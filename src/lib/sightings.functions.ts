import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SubmitSchema = z.object({
  caseId: z.string().uuid(),
  photoUrl: z.string().url(),
  location: z.string().trim().min(2).max(300),
  notes: z.string().trim().max(2000).optional().default(""),
});

type AiResult = { confidence: number; result: "Match Found" | "Possible Match" | "No Match"; reason: string };

async function runFaceMatch(referenceUrl: string, sightingUrl: string): Promise<AiResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return { confidence: 0, result: "No Match", reason: "AI unavailable" };
  }
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a face comparison assistant for a missing-persons platform. Compare the two faces and respond ONLY with strict JSON: {\"confidence\": <0-100 integer>, \"result\": \"Match Found\" | \"Possible Match\" | \"No Match\", \"reason\": <one short sentence>}. Rules: confidence >= 80 -> Match Found; 50-79 -> Possible Match; below 50 -> No Match. If a face cannot be detected, return No Match with confidence 0.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Image A is the reference missing person. Image B is a community sighting. Compare them." },
              { type: "image_url", image_url: { url: referenceUrl } },
              { type: "image_url", image_url: { url: sightingUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("AI gateway error", res.status, txt);
      return { confidence: 0, result: "No Match", reason: `AI error ${res.status}` };
    }
    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    const conf = Math.max(0, Math.min(100, Math.round(Number(parsed.confidence) || 0)));
    const result: AiResult["result"] = conf >= 80 ? "Match Found" : conf >= 50 ? "Possible Match" : "No Match";
    return { confidence: conf, result, reason: String(parsed.reason ?? "").slice(0, 300) };
  } catch (e) {
    console.error("Face match failed", e);
    return { confidence: 0, result: "No Match", reason: "Comparison failed" };
  }
}

export const submitSighting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => SubmitSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: caseRow, error: caseErr } = await supabase
      .from("cases").select("id,full_name,cover_photo_url,reporter_id").eq("id", data.caseId).maybeSingle();
    if (caseErr || !caseRow) throw new Error("Case not found");

    const ai = caseRow.cover_photo_url
      ? await runFaceMatch(caseRow.cover_photo_url, data.photoUrl)
      : { confidence: 0, result: "No Match" as const, reason: "No reference photo on case" };

    const status = ai.result === "Match Found" ? "verified" : "pending";

    const { error: insErr } = await supabase.from("sightings").insert({
      case_id: data.caseId,
      reporter_id: userId,
      location: data.location,
      notes: data.notes,
      photo_url: data.photoUrl,
      ai_confidence: ai.confidence,
      ai_result: ai.result,
      status,
    });
    if (insErr) throw new Error(insErr.message);

    if (ai.result !== "No Match" && caseRow.reporter_id !== userId) {
      await supabase.from("notifications").insert({
        user_id: caseRow.reporter_id,
        title: `${ai.result}: ${caseRow.full_name}`,
        body: `New sighting near ${data.location} — ${ai.confidence}% confidence. ${ai.reason}`,
        link: `/cases/${data.caseId}`,
        kind: ai.result === "Match Found" ? "match" : "info",
      });
    }

    return ai;
  });

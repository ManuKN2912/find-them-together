import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload, MapPin, Check, FileText, User, Fingerprint, CalendarDays, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";

export const Route = createFileRoute("/report")({ component: Report });

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Identification", icon: Fingerprint },
  { id: 3, label: "Missing details", icon: CalendarDays },
  { id: 4, label: "Uploads", icon: Upload },
  { id: 5, label: "Contact & reward", icon: Phone },
  { id: 6, label: "Preview", icon: FileText },
];

const FormSchema = z.object({
  full_name: z.string().trim().min(2, "Name required").max(120),
  age: z.coerce.number().int().min(0).max(120).optional(),
  gender: z.string().optional(),
  height_cm: z.coerce.number().int().min(30).max(280).optional(),
  weight_kg: z.coerce.number().int().min(2).max(400).optional(),
  body_shape: z.string().max(60).optional(),
  skin_tone: z.string().max(60).optional(),
  hair: z.string().max(120).optional(),
  eye_color: z.string().max(60).optional(),
  tattoos: z.string().max(500).optional(),
  birthmarks: z.string().max(200).optional(),
  scars: z.string().max(200).optional(),
  clothes_last_worn: z.string().max(300).optional(),
  other_marks: z.string().max(500).optional(),
  date_missing: z.string().optional(),
  time_missing: z.string().optional(),
  last_seen_location: z.string().trim().min(2, "Last seen location required").max(300),
  city: z.string().trim().min(1).max(120),
  state: z.string().max(120).optional(),
  country: z.string().max(120).optional(),
  contact_phone: z.string().trim().min(6, "Phone required").max(30),
  contact_alt_phone: z.string().max(30).optional(),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  reward: z.coerce.number().min(0).max(100_000_000).optional(),
});

function Report() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [channels, setChannels] = useState<string[]>([]);
  const progress = (step / STEPS.length) * 100;

  const set = (k: string) => (e: any) => setForm((p) => ({ ...p, [k]: e?.target?.value ?? e }));

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/") && f.size <= 8 * 1024 * 1024).slice(0, 5);
    if (dropped.length === 0) toast.error("Use images up to 8MB");
    setFiles((f) => [...f, ...dropped].slice(0, 5));
  }
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []).filter(f => f.type.startsWith("image/") && f.size <= 8 * 1024 * 1024).slice(0, 5);
    setFiles((f) => [...f, ...list].slice(0, 5));
  }

  async function publish() {
    if (!user) { toast.error("Please sign in first"); navigate({ to: "/auth" }); return; }
    if (files.length === 0) { toast.error("Upload at least one photo"); setStep(4); return; }
    const parsed = FormSchema.safeParse({ ...form });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const { data: caseRow, error: caseErr } = await supabase
        .from("cases")
        .insert({ ...parsed.data, reporter_id: user.id, preferred_channels: channels })
        .select("id").single();
      if (caseErr || !caseRow) throw new Error(caseErr?.message || "Insert failed");

      const uploaded: { url: string; path: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const ext = f.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/${caseRow.id}/${Date.now()}-${i}.${ext}`;
        const { error: upErr } = await supabase.storage.from("case-photos").upload(path, f, { contentType: f.type, upsert: false });
        if (upErr) throw new Error(upErr.message);
        const { data: pub } = supabase.storage.from("case-photos").getPublicUrl(path);
        uploaded.push({ url: pub.publicUrl, path });
      }

      if (uploaded.length) {
        await supabase.from("case_photos").insert(uploaded.map((u, idx) => ({ case_id: caseRow.id, url: u.url, storage_path: u.path, position: idx })));
        await supabase.from("cases").update({ cover_photo_url: uploaded[0].url }).eq("id", caseRow.id);
      }

      toast.success("Case published — volunteers notified");
      navigate({ to: "/cases/$id", params: { id: caseRow.id } });
    } catch (e: any) {
      toast.error(e.message ?? "Could not publish");
    } finally {
      setSubmitting(false);
    }
  }

  if (!authLoading && !user) {
    return (
      <SiteLayout>
        <section className="container mx-auto px-4 py-20 max-w-md text-center">
          <h1 className="text-2xl font-display font-bold">Sign in to report a case</h1>
          <p className="text-muted-foreground mt-2">Your account keeps every report secure and verified.</p>
          <Button onClick={() => navigate({ to: "/auth" })} className="mt-6 gradient-brand text-white">Sign in</Button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Report a missing person</h1>
          <p className="text-muted-foreground mt-2">All information stays confidential and is only shared with verified volunteers and authorities.</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 overflow-x-auto pb-2">
            {STEPS.map((s) => (
              <div key={s.id} className={`flex items-center gap-2 text-xs whitespace-nowrap ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>
                <div className={`grid place-items-center h-7 w-7 rounded-full text-xs font-semibold ${step > s.id ? "bg-[color:var(--color-success)] text-white" : step === s.id ? "gradient-brand text-white" : "bg-muted"}`}>
                  {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} />
        </div>

        <Card className="glass p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {step === 1 && (
                <Grid title="Personal details">
                  <Row><Label>Full name *</Label><Input value={form.full_name ?? ""} onChange={set("full_name")} placeholder="Priya Sharma" required /></Row>
                  <Row><Label>Age</Label><Input type="number" value={form.age ?? ""} onChange={set("age")} placeholder="14" /></Row>
                  <Row><Label>Gender</Label>
                    <Select value={form.gender} onValueChange={(v) => setForm(p => ({...p, gender: v}))}>
                      <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                      <SelectContent>{["Male","Female","Other"].map(g=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  </Row>
                  <Row><Label>Height (cm)</Label><Input type="number" value={form.height_cm ?? ""} onChange={set("height_cm")} placeholder="165" /></Row>
                  <Row><Label>Weight (kg)</Label><Input type="number" value={form.weight_kg ?? ""} onChange={set("weight_kg")} placeholder="52" /></Row>
                  <Row><Label>Body shape</Label><Input value={form.body_shape ?? ""} onChange={set("body_shape")} placeholder="Slim / Average / Heavy" /></Row>
                  <Row><Label>Skin tone</Label><Input value={form.skin_tone ?? ""} onChange={set("skin_tone")} placeholder="Fair / Wheatish / Dark" /></Row>
                  <Row><Label>Hair</Label><Input value={form.hair ?? ""} onChange={set("hair")} placeholder="Short black, curly" /></Row>
                  <Row><Label>Eye color</Label><Input value={form.eye_color ?? ""} onChange={set("eye_color")} placeholder="Brown" /></Row>
                </Grid>
              )}
              {step === 2 && (
                <Grid title="Identification details">
                  <Row className="sm:col-span-2"><Label>Tattoos</Label><Textarea value={form.tattoos ?? ""} onChange={set("tattoos")} rows={2} /></Row>
                  <Row><Label>Birthmarks</Label><Input value={form.birthmarks ?? ""} onChange={set("birthmarks")} /></Row>
                  <Row><Label>Scars</Label><Input value={form.scars ?? ""} onChange={set("scars")} /></Row>
                  <Row><Label>Clothes last worn</Label><Input value={form.clothes_last_worn ?? ""} onChange={set("clothes_last_worn")} /></Row>
                  <Row className="sm:col-span-2"><Label>Other marks</Label><Textarea value={form.other_marks ?? ""} onChange={set("other_marks")} rows={2} /></Row>
                </Grid>
              )}
              {step === 3 && (
                <Grid title="Missing details">
                  <Row><Label>Date missing</Label><Input type="date" value={form.date_missing ?? ""} onChange={set("date_missing")} /></Row>
                  <Row><Label>Time (approx)</Label><Input type="time" value={form.time_missing ?? ""} onChange={set("time_missing")} /></Row>
                  <Row className="sm:col-span-2"><Label>Last seen location *</Label>
                    <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                      <Input className="pl-9" value={form.last_seen_location ?? ""} onChange={set("last_seen_location")} placeholder="e.g. Connaught Place metro gate 4" required />
                    </div>
                  </Row>
                  <Row><Label>City *</Label><Input value={form.city ?? ""} onChange={set("city")} placeholder="New Delhi" required /></Row>
                  <Row><Label>State</Label><Input value={form.state ?? ""} onChange={set("state")} placeholder="Delhi" /></Row>
                  <Row><Label>Country</Label><Input value={form.country ?? ""} onChange={set("country")} placeholder="India" /></Row>
                </Grid>
              )}
              {step === 4 && (
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4">Upload photos</h3>
                  <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}
                    className="rounded-xl border-2 border-dashed p-10 text-center bg-muted/30 hover:bg-muted/50 transition">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div className="mt-3 font-medium">Drag 2–5 photos here</div>
                    <div className="text-xs text-muted-foreground mt-1">PNG, JPG up to 8 MB each</div>
                    <label className="inline-block mt-4">
                      <input type="file" multiple accept="image/*" onChange={onPick} className="hidden" />
                      <span className="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium cursor-pointer hover:bg-accent">Browse files</span>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                      {files.map((f,i) => (
                        <div key={i} className="aspect-square rounded-md overflow-hidden bg-muted relative">
                          <img src={URL.createObjectURL(f)} alt={f.name} className="h-full w-full object-cover" />
                          <button type="button" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-xs h-5 w-5 grid place-items-center">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {step === 5 && (
                <Grid title="Contact & reward">
                  <Row><Label>Family contact number *</Label><Input type="tel" value={form.contact_phone ?? ""} onChange={set("contact_phone")} placeholder="+91 98765 43210" required /></Row>
                  <Row><Label>Alternate contact</Label><Input type="tel" value={form.contact_alt_phone ?? ""} onChange={set("contact_alt_phone")} /></Row>
                  <Row><Label>Email address</Label><Input type="email" value={form.contact_email ?? ""} onChange={set("contact_email")} placeholder="family@example.com" /></Row>
                  <Row><Label>Reward (₹)</Label><Input type="number" value={form.reward ?? ""} onChange={set("reward")} placeholder="50000" /></Row>
                  <div className="sm:col-span-2">
                    <Label>Preferred communication</Label>
                    <div className="flex gap-4 mt-2">
                      {["Email", "WhatsApp", "SMS"].map(p => (
                        <label key={p} className="flex items-center gap-2 text-sm">
                          <Checkbox checked={channels.includes(p)} onCheckedChange={(v) => setChannels(c => v ? [...c, p] : c.filter(x => x !== p))} /> {p}
                        </label>
                      ))}
                    </div>
                  </div>
                </Grid>
              )}
              {step === 6 && (
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4">Preview & publish</h3>
                  <Card className="p-5 bg-muted/30">
                    <div className="text-sm text-muted-foreground">Once published, your case becomes visible to volunteers and the AI matching system scans new sightings instantly.</div>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-success)]" /> {form.full_name || "—"} · {form.age || "?"} years</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-success)]" /> {files.length} photo(s) ready to upload</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-success)]" /> Last seen: {form.last_seen_location || "—"}, {form.city || "—"}</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-success)]" /> Contact: {form.contact_phone || "—"}</li>
                    </ul>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
              <ChevronLeft className="h-4 w-4" />Back
            </Button>
            {step < STEPS.length ? (
              <Button onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))} className="gradient-brand text-white">
                Next<ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={publish} disabled={submitting} className="gradient-brand text-white">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Publish case
              </Button>
            )}
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}

function Grid({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="font-display text-xl font-semibold mb-4">{title}</h3><div className="grid sm:grid-cols-2 gap-4">{children}</div></div>;
}
function Row({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className}`}>{children}</div>;
}

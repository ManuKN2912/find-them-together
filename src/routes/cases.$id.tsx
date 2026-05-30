import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, MapPin, Calendar, Share2, Phone, MessageCircle, Mail, Camera, Upload, Sparkles, CheckCircle2, BellRing, Loader2 } from "lucide-react";
import { AIScanAnimation } from "@/components/ai-scan";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { submitSighting } from "@/lib/sightings.functions";

export const Route = createFileRoute("/cases/$id")({ component: CaseDetail });

function CaseDetail() {
  const { id } = useParams({ from: "/cases/$id" });
  const { user } = useAuth();
  const submit = useServerFn(submitSighting);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"form" | "scan" | "done">("form");
  const [result, setResult] = useState<{ result: string; confidence: number; reason?: string } | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: c, isLoading } = useQuery({
    queryKey: ["case", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases").select("*, case_photos(url, position)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <SiteLayout><div className="container mx-auto px-4 py-8 space-y-4"><Skeleton className="h-72 rounded-xl" /><Skeleton className="h-40 rounded-xl" /></div></SiteLayout>;
  }

  if (!c) {
    return <SiteLayout><div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-display font-bold">Case not found</h2>
      <Button asChild className="mt-4"><Link to="/cases">Back to cases</Link></Button>
    </div></SiteLayout>;
  }

  const photos = (c.case_photos ?? []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
  const cover = c.cover_photo_url || photos[0]?.url;

  async function runSighting(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { toast.error("Please sign in"); return; }
    if (!photoFile) { toast.error("Add a sighting photo"); return; }
    if (!location.trim()) { toast.error("Where did you see them?"); return; }
    if (photoFile.size > 8 * 1024 * 1024) { toast.error("Photo too large (max 8MB)"); return; }
    setBusy(true);
    try {
      const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/sightings/${id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("case-photos").upload(path, photoFile, { contentType: photoFile.type });
      if (upErr) throw new Error(upErr.message);
      const { data: pub } = supabase.storage.from("case-photos").getPublicUrl(path);
      setStage("scan");
      const ai = await submit({ data: { caseId: id, photoUrl: pub.publicUrl, location, notes } });
      setResult(ai);
      setTimeout(() => setStage("done"), 1200);
    } catch (err: any) {
      toast.error(err.message ?? "Sighting failed");
      setStage("form");
    } finally {
      setBusy(false);
    }
  }

  function shareLink() {
    try { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }
    catch { toast.error("Could not copy"); }
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-8">
        <Link to="/cases" className="text-sm text-muted-foreground hover:text-foreground">← All cases</Link>

        <div className="grid lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-4 aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                {cover && <img src={cover} alt={c.full_name} className="h-full w-full object-cover" />}
              </div>
              {photos.slice(0,4).map((p: any, i: number) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={p.url} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 hover:opacity-100 transition" />
                </div>
              ))}
            </div>

            <Card className="glass p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground font-mono">{c.id.slice(0, 8)}</div>
                  <h1 className="text-3xl font-display font-bold mt-1">{c.full_name}</h1>
                  <div className="text-sm text-muted-foreground mt-1">{c.age ? `${c.age} years` : "Age unknown"}{c.gender ? ` · ${c.gender}` : ""}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.fir_verified && <Badge className="bg-primary text-primary-foreground"><ShieldCheck className="h-3 w-3 mr-1" />FIR verified</Badge>}
                  <Badge variant="outline"><Sparkles className="h-3 w-3 mr-1" />AI: {c.ai_status}</Badge>
                  <Badge variant={c.status === "found" ? "secondary" : "destructive"}>{c.status}</Badge>
                </div>
              </div>
              {c.description && <p className="mt-4 text-muted-foreground">{c.description}</p>}

              <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
                {c.date_missing && <Info label="Date missing" value={String(c.date_missing)} icon={Calendar} />}
                <Info label="Last seen" value={`${c.last_seen_location || "?"}${c.city ? `, ${c.city}` : ""}`} icon={MapPin} />
                {c.reward ? <Info label="Reward" value={`₹${Number(c.reward).toLocaleString("en-IN")}`} icon={ShieldCheck} /> : null}
                {c.contact_phone && <Info label="Contact" value={c.contact_phone} icon={Phone} />}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="glass p-6">
              <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setStage("form"); setResult(null); setPhotoFile(null); setLocation(""); setNotes(""); } }}>
                <DialogTrigger asChild>
                  <Button className="w-full gradient-brand text-white shadow-lg shadow-primary/30">
                    <Camera className="h-4 w-4" /> I Found This Person
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>Submit a sighting</DialogTitle></DialogHeader>
                  {stage === "form" && (
                    <form onSubmit={runSighting} className="space-y-3">
                      <label className="block">
                        <span className="text-sm font-medium">Sighting photo *</span>
                        <div className="mt-1 rounded-lg border-2 border-dashed p-4 text-center bg-muted/30 cursor-pointer hover:bg-muted/50">
                          <input type="file" accept="image/*" capture="environment" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} className="hidden" />
                          {photoFile ? <div className="text-xs">{photoFile.name}</div> : <><Upload className="mx-auto h-5 w-5 text-muted-foreground" /><div className="text-xs mt-1">Tap to capture or upload</div></>}
                        </div>
                      </label>
                      <div className="space-y-1.5"><Label>Current location *</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Park Street, Kolkata" required /></div>
                      <div className="space-y-1.5"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe what you saw…" rows={3} /></div>
                      <Button type="submit" disabled={busy || !user} className="w-full gradient-brand text-white">
                        {busy && <Loader2 className="h-4 w-4 animate-spin" />} {user ? "Run AI verification" : "Sign in to submit"}
                      </Button>
                    </form>
                  )}
                  {stage === "scan" && (
                    <AIScanAnimation image={cover || ""} onComplete={() => {}} />
                  )}
                  {stage === "done" && result && (
                    <div className="space-y-3">
                      <div className={`rounded-xl p-4 ${result.result === "Match Found" ? "bg-success/10" : result.result === "Possible Match" ? "bg-warning/15" : "bg-muted"}`}>
                        <div className="font-display font-semibold">{result.result} · {result.confidence}%</div>
                        {result.reason && <div className="text-xs text-muted-foreground mt-1">{result.reason}</div>}
                      </div>
                      {result.result !== "No Match" && (
                        <Card className="p-4 space-y-2">
                          <div className="font-semibold text-sm flex items-center gap-2"><BellRing className="h-4 w-4 text-primary" /> Family has been alerted</div>
                          {[
                            { i: Mail, t: "Notification dispatched to case owner" },
                            { i: MessageCircle, t: "Sighting saved to case file" },
                          ].map((n, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.2 }}
                              className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-[color:var(--color-success)]" />
                              <n.i className="h-3.5 w-3.5" />{n.t}
                            </motion.div>
                          ))}
                        </Card>
                      )}
                      <Button onClick={() => { toast.success("Thank you"); setOpen(false); setStage("form"); }} className="w-full gradient-brand text-white">Done</Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <div className="grid grid-cols-2 gap-2 mt-3">
                {c.contact_phone && <Button asChild variant="outline"><a href={`tel:${c.contact_phone}`}><Phone className="h-4 w-4" />Call</a></Button>}
                {c.contact_phone && <Button asChild variant="outline"><a href={`https://wa.me/${c.contact_phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp</a></Button>}
                {c.contact_email && <Button asChild variant="outline"><a href={`mailto:${c.contact_email}`}><Mail className="h-4 w-4" />Email</a></Button>}
                <Button variant="outline" onClick={shareLink}><Share2 className="h-4 w-4" />Share</Button>
              </div>
            </Card>

            {c.reward ? (
              <Card className="glass p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Reward</div>
                <div className="text-3xl font-display font-bold text-gradient">₹{Number(c.reward).toLocaleString("en-IN")}</div>
                <p className="text-xs text-muted-foreground mt-2">Released to the verified volunteer who provides the confirmed sighting.</p>
              </Card>
            ) : null}

            <Card className="glass p-6">
              <div className="font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI match status</div>
              <Badge className="bg-primary/10 text-primary border-primary/30" variant="outline">{c.ai_status}</Badge>
              <p className="text-xs text-muted-foreground mt-3">Our face recognition model continuously scans new sightings against this case profile.</p>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
      <div className="grid place-items-center h-8 w-8 rounded-md bg-primary/10 text-primary shrink-0"><Icon className="h-4 w-4" /></div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

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
import { ChevronLeft, ChevronRight, Upload, MapPin, Check, FileText, User, Fingerprint, CalendarDays, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/report")({ component: Report });

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Identification", icon: Fingerprint },
  { id: 3, label: "Missing details", icon: CalendarDays },
  { id: 4, label: "Uploads", icon: Upload },
  { id: 5, label: "Contact & reward", icon: Phone },
  { id: 6, label: "Preview", icon: FileText },
];

function Report() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const progress = (step / STEPS.length) * 100;

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).slice(0, 5);
    setFiles((f) => [...f, ...dropped].slice(0, 5));
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Report a missing person</h1>
          <p className="text-muted-foreground mt-2">All information stays confidential and is only shared with verified volunteers and authorities.</p>
        </div>

        {/* Stepper */}
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
                  <Row><Label>Full name</Label><Input placeholder="Priya Sharma" /></Row>
                  <Row><Label>Age</Label><Input type="number" placeholder="14" /></Row>
                  <Row><Label>Gender</Label><Select><SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger><SelectContent>{["Male","Female","Other"].map(g=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></Row>
                  <Row><Label>Height (cm)</Label><Input type="number" placeholder="165" /></Row>
                  <Row><Label>Weight (kg)</Label><Input type="number" placeholder="52" /></Row>
                  <Row><Label>Body shape</Label><Input placeholder="Slim / Average / Heavy" /></Row>
                  <Row><Label>Skin tone</Label><Input placeholder="Fair / Wheatish / Dark" /></Row>
                  <Row><Label>Hair style</Label><Input placeholder="Short black, curly" /></Row>
                  <Row><Label>Eye color</Label><Input placeholder="Brown" /></Row>
                </Grid>
              )}
              {step === 2 && (
                <Grid title="Identification details">
                  <Row className="sm:col-span-2"><Label>Tattoos</Label><Textarea placeholder="Describe any tattoos and their location" rows={2} /></Row>
                  <Row><Label>Birthmarks</Label><Input placeholder="e.g. left cheek" /></Row>
                  <Row><Label>Scars</Label><Input placeholder="e.g. above right eyebrow" /></Row>
                  <Row><Label>Disability info</Label><Input placeholder="If any" /></Row>
                  <Row><Label>Clothes last worn</Label><Input placeholder="Blue school uniform" /></Row>
                  <Row className="sm:col-span-2"><Label>Other body marks</Label><Textarea placeholder="Other distinguishing features" rows={2} /></Row>
                </Grid>
              )}
              {step === 3 && (
                <Grid title="Missing details">
                  <Row><Label>Date missing</Label><Input type="date" /></Row>
                  <Row><Label>Time (approx)</Label><Input type="time" /></Row>
                  <Row className="sm:col-span-2"><Label>Last seen location</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input className="pl-9" placeholder="e.g. Connaught Place metro gate 4" /></div></Row>
                  <Row><Label>City</Label><Input placeholder="New Delhi" /></Row>
                  <Row><Label>State</Label><Input placeholder="Delhi" /></Row>
                  <Row><Label>Country</Label><Input placeholder="India" /></Row>
                  <div className="sm:col-span-2 rounded-lg overflow-hidden border h-56">
                    <iframe title="map" className="w-full h-full border-0" src="https://www.openstreetmap.org/export/embed.html?bbox=77.20%2C28.60%2C77.25%2C28.65&layer=mapnik" />
                  </div>
                </Grid>
              )}
              {step === 4 && (
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4">Upload section</h3>
                  <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}
                    className="rounded-xl border-2 border-dashed p-10 text-center bg-muted/30 hover:bg-muted/50 transition">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div className="mt-3 font-medium">Drag and drop 2–5 photos here</div>
                    <div className="text-xs text-muted-foreground mt-1">PNG, JPG up to 8 MB each</div>
                    <Button type="button" variant="outline" className="mt-4">Browse files</Button>
                  </div>
                  {files.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                      {files.map((f,i) => <div key={i} className="aspect-square rounded-md bg-muted grid place-items-center text-xs px-2 text-center">{f.name}</div>)}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <Row><Label>FIR copy (PDF/JPG)</Label><Input type="file" accept=".pdf,image/*" /></Row>
                    <Row><Label>Additional document</Label><Input type="file" /></Row>
                  </div>
                </div>
              )}
              {step === 5 && (
                <Grid title="Contact & reward">
                  <Row><Label>Family contact number</Label><Input type="tel" placeholder="+91 98765 43210" /></Row>
                  <Row><Label>Alternate contact</Label><Input type="tel" /></Row>
                  <Row><Label>Email address</Label><Input type="email" placeholder="family@example.com" /></Row>
                  <Row><Label>Reward / bounty (₹)</Label><Input type="number" placeholder="50000" /></Row>
                  <div className="sm:col-span-2">
                    <Label>Preferred communication</Label>
                    <div className="flex gap-4 mt-2">
                      {["Email", "WhatsApp", "SMS"].map(p => (
                        <label key={p} className="flex items-center gap-2 text-sm"><Checkbox /> {p}</label>
                      ))}
                    </div>
                  </div>
                </Grid>
              )}
              {step === 6 && (
                <div>
                  <h3 className="font-display text-xl font-semibold mb-4">Preview & publish</h3>
                  <Card className="p-5 bg-muted/30">
                    <div className="text-sm text-muted-foreground">Once published, your case becomes visible to verified volunteers in the search radius and the AI matching system starts scanning new sightings instantly.</div>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-success)]" /> Personal & identification details captured</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-success)]" /> {files.length} photo(s) uploaded</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-success)]" /> Last seen location pinned</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--color-success)]" /> Contact channels confirmed</li>
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
              <Button onClick={() => { toast.success("Case published — volunteers notified"); navigate({ to: "/cases" }); }} className="gradient-brand text-white">
                Publish case
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

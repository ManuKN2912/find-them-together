import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Users, MapPin, Heart, FileText, Search, BellRing, Building2 } from "lucide-react";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-brand-soft" />
        <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium">About FindThem</div>
          <h1 className="mt-4 text-4xl lg:text-5xl font-display font-bold tracking-tight">A platform built on hope and technology</h1>
          <p className="mt-5 text-muted-foreground text-lg">We combine community vigilance with AI to dramatically reduce the time it takes to locate missing persons in India.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-6">
        <Card className="glass p-8">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Our mission</div>
          <h2 className="text-2xl font-display font-bold mt-2">Bring every missing person home.</h2>
          <p className="text-muted-foreground mt-3">FindThem exists to give every family a fighting chance — by mobilising community, technology, and trust.</p>
        </Card>
        <Card className="glass p-8">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Our vision</div>
          <h2 className="text-2xl font-display font-bold mt-2">A country where no one stays lost for long.</h2>
          <p className="text-muted-foreground mt-3">We're building the most reliable, transparent network for locating missing persons across India and beyond.</p>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-display font-bold mb-6">How AI face recognition helps</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { i: Sparkles, t: "Continuous matching", d: "Each new sighting is checked against thousands of case profiles in seconds." },
            { i: BellRing, t: "Smart alerts", d: "Families and volunteers are notified the moment a high-confidence match is detected." },
            { i: Heart, t: "Privacy-first", d: "Photos are encrypted, used only for matching, and never sold or shared." },
          ].map((x) => (
            <Card key={x.t} className="glass p-6">
              <div className="grid place-items-center h-11 w-11 rounded-xl gradient-brand text-white"><x.i className="h-5 w-5"/></div>
              <div className="font-display font-semibold mt-3">{x.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{x.d}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { v: "4,392", l: "People reunited", i: Heart },
            { v: "12,847", l: "Active cases", i: Search },
            { v: "28,910", l: "Volunteers", i: Users },
            { v: "238", l: "Cities covered", i: Building2 },
          ].map((s) => (
            <Card key={s.l} className="glass p-5 flex items-center gap-3">
              <div className="grid place-items-center h-11 w-11 rounded-xl bg-primary/10 text-primary"><s.i className="h-5 w-5" /></div>
              <div><div className="text-2xl font-display font-bold leading-none">{s.v}</div><div className="text-xs text-muted-foreground mt-1">{s.l}</div></div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-display font-bold mb-8 text-center">The journey from report to reunion</h2>
        <ol className="relative border-l-2 border-primary/20 ml-4 space-y-8">
          {[
            { i: FileText, t: "Report missing person", d: "Family files a detailed case with photos and FIR." },
            { i: Users, t: "Volunteers search", d: "Verified volunteers in the area get alerted." },
            { i: Sparkles, t: "AI verification", d: "Face recognition checks every new sighting." },
            { i: BellRing, t: "Family notification", d: "Emergency contacts notified via Email, SMS, WhatsApp." },
            { i: Heart, t: "Person reunited", d: "Confirmed meet-up with family. Reward processed." },
          ].map((step, i) => (
            <motion.li key={step.t} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="pl-8 relative">
              <div className="absolute -left-[1.15rem] grid place-items-center h-9 w-9 rounded-full gradient-brand text-white ring-4 ring-background">
                <step.i className="h-4 w-4" />
              </div>
              <div className="font-display text-lg font-semibold">{step.t}</div>
              <div className="text-muted-foreground">{step.d}</div>
            </motion.li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}

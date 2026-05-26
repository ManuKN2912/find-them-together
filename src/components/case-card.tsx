import { Link } from "@tanstack/react-router";
import { MapPin, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { MissingCase } from "@/lib/mock-data";

const matchColor: Record<string, string> = {
  "Match Found": "bg-success/15 text-[color:var(--color-success)] border-[color:var(--color-success)]/30",
  "Possible Match": "bg-warning/15 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/30",
  "No Match": "bg-muted text-muted-foreground border-border",
  "Pending": "bg-primary/10 text-primary border-primary/30",
};

export function CaseCard({ c, index = 0 }: { c: MissingCase; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to="/cases/$id" params={{ id: c.id }} className="block group">
        <Card className="overflow-hidden glass hover:ring-glow transition-all duration-300 p-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={c.image} alt={c.name} loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-1.5">
              {c.firVerified && (
                <Badge className="bg-primary/90 text-primary-foreground border-0 backdrop-blur">
                  <ShieldCheck className="h-3 w-3 mr-1" />FIR verified
                </Badge>
              )}
              {c.status === "Found" && (
                <Badge className="bg-[color:var(--color-success)] text-white border-0">Found</Badge>
              )}
            </div>
            {c.aiMatch && (
              <Badge variant="outline" className={`absolute top-3 right-3 backdrop-blur ${matchColor[c.aiMatch]}`}>
                <Sparkles className="h-3 w-3 mr-1" />{c.aiMatch}
              </Badge>
            )}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="text-lg font-display font-semibold leading-tight">{c.name}</div>
              <div className="text-xs opacity-90">{c.age} yrs · {c.gender} · #{c.id}</div>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city}, {c.state}</div>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{c.lastSeen}</div>
            </div>
            {c.reward > 0 && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-md gradient-brand-soft px-2 py-1 text-xs font-semibold text-primary">
                Reward · ₹{c.reward.toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

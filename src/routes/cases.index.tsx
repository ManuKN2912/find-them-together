import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cases/")({
  component: CasesIndex,
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) || "" }),
});

function CasesIndex() {
  const { q: initialQ } = Route.useSearch();
  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("id, full_name, age, gender, city, last_seen_location, date_missing, status, reward, ai_status, fir_verified, cover_photo_url, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    const term = q.trim().toLowerCase();
    return list.filter(c => {
      if (status !== "all" && c.status !== status) return false;
      if (!term) return true;
      return [c.full_name, c.city, c.last_seen_location].filter(Boolean).some(v => String(v).toLowerCase().includes(term));
    });
  }, [data, q, status]);

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">Missing persons</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} cases · updated live</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" placeholder="Search name, city…" aria-label="Search cases" />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border bg-background px-3 text-sm" aria-label="Filter status">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="found">Found</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length:6}).map((_,i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="glass p-12 text-center">
            <p className="text-muted-foreground">No cases yet. Be the first to <Link to="/report" className="text-primary underline">report a case</Link>.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => (
              <Link key={c.id} to="/cases/$id" params={{ id: c.id }}>
                <Card className="glass overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition h-full">
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    {c.cover_photo_url ? (
                      <img src={c.cover_photo_url} alt={c.full_name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-muted-foreground text-xs">No photo</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-display font-semibold">{c.full_name}</div>
                        <div className="text-xs text-muted-foreground">{c.age ? `${c.age} yrs · ` : ""}{c.gender || ""}</div>
                      </div>
                      <Badge variant={c.status === "found" ? "secondary" : "destructive"}>{c.status}</Badge>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{c.last_seen_location || c.city}</div>
                      <div className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" />{c.ai_status}</div>
                      {c.fir_verified && <div className="flex items-center gap-1.5 text-primary"><ShieldCheck className="h-3 w-3" />FIR verified</div>}
                    </div>
                    {c.reward ? <div className="mt-3 text-sm font-semibold text-gradient">₹{Number(c.reward).toLocaleString("en-IN")} reward</div> : null}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/site-layout";
import { CaseCard } from "@/components/case-card";
import { MOCK_CASES } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export const Route = createFileRoute("/cases/")({ component: CasesIndex });

function CasesIndex() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const cities = useMemo(() => Array.from(new Set(MOCK_CASES.map(c => c.city))), []);
  const filtered = MOCK_CASES.filter(c =>
    (status === "all" || c.status === status) &&
    (city === "all" || c.city === city) &&
    (q === "" || (c.name + c.id + c.city + c.location).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold">Browse missing person cases</h1>
          <p className="text-muted-foreground mt-2">{filtered.length} active cases — filter by location and status.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by name, ID, location…" className="pl-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="all">All statuses</SelectItem><SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Found">Found</SelectItem><SelectItem value="Under Review">Under Review</SelectItem>
            </SelectContent></Select>
            <Select value={city} onValueChange={setCity}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent></Select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => <CaseCard key={c.id} c={c} index={i} />)}
        </div>
      </section>
    </SiteLayout>
  );
}

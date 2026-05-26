import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_CASES } from "@/lib/mock-data";
import { CheckCircle2, Clock, Trophy, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/rewards")({ component: Rewards });

function Rewards() {
  const all = [...MOCK_CASES].sort((a,b) => b.reward - a.reward);
  const total = all.reduce((s,c) => s + c.reward, 0);
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <Card className="glass p-6"><div className="text-xs text-muted-foreground">Total reward pool</div><div className="text-3xl font-display font-bold mt-1 text-gradient">₹{total.toLocaleString("en-IN")}</div></Card>
          <Card className="glass p-6"><div className="text-xs text-muted-foreground">Active reward cases</div><div className="text-3xl font-display font-bold mt-1">{all.filter(c=>c.status==="Active").length}</div></Card>
          <Card className="glass p-6"><div className="text-xs text-muted-foreground">Claims released</div><div className="text-3xl font-display font-bold mt-1">{all.filter(c=>c.status==="Found").length}</div></Card>
        </div>

        <h1 className="text-3xl font-display font-bold mb-6">Bounty board</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {all.map((c, i) => (
            <motion.div key={c.id} initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.04}}>
              <Card className="glass p-5">
                <div className="flex items-center gap-3">
                  <img src={c.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground font-mono">{c.id}</div>
                    <div className="font-display font-semibold truncate">{c.name}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Reward</div>
                    <div className="text-2xl font-display font-bold text-gradient">₹{c.reward.toLocaleString("en-IN")}</div>
                  </div>
                  {c.status === "Found" ? <Badge className="bg-[color:var(--color-success)] text-white"><CheckCircle2 className="h-3 w-3 mr-1" />Claimed</Badge>
                    : <Badge variant="outline" className="text-[color:var(--color-warning)] border-[color:var(--color-warning)]/40"><Clock className="h-3 w-3 mr-1"/>Pending</Badge>}
                </div>
                <Button variant="outline" className="w-full mt-4"><Wallet className="h-4 w-4" /> View payout</Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="glass p-6 mt-10 flex items-center gap-4">
          <div className="grid place-items-center h-12 w-12 rounded-xl gradient-brand text-white"><Trophy className="h-6 w-6" /></div>
          <div className="flex-1">
            <div className="font-display font-semibold">Transparent payouts</div>
            <div className="text-sm text-muted-foreground">Every claim is verified by AI matching, family confirmation, and FIR cross-check before release.</div>
          </div>
        </Card>
      </section>
    </SiteLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { Sparkles, Users, Wallet, FileWarning } from "lucide-react";

const ICON: Record<string, any> = { ai: Sparkles, volunteer: Users, reward: Wallet, status: FileWarning };

export const Route = createFileRoute("/notifications")({ component: Notifications });

function Notifications() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-display font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground mb-8">Real-time AI alerts, volunteer reports, reward updates and case status changes.</p>
        <div className="space-y-3">
          {[...NOTIFICATIONS, ...NOTIFICATIONS].map((n, idx) => {
            const Icon = ICON[n.type] ?? Sparkles;
            return (
              <Card key={idx} className="glass p-4 flex items-start gap-3">
                <div className="grid place-items-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0"><Icon className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{n.title}</div>
                    <Badge variant="outline" className="capitalize">{n.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{n.body}</div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</div>
              </Card>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}

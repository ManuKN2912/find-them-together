import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BrandWordmark } from "@/components/brand-logo";

export const Route = createFileRoute("/reset-password")({ component: ResetPwd });

function ResetPwd() {
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.length < 8) { toast.error("Min 8 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <Card className="glass w-full max-w-md p-6 sm:p-8">
        <BrandWordmark />
        <h1 className="mt-4 text-2xl font-display font-bold">Reset your password</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter a new password for your account.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">New password</Label>
            <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} minLength={8} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-brand text-white">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}

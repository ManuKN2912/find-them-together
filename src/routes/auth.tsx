import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Mail, Lock, User, Loader2 } from "lucide-react";
import { BrandWordmark } from "@/components/brand-logo";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";

export const Route = createFileRoute("/auth")({ component: Auth });

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name too short").max(80),
  email: z.string().trim().email("Invalid email").max(200),
  password: z.string().min(8, "Min 8 characters").max(128),
});

function Auth() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSuccess(true);
    toast.success("Account created");
  }

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email || !password) { toast.error("Email and password required"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Signed in");
  }

  async function google() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setLoading(false); toast.error("Google sign-in failed"); return; }
    if (result.redirected) return;
    setLoading(false);
  }

  async function forgot() {
    const email = prompt("Enter your email for the reset link:");
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message); else toast.success("Reset link sent");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:flex flex-col p-12 text-white overflow-hidden">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="relative">
          <Link to="/" className="inline-flex"><BrandWordmark className="text-white" /></Link>
        </div>
        <div className="relative mt-auto space-y-6">
          <h2 className="text-4xl font-display font-bold leading-tight">Join a movement that brings families back together.</h2>
          <p className="text-white/85 max-w-md">Sign in to report cases, receive AI match alerts, and volunteer in your city.</p>
          <ul className="space-y-2 text-sm">
            {["Encrypted, privacy-first identity", "Verified by document upload", "Get nearby case alerts within minutes"].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 lg:hidden">
          <Link to="/"><BrandWordmark /></Link>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button>
        </div>
        <div className="flex-1 grid place-items-center p-6">
          <Card className="glass w-full max-w-md p-6 sm:p-8">
            {success ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                <div className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-2xl font-display font-bold">Welcome to FindThem!</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your account is ready.</p>
                <Button asChild className="mt-6 gradient-brand text-white"><Link to="/dashboard">Go to dashboard</Link></Button>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-display font-bold">Welcome</h3>
                  <p className="text-sm text-muted-foreground mt-1">Sign in or create your account</p>
                </div>

                <Tabs defaultValue="login">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={signIn} className="space-y-3 mt-5">
                      <Field icon={<Mail className="h-4 w-4" />} label="Email"><Input name="email" type="email" placeholder="you@example.com" required autoComplete="email" /></Field>
                      <Field icon={<Lock className="h-4 w-4" />} label="Password"><Input name="password" type="password" placeholder="••••••••" required autoComplete="current-password" /></Field>
                      <button type="button" onClick={forgot} className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</button>
                      <Button type="submit" disabled={loading} className="w-full gradient-brand text-white">
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={signUp} className="space-y-3 mt-5">
                      <Field icon={<User className="h-4 w-4" />} label="Full name"><Input name="fullName" placeholder="Priya Sharma" required autoComplete="name" /></Field>
                      <Field icon={<Mail className="h-4 w-4" />} label="Email"><Input name="email" type="email" placeholder="you@example.com" required autoComplete="email" /></Field>
                      <Field icon={<Lock className="h-4 w-4" />} label="Password (min 8)"><Input name="password" type="password" required autoComplete="new-password" minLength={8} /></Field>
                      <Button type="submit" disabled={loading} className="w-full gradient-brand text-white">
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="relative my-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div><div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div></div>
                <Button variant="outline" type="button" onClick={google} disabled={loading} className="w-full">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                  Continue with Google
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs flex items-center gap-1.5">{icon}{label}</Label>
      {children}
    </div>
  );
}

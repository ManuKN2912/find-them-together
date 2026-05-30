import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Moon, Search, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { BrandWordmark } from "./brand-logo";
import { useTheme } from "./theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/cases", label: "Cases" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/rewards", label: "Rewards" },
  { to: "/about", label: "About" },
];

type Notif = { id: string; title: string; body: string | null; created_at: string; read: boolean };

export function Navbar() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [q, setQ] = useState("");
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    if (!user) { setNotifs([]); return; }
    supabase.from("notifications").select("id,title,body,created_at,read").order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => setNotifs(data ?? []));
  }, [user]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/cases", search: { q } as any });
  }

  async function logout() {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  const unread = notifs.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b">
        <div className="container mx-auto flex h-16 items-center gap-3 px-4">
          <Link to="/" className="shrink-0"><BrandWordmark /></Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition"
                activeProps={{ className: "text-foreground bg-accent" }}>
                {n.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-sm ml-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search missing persons, cases, locations…"
                className="pl-9 bg-background/60" aria-label="Search" />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications <Badge variant="secondary">{notifs.length}</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifs.length === 0 ? (
                  <div className="p-3 text-xs text-muted-foreground text-center">{user ? "No notifications yet" : "Sign in to see alerts"}</div>
                ) : notifs.slice(0, 4).map((n) => (
                  <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2">
                    <div className="text-sm font-medium">{n.title}</div>
                    {n.body && <div className="text-xs text-muted-foreground">{n.body}</div>}
                    <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/notifications" className="w-full text-center justify-center">View all</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account"><User className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user ? (user.email ?? "Account") : "Guest"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem asChild><Link to="/dashboard">Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/report">Report a case</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}><LogOut className="h-4 w-4 mr-2" />Sign out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild><Link to="/auth">Sign in</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/cases">Browse cases</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {!user && (
              <Button asChild className="hidden sm:inline-flex ml-1 gradient-brand text-white hover:opacity-95">
                <Link to="/auth">Login / Register</Link>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader><SheetTitle><BrandWordmark /></SheetTitle></SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {NAV.map((n) => (
                    <Link key={n.to} to={n.to} className="px-3 py-2 rounded-md hover:bg-accent text-sm font-medium">{n.label}</Link>
                  ))}
                  <Link to="/report" className="px-3 py-2 rounded-md hover:bg-accent text-sm font-medium">Report a case</Link>
                  <Link to="/notifications" className="px-3 py-2 rounded-md hover:bg-accent text-sm font-medium">Notifications</Link>
                  {user ? (
                    <button onClick={logout} className="mt-2 px-3 py-2 rounded-md border text-sm font-medium text-left">Sign out</button>
                  ) : (
                    <Link to="/auth" className="mt-2 px-3 py-2 rounded-md gradient-brand text-white text-sm font-semibold text-center">Login / Register</Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

import { MapPin, Fingerprint } from "lucide-react";

export function BrandLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div className={`relative ${className} grid place-items-center rounded-xl gradient-brand text-white shadow-lg shadow-primary/30`}>
      <MapPin className="absolute h-full w-full p-1 opacity-30" strokeWidth={1.5} />
      <Fingerprint className="h-1/2 w-1/2 relative" strokeWidth={2} />
      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[color:var(--color-accent-orange)] ring-2 ring-background" />
    </div>
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BrandLogo />
      <div className="leading-none">
        <div className="font-display text-lg font-bold tracking-tight">
          <span className="text-primary">Find</span>
          <span className="text-[color:var(--color-accent-orange)]">Them</span>
        </div>
        <div className="text-[10px] font-medium text-muted-foreground mt-0.5 hidden sm:block">
          Together We Bring People Home
        </div>
      </div>
    </div>
  );
}

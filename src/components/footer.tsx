import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, Shield } from "lucide-react";
import { BrandWordmark } from "./brand-logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card/50">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <BrandWordmark />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            AI-powered missing persons platform reuniting families with the help of communities and volunteers across India.
          </p>
          <div className="mt-4 flex gap-2 text-muted-foreground">
            <a href="#" aria-label="Twitter" className="p-2 rounded-md hover:bg-accent"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="p-2 rounded-md hover:bg-accent"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="p-2 rounded-md hover:bg-accent"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Youtube" className="p-2 rounded-md hover:bg-accent"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-3">Platform</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/cases" className="hover:text-foreground">Browse cases</Link></li>
            <li><Link to="/report" className="hover:text-foreground">Report missing person</Link></li>
            <li><Link to="/volunteer" className="hover:text-foreground">Become a volunteer</Link></li>
            <li><Link to="/rewards" className="hover:text-foreground">Rewards</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Emergency</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Police: 100</li>
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Women: 1091</li>
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Child: 1098</li>
            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> support@findthem.org</li>
            <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> NGO partners: 47</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Legal</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Privacy policy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms of service</a></li>
            <li><a href="#" className="hover:text-foreground">Data protection</a></li>
            <li><a href="#" className="hover:text-foreground">Cookie policy</a></li>
            <li><a href="#" className="hover:text-foreground">Contact support</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} FindThem. A community initiative.</div>
          <div>Made with care for families across India 🇮🇳</div>
        </div>
      </div>
    </footer>
  );
}

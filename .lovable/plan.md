
# FindThem — Build Plan

A modern, responsive, AI-powered missing persons platform with NGO + startup aesthetic. Glassmorphism, dark/light mode, blue/white/black palette with red alert accents.

## Logo choice
Use **Full Logo (option 1)** in the navbar/footer and **App Icon (option 2)** as the favicon / mobile tab. Dark-mode version (3) auto-swaps when theme toggles.

## Tech & Foundations
- React + Vite + Tailwind + shadcn/ui + Framer Motion
- Lovable Cloud for: auth (email+password, Google, mobile OTP), database (cases, volunteers, sightings, rewards, notifications), storage (photos, FIR docs), edge functions (AI face match stub, notifications)
- Lovable AI Gateway for AI match reasoning + image embedding similarity
- React Router, TanStack Query, Zod form validation, react-hook-form
- Leaflet (OpenStreetMap) for maps — no API key needed
- next-themes-style theme provider, design tokens in `index.css` + `tailwind.config.ts`

## Design system
- Tokens: deep navy `#1E3A8A`, accent orange `#F59E0B` (from logo), white, near-black, red alert `#DC2626`
- Glassmorphism cards (backdrop-blur, subtle border), rounded-2xl, gradient CTAs (blue→indigo)
- Typography: Inter (body) + Sora (display)
- Framer Motion page/section transitions; skeleton loaders

## Pages & Routes
1. `/` Landing — hero ("Together We Can Bring Them Home"), 3 CTAs, 4 stat cards, featured cases, how-it-works, testimonials, footer
2. `/auth` Login / Signup tabs — email+password, mobile OTP, Google; CAPTCHA, OTP verify screen, animated success
3. `/dashboard` — Nearby cases, Recently found, High-reward, AI match alerts, Volunteer feed
4. `/report` — 5-step wizard (Personal, Identification, Missing details + map picker, Uploads drag-drop, Contact & reward) + Preview & Publish
5. `/cases` — searchable/filterable grid
6. `/cases/:id` — gallery, details, FIR badge, reward, last-seen map, share, AI match status, "I Found This Person" flow
7. Sighting submission modal — camera capture, evidence upload, location, notes → AI verification animation with confidence % → notifications-sent UI
8. `/volunteer` — enable live location, radius slider, "Cases Near You"
9. `/rewards` — bounty cards, claim status, payment success screen
10. `/notifications` — AI alerts, volunteer reports, reward updates, case status
11. `/about` — mission, vision, how it works, AI explanation, impact stats, timeline (Report → Search → AI Verify → Notify → Reunited)
12. Footer (global) — emergency contacts, partners, social, support, privacy, terms

## Global UI
- Navbar: logo, global search, theme toggle, notifications bell (badge), profile menu, Login/Register
- Mobile drawer nav
- Toast system + WhatsApp-style slide-in alert popup
- AI scanning animation component (reusable)

## Backend (Lovable Cloud)
- Tables: `profiles`, `user_roles` (separate, with `has_role` security definer), `cases`, `case_photos`, `sightings`, `sighting_photos`, `notifications`, `rewards`, `volunteer_locations`
- Storage buckets: `case-photos`, `fir-docs`, `sighting-evidence`
- RLS on all tables; public read for published cases, owner/admin write
- Edge functions: `send-otp`, `verify-otp`, `ai-face-match` (calls Lovable AI gateway with image inputs, returns confidence), `notify-match` (email/WhatsApp/SMS stubs)

## Build order
1. Scaffold web_app artifact, design tokens, theme toggle, layout (navbar/footer)
2. Landing page + About + Footer
3. Enable Lovable Cloud → auth pages + profiles + user_roles
4. DB schema + RLS + storage buckets
5. Report wizard (5 steps) with map picker + uploads
6. Cases list + case detail page
7. Dashboard + notifications
8. Sighting flow + AI match edge function + verification animation
9. Volunteer location + rewards pages
10. Polish: animations, skeletons, mobile pass, accessibility (focus rings, aria, contrast)

## Out of scope for v1 (stubbed UI only)
- Real SMS/WhatsApp delivery (UI + edge function shell only; user can wire Twilio later)
- Real payment payout (UI screens only)
- Production-grade face recognition (uses Lovable AI vision as best-effort match)

Approve to start building.

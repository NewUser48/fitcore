# FITCORE — Gym Trainer & Member Management OS
### Production brief (copy this into Claude to build slides)

---

## 1. Title Slide
- **Product:** FITCORE
- **Tagline:** "One Trainer. Unlimited Athletes. Complete Synchronization."
- **Subtitle:** A dual-role gym trainer & athlete management platform
- **Theme:** Midnight Performance — dark charcoal UI with electric-lime accents
- **Stack badge:** Next.js 14 · TypeScript · Supabase · Tailwind CSS

---

## 2. One-Line Pitch
FITCORE is a production-ready SaaS platform built for a **single personal trainer** to manage their athletes end-to-end — workout programming, nutrition plans, attendance, body progress, fees, and 1-on-1 session scheduling — while every athlete gets their own **private, mobile-first portal** that shows only their own live data.

---

## 3. Problem & Solution
**Problem**
- Personal trainers juggle WhatsApp, spreadsheets, and paper for workouts, diets, payments, and attendance.
- Athletes have no single place to see their assigned plan, check progress, or request sessions.
- Generic gym software is built for multi-branch enterprises, not a solo trainer.

**Solution**
- A focused **single-trainer SaaS** with a Trainer Command Center + Athlete Portal.
- Real-time Supabase backend with **row-level security** so each athlete sees only their own record, workouts, diet, and sessions.
- One-click athlete provisioning with secure login handover (copy / WhatsApp).
- Day-by-day, note-based workout & diet programming — fast for the trainer, clear for the athlete.

---

## 4. Two User Roles
| Role | Entry | Capabilities |
|---|---|---|
| **Trainer (Admin)** | Email + password login | Full control: athletes, workouts, diets, attendance, payments, progress, schedule, settings |
| **Member (Athlete)** | Phone (E.164) login (email fallback) | Own dashboard, assigned workouts/diet, progress, membership/receipts, profile, session requests |

- Architecture is intentionally **single-trainer** (no multi-tenant bloat).
- Role-based access enforced at both UI and database (RLS) layers.

---

## 5. Trainer Module — Features
- **Command Dashboard:** 7 live KPIs (total/active members, today's attendance, active workout plans, pending payments, monthly revenue, expiring memberships), analytics charts (revenue, growth, attendance, status donut), operative widgets (today's schedule, expirations, recent payments, members needing attention, activity feed), quick actions.
- **Athlete Roster Management:** search, status filters, card/table views, CSV export.
- **Provisioning (Add Member):** 4-step wizard — personal details, fitness biometrics, membership plan, login credentials — creates a real Supabase Auth user + DB records in one action; credential handover screen with copy-to-clipboard and "Send via WhatsApp".
- **Edit / Delete Members:** update profile & membership, delete removes auth account + cascades records.
- **Day-by-Day Workout Programming:** 7-day editor with workout name, rest-day toggle, format template, and a free-form coach note per day; saved to Supabase per athlete.
- **Day-by-Day Diet Programming:** 7-day nutrition notes with calorie/protein/carb/fat/water targets per athlete.
- **Attendance:** daily present/absent/rest tracking.
- **Payments & Memberships:** invoices, paid/pending/overdue status, revenue tracking, PDF receipts.
- **Body Progress:** weight tracking and assessment milestones.
- **Training Schedule:** calendar of 1-on-1 sessions; **Book Training Session** and **Reschedule** via modal; auto-refreshes to catch member requests.
- **Notifications, Analytics, Settings:** notification log, long-term charts, gym/currency/security settings.

---

## 6. Member Module — Features (Athlete Portal)
- **Personal Dashboard:** greeting, membership status, today's only workout + diet (future days locked), rest timer, hydration tracker, weight trajectory, next session.
- **Workouts:** today's assigned routine and coach notes, "mark complete" tracking.
- **Diet & Nutrition:** today's meal/nutrition instructions and calorie target.
- **Progress:** weight-trend chart from live progress records, PRs.
- **Membership & Receipts:** plan validity, fee paid, downloadable invoice, payment history.
- **Profile:** edit contact, emergency contact, target weight (persisted to DB).
- **Schedule:** view today's sessions, view upcoming requests, and **Request Session Slot** (date, time, focus, notes) — the request instantly appears in the trainer's schedule.
- **Live data guarantee:** every member page is bound to the signed-in user's auth id (no shared/mock data).

---

## 7. Key User Flows
1. **Athlete onboarding**
   Trainer opens Add Member → fills wizard → system creates Supabase Auth user (role=member) + `members` row + seeds 7 workout plans + 7 diet plans + optional payment → shows temp password handover (copy / WhatsApp).
2. **Member login**
   Member enters phone + password → app tries phone auth → phone provider disabled → seamless **phone→email lookup fallback** → signs in → middleware redirects to `/member/dashboard` → portal loads that member's live data.
3. **Workout assignment**
   Trainer edits per-day notes in Workouts module → saved to `workout_plans` via upsert → member's portal reflects the exact notes for today.
4. **Session booking**
   Member requests a slot → server API authenticates member, validates, inserts `training_sessions` with a "Requested by member" tag → trainer schedule refreshes (polling + focus) and shows a **Member Request** badge.
5. **Trainer booking/reschedule**
   Trainer opens Book/Reschedule modal → writes `training_sessions` under trainer RLS → calendar refreshes.

---

## 8. Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| UI | React 18, Tailwind CSS 3, custom component library |
| Motion | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications/Toasts | Sonner |
| PDF | jsPDF |
| Backend/DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + phone, E.164 normalization) |
| Security | PostgreSQL Row-Level Security (RLS) policies + triggers |
| Hosting-ready | Vercel (`.vercel` present) |

**Rendering:** 46 routes build cleanly; server API routes for privileged operations; client components for interactive dashboards.

---

## 9. Database Design (PostgreSQL / Supabase)
| Table | Purpose |
|---|---|
| `profiles` | Auth-linked users (role: trainer/member, name, phone, email, avatar) |
| `trainer_settings` | Gym name, specialization, currency, experience |
| `members` | Athlete directory: biometrics, contacts, plan, fee, status, dates |
| `workout_plans` | Per-member, per-day workout name + rest flag + coach note |
| `diet_plans` | Per-member, per-day nutrition note + macro/water targets |
| `attendance` | Daily per-member check-in (present/absent/rest) |
| `payments` | Invoices, amounts, method, status, dates |
| `progress_records` | Weight, body-fat, measurements, notes |
| `training_sessions` | 1-on-1 sessions (date, time, focus, status, notes) |
| `notifications` | Per-user notification log |
| `auth.users` | Supabase-managed credentials |

**Integrity:** UUID primary keys, foreign keys with `on delete cascade`, unique constraints on `(member_id, day)` for plans, indexes on member/phone/status, auto-profile trigger on `auth.users` insert.

---

## 10. Security Model (RLS)
- **Trainer** (role = trainer) has full access to all members, plans, sessions, payments, progress, attendance, notifications — verified via `is_trainer()` security-definer function.
- **Members** can only:
  - view/update their own `members` and `profiles` record,
  - view their own workout/diet/attendance/payment/progress/session rows,
  - insert their own attendance/progress,
  - request sessions via a server API (service-role) because members have no direct insert on `training_sessions`.
- **Privileged operations** (create/delete/update member, member session requests) run server-side with the service-role key; the key is never exposed to the browser.
- **Middleware** guards `/trainer/*` and `/member/*`, redirecting unauthenticated users to `/login` and separating roles.

---

## 11. API Endpoints
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/member-lookup` | Resolve phone → linked email for login fallback |
| POST | `/api/member/sessions/request` | Member books a 1-on-1 session (auth + validation) |
| POST | `/api/trainer/members/create` | Provision member auth account + all records |
| POST | `/api/trainer/members/update` | Update member + profile |
| DELETE | `/api/trainer/members/delete` | Remove member auth account & records |
| GET | `/api/trainer/members/count` | Roster count metric |

---

## 12. Design System — "Midnight Performance"
| Token | Value |
|---|---|
| Background | `#10151B` |
| Sidebar | `#151B22` |
| Cards | `#1C242D` |
| Primary accent (electric lime) | `#B8FF3B` |
| Text primary | `#F5F7FA` |
| Text muted | `#94A3B8` |
| Borders | `#303A45` |
| Status | emerald `#10B981`, amber `#F59E0B`, orange `#F97316`, rose `#EF4444`, sky `#38BDF8` |

- Fonts: Inter (body) + Manrope (display).
- Styling cues: glass headers, lime glow shadows, rounded 2xl cards, grid-pattern background, dark sport-tech aesthetic.
- Currency default: ₹ INR.

---

## 13. Project Structure (high level)
```
app/
  page.tsx                 Landing / dual-role entry
  login/                   Trainer + Member login tabs
  trainer/                 dashboard, members, workouts, diet, attendance,
                           payments, progress, schedule, memberships,
                           notifications, settings
  member/                  dashboard, workouts, diet, progress, schedule,
                           membership, profile  (+ layout with live data provider)
  portal/                  Trainer-preview athlete portal
  api/                     auth + member + trainer endpoints
components/
  trainer/  member/  dashboard/  layout/  modals/  portal/  ui/
lib/
  supabase/ (client, server, admin, mappers, hooks)
  auth-helpers.ts, utils.ts, mock-data.ts
supabase/schema.sql        Full DB schema + RLS + triggers
```

---

## 14. Current Status & Highlights (talking points)
- **Fully Supabase-backed** — not a mock; live member roster, plans, sessions, payments.
- **7 athletes live** in the database, each with 7 workout + 7 diet plans.
- **Auth verified:** member phone→email fallback works; trainer RLS insert/update/delete verified.
- **Production build passes:** typecheck + `next build`, 46 routes.
- **Member data isolation fixed app-wide** via a shared live-data provider.
- **Bidirectional scheduling:** members request slots; trainer books/reschedules; calendar stays in sync.

**Demo credentials**
- Trainer: `alex@fitcore.com` / `Trainer@123`
- Member (demo): `+91 98201 12345` (Rohan) / `Member@123`

---

## 15. Future Roadmap
- Automated reminders (expiring memberships, session confirmations) via WhatsApp/email.
- In-app chat between trainer and athlete.
- Exercise library with media/video and set-level logging.
- Payment gateway integration (UPI/Razorpay) with auto receipts.
- Progress photo uploads to private Supabase Storage.
- Mobile PWA / native app wrapper.
- Multi-currency and timezone support.

---

## 16. Suggested 14-Slide Deck Outline
1. **Title** — FITCORE + tagline
2. **Problem** — solo trainers' fragmented tools
3. **Solution** — single-trainer SaaS + dual portals
4. **Two Roles** — Trainer vs Athlete
5. **Trainer Command Center** — dashboard KPIs & analytics
6. **Athlete Management** — roster, provisioning, credential handover
7. **Workout & Diet Programming** — day-by-day note-based
8. **Attendance, Payments & Progress** — operations
9. **Training Schedule** — member request ↔ trainer booking
10. **Athlete Portal** — personal live dashboard
11. **Architecture** — Next.js + Supabase + RLS
12. **Database & Security** — schema + row-level security
13. **Design System** — Midnight Performance palette
14. **Status & Roadmap** — what's live, what's next

---

### Speaker-note soundbite
"FITCORE gives one coach the operational power of an entire gym platform, and gives every athlete a private, real-time window into their own training — all secured by database-level row-level security."

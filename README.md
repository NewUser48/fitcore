# APEX // PERSONAL GYM TRAINER MANAGEMENT SYSTEM
### *Theme: Midnight Performance*

A world-class, production-ready SaaS management platform designed exclusively for **ONE PERSONAL GYM TRAINER** to manage their private roster of athletes, workouts, nutrition protocols, body metrics, fee billing, and 1-on-1 sessions.

---

## 1. Project Philosophy & Architecture

- **Single Trainer Focus**: Built strictly for one personal trainer managing their own members. No multi-tenant gym branches, trainer marketplaces, or enterprise bloat.
- **Midnight Performance Theme**: Athletic sports-tech visual identity with deep midnight surfaces, high-contrast typography, and electric lime accents.
- **Production-Ready Next.js 14**: App Router, TypeScript, Tailwind CSS, Framer Motion, Recharts, and Lucide React.
- **Zero Faked Data Backend Philosophy**: Phase 1 establishes the complete design system, layout shell, responsive navigation, and interactive UI views. All data structures match the normalized Supabase PostgreSQL schema ready for Phase 2.

---

## 2. Design System Tokens (Midnight Performance)

| Element | Hex Code / Specification | Description |
|---|---|---|
| **Background** | `#10151B` | Deep midnight canvas |
| **Sidebar** | `#151B22` | Dark obsidian panel |
| **Cards & Surfaces** | `#1C242D` | Charcoal performance containers |
| **Primary Accent** | `#B8FF3B` | Electric athletic lime |
| **Text Primary** | `#F5F7FA` | High-contrast clean white |
| **Text Muted** | `#94A3B8` | Slate secondary information |
| **Borders** | `#303A45` | Subtle architectural boundary |
| **Currency** | `₹ (INR)` | Indian Rupee default (configurable) |

---

## 3. Implemented Modules (Phase 1)

### 3.1. Main Dashboard (`/`)
- **Top Glass Header**: Dynamic trainer greeting, date formatting, quick athlete search (`⌘K`), unread notification bell with preview popover, trainer profile menu, and one-click "Add Member" button.
- **6 Key KPI Cards**:
  1. Total Members
  2. Active Members (retention rate)
  3. Expiring Memberships (< 7 days)
  4. Monthly Revenue (in ₹ with trend)
  5. Today's Attendance (present vs expected)
  6. Pending Payments (unpaid invoices)
- **Interactive Analytics (Recharts)**:
  - Monthly Revenue Bar Chart (Actual vs Projected in ₹)
  - Member Growth Line Chart (Total enrolled vs Active)
  - Weekly Attendance Trend Area Chart
  - Member Status Donut Chart (Active vs Expiring vs Expired)
- **High-Impact Operative Widgets**:
  - Today's Training Schedule (1-on-1 sessions with live status)
  - Upcoming Membership Expirations (with WhatsApp reminder trigger)
  - Recent Payments & Invoices
  - Members Requiring Attention (missed workouts, overdue fees, injury flags)
  - Live Member Activity Feed
  - Quick Action Commands bar
- **Zero-State Onboarding**: One-click toggle to preview the clean empty-state layout for brand-new trainer accounts.

### 3.2. Member Directory & Profiles (`/members`)
- Real-time search by athlete name, phone, or fitness goal
- Filter by membership status (`active`, `expiring`, `expired`)
- Filter by membership plan
- Sort by joining date (newest/oldest)
- **Export to CSV**: Real browser download of all member records
- Dual view toggle: **Cards View** and **Table View**
- **7-Tab Member Profile Modal**:
  1. *Overview* (Biometrics, vitals, emergency contacts, medical flags)
  2. *Workout Plan* (Assigned exercises, sets, reps)
  3. *Diet Plan* (Daily calorie targets, macro splits, hydration)
  4. *Attendance* (Compliance percentage, last check-in)
  5. *Progress* (Weight delta, lift PRs)
  6. *Payments* (Plan fee status, due balances)
  7. *Notes* (Confidential coach observations)

### 3.3. Add Member Modal
- 3-step enrollment wizard:
  - Step 1: Personal info (Name, email, phone, DOB, gender)
  - Step 2: Biometrics & goals (Height, start weight, goal, assessment notes)
  - Step 3: Membership plan & medical notes (Plan selection, start date, emergency contact, restricted medical notes)
- Form validation and animated success feedback.

### 3.4. Additional Module Shells
- **Workouts (`/workouts`)**: Periodization routine templates and Master Exercise Library.
- **Nutrition (`/nutrition`)**: Daily calorie targets, macro splits (protein/carbs/fats), and hydration goals.
- **Attendance (`/attendance`)**: Check-in roster with instant present/absent toggles and reliability percentages.
- **Body Progress (`/progress`)**: Weight tracking, delta calculations, and assessment milestones.
- **Billing & Plans (`/billing`)**: Membership packages, fee collection, partial balance logs, and PDF receipt downloads.
- **Training Schedule (`/schedule`)**: 1-on-1 session calendar preventing appointment overlaps.
- **Analytics (`/analytics`)**: Long-term roster growth, revenue, and retention charts.
- **Settings (`/settings`)**: Trainer credentials, gym name, currency preferences, and RLS security status.
- **Notifications (`/notifications`)**: Database-backed notification log.

---

## 4. Folder Structure

```
TRAINER MS/
├── app/
│   ├── analytics/page.tsx
│   ├── attendance/page.tsx
│   ├── billing/page.tsx
│   ├── members/page.tsx
│   ├── notifications/page.tsx
│   ├── nutrition/page.tsx
│   ├── progress/page.tsx
│   ├── schedule/page.tsx
│   ├── settings/page.tsx
│   ├── workouts/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── activity-feed.tsx
│   │   ├── analytics-charts.tsx
│   │   ├── attention-widget.tsx
│   │   ├── expiring-members.tsx
│   │   ├── kpi-cards.tsx
│   │   ├── quick-actions.tsx
│   │   ├── recent-payments.tsx
│   │   └── today-schedule.tsx
│   ├── layout/
│   │   ├── dashboard-shell.tsx
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   ├── modals/
│   │   ├── add-member-modal.tsx
│   │   └── quick-search-modal.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── empty-state.tsx
│       ├── input.tsx
│       ├── modal.tsx
│       ├── skeleton.tsx
│       └── tabs.tsx
├── lib/
│   ├── mock-data.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 5. How to Run the Application

### Prerequisites
- Node.js `v18+` or `v20+` or `v22+` (v26 verified)
- npm `v9+` or `v10+` or `v11+`

### Installation & Launch
```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000

# 4. Production build verification
npm run build
npm run start
```

---

## 6. Next Step: Phase 2 Supabase Readiness

Upon user approval, **Phase 2** will implement:
1. Supabase PostgreSQL database schema migrations for all tables (`profiles`, `trainer_settings`, `members`, `membership_plans`, `payments`, `attendance`, `exercises`, `workout_templates`, `diet_plans`, `progress_records`, `training_sessions`, `notifications`).
2. Foreign keys, constraints, indexes, and triggers.
3. Supabase Row Level Security (RLS) policies enforcing single-trainer ownership.
4. Private Supabase Storage bucket policies for progress photos and receipts.
5. Supabase Auth configuration (Trainer secure login & optional restricted member portal).

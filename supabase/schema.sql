-- ==============================================================================
-- FITCORE: DUAL-LOGIN GYM TRAINER & MEMBER MANAGEMENT SYSTEM
-- PostgreSQL Database Schema, Row Level Security (RLS) & Triggers
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Clean existing schema if running as clean migration (optional safety)
-- drop schema if exists public cascade;
-- create schema public;

-- ==============================================================================
-- 2. CORE USER PROFILES TABLE
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('trainer', 'member')),
  full_name text not null,
  phone text unique,
  email text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. TRAINER SETTINGS TABLE
-- ==============================================================================
create table if not exists public.trainer_settings (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null unique references public.profiles(id) on delete cascade,
  gym_name text not null default 'FITCORE Performance Center',
  specialization text not null default 'Strength, Hypertrophy & Athletic Conditioning',
  currency text not null default 'INR',
  currency_symbol text not null default '₹',
  experience_years int default 8,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 4. MEMBERS DIRECTORY TABLE
-- ==============================================================================
create table if not exists public.members (
  id uuid primary key references public.profiles(id) on delete cascade,
  trainer_id uuid references public.profiles(id),
  full_name text not null,
  phone text unique not null,
  email text,
  date_of_birth date,
  gender text,
  address text,
  emergency_contact text,
  height_cm numeric(5,2),
  weight_kg numeric(5,2),
  target_weight_kg numeric(5,2),
  fitness_goal text not null default 'Muscle Hypertrophy & Strength',
  experience_level text not null default 'Intermediate',
  medical_notes text,
  trainer_notes text,
  membership_plan text not null default 'Quarterly Elite VIP',
  membership_fee numeric(10,2) not null default 9500.00,
  membership_status text not null default 'Active' check (membership_status in ('Active', 'Expiring', 'Expired', 'Inactive')),
  start_date date not null default current_date,
  end_date date not null default (current_date + interval '90 days'),
  must_change_password boolean not null default true,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Index for high-speed searching
create index if not exists idx_members_trainer on public.members(trainer_id);
create index if not exists idx_members_phone on public.members(phone);
create index if not exists idx_members_status on public.members(membership_status);

-- ==============================================================================
-- 5. DAY-BY-DAY WORKOUT PLANS (NOTE-BASED ARCHITECTURE)
-- ==============================================================================
create table if not exists public.workout_plans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  day text not null check (day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  workout_name text not null default 'Training Split',
  is_rest_day boolean not null default false,
  estimated_duration_min int default 60,
  focus text default 'General Conditioning',
  workout_note text not null default '',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  unique(member_id, day)
);

create index if not exists idx_workout_plans_member on public.workout_plans(member_id);

-- ==============================================================================
-- 6. DAY-BY-DAY DIET & NUTRITION PLANS (NOTE-BASED ARCHITECTURE)
-- ==============================================================================
create table if not exists public.diet_plans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  day text not null check (day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  diet_title text not null default 'High Protein Daily Fuel',
  daily_calories_target int default 2200,
  protein_target_g int default 180,
  carbs_target_g int default 200,
  fats_target_g int default 60,
  water_target_liters numeric(3,1) default 3.5,
  diet_note text not null default '',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null,
  unique(member_id, day)
);

create index if not exists idx_diet_plans_member on public.diet_plans(member_id);

-- ==============================================================================
-- 7. ATTENDANCE TRACKING TABLE
-- ==============================================================================
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  date date not null default current_date,
  status text not null default 'present' check (status in ('present', 'absent', 'rest_day')),
  check_in_time time default current_time,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  unique(member_id, date)
);

create index if not exists idx_attendance_member_date on public.attendance(member_id, date);

-- ==============================================================================
-- 8. PAYMENTS & INVOICES TABLE
-- ==============================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  invoice_no text unique not null,
  plan_name text not null,
  amount numeric(10,2) not null,
  status text not null default 'Paid' check (status in ('Paid', 'Pending', 'Overdue')),
  payment_method text not null default 'UPI / GPay / PhonePe',
  payment_date date default current_date,
  due_date date,
  receipt_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_payments_member on public.payments(member_id);

-- ==============================================================================
-- 9. BODY BIOMETRICS & PROGRESS TABLE
-- ==============================================================================
create table if not exists public.progress_records (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  recorded_date date not null default current_date,
  weight_kg numeric(5,2) not null,
  body_fat_pct numeric(4,1),
  chest_cm numeric(5,2),
  waist_cm numeric(5,2),
  arms_cm numeric(5,2),
  notes text,
  photo_front_url text,
  photo_side_url text,
  photo_back_url text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_progress_member on public.progress_records(member_id);

-- ==============================================================================
-- 10. TRAINING SESSIONS TABLE
-- ==============================================================================
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  trainer_id uuid references public.profiles(id),
  session_date date not null default current_date,
  start_time text not null,
  end_time text not null,
  focus_area text,
  status text not null default 'Scheduled' check (status in ('Scheduled', 'Completed', 'Cancelled')),
  notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_sessions_member on public.training_sessions(member_id);

-- ==============================================================================
-- 11. NOTIFICATIONS TABLE
-- ==============================================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'info',
  read boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

create index if not exists idx_notifications_user on public.notifications(user_id);

-- ==============================================================================
-- 12. HELPER FUNCTIONS FOR SECURITY (RLS)
-- ==============================================================================

-- Helper: Check if current authenticated user has 'trainer' role
create or replace function public.is_trainer()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'trainer'
  );
$$;

-- Helper: Get current user ID
create or replace function public.current_user_id()
returns uuid
language sql
security definer
stable
as $$
  select auth.uid();
$$;

-- ==============================================================================
-- 13. ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.trainer_settings enable row level security;
alter table public.members enable row level security;
alter table public.workout_plans enable row level security;
alter table public.diet_plans enable row level security;
alter table public.attendance enable row level security;
alter table public.payments enable row level security;
alter table public.progress_records enable row level security;
alter table public.training_sessions enable row level security;
alter table public.notifications enable row level security;

-- ==============================================================================
-- 14. ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- PROFILES
create policy "Trainer has full access to all profiles"
  on public.profiles for all
  using (public.is_trainer());

create policy "Users can view their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update specific fields of their own profile"
  on public.profiles for update
  using (id = auth.uid());

-- TRAINER SETTINGS
create policy "Trainer manages their settings"
  on public.trainer_settings for all
  using (public.is_trainer());

create policy "Members can view trainer gym details"
  on public.trainer_settings for select
  using (true);

-- MEMBERS
create policy "Trainer has full control of members"
  on public.members for all
  using (public.is_trainer());

create policy "Members can view only their own record"
  on public.members for select
  using (id = auth.uid());

create policy "Members can update their own personal contact & target weight"
  on public.members for update
  using (id = auth.uid());

-- WORKOUT PLANS
create policy "Trainer manages all workout plans"
  on public.workout_plans for all
  using (public.is_trainer());

create policy "Members view only their assigned workout plans"
  on public.workout_plans for select
  using (member_id = auth.uid());

-- DIET PLANS
create policy "Trainer manages all diet plans"
  on public.diet_plans for all
  using (public.is_trainer());

create policy "Members view only their assigned diet plans"
  on public.diet_plans for select
  using (member_id = auth.uid());

-- ATTENDANCE
create policy "Trainer manages all attendance records"
  on public.attendance for all
  using (public.is_trainer());

create policy "Members view their own attendance history"
  on public.attendance for select
  using (member_id = auth.uid());

create policy "Members can mark their daily check-in"
  on public.attendance for insert
  with check (member_id = auth.uid());

-- PAYMENTS
create policy "Trainer manages all payments"
  on public.payments for all
  using (public.is_trainer());

create policy "Members view their own payment receipts"
  on public.payments for select
  using (member_id = auth.uid());

-- PROGRESS RECORDS
create policy "Trainer manages all progress records"
  on public.progress_records for all
  using (public.is_trainer());

create policy "Members view their own progress records"
  on public.progress_records for select
  using (member_id = auth.uid());

create policy "Members can submit their progress record"
  on public.progress_records for insert
  with check (member_id = auth.uid());

-- TRAINING SESSIONS
create policy "Trainer manages all sessions"
  on public.training_sessions for all
  using (public.is_trainer());

create policy "Members view their upcoming sessions"
  on public.training_sessions for select
  using (member_id = auth.uid());

-- NOTIFICATIONS
create policy "Trainer manages all notifications"
  on public.notifications for all
  using (public.is_trainer());

create policy "Users view and read their own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can mark notifications as read"
  on public.notifications for update
  using (user_id = auth.uid());

-- ==============================================================================
-- 15. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_role text;
  user_name text;
  user_phone text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'member');
  user_name := coalesce(new.raw_user_meta_data->>'full_name', 'FITCORE User');
  user_phone := coalesce(new.phone, new.raw_user_meta_data->>'phone');

  insert into public.profiles (id, role, full_name, phone, email, avatar_url)
  values (
    new.id,
    user_role,
    user_name,
    user_phone,
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
  );

  return new;
end;
$$;

-- Drop trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 16. SEED TRAINER INITIAL SETUP (EXAMPLE INSTRUCTION)
-- Run this in SQL editor after creating the trainer user in Auth!
-- ==============================================================================
/*
-- 1. Create Alex Vance (Trainer) in Auth via Supabase Dashboard -> Authentication -> Users -> Add User:
-- Email: alex@fitcore.com
-- Password: Trainer@123
-- User Metadata: {"role": "trainer", "full_name": "Alex Vance"}
*/


-- ==============================================================================
-- 17. SCHEMA PERMISSIONS FOR API ROLES
-- ==============================================================================
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

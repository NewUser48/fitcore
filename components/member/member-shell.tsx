"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Calendar,
  CreditCard,
  User,
  LogOut,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { fitcoreMembers, fitcoreTrainer } from "@/lib/mock-data";
import { MemberProfile } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MemberShellProps {
  children: React.ReactNode;
}

export function MemberShell({ children }: MemberShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Local state for switching athlete preview
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>(fitcoreMembers[0].id);

  const activeMember: MemberProfile =
    fitcoreMembers.find((m) => m.id === selectedMemberId) || fitcoreMembers[0];

  const navItems = [
    { name: "Overview", href: "/member/dashboard", icon: LayoutDashboard },
    { name: "Workouts", href: "/member/workouts", icon: Dumbbell },
    { name: "Diet", href: "/member/diet", icon: UtensilsCrossed },
    { name: "Progress", href: "/member/progress", icon: TrendingUp },
    { name: "Schedule", href: "/member/schedule", icon: Calendar },
    { name: "Membership", href: "/member/membership", icon: CreditCard },
  ];

  const handleSignOut = () => {
    toast.success("Signed out of Athlete Portal");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col pb-20 md:pb-6">
      {/* Top Preview Switcher Bar (For testing / demonstration) */}
      <div className="bg-[#1C2622] border-b border-primary/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-bold text-primary tracking-wide uppercase text-[11px]">
            FITCORE Athlete Portal
          </span>
          <span className="text-text-muted hidden sm:inline">&bull;</span>
          <span className="text-text-muted hidden sm:inline">
            Logged in as: <strong className="text-text-primary">{activeMember.full_name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-text-muted hidden md:inline">Switch Athlete:</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="h-7 rounded-lg border border-border bg-[#151B22] px-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              {fitcoreMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.membership_status})
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/trainer/dashboard"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151B22] border border-border hover:border-primary/50 text-text-muted hover:text-text-primary text-[11px] font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
            <span>Trainer Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Floating Header */}
      <header className="sticky top-0 z-40 glass-header px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/member/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-primary/40 shadow-lime-glow-sm">
              <Flame className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div>
              <span className="font-display font-black text-sm tracking-wider text-text-primary">
                FIT<span className="text-primary font-bold">CORE</span>
              </span>
              <p className="text-[10px] text-text-muted">Coach: {fitcoreTrainer.name}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-6 border-l border-border pl-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-[#25303D] text-primary border border-primary/20 shadow-sm"
                      : "text-text-muted hover:text-text-primary hover:bg-[#1E2630]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Member Profile Badge & Sign Out */}
        <div className="flex items-center gap-3">
          <Link
            href="/member/profile"
            className="flex items-center gap-2.5 bg-[#151B22] border border-border/80 rounded-xl px-2.5 py-1 hover:border-primary/40 transition-colors"
          >
            <img
              src={activeMember.avatar_url || ""}
              alt={activeMember.full_name}
              className="h-7 w-7 rounded-lg object-cover border border-primary/30"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-text-primary leading-none">
                {activeMember.full_name}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">
                {activeMember.membership_plan_name}
              </span>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-card border border-border text-rose-400 hover:bg-rose-500/10"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Thumb-friendly fitness app navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#151B22]/95 backdrop-blur-md border-t border-border px-3 py-2 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all",
                isActive ? "text-primary scale-105 font-bold" : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Calendar,
  Receipt,
  User,
  ShieldCheck,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { sampleMembers, initialTrainerProfile } from "@/lib/mock-data";
import { Member } from "@/types";
import { cn } from "@/lib/utils";

interface PortalShellProps {
  children: React.ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>(sampleMembers[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Active member for preview
  const currentMember =
    sampleMembers.find((m) => m.id === selectedMemberId) || sampleMembers[0];

  const portalNav = [
    { name: "My Dashboard", href: "/portal", icon: LayoutDashboard },
    { name: "My Workouts", href: "/portal/workouts", icon: Dumbbell },
    { name: "Diet & Macros", href: "/portal/nutrition", icon: UtensilsCrossed },
    { name: "Body Progress", href: "/portal/progress", icon: TrendingUp },
    { name: "Training Sessions", href: "/portal/schedule", icon: Calendar },
    { name: "Plan & Receipts", href: "/portal/billing", icon: Receipt },
    { name: "My Profile", href: "/portal/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Top Trainer Switcher & Portal Mode Banner */}
      <div className="bg-[#1C2622] border-b border-primary/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-bold text-primary tracking-wide uppercase text-[11px]">
            Restricted Member Portal View
          </span>
          <span className="text-text-muted hidden sm:inline">&bull;</span>
          <span className="text-text-muted hidden sm:inline">
            Viewing as athlete: <strong className="text-text-primary">{currentMember.full_name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Member Switcher Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-text-muted hidden md:inline">Switch Athlete:</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="h-7 rounded-lg border border-border bg-[#151B22] px-2 text-xs text-text-primary focus:outline-none focus:border-primary/60"
            >
              {sampleMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.membership_status})
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151B22] border border-border hover:border-primary/50 text-text-muted hover:text-text-primary text-[11px] font-semibold transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
            <span>Trainer Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Member Portal Navigation Header */}
      <header className="sticky top-0 z-40 glass-header px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portal" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-primary/40 shadow-lime-glow-sm">
              <Flame className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm tracking-wider text-text-primary">
                APEX<span className="text-primary font-bold">.ATHLETE</span>
              </span>
              <p className="text-[10px] text-text-muted">Coach: {initialTrainerProfile.name}</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-6 border-l border-border pl-6">
            {portalNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-[#25303D] text-primary shadow-sm font-semibold border border-primary/20"
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

        {/* Member Profile Avatar & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-[#151B22] border border-border/80 rounded-xl px-2.5 py-1.5">
            <img
              src={currentMember.avatar_url || ""}
              alt={currentMember.full_name}
              className="h-7 w-7 rounded-lg object-cover border border-primary/30"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-text-primary leading-none">
                {currentMember.full_name}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">
                {currentMember.membership_plan_name}
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-card border border-border text-text-primary"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#151B22] border-b border-border p-4 space-y-1.5 animate-in fade-in">
          {portalNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                  isActive
                    ? "bg-[#25303D] text-primary border border-primary/30"
                    : "text-text-muted hover:text-text-primary hover:bg-card"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Portal Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

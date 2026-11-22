"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Users,
  Dumbbell,
  UtensilsCrossed,
  CalendarCheck,
  TrendingUp,
  Calendar,
  Layers,
  CreditCard,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  LogOut,
  Sparkles,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fitcoreTrainer } from "@/lib/mock-data";
import { AddMemberDialog } from "@/components/trainer/add-member-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TrainerShellProps {
  children: React.ReactNode;
}

export const trainerNavItems = [
  { name: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/trainer/members", icon: Users, badge: "32" },
  { name: "Workout Management", href: "/trainer/workouts", icon: Dumbbell },
  { name: "Diet Management", href: "/trainer/diet", icon: UtensilsCrossed },
  { name: "Attendance", href: "/trainer/attendance", icon: CalendarCheck, badge: "14/18" },
  { name: "Body Progress", href: "/trainer/progress", icon: TrendingUp },
  { name: "Training Schedule", href: "/trainer/schedule", icon: Calendar, badge: "4 Today" },
  { name: "Memberships", href: "/trainer/memberships", icon: Layers },
  { name: "Payments", href: "/trainer/payments", icon: CreditCard, badge: "2 Due" },
  { name: "Notifications", href: "/trainer/notifications", icon: Bell, badge: "3" },
  { name: "Settings", href: "/trainer/settings", icon: Settings },
];

export function TrainerShell({ children }: TrainerShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);

  const handleSignOut = () => {
    toast.success("Signed out of Trainer Account");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* 1. Desktop Trainer Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-sidebar border-r border-border transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto no-scrollbar">
          {/* Top Brand */}
          <div>
            <div className="flex h-20 items-center justify-between px-5 border-b border-border">
              <Link href="/trainer/dashboard" className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-2xl bg-[#1C242D] border border-primary/40 flex items-center justify-center text-primary shadow-lime-glow-sm">
                  <Flame className="h-5 w-5 animate-pulse" />
                </div>
                {!collapsed && (
                  <div>
                    <span className="font-display font-black text-base tracking-wider text-text-primary">
                      FIT<span className="text-primary font-bold">CORE</span>
                    </span>
                    <span className="block text-[9px] font-bold text-text-muted tracking-widest uppercase">
                      Trainer Admin OS
                    </span>
                  </div>
                )}
              </Link>
            </div>

            {/* Quick Athlete Portal Jump */}
            {!collapsed && (
              <div className="mx-3 mt-3 mb-1">
                <Link
                  href="/member/dashboard"
                  className="flex items-center justify-between p-2 rounded-xl bg-[#1C242D]/80 border border-primary/30 text-xs text-text-muted hover:text-text-primary hover:border-primary transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                    <Sparkles className="h-3 w-3" /> Athlete Portal
                  </span>
                  <ExternalLink className="h-3 w-3 text-text-muted" />
                </Link>
              </div>
            )}

            {/* Navigation links */}
            <nav className="space-y-1 px-3 py-3">
              {trainerNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/trainer/dashboard" && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150",
                      isActive
                        ? "bg-[#1C242D] text-primary border border-primary/30 shadow-lime-glow-sm"
                        : "text-text-muted hover:bg-sidebar-hover hover:text-text-primary",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-primary shadow-lime-glow" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary"
                      )}
                    />
                    {!collapsed && <span className="truncate text-xs">{item.name}</span>}
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-md",
                          item.badge.includes("Due")
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : isActive
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-[#242D37] text-text-muted"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Trainer Identity & Collapse Button */}
          <div className="border-t border-border p-3 bg-[#13181F]/90">
            {!collapsed ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={fitcoreTrainer.avatar_url}
                    alt={fitcoreTrainer.name}
                    className="h-8 w-8 rounded-xl object-cover border border-primary/40 shrink-0"
                  />
                  <div className="truncate text-left">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {fitcoreTrainer.name}
                    </p>
                    <p className="text-[10px] text-text-muted truncate">Sole Trainer</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-[#1E2630] transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg border border-border text-text-muted hover:text-primary transition-colors"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-1.5 rounded-lg border border-border text-text-muted hover:text-primary"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. Main Viewport & Top Header */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          collapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        {/* Floating Glass Header */}
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between px-4 sm:px-8 glass-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-text-primary"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-text-primary">
                Coach Alex Vance &bull;{" "}
                <span className="text-primary font-black">FITCORE OS</span>
              </h1>
              <p className="text-[11px] text-text-muted font-medium">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date())}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Add Member button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddMemberOpen(true)}
              className="shadow-lime-glow-sm flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Member</span>
            </Button>

            {/* Jump to Member Portal */}
            <Link
              href="/member/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-[#151B22] text-xs font-semibold text-text-muted hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Athlete Portal &rarr;</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Viewport content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-border transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <span className="font-black text-sm text-text-primary">
            FITCORE // TRAINER
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {trainerNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium",
                  isActive
                    ? "bg-[#1C242D] text-primary border border-primary/30"
                    : "text-text-muted hover:bg-card hover:text-text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Global Add Member Dialog */}
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
      />
    </div>
  );
}

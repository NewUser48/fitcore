"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UtensilsCrossed,
  CalendarCheck,
  TrendingUp,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck,
  Bell,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { initialTrainerProfile } from "@/lib/mock-data";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: undefined,
  },
  {
    name: "Members",
    href: "/members",
    icon: Users,
    badge: "32",
  },
  {
    name: "Workout Plans",
    href: "/workouts",
    icon: Dumbbell,
    badge: undefined,
  },
  {
    name: "Diet & Nutrition",
    href: "/nutrition",
    icon: UtensilsCrossed,
    badge: undefined,
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
    badge: "14/18",
  },
  {
    name: "Body Progress",
    href: "/progress",
    icon: TrendingUp,
    badge: undefined,
  },
  {
    name: "Billing & Plans",
    href: "/billing",
    icon: CreditCard,
    badge: "2 Due",
  },
  {
    name: "Training Schedule",
    href: "/schedule",
    icon: Calendar,
    badge: "4 Today",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: undefined,
  },
  {
    name: "Member Portal",
    href: "/portal",
    icon: ShieldCheck,
    badge: "Live",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    badge: undefined,
  },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto no-scrollbar">
      {/* Top Branding & Header */}
      <div>
        <div className="flex h-20 items-center justify-between px-5 border-b border-border/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1C242D] border border-primary/40 shadow-lime-glow-sm transition-transform duration-300 group-hover:scale-105">
              <Flame className="h-5 w-5 text-primary animate-pulse" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-base tracking-wider text-text-primary">
                    APEX<span className="text-primary font-bold">.TRAINER</span>
                  </span>
                </div>
                <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                  Personal Coach OS
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden rounded-lg p-2 text-text-muted hover:bg-sidebar-hover hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* System Single-Trainer Badge */}
        {!collapsed && (
          <div className="mx-4 mt-4 mb-2 flex items-center justify-between rounded-xl bg-[#1C242D]/90 border border-border/60 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[11px] font-medium text-text-muted">
                Coach Alex Vance
              </span>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              PRO SOLO
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5 px-3 py-4">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "group relative flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 select-none",
                  isActive
                    ? "bg-[#1C242D] text-primary border border-primary/30 shadow-lime-glow-sm"
                    : "text-text-muted hover:bg-sidebar-hover hover:text-text-primary",
                  collapsed && "justify-center px-0"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-primary shadow-lime-glow" />
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-text-muted group-hover:text-text-primary"
                  )}
                />

                {!collapsed && (
                  <span className="truncate text-[13px]">{item.name}</span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md",
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

      {/* Footer Profile & Collapse Toggle */}
      <div className="border-t border-border/80 p-3 bg-[#13181F]/90">
        {!collapsed ? (
          <div className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-sidebar-hover">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative">
                <img
                  src={initialTrainerProfile.avatar_url}
                  alt={initialTrainerProfile.name}
                  className="h-9 w-9 rounded-xl object-cover border border-primary/40"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-text-primary truncate">
                  {initialTrainerProfile.name}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {initialTrainerProfile.gym_name}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleCollapse}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:border-primary/50 hover:text-primary transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img
              src={initialTrainerProfile.avatar_url}
              alt={initialTrainerProfile.name}
              className="h-8 w-8 rounded-xl object-cover border border-primary/40"
            />
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted hover:border-primary/50 hover:text-primary transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-sidebar border-r border-border transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-border transform transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}

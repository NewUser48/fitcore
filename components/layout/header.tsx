"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,

  Bell,
  Plus,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Sliders,
  Dumbbell,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialTrainerProfile, sampleNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenAddMember: () => void;
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
  collapsed: boolean;
}

export function Header({
  onOpenAddMember,
  onOpenSearch,
  onOpenMobileMenu,
  collapsed,
}: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [greeting, setGreeting] = React.useState("Welcome back");
  const [currentDateFormatted, setCurrentDateFormatted] = React.useState("");

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const now = new Date();
    setCurrentDateFormatted(
      new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now)
    );
  }, []);

  const unreadCount = sampleNotifications.filter((n) => !n.is_read).length;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-20 w-full items-center justify-between px-4 sm:px-8 glass-header transition-all duration-300"
      )}
    >
      {/* Left Greeting & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-text-primary hover:border-primary/50"
          aria-label="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
              {greeting},{" "}
              <span className="text-primary font-extrabold">
                {initialTrainerProfile.name.split(" ")[0]}
              </span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> Ready to Train
            </span>
          </div>
          <p className="text-xs text-text-muted font-medium">
            {currentDateFormatted || "Saturday, Nov 22, 2026"} &bull;{" "}
            <span className="text-text-primary">Apex Performance Lab</span>
          </p>
        </div>
      </div>

      {/* Middle/Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Search Bar / Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-3 rounded-xl border border-border bg-[#151B22]/90 px-3.5 py-2 text-xs text-text-muted hover:border-primary/50 hover:text-text-primary transition-all w-60 lg:w-72 shadow-inner"
        >
          <Search className="h-4 w-4 text-text-muted" />
          <span className="truncate">Search members, workouts...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-[#1C242D] px-1.5 font-mono text-[10px] font-medium text-text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Member Action */}
        <Button
          onClick={onOpenAddMember}
          variant="primary"
          size="default"
          className="hidden sm:inline-flex items-center gap-2 shadow-lime-glow-sm"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Add Member</span>
        </Button>

        {/* Compact Mobile Add Member Button */}
        <button
          onClick={onOpenAddMember}
          className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-lime-glow-sm"
          title="Add Member"
        >
          <Plus className="h-5 w-5" />
        </button>

        {/* Notifications Popover Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-text-muted transition-all duration-200 hover:border-primary/50 hover:text-text-primary",
              notificationsOpen && "border-primary text-primary bg-[#25303D]"
            )}
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-border bg-[#151B22] p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-text-primary">
                    Trainer Alerts
                  </h3>
                  <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                    {unreadCount} New
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto no-scrollbar py-2">
                {sampleNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="py-3 px-1 hover:bg-[#1C242D] rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg p-1.5 bg-[#25303D] border border-border text-primary shrink-0">
                        {notif.type === "expiring_membership" ? (
                          <Clock className="h-3.5 w-3.5 text-orange-400" />
                        ) : notif.type === "overdue_payment" ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-text-primary">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-text-dim mt-1.5 block">
                          {notif.created_at}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border mt-1 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  View all system logs &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1.5 border border-transparent hover:border-border hover:bg-card transition-all"
            aria-label="User profile"
          >
            <div className="relative">
              <img
                src={initialTrainerProfile.avatar_url}
                alt={initialTrainerProfile.name}
                className="h-9 w-9 rounded-xl object-cover border border-primary/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-text-muted" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border bg-[#151B22] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-border mb-1">
                <p className="text-xs font-bold text-text-primary">
                  {initialTrainerProfile.name}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {initialTrainerProfile.email}
                </p>
                <span className="mt-1 inline-block text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                  Sole Trainer Account
                </span>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-card transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>Trainer Profile</span>
                </Link>
                <Link
                  href="/billing"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-card transition-colors"
                >
                  <Receipt className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Fee Structure & Plans</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-card transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5 text-sky-400" />
                  <span>System Preferences</span>
                </Link>
              </div>

              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

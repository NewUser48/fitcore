"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TodayScheduleWidget } from "@/components/dashboard/today-schedule";
import { ExpiringMembersWidget } from "@/components/dashboard/expiring-members";
import { RecentPaymentsWidget } from "@/components/dashboard/recent-payments";
import { AttentionWidget } from "@/components/dashboard/attention-widget";
import { ActivityFeedWidget } from "@/components/dashboard/activity-feed";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Users,
  Dumbbell,
  RefreshCw,
  Flame,
  LayoutGrid,
  BarChart2,
} from "lucide-react";

export default function DashboardPage() {
  const [showEmptyStateDemo, setShowEmptyStateDemo] = React.useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);

  return (
    <DashboardShell>
      {/* Top Banner / Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[#151B22] via-[#1A222B] to-[#151B22] p-6 shadow-card-subtle">
        <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 h-32 w-32 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-6 items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-2.5 text-[11px] font-bold text-primary tracking-wide uppercase">
                <Flame className="h-3.5 w-3.5" /> High Performance Dashboard
              </span>
              <span className="text-xs text-text-muted">&bull;</span>
              <span className="text-xs text-text-muted font-medium">Single Trainer Edition</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Elevate Your Coaching Roster
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-xl leading-relaxed">
              Real-time oversight of athlete workouts, nutrition goals, biometric milestones, and monthly fee collections.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Toggle demo button between populated view and empty state view */}
            <button
              onClick={() => setShowEmptyStateDemo(!showEmptyStateDemo)}
              className="px-3 py-2 rounded-xl border border-border bg-[#10151B] text-xs font-semibold text-text-muted hover:text-text-primary hover:border-primary/40 transition-colors"
              title="Toggle to view empty state onboarding layout"
            >
              {showEmptyStateDemo ? "View Populated Dashboard" : "Preview Zero-State Mode"}
            </button>
          </div>
        </div>
      </div>

      {showEmptyStateDemo ? (
        /* Empty State Representation as required: "If the database is empty, show helpful empty states and onboarding actions rather than fabricated statistics" */
        <div className="space-y-6">
          <EmptyState
            icon={Users}
            title="Your Coaching Roster is Ready"
            description="You don't have any enrolled members yet. Add your first client to start assigning workouts, tracking biometrics, and scheduling 1-on-1 sessions."
            actionLabel="Enroll First Member"
            onAction={() => setShowEmptyStateDemo(false)}
          />
        </div>
      ) : (
        <>
          {/* 1. Main KPI Cards */}
          <KpiCards />

          {/* 2. Quick Action Commands */}
          <QuickActions />

          {/* 3. Analytics Charts (Recharts) */}
          <AnalyticsCharts />

          {/* 4. Multi-Widget Operative Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            {/* Today's Schedule */}
            <TodayScheduleWidget />

            {/* Expiring Memberships */}
            <ExpiringMembersWidget />

            {/* Recent Fee Payments */}
            <RecentPaymentsWidget />

            {/* Members Requiring Attention */}
            <AttentionWidget />
          </div>

          {/* 5. Live Activity Feed */}
          <div className="my-6">
            <ActivityFeedWidget />
          </div>
        </>
      )}
    </DashboardShell>
  );
}

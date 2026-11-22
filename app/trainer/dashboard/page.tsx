"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { TodayScheduleWidget } from "@/components/dashboard/today-schedule";
import { ExpiringMembersWidget } from "@/components/dashboard/expiring-members";
import { RecentPaymentsWidget } from "@/components/dashboard/recent-payments";
import { AttentionWidget } from "@/components/dashboard/attention-widget";
import { ActivityFeedWidget } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { sampleDashboardKpis } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  UserCheck,
  CalendarCheck,
  Dumbbell,
  AlertCircle,
  IndianRupee,
  Clock,
  ArrowUpRight,
  Flame,
  Plus,
} from "lucide-react";
import { AddMemberDialog } from "@/components/trainer/add-member-dialog";

export default function TrainerDashboardPage() {
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const kpis = [
    {
      title: "Total Members",
      value: sampleDashboardKpis.totalMembers,
      subtext: "+4 enrolled this month",
      icon: Users,
      accent: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: "Active Members",
      value: sampleDashboardKpis.activeMembers,
      subtext: "90.6% active retention",
      icon: UserCheck,
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Today's Attendance",
      value: `${sampleDashboardKpis.todayAttendance.present} / ${sampleDashboardKpis.todayAttendance.expected}`,
      subtext: `${sampleDashboardKpis.todayAttendance.rate}% compliance rate`,
      icon: CalendarCheck,
      accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Active Workout Plans",
      value: sampleDashboardKpis.activeWorkoutPlans,
      subtext: "Assigned routines active",
      icon: Dumbbell,
      accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Pending Payments",
      value: formatCurrency(sampleDashboardKpis.pendingPaymentsAmount),
      subtext: `${sampleDashboardKpis.pendingPaymentsCount} member balances`,
      icon: AlertCircle,
      accent: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(sampleDashboardKpis.monthlyRevenue),
      subtext: "+14.2% vs October",
      icon: IndianRupee,
      accent: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: "Expiring Memberships",
      value: sampleDashboardKpis.expiringMemberships,
      subtext: "Next 7 days renewal",
      icon: Clock,
      accent: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    },
  ];

  return (
    <TrainerShell>
      {/* Hero Banner */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[#151B22] via-[#1C242D] to-[#151B22] p-6 shadow-card-subtle">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-5 items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2 text-[10px] font-bold text-primary uppercase">
                <Flame className="h-3 w-3" /> Fitcore Single Trainer Architecture
              </span>
              <span className="text-xs text-text-muted">&bull;</span>
              <span className="text-xs text-text-muted">Coach Alex Vance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Trainer Command Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-xl">
              Day-by-day athlete programming, real-time check-ins, fee collections, and direct member provisioning.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={() => setIsAddOpen(true)}
              variant="primary"
              size="sm"
              className="shadow-lime-glow-sm flex items-center gap-2 font-bold"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Enroll & Provision Athlete</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 7 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 mb-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              glowOnHover
              className="p-4 flex flex-col justify-between border-border bg-card relative overflow-hidden group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted line-clamp-1">
                    {kpi.title}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${kpi.accent}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="text-xl font-black text-text-primary font-display">
                  {kpi.value}
                </div>
              </div>
              <p className="text-[10px] text-text-muted mt-2 pt-2 border-t border-border/50 truncate">
                {kpi.subtext}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Commands */}
      <QuickActions onOpenAddMember={() => setIsAddOpen(true)} />

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Operative Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <TodayScheduleWidget />
        <ExpiringMembersWidget />
        <RecentPaymentsWidget />
        <AttentionWidget />
      </div>

      {/* Activity Feed */}
      <div className="my-6">
        <ActivityFeedWidget />
      </div>

      {/* Add Member Dialog */}
      <AddMemberDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </TrainerShell>
  );
}

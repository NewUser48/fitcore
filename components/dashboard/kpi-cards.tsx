"use client";

import * as React from "react";
import {
  Users,
  UserCheck,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { sampleMetrics } from "@/lib/mock-data";

export function KpiCards() {
  const kpis = [
    {
      title: "Total Members",
      value: sampleMetrics.totalMembers,
      subtext: "+4 this month",
      trend: "up",
      icon: Users,
      accent: "text-primary",
      bgAccent: "bg-primary/10 border-primary/20",
      description: "Direct roster",
    },
    {
      title: "Active Members",
      value: sampleMetrics.activeMembers,
      subtext: "90.6% retention rate",
      trend: "up",
      icon: UserCheck,
      accent: "text-emerald-400",
      bgAccent: "bg-emerald-500/10 border-emerald-500/20",
      description: "On active plans",
    },
    {
      title: "Expiring Memberships",
      value: sampleMetrics.expiringMemberships,
      subtext: "Within next 7 days",
      trend: "warning",
      icon: Clock,
      accent: "text-orange-400",
      bgAccent: "bg-orange-500/10 border-orange-500/20",
      description: "Requires renewal",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(sampleMetrics.monthlyRevenue),
      subtext: "+14.2% vs last month",
      trend: "up",
      icon: IndianRupee,
      accent: "text-primary",
      bgAccent: "bg-primary/10 border-primary/20",
      description: "November 2026",
    },
    {
      title: "Today's Attendance",
      value: `${sampleMetrics.todayAttendance.present} / ${sampleMetrics.todayAttendance.totalExpected}`,
      subtext: `${sampleMetrics.todayAttendance.percentage}% of scheduled`,
      trend: "up",
      icon: CheckCircle2,
      accent: "text-sky-400",
      bgAccent: "bg-sky-500/10 border-sky-500/20",
      description: "Checked in today",
    },
    {
      title: "Pending Payments",
      value: formatCurrency(sampleMetrics.pendingPaymentsTotal),
      subtext: `${sampleMetrics.pendingPaymentsCount} member invoices`,
      trend: "down",
      icon: AlertCircle,
      accent: "text-rose-400",
      bgAccent: "bg-rose-500/10 border-rose-500/20",
      description: "Overdue & balance",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.title}
            glowOnHover
            className="p-5 flex flex-col justify-between relative overflow-hidden group border-border/80 bg-card hover:border-primary/40 transition-all duration-300"
          >
            {/* Ambient subtle corner glow on hover */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  {kpi.title}
                </span>
                <div
                  className={`p-2 rounded-xl border ${kpi.bgAccent} ${kpi.accent} transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-text-primary font-display">
                  {kpi.value}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
              <span className="text-text-dim truncate">{kpi.description}</span>
              <div
                className={`flex items-center gap-0.5 font-bold ${
                  kpi.trend === "up"
                    ? "text-emerald-400"
                    : kpi.trend === "warning"
                    ? "text-orange-400"
                    : "text-rose-400"
                }`}
              >
                {kpi.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                {kpi.trend === "down" && <ArrowDownRight className="h-3 w-3" />}
                <span className="truncate">{kpi.subtext}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

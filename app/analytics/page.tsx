"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Coaching Analytics & Retention
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              Performance Insights
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Track member churn, revenue trajectory, attendance compliance, and historical growth.
          </p>
        </div>
      </div>

      <AnalyticsCharts />
    </DashboardShell>
  );
}

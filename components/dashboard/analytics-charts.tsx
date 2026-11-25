"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  sampleRevenueChart,
  sampleAttendanceTrends,
} from "@/lib/mock-data";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";

// Custom dark tooltip for Recharts
function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-[#151B22]/95 p-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-text-primary mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
            />
            <span className="text-text-muted">{entry.name}:</span>
            <span className="font-bold text-text-primary">
              {prefix}
              {typeof entry.value === "number" && prefix === "₹"
                ? entry.value.toLocaleString("en-IN")
                : entry.value}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function AnalyticsCharts() {
  const [mounted, setMounted] = React.useState(false);
  const { members } = useTrainerMembers();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const statusDonutData = React.useMemo(() => {
    const activeCount = members.filter((m) => m.membership_status === "active").length;
    const expiringCount = members.filter((m) => m.membership_status === "expiring").length;
    const expiredCount = members.filter(
      (m) => m.membership_status === "expired" || m.membership_status === "inactive"
    ).length;

    return [
      { name: "Active", value: activeCount, color: "#10B981" },
      { name: "Expiring Soon", value: expiringCount, color: "#F97316" },
      { name: "Expired / Due", value: expiredCount, color: "#EF4444" },
    ];
  }, [members]);

  const growthData = React.useMemo(() => {
    const now = new Date();
    const points: { month: string; total: number; active: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const enrolled = members.filter((m) => {
        if (!m.created_at) return false;
        return new Date(m.created_at) <= monthEnd;
      });

      points.push({
        month: monthEnd.toLocaleString("en-US", { month: "short" }),
        total: enrolled.length,
        active: enrolled.filter((m) => m.membership_status === "active").length,
      });
    }

    return points;
  }, [members]);

  const growthPercent =
    growthData[0]?.total > 0
      ? Math.round(
          ((growthData[growthData.length - 1].total - growthData[0].total) /
            growthData[0].total) *
            100
        )
      : 0;

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <div className="h-72 rounded-2xl bg-card animate-pulse" />
        <div className="h-72 rounded-2xl bg-card animate-pulse" />
        <div className="h-72 rounded-2xl bg-card animate-pulse" />
        <div className="h-72 rounded-2xl bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {/* 1. Monthly Revenue Bar Chart */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">Monthly Revenue</span>
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                ₹ INR
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Actual collected fees vs month-to-month projections
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" /> Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#303A45]" /> Projected
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleRevenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#242D37" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip
                content={<CustomTooltip prefix="₹" />}
                cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
              />
              <Bar dataKey="revenue" name="Collected" fill="#B8FF3B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="projected" name="Projected" fill="#303A45" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Membership Growth Line Chart */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">Roster Growth</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {growthPercent >= 0 ? "+" : ""}
                {growthPercent}% 6 Mo
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Total enrolled athletes and retained active members
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" /> Total
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Active
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#242D37" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Enrolled"
                stroke="#B8FF3B"
                strokeWidth={3}
                dot={{ fill: "#B8FF3B", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#B8FF3B", stroke: "#10151B", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="active"
                name="Active Subscriptions"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: "#10B981", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3. Attendance Weekly Trend Area Chart */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">Attendance Trend</span>
              <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                Weekly Flow
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Daily check-ins vs confirmed training appointments
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampleAttendanceTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#242D37" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="attendance"
                name="Attended"
                stroke="#38BDF8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#attendanceGradient)"
              />
              <Line
                type="monotone"
                dataKey="scheduled"
                name="Booked"
                stroke="#64748B"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. Active vs Expiring Members Donut Chart */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">Roster Status Health</span>
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                Live Overview
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Breakdown of current membership active status
            </p>
          </div>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDonutData}
                innerRadius={65}
                outerRadius={90}
                paddingAngle={6}
                dataKey="value"
              >
                {statusDonutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#1C242D" strokeWidth={3} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip suffix=" members" />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Legend */}
          <div className="flex flex-col gap-3 pr-4">
            {statusDonutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-muted">{item.name}</span>
                </div>
                <span className="font-bold text-text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

"use client";

import * as React from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleMembers } from "@/lib/mock-data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Scale,
  Trophy,
  Activity,
  Plus,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";

export default function MemberProgressPage() {
  const member = sampleMembers[0]; // Rohan Malhotra

  const weightHistory = [
    { date: "Jun 15", weight: 89.5 },
    { date: "Jul 15", weight: 87.8 },
    { date: "Aug 15", weight: 86.0 },
    { date: "Sep 15", weight: 84.5 },
    { date: "Oct 15", weight: 83.2 },
    { date: "Nov 22", weight: 82.3 },
  ];

  const personalRecords = [
    { movement: "Trap Bar Deadlift", record: "160 kg x 3 reps", date: "Nov 20, 2026", type: "Strength" },
    { movement: "Incline DB Bench Press", record: "36 kg DBs x 8 reps", date: "Nov 15, 2026", type: "Hypertrophy" },
    { movement: "Bodyweight Pull-ups", record: "14 strict reps", date: "Nov 02, 2026", type: "Endurance" },
    { movement: "Back Squat (Full Depth)", record: "135 kg x 5 reps", date: "Oct 28, 2026", type: "Strength" },
  ];

  return (
    <PortalShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              My Fitness & Biometric Trajectory
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
              -7.2 kg Net Loss
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Weekly weight records, verified personal bests, and tape measurements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" className="shadow-lime-glow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Log Today&apos;s Weight
          </Button>
        </div>
      </div>

      {/* 3 Biometric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Starting Weight</span>
            <span className="text-2xl font-black text-text-primary font-display">
              {member.starting_weight_kg} kg
            </span>
            <span className="text-[10px] text-text-dim block mt-0.5">Recorded on Jun 15, 2026</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#151B22] border border-border text-text-muted">
            <Scale className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Current Weight</span>
            <span className="text-2xl font-black text-primary font-display">
              {member.current_weight_kg} kg
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5 font-semibold flex items-center gap-0.5">
              <ArrowDownRight className="h-3 w-3" /> -7.2 kg (-8.0%)
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Target Goal Weight</span>
            <span className="text-2xl font-black text-sky-400 font-display">
              {member.target_weight_kg} kg
            </span>
            <span className="text-[10px] text-text-dim block mt-0.5 font-mono">4.3 kg remaining</span>
          </div>
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Sparkles className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Weight History Line Chart */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Body Weight Trend (kg)</h3>
            <p className="text-xs text-text-muted">Consistent progressive fat loss timeline</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#242D37" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis domain={[75, 95]} stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-border bg-[#151B22] p-2.5 shadow-xl text-xs">
                        <p className="font-bold text-text-primary">{label}</p>
                        <p className="text-primary font-mono font-bold mt-0.5">
                          {payload[0].value} kg
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#B8FF3B"
                strokeWidth={3}
                dot={{ fill: "#B8FF3B", r: 4 }}
                activeDot={{ r: 6, fill: "#B8FF3B", stroke: "#10151B", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Personal Records Board */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Verified Personal Records (PR Board)
              </h3>
              <p className="text-[11px] text-text-muted">
                Coaching assessments confirmed by Coach Alex
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personalRecords.map((pr) => (
            <div
              key={pr.movement}
              className="p-3.5 rounded-xl bg-[#151B22] border border-border/70 hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-text-primary">{pr.movement}</p>
                <p className="text-sm font-black text-primary font-mono mt-0.5">{pr.record}</p>
                <span className="text-[10px] text-text-dim mt-1 block">Set on {pr.date}</span>
              </div>
              <Badge variant="primary">{pr.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </PortalShell>
  );
}

"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Scale, Trophy, Plus, ArrowDownRight } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MemberProgressPage() {
  const weightData = [
    { date: "Jun 15", weight: 89.5 },
    { date: "Jul 15", weight: 87.8 },
    { date: "Aug 15", weight: 86.0 },
    { date: "Sep 15", weight: 84.5 },
    { date: "Oct 15", weight: 83.2 },
    { date: "Nov 22", weight: 82.3 },
  ];

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              My Body Progress & PRs
            </h1>
            <Badge variant="primary">-7.2 kg Down</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Weight trajectory, verified lift achievements, and body fat tracking.
          </p>
        </div>

        <Button variant="primary" size="sm" className="shadow-lime-glow-sm">
          <Plus className="h-4 w-4 mr-1.5" /> Log Weigh-In
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-sm font-bold text-text-primary mb-4">Weight Trend History (kg)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#242D37" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis domain={[75, 95]} stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#B8FF3B" strokeWidth={3} dot={{ fill: "#B8FF3B", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </MemberShell>
  );
}

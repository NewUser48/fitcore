"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Trophy,
  Dumbbell,
  CheckCircle,
  Receipt,
  Scale,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function ActivityFeedWidget() {
  const events = [
    {
      id: "ev_1",
      athlete: "Kavita Rao",
      action: "New Personal Record",
      details: "80kg Barbell Deadlift (3 reps) achieved",
      time: "45 mins ago",
      icon: Trophy,
      accent: "text-primary bg-primary/10 border-primary/20",
    },
    {
      id: "ev_2",
      athlete: "Rohan Malhotra",
      action: "Session Completed",
      details: "Completed Posterior Chain & Deadlift Max Test",
      time: "2 hours ago",
      icon: Dumbbell,
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "ev_3",
      athlete: "Priya Sundaram",
      action: "Body Metric Recorded",
      details: "Weight down to 62.0 kg (-2.0 kg from start)",
      time: "4 hours ago",
      icon: Scale,
      accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      id: "ev_4",
      athlete: "Kavita Rao",
      action: "Payment Received",
      details: "₹22,500 for Transform 90-Day VIP via UPI",
      time: "Yesterday",
      icon: Receipt,
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Live Member Activity Feed
              </h3>
              <p className="text-[11px] text-text-muted">
                Real-time training & biometric events
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
            Auto-Sync
          </span>
        </div>

        <div className="space-y-3 mt-4">
          {events.map((ev) => {
            const Icon = ev.icon;
            return (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-[#151B22] border border-border hover:border-primary/30 transition-colors flex items-start gap-3"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${ev.accent}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">
                      {ev.athlete}
                    </span>
                    <span className="text-[10px] text-text-dim flex items-center gap-1 font-mono">
                      <Clock className="h-2.5 w-2.5" />
                      {ev.time}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-primary mt-0.5">
                    {ev.action}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                    {ev.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          All milestones saved to progress history
        </span>
        <Link
          href="/progress"
          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
        >
          View Progress &rarr;
        </Link>
      </div>
    </Card>
  );
}

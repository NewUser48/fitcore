"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleSessions } from "@/lib/mock-data";
import { Calendar, Clock, Plus, Dumbbell, User, MapPin } from "lucide-react";

export default function SchedulePage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Training Schedule & Sessions
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              1-on-1 Calendar
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Prevent overlapping trainer appointments, manage session statuses, and view daily bookings.
          </p>
        </div>

        <Button variant="primary" size="sm" className="flex items-center gap-2 shadow-lime-glow-sm">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Book Training Session</span>
        </Button>
      </div>

      <div className="space-y-4">
        {sampleSessions.map((session) => (
          <Card key={session.id} glowOnHover className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={session.member_avatar || ""}
                alt={session.member_name}
                className="h-12 w-12 rounded-2xl object-cover border border-primary/30 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-text-primary">
                    {session.member_name}
                  </h3>
                  <Badge variant={session.status === "completed" ? "completed" : session.status === "in_progress" ? "primary" : "scheduled"}>
                    {session.status}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5 font-medium">
                  <Dumbbell className="h-3 w-3 text-primary" />
                  <span>{session.title} &bull; {session.focus_area}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
              <div className="text-left sm:text-right">
                <span className="text-xs font-mono font-bold text-text-primary flex items-center gap-1 sm:justify-end">
                  <Clock className="h-3 w-3 text-text-muted" />
                  <span>{session.start_time} - {session.end_time}</span>
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5 font-mono">
                  {session.date}
                </span>
              </div>

              <Button variant="outline" size="sm">
                Reschedule
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

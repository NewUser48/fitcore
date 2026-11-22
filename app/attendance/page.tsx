"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleMembers } from "@/lib/mock-data";
import { CalendarCheck, Check, X, Clock, AlertTriangle, UserCheck } from "lucide-react";
import { toast } from "sonner";

export default function AttendancePage() {
  const [attendanceState, setAttendanceState] = React.useState<Record<string, "present" | "absent" | "unmarked">>({
    mem_01: "present",
    mem_02: "present",
    mem_03: "absent",
    mem_04: "present",
    mem_05: "unmarked",
  });

  const markAttendance = (memberId: string, status: "present" | "absent") => {
    setAttendanceState((prev) => ({ ...prev, [memberId]: status }));
    toast.success(`Marked as ${status}`);
  };

  const presentCount = Object.values(attendanceState).filter((s) => s === "present").length;
  const totalCount = sampleMembers.length;

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Daily Attendance Roster
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              {presentCount} / {totalCount} Checked In
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Prevent duplicate entries, track consecutive absences, and monitor attendance percentages.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary bg-[#151B22] border border-border px-3 py-2 rounded-xl">
          <CalendarCheck className="h-4 w-4 text-primary" />
          <span>Saturday, Nov 22, 2026</span>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-[#151B22] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Today&apos;s Member Check-In Log
          </h3>
          <span className="text-xs text-text-dim">
            Click Present or Absent to log entry
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {sampleMembers.map((member) => {
            const status = attendanceState[member.id] || "unmarked";

            return (
              <div
                key={member.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1C242D]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar_url || ""}
                    alt={member.full_name}
                    className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">
                        {member.full_name}
                      </span>
                      <span className="text-[10px] text-text-dim font-mono">
                        {member.phone}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      Goal: {member.fitness_goal} &bull; {member.membership_plan_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-mono font-semibold text-text-muted">
                    {member.attendance_rate || 90}% Reliability
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant={status === "present" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => markAttendance(member.id, "present")}
                      className="h-8 px-3 text-xs flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Present</span>
                    </Button>
                    <Button
                      variant={status === "absent" ? "danger" : "outline"}
                      size="sm"
                      onClick={() => markAttendance(member.id, "absent")}
                      className="h-8 px-3 text-xs flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Absent</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </DashboardShell>
  );
}

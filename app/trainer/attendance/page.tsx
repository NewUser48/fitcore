"use client";

import * as React from "react";
import Link from "next/link";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import { getTodayISODate } from "@/lib/utils";
import { CalendarCheck, Check, X, User } from "lucide-react";
import { toast } from "sonner";

type AttendanceStatus = "present" | "absent";

const TODAY = getTodayISODate();

export default function TrainerAttendancePage() {
  const { members, isLoading } = useTrainerMembers();
  const [attendance, setAttendance] = React.useState<Record<string, AttendanceStatus>>({});

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("member_id, status")
        .eq("date", TODAY);

      if (!active) return;

      if (error) {
        toast.error(`Could not load today's attendance: ${error.message}`);
        return;
      }

      setAttendance(
        Object.fromEntries(
          (data ?? [])
            .filter((row: any) => row.status === "present" || row.status === "absent")
            .map((row: any) => [row.member_id, row.status as AttendanceStatus])
        )
      );
    })();

    return () => {
      active = false;
    };
  }, []);

  const mark = async (memberId: string, memberName: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [memberId]: status }));

    const supabase = createClient();
    if (!supabase) {
      toast.success(`${memberName} marked as ${status}`);
      return;
    }

    const { error } = await supabase.from("attendance").upsert(
      {
        member_id: memberId,
        date: TODAY,
        status,
        check_in_time: new Date().toTimeString().slice(0, 8),
      },
      { onConflict: "member_id,date" }
    );

    if (error) {
      toast.error(`Could not save attendance: ${error.message}`);
      return;
    }

    window.dispatchEvent(new CustomEvent("fitcore:attendance-changed"));
    toast.success(`${memberName} marked as ${status}`);
  };

  const presentCount = Object.values(attendance).filter((s) => s === "present").length;

  return (
    <TrainerShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Daily Attendance Roster
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              {isLoading ? "…" : `${presentCount} / ${members.length}`} Present Today
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Prevent duplicate daily check-ins, monitor consecutive absences, and calculate attendance compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-text-primary bg-[#151B22] border border-border px-3 py-2 rounded-xl">
          <CalendarCheck className="h-4 w-4 text-primary" />
          <span>
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date())}
          </span>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-[#151B22] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Today&apos;s Check-In Records
          </h3>
          <span className="text-xs text-text-dim">One check-in per member per date</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-text-muted">Loading athletes…</div>
        ) : members.length === 0 ? (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <User className="h-8 w-8 text-primary" />
            <h3 className="text-base font-bold text-text-primary">No athletes yet</h3>
            <p className="text-xs text-text-muted max-w-sm">
              Add members from your roster and they will appear here for daily check-ins.
            </p>
            <Link href="/trainer/members" className="text-xs font-bold text-primary hover:underline">
              Go to Athlete Roster &rarr;
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {members.map((member) => {
              const status = attendance[member.id];

              return (
                <div
                  key={member.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1C242D]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary">{member.full_name}</span>
                        <span className="text-[10px] text-primary font-mono">{member.phone}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        Goal: {member.fitness_goal} &bull; {member.membership_plan_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant={status === "present" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => mark(member.id, member.full_name, "present")}
                      className="h-8 px-3 text-xs flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Present</span>
                    </Button>
                    <Button
                      variant={status === "absent" ? "danger" : "outline"}
                      size="sm"
                      onClick={() => mark(member.id, member.full_name, "absent")}
                      className="h-8 px-3 text-xs flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Absent</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </TrainerShell>
  );
}

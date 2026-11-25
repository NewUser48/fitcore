"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import { getTodayISODate } from "@/lib/utils";
import { Calendar, Clock, Dumbbell } from "lucide-react";
import Link from "next/link";

interface SessionRow {
  id: string;
  member_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  focus_area: string | null;
  status: string;
  notes: string | null;
}

const TODAY = getTodayISODate();

export function TodayScheduleWidget() {
  const { members } = useTrainerMembers();
  const [sessions, setSessions] = React.useState<SessionRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("training_sessions")
        .select("id, member_id, session_date, start_time, end_time, focus_area, status, notes")
        .eq("session_date", TODAY)
        .order("start_time", { ascending: true });

      if (!active) return;

      if (!error) setSessions((data ?? []) as SessionRow[]);
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const memberNames = React.useMemo(
    () => new Map(members.map((m) => [m.id, m.full_name])),
    [members]
  );

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Today&apos;s Training Schedule
              </h3>
              <p className="text-[11px] text-text-muted">
                {sessions.length} sessions booked for today
              </p>
            </div>
          </div>
          <Link
            href="/trainer/schedule"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            Full Calendar &rarr;
          </Link>
        </div>

        <div className="space-y-3 mt-4">
          {isLoading ? (
            <p className="py-6 text-center text-xs text-text-muted">Loading schedule…</p>
          ) : sessions.length === 0 ? (
            <p className="py-6 text-center text-xs text-text-muted">
              No sessions booked for today.
            </p>
          ) : (
            sessions.map((session) => {
              const status = session.status.toLowerCase();
              const isCompleted = status === "completed";
              const isInProgress = status === "in_progress" || status === "in progress";

              return (
                <div
                  key={session.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 ${
                    isInProgress
                      ? "bg-[#1C2622] border-primary/40 shadow-lime-glow-sm"
                      : isCompleted
                      ? "bg-[#151B22]/60 border-border/50 opacity-75"
                      : "bg-[#151B22] border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary">
                            {memberNames.get(session.member_id) || "Unknown athlete"}
                          </span>
                          {isInProgress && (
                            <Badge variant="primary" dot>
                              Live Now
                            </Badge>
                          )}
                          {isCompleted && <Badge variant="completed">Done</Badge>}
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5 font-medium flex items-center gap-1.5">
                          <Dumbbell className="h-3 w-3 text-primary" />
                          <span>{session.focus_area || "Training Session"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-text-primary">
                        <Clock className="h-3 w-3 text-text-muted" />
                        <span>{session.start_time} - {session.end_time}</span>
                      </div>
                      <span className="text-[10px] text-text-dim block mt-0.5">
                        {session.session_date}
                      </span>
                    </div>
                  </div>

                  {session.notes && (
                    <div className="mt-2.5 pt-2 border-t border-border/40 text-[10px] text-text-muted italic flex items-center justify-between">
                      <span>Note: {session.notes}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Overlaps prevented &bull; Real-time status
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/trainer/schedule">Add Appointment</Link>
        </Button>
      </div>
    </Card>
  );
}

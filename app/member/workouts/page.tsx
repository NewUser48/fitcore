"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemberPortal } from "@/components/member/member-portal-provider";
import { WEEK_DAYS, getTodayDayOfWeek } from "@/lib/utils";
import { Clock, CheckCircle2, FileText, Lock, Loader2, Moon } from "lucide-react";
import { toast } from "sonner";

export default function MemberWorkoutsPage() {
  const { workouts, todayStatus, logWorkoutComplete, logRestDay, isLoading } =
    useMemberPortal();

  // Members are restricted to the current date only.
  const activeDay = getTodayDayOfWeek();
  const [isSaving, setIsSaving] = React.useState(false);

  const workout = workouts.find((w) => w.day === activeDay) || workouts[0];
  const isDone = todayStatus === "present";
  const isRestLogged = todayStatus === "rest_day";

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      await logWorkoutComplete();
      toast.success(`Logged ${activeDay}'s workout as complete!`);
    } catch (err: any) {
      toast.error(err?.message || "Could not log your workout.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestDay = async () => {
    setIsSaving(true);
    try {
      await logRestDay();
      toast.success("Rest day logged. Recovery is part of the plan!");
    } catch (err: any) {
      toast.error(err?.message || "Could not log your rest day.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MemberShell>
        <Card className="p-10 text-center text-sm text-text-muted">
          Loading your routine…
        </Card>
      </MemberShell>
    );
  }

  if (!workout) {
    return (
      <MemberShell>
        <Card className="p-10 flex flex-col items-center gap-3 text-center">
          <FileText className="h-8 w-8 text-primary" />
          <h3 className="text-base font-bold text-text-primary">No routine assigned</h3>
          <p className="text-xs text-text-muted max-w-sm">
            Your trainer has not assigned a workout plan yet. Check back soon.
          </p>
        </Card>
      </MemberShell>
    );
  }

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Workout Routine & Coach Notes
            </h1>
            <Badge variant="primary">{activeDay}</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
            Assigned by Coach Alex Vance &bull; <Lock className="h-3 w-3 text-primary" /> Today&apos;s routine only
          </p>
        </div>
      </div>

      {/* Today-only day strip (other days locked) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
        {WEEK_DAYS.map((day) => {
          const w = workouts.find((item) => item.day === day);
          const isToday = activeDay === day;

          return (
            <div
              key={day}
              aria-disabled={!isToday}
              title={isToday ? "Today" : "Locked — today only"}
              className={`p-3 rounded-2xl border text-left select-none ${
                isToday
                  ? "bg-[#1C242D] border-primary text-text-primary shadow-lime-glow-sm"
                  : "bg-[#151B22] border-border/60 text-text-muted opacity-45 cursor-not-allowed"
              }`}
            >
              <span className="text-xs font-bold mb-1 flex items-center justify-between">
                {day}
                {!isToday && <Lock className="h-3 w-3 text-text-dim" />}
              </span>
              <p className="text-[11px] font-semibold text-text-primary truncate">
                {isToday ? w?.workout_name : "Locked"}
              </p>
            </div>
          );
        })}
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-primary uppercase">{activeDay} Split</span>
              {workout.is_rest_day && <Badge variant="neutral">Rest Day</Badge>}
              {isDone && <Badge variant="completed">Completed ✓</Badge>}
              {isRestLogged && <Badge variant="completed">Rest Logged ✓</Badge>}
            </div>
            <h2 className="text-lg font-black text-text-primary mt-1">{workout.workout_name}</h2>
            <p className="text-xs text-text-muted">Focus: {workout.focus}</p>
          </div>

          {workout.is_rest_day ? (
            <Button
              variant={isRestLogged ? "secondary" : "primary"}
              size="sm"
              onClick={handleRestDay}
              disabled={isSaving || isRestLogged}
              className="font-bold shadow-lime-glow-sm"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Moon className="h-4 w-4 mr-1.5" />
              )}
              {isRestLogged ? "Rest Day Logged ✓" : "Log Rest Day"}
            </Button>
          ) : (
            <Button
              variant={isDone ? "secondary" : "primary"}
              size="sm"
              onClick={handleComplete}
              disabled={isSaving || isDone}
              className="font-bold shadow-lime-glow-sm"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
              )}
              {isDone ? "Marked as Done ✓" : "Mark Workout Complete"}
            </Button>
          )}
        </div>

        {/* Workout Note */}
        <div className="p-5 rounded-2xl bg-[#10151B] border border-border/80">
          <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
            <FileText className="h-4 w-4" />
            <span>Trainer Routine Instructions ({activeDay}):</span>
          </div>

          <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed">
            {workout.workout_note || "No specific routine note assigned for this day."}
          </pre>
        </div>

        {workout.estimated_duration_min ? (
          <p className="text-[11px] text-text-muted mt-3 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Estimated duration: {workout.estimated_duration_min} minutes
          </p>
        ) : null}
      </Card>
    </MemberShell>
  );
}

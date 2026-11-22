"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleWeeklyWorkouts } from "@/lib/mock-data";
import { DayOfWeek } from "@/types";
import { Dumbbell, Clock, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MemberWorkoutsPage() {
  const [activeDay, setActiveDay] = React.useState<DayOfWeek>("Monday");
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});

  const workout = sampleWeeklyWorkouts.find((w) => w.day === activeDay) || sampleWeeklyWorkouts[0];
  const isDone = !!completed[activeDay];

  const handleToggleComplete = () => {
    setCompleted((prev) => {
      const next = !prev[activeDay];
      if (next) toast.success(`Logged ${activeDay}'s workout as complete!`);
      return { ...prev, [activeDay]: next };
    });
  };

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
          <p className="text-xs text-text-muted mt-1">
            Assigned by Coach Alex Vance &bull; 7-Day Day-by-Day Split
          </p>
        </div>
      </div>

      {/* 7-Day Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
        {DAYS.map((day) => {
          const w = sampleWeeklyWorkouts.find((item) => item.day === day);
          const isSelected = activeDay === day;

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-[#1C242D] border-primary text-text-primary shadow-lime-glow-sm"
                  : "bg-[#151B22] border-border text-text-muted hover:border-primary/40"
              }`}
            >
              <span className="text-xs font-bold block mb-1">{day}</span>
              <p className="text-[11px] font-semibold text-text-primary truncate">{w?.workout_name}</p>
            </button>
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
            </div>
            <h2 className="text-lg font-black text-text-primary mt-1">{workout.workout_name}</h2>
            <p className="text-xs text-text-muted">Focus: {workout.focus}</p>
          </div>

          {!workout.is_rest_day && (
            <Button
              variant={isDone ? "secondary" : "primary"}
              size="sm"
              onClick={handleToggleComplete}
              className="font-bold shadow-lime-glow-sm"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
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
      </Card>
    </MemberShell>
  );
}

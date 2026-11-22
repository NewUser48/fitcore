"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleWeeklyWorkouts } from "@/lib/mock-data";
import { DayOfWeek } from "@/types";
import { Dumbbell, Clock, CheckCircle2 } from "lucide-react";
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
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({ m_1: true });

  const workout = sampleWeeklyWorkouts.find((w) => w.day === activeDay) || sampleWeeklyWorkouts[0];

  const toggle = (id: string, name: string) => {
    setCompleted((prev) => {
      const next = !prev[id];
      if (next) toast.success(`Completed: ${name}`);
      return { ...prev, [id]: next };
    });
  };

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Workout Program & Exercises
            </h1>
            <Badge variant="primary">{activeDay}</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Assigned by Coach Alex Vance &bull; 7-day periodization protocol
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
        <h2 className="text-lg font-black text-text-primary mb-1">{workout.workout_name}</h2>
        <p className="text-xs text-text-muted mb-6">Focus: {workout.focus}</p>

        {workout.is_rest_day ? (
          <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border rounded-xl">
            Rest Day. Focus on mobility, hydration, and nutrition.
          </div>
        ) : (
          <div className="space-y-3">
            {workout.exercises.map((ex, index) => {
              const isDone = !!completed[ex.id];

              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                    isDone ? "bg-[#141C18] border-emerald-500/40" : "bg-[#151B22] border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggle(ex.id, ex.name)}
                      className={`h-6 w-6 rounded-lg border flex items-center justify-center ${
                        isDone ? "bg-emerald-500 text-black border-emerald-400" : "bg-[#10151B] border-border"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <div>
                      <h4 className={`text-xs font-bold ${isDone ? "text-emerald-300 line-through" : "text-text-primary"}`}>
                        {index + 1}. {ex.name}
                      </h4>
                      <p className="text-[10px] text-text-muted">{ex.instructions}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary">
                    <span>{ex.sets} &times; {ex.reps}</span>
                    <span className="text-text-muted">&bull;</span>
                    <span>{ex.weight_target}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </MemberShell>
  );
}

"use client";

import * as React from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  CheckCircle2,
  Clock,
  PlayCircle,
  Flame,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function MemberWorkoutsPage() {
  const [activeDay, setActiveDay] = React.useState("Day 1");
  const [completedExercises, setCompletedExercises] = React.useState<Record<string, boolean>>({
    ex_1: true,
  });

  const [activeRestTimer, setActiveRestTimer] = React.useState<number | null>(null);

  React.useEffect(() => {
    let interval: any;
    if (activeRestTimer && activeRestTimer > 0) {
      interval = setInterval(() => {
        setActiveRestTimer((prev) => (prev ? prev - 1 : null));
      }, 1000);
    } else if (activeRestTimer === 0) {
      toast.success("Rest timer complete! Ready for next set.");
      setActiveRestTimer(null);
    }
    return () => clearInterval(interval);
  }, [activeRestTimer]);

  const toggleExercise = (id: string, name: string) => {
    setCompletedExercises((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        toast.success(`Completed: ${name}!`);
      }
      return { ...prev, [id]: nextState };
    });
  };

  const exercises = [
    {
      id: "ex_1",
      name: "Trap Bar Deadlift",
      target: "Hamstrings & Glutes",
      sets: 4,
      reps: "6-8",
      weight: "140 kg",
      rest: 120,
      cues: "Keep chest tall, push the floor away, maintain neutral spine throughout.",
    },
    {
      id: "ex_2",
      name: "Romanian Dumbbell Deadlift",
      target: "Hamstrings & Lower Back",
      sets: 3,
      reps: "10-12",
      weight: "32 kg DBs",
      rest: 90,
      cues: "Hinge at the hips, slight soft knee bend, feel deep hamstring stretch at bottom.",
    },
    {
      id: "ex_3",
      name: "Bulgarian Split Squat",
      target: "Unilateral Quadriceps & Glute",
      sets: 3,
      reps: "8 / leg",
      weight: "20 kg DBs",
      rest: 90,
      cues: "Elevate rear foot, descend with torso upright, drive through front mid-foot.",
    },
    {
      id: "ex_4",
      name: "Lying Leg Curls",
      target: "Knee Flexors (Hamstrings)",
      sets: 3,
      reps: "12-15",
      weight: "45 kg",
      rest: 60,
      cues: "Squeeze at top contraction for 1 second, control the 3-second negative.",
    },
    {
      id: "ex_5",
      name: "Standing Calf Raises",
      target: "Gastrocnemius",
      sets: 4,
      reps: "15",
      weight: "Bodyweight + 20kg",
      rest: 60,
      cues: "Full ankle dorsiflexion stretch, pause 2 seconds on balls of feet.",
    },
  ];

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / exercises.length) * 100);

  return (
    <PortalShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Assigned Workout Program
            </h1>
            <Badge variant="primary">Hypertrophy Split</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Assigned by Coach Alex Vance &bull; Check off completed movements to log compliance.
          </p>
        </div>

        {/* Rest Timer Widget */}
        <div className="flex items-center gap-2">
          {activeRestTimer !== null ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/20 border border-primary text-primary animate-pulse">
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold text-sm">
                Rest: {Math.floor(activeRestTimer / 60)}:
                {(activeRestTimer % 60).toString().padStart(2, "0")}
              </span>
              <button
                onClick={() => setActiveRestTimer(null)}
                className="text-xs text-text-muted hover:text-text-primary ml-1"
              >
                &times;
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveRestTimer(90)}
              className="text-xs flex items-center gap-1.5"
            >
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Start 90s Rest</span>
            </Button>
          )}
        </div>
      </div>

      {/* Routine Split Selector & Completion Bar */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {["Day 1: Legs & Pull", "Day 2: Push & Delts", "Day 3: Back & Core", "Day 4: Full Conditioning"].map(
              (day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day.split(":")[0])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeDay === day.split(":")[0]
                      ? "bg-primary text-background font-bold shadow-lime-glow-sm"
                      : "bg-[#151B22] text-text-muted hover:text-text-primary border border-border"
                  }`}
                >
                  {day}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">Workout Progress:</span>
            <span className="font-bold text-primary font-mono">{progressPercent}%</span>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-[#151B22] overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </Card>

      {/* Exercises List */}
      <div className="space-y-4">
        {exercises.map((ex, index) => {
          const isDone = !!completedExercises[ex.id];

          return (
            <Card
              key={ex.id}
              className={`p-5 transition-all duration-200 ${
                isDone
                  ? "bg-[#151E18]/80 border-emerald-500/40"
                  : "bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => toggleExercise(ex.id, ex.name)}
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border transition-all ${
                      isDone
                        ? "bg-emerald-500 border-emerald-400 text-black shadow-md"
                        : "border-border bg-[#151B22] text-text-muted hover:border-primary"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          isDone ? "text-emerald-300 line-through" : "text-text-primary"
                        }`}
                      >
                        {index + 1}. {ex.name}
                      </h3>
                      <Badge variant="neutral">{ex.target}</Badge>
                    </div>

                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      <strong>Coach Cue:</strong> {ex.cues}
                    </p>
                  </div>
                </div>

                {/* Sets & Reps Table / Stats */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-[#151B22] border border-border">
                      <span className="text-[10px] text-text-muted block">Sets</span>
                      <span className="font-bold text-text-primary font-mono">{ex.sets}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#151B22] border border-border">
                      <span className="text-[10px] text-text-muted block">Reps</span>
                      <span className="font-bold text-text-primary font-mono">{ex.reps}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#151B22] border border-border">
                      <span className="text-[10px] text-text-muted block">Load</span>
                      <span className="font-bold text-primary font-mono">{ex.weight}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveRestTimer(ex.rest)}
                    className="h-12 px-2.5 text-[11px] flex flex-col items-center justify-center"
                    title={`Start ${ex.rest}s rest timer`}
                  >
                    <Clock className="h-3.5 w-3.5 text-primary mb-0.5" />
                    <span>{ex.rest}s Rest</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PortalShell>
  );
}

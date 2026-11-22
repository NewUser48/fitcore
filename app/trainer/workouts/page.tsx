"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleWeeklyWorkouts, fitcoreMembers } from "@/lib/mock-data";
import { DayWorkoutPlan, DayOfWeek, ExerciseItem } from "@/types";
import {
  Dumbbell,
  Plus,
  Clock,
  Trash2,
  Save,
  User,
  Flame,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
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

export default function TrainerWorkoutManagementPage() {
  const [selectedMemberId, setSelectedMemberId] = React.useState(fitcoreMembers[0].id);
  const [activeDay, setActiveDay] = React.useState<DayOfWeek>("Monday");
  const [weeklyPlan, setWeeklyPlan] = React.useState<DayWorkoutPlan[]>(sampleWeeklyWorkouts);

  const selectedMember = fitcoreMembers.find((m) => m.id === selectedMemberId) || fitcoreMembers[0];
  const currentDayPlan = weeklyPlan.find((p) => p.day === activeDay) || weeklyPlan[0];

  const handleUpdateWorkoutName = (newName: string) => {
    setWeeklyPlan((prev) =>
      prev.map((p) => (p.day === activeDay ? { ...p, workout_name: newName } : p))
    );
  };

  const handleToggleRestDay = () => {
    setWeeklyPlan((prev) =>
      prev.map((p) =>
        p.day === activeDay
          ? {
              ...p,
              is_rest_day: !p.is_rest_day,
              workout_name: !p.is_rest_day ? "Active Recovery & Rest Day" : "Custom Strength Split",
            }
          : p
      )
    );
    toast.success(`Updated ${activeDay} rest day status`);
  };

  const handleAddExercise = () => {
    const newEx: ExerciseItem = {
      id: `ex_${Date.now()}`,
      name: "New Movement",
      target_muscle: "Primary Muscle",
      sets: 3,
      reps: "10-12",
      weight_target: "Moderate",
      rest_seconds: 60,
      instructions: "Perform with full range of motion and 2s concentric control.",
    };
    setWeeklyPlan((prev) =>
      prev.map((p) =>
        p.day === activeDay ? { ...p, exercises: [...p.exercises, newEx] } : p
      )
    );
    toast.success("Added new exercise to protocol");
  };

  const handleDeleteExercise = (exId: string) => {
    setWeeklyPlan((prev) =>
      prev.map((p) =>
        p.day === activeDay
          ? { ...p, exercises: p.exercises.filter((e) => e.id !== exId) }
          : p
      )
    );
    toast.success("Removed exercise");
  };

  const handleSaveRoutine = () => {
    toast.success(`Saved customized 7-day workout plan for ${selectedMember.full_name}!`);
  };

  return (
    <TrainerShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Day-by-Day Workout Builder
            </h1>
            <Badge variant="primary">7-Day Periodization</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Assign unique daily routines for Monday through Sunday tailored to each individual member.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Athlete Selector */}
          <div className="flex items-center gap-2 bg-[#151B22] border border-border px-3 py-1.5 rounded-xl text-xs">
            <User className="h-4 w-4 text-primary" />
            <span className="text-text-muted">Athlete:</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="bg-transparent text-text-primary font-bold focus:outline-none"
            >
              {fitcoreMembers.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#151B22] text-text-primary">
                  {m.full_name} ({m.fitness_goal})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveRoutine}
            className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold"
          >
            <Save className="h-4 w-4" />
            <span>Save Routine</span>
          </Button>
        </div>
      </div>

      {/* 7-Day Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
        {DAYS.map((day) => {
          const plan = weeklyPlan.find((p) => p.day === day);
          const isSelected = activeDay === day;

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? "bg-[#1C242D] border-primary shadow-lime-glow-sm text-text-primary"
                  : "bg-[#151B22] border-border/80 text-text-muted hover:border-primary/40 hover:text-text-primary"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">{day}</span>
                {plan?.is_rest_day ? (
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-[11px] font-semibold text-text-primary truncate">
                {plan?.workout_name || "Custom"}
              </p>
              <span className="text-[10px] text-text-dim mt-0.5 block">
                {plan?.is_rest_day ? "Rest Day" : `${plan?.exercises.length || 0} exercises`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Workout Editor Card */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-6">
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider block mb-1">
              Programming for {activeDay} &bull; {selectedMember.full_name}
            </span>
            <div className="flex items-center gap-3">
              <Input
                value={currentDayPlan.workout_name}
                onChange={(e) => handleUpdateWorkoutName(e.target.value)}
                className="text-base font-bold text-text-primary bg-[#10151B] max-w-md h-10 border-primary/30"
              />
              {currentDayPlan.is_rest_day && <Badge variant="neutral">Rest Day Active</Badge>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleRestDay}
              className="text-xs"
            >
              {currentDayPlan.is_rest_day ? "Mark as Training Day" : "Set as Rest Day"}
            </Button>

            {!currentDayPlan.is_rest_day && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddExercise}
                className="text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Exercise
              </Button>
            )}
          </div>
        </div>

        {/* Exercises or Rest Day Notice */}
        {currentDayPlan.is_rest_day ? (
          <div className="py-12 text-center border border-dashed border-border/80 rounded-2xl bg-[#151B22]/50">
            <div className="h-12 w-12 rounded-2xl bg-[#10151B] border border-border flex items-center justify-center text-text-muted mx-auto mb-3">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">
              Scheduled Rest & Recovery Day
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
              No formal lifting exercises assigned for {activeDay}. Athletes are encouraged to focus on hydration, mobility, and CNS restoration.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDayPlan.exercises.map((ex, index) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl bg-[#151B22] border border-border hover:border-border-highlight transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-xl bg-[#1C242D] border border-border flex items-center justify-center text-xs font-mono font-bold text-primary shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <Input
                        value={ex.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWeeklyPlan((prev) =>
                            prev.map((p) =>
                              p.day === activeDay
                                ? {
                                    ...p,
                                    exercises: p.exercises.map((item) =>
                                      item.id === ex.id ? { ...item, name: val } : item
                                    ),
                                  }
                                : p
                            )
                          );
                        }}
                        className="font-bold text-sm bg-transparent border-none p-0 h-auto focus:ring-0 focus:border-b focus:border-primary"
                      />
                      <span className="text-[10px] text-text-dim block">Target: {ex.target_muscle}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteExercise(ex.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-rose-400 hover:bg-[#1E2630] transition-colors"
                    title="Remove movement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                  <div>
                    <label className="block text-[10px] text-text-muted mb-0.5">Sets</label>
                    <Input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWeeklyPlan((prev) =>
                          prev.map((p) =>
                            p.day === activeDay
                              ? {
                                  ...p,
                                  exercises: p.exercises.map((item) =>
                                    item.id === ex.id ? { ...item, sets: val } : item
                                  ),
                                }
                              : p
                          )
                        );
                      }}
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-text-muted mb-0.5">Reps Protocol</label>
                    <Input
                      value={ex.reps}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWeeklyPlan((prev) =>
                          prev.map((p) =>
                            p.day === activeDay
                              ? {
                                  ...p,
                                  exercises: p.exercises.map((item) =>
                                    item.id === ex.id ? { ...item, reps: val } : item
                                  ),
                                }
                              : p
                          )
                        );
                      }}
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-text-muted mb-0.5">Target Load</label>
                    <Input
                      value={ex.weight_target || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWeeklyPlan((prev) =>
                          prev.map((p) =>
                            p.day === activeDay
                              ? {
                                  ...p,
                                  exercises: p.exercises.map((item) =>
                                    item.id === ex.id ? { ...item, weight_target: val } : item
                                  ),
                                }
                              : p
                          )
                        );
                      }}
                      className="h-8 text-xs font-mono text-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-text-muted mb-0.5">Rest Duration (sec)</label>
                    <Input
                      type="number"
                      value={ex.rest_seconds}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWeeklyPlan((prev) =>
                          prev.map((p) =>
                            p.day === activeDay
                              ? {
                                  ...p,
                                  exercises: p.exercises.map((item) =>
                                    item.id === ex.id ? { ...item, rest_seconds: val } : item
                                  ),
                                }
                              : p
                          )
                        );
                      }}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-muted mb-0.5">Coach Instructions & Form Cues</label>
                  <Input
                    value={ex.instructions}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWeeklyPlan((prev) =>
                        prev.map((p) =>
                          p.day === activeDay
                            ? {
                                ...p,
                                exercises: p.exercises.map((item) =>
                                  item.id === ex.id ? { ...item, instructions: val } : item
                                ),
                              }
                            : p
                        )
                      );
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </TrainerShell>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleWeeklyWorkouts, fitcoreMembers } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import { mapMemberRow, type MemberRow } from "@/lib/supabase/mappers";
import { MemberProfile, DayWorkoutPlan, DayOfWeek } from "@/types";
import {
  Dumbbell,
  Clock,
  Save,
  User,
  Flame,
  FileText,
  Sparkles,
  CheckCircle2,
  Copy,
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

const DEFAULT_WEEK: DayWorkoutPlan[] = DAYS.map((day) => ({
  day,
  workout_name: "Training Split",
  is_rest_day: false,
  workout_note: "",
}));

interface WorkoutPlanRow {
  member_id: string;
  day: DayOfWeek;
  workout_name: string;
  is_rest_day: boolean;
  estimated_duration_min: number | null;
  focus: string | null;
  workout_note: string;
}

function mergePlans(rows: WorkoutPlanRow[]): DayWorkoutPlan[] {
  return DEFAULT_WEEK.map((defaultPlan) => {
    const row = rows.find((r) => r.day === defaultPlan.day);
    if (!row) return { ...defaultPlan };

    return {
      day: defaultPlan.day,
      workout_name: row.workout_name,
      is_rest_day: row.is_rest_day,
      estimated_duration_min: row.estimated_duration_min ?? undefined,
      focus: row.focus ?? undefined,
      workout_note: row.workout_note,
    };
  });
}

export default function TrainerWorkoutManagementPage() {
  const [members, setMembers] = React.useState<MemberProfile[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = React.useState(true);
  const [selectedMemberId, setSelectedMemberId] = React.useState("");
  const [activeDay, setActiveDay] = React.useState<DayOfWeek>("Monday");
  const [isSaving, setIsSaving] = React.useState(false);
  const [plansByMember, setPlansByMember] = React.useState<Record<string, DayWorkoutPlan[]>>({});

  const loadMembers = React.useCallback(async () => {
    const supabase = createClient();

    if (!supabase) {
      setMembers(fitcoreMembers);
      setPlansByMember(
        Object.fromEntries(
          fitcoreMembers.map((m) => [m.id, sampleWeeklyWorkouts.map((p) => ({ ...p }))])
        )
      );
      setIsLoadingMembers(false);
      return;
    }

    const [{ data: rows, error }, { data: planRows }] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase
        .from("workout_plans")
        .select(
          "member_id, day, workout_name, is_rest_day, estimated_duration_min, focus, workout_note"
        ),
    ]);

    if (error) {
      toast.error(`Could not load athletes: ${error.message}`);
      setIsLoadingMembers(false);
      return;
    }

    const mappedMembers = ((rows ?? []) as MemberRow[]).map((row) => mapMemberRow(row));

    const plansByMemberId = new Map<string, WorkoutPlanRow[]>();
    ((planRows ?? []) as WorkoutPlanRow[]).forEach((row) => {
      const list = plansByMemberId.get(row.member_id) ?? [];
      list.push(row);
      plansByMemberId.set(row.member_id, list);
    });

    setMembers(mappedMembers);
    setPlansByMember(
      Object.fromEntries(
        mappedMembers.map((m) => [m.id, mergePlans(plansByMemberId.get(m.id) ?? [])])
      )
    );
    setIsLoadingMembers(false);
  }, []);

  React.useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  React.useEffect(() => {
    const refresh = () => loadMembers();
    window.addEventListener("fitcore:member-created", refresh);
    window.addEventListener("fitcore:members-changed", refresh);
    return () => {
      window.removeEventListener("fitcore:member-created", refresh);
      window.removeEventListener("fitcore:members-changed", refresh);
    };
  }, [loadMembers]);

  React.useEffect(() => {
    if (members.length === 0) return;
    if (!members.some((m) => m.id === selectedMemberId)) {
      setSelectedMemberId(members[0].id);
    }
  }, [members, selectedMemberId]);

  const selectedMember =
    members.find((m) => m.id === selectedMemberId) || members[0];
  const weeklyPlan = plansByMember[selectedMemberId] || DEFAULT_WEEK;
  const currentDayPlan = weeklyPlan.find((p) => p.day === activeDay) || weeklyPlan[0];

  const updateActiveDay = (updater: (plan: DayWorkoutPlan) => DayWorkoutPlan) => {
    if (!selectedMemberId) return;
    setPlansByMember((prev) => ({
      ...prev,
      [selectedMemberId]: (prev[selectedMemberId] || DEFAULT_WEEK).map((p) =>
        p.day === activeDay ? updater(p) : p
      ),
    }));
  };

  const handleUpdateWorkoutName = (newName: string) => {
    updateActiveDay((p) => ({ ...p, workout_name: newName }));
  };

  const handleUpdateWorkoutNote = (newNote: string) => {
    updateActiveDay((p) => ({ ...p, workout_note: newNote }));
  };

  const handleToggleRestDay = () => {
    updateActiveDay((p) => ({
      ...p,
      is_rest_day: !p.is_rest_day,
      workout_name: !p.is_rest_day ? "Active Recovery & Rest Day" : "Custom Strength Split",
      workout_note: !p.is_rest_day
        ? "• Complete Rest Day.\n• Light 30-minute outdoor walk.\n• Hydrate with 3.5L water & prioritize 8 hours sleep."
        : "• Enter workout instructions here...",
    }));
    toast.success(`Toggled ${activeDay} rest day status for ${selectedMember.full_name}`);
  };

  const handleInsertTemplate = () => {
    const template = `• Exercise 1: 4 sets x 8-10 reps (Warm-up + working sets), 90s rest.
• Exercise 2: 3 sets x 10-12 reps, 75s rest. Strict tempo.
• Exercise 3: 3 sets x 12-15 reps, 60s rest. 2s peak contraction.
• Exercise 4: 3 sets to failure, 60s rest.
• Core/Cardio Finisher: 3 rounds of 60-second plank or 10 min assault bike.`;

    handleUpdateWorkoutNote(template);
    toast.success("Inserted routine structure template!");
  };

  const handleSaveRoutine = async () => {
    if (!selectedMember) return;

    const supabase = createClient();
    if (!supabase) {
      toast.success(`Saved ${activeDay} workout instructions for ${selectedMember.full_name}!`);
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("workout_plans").upsert(
      {
        member_id: selectedMember.id,
        day: activeDay,
        workout_name: currentDayPlan.workout_name || "Training Split",
        is_rest_day: currentDayPlan.is_rest_day,
        estimated_duration_min: currentDayPlan.estimated_duration_min ?? 60,
        focus: currentDayPlan.focus ?? "General Conditioning",
        workout_note: currentDayPlan.workout_note,
      },
      { onConflict: "member_id,day" }
    );
    setIsSaving(false);

    if (error) {
      toast.error(`Could not save routine: ${error.message}`);
      return;
    }

    toast.success(`Saved ${activeDay} workout instructions for ${selectedMember.full_name}!`);
  };

  return (
    <TrainerShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Day-by-Day Workout Notes
            </h1>
            <Badge variant="primary">Fast Note-Based Routine</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Write or paste the day&apos;s workout routine and coach instructions directly for each athlete.
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
              disabled={isLoadingMembers || members.length === 0}
              className="bg-transparent text-text-primary font-bold focus:outline-none disabled:opacity-60"
            >
              {isLoadingMembers && <option className="bg-[#151B22]">Loading athletes...</option>}
              {!isLoadingMembers && members.length === 0 && (
                <option className="bg-[#151B22]">No athletes yet</option>
              )}
              {members.map((m) => (
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
            disabled={isSaving || isLoadingMembers || members.length === 0}
            className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold"
          >
            <Save className="h-4 w-4" />
            <span>Save Routine</span>
          </Button>
        </div>
      </div>

      {members.length === 0 ? (
        <Card className="p-10 flex flex-col items-center gap-3 text-center">
          {isLoadingMembers ? (
            <>
              <Clock className="h-8 w-8 text-primary animate-pulse" />
              <p className="text-sm text-text-muted">Loading your athletes...</p>
            </>
          ) : (
            <>
              <User className="h-8 w-8 text-primary" />
              <h3 className="text-base font-bold text-text-primary">No athletes yet</h3>
              <p className="text-xs text-text-muted max-w-sm">
                Add members from your roster and they will appear here automatically for workout
                programming.
              </p>
              <Link
                href="/trainer/members"
                className="text-xs font-bold text-primary hover:underline"
              >
                Go to Athlete Roster &rarr;
              </Link>
            </>
          )}
        </Card>
      ) : (
        <>
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
                {plan?.is_rest_day ? "Rest Day" : "Training Note"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Workout Note Editor Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-6">
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider block mb-1">
              Programming for {activeDay} &bull; {selectedMember.full_name}
            </span>
            <div className="flex items-center gap-3">
              <Input
                value={currentDayPlan.workout_name}
                onChange={(e) => handleUpdateWorkoutName(e.target.value)}
                placeholder="Workout Title (e.g. Chest & Triceps Hypertrophy)"
                className="text-base font-bold text-text-primary bg-[#10151B] max-w-md h-10 border-primary/30"
              />
              {currentDayPlan.is_rest_day && <Badge variant="neutral">Rest Day</Badge>}
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
                variant="secondary"
                size="sm"
                onClick={handleInsertTemplate}
                className="text-xs flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Insert Format Template</span>
              </Button>
            )}
          </div>
        </div>

        {/* Note Textarea */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-primary flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Workout Routine Note & Form Guidance ({activeDay})</span>
            </label>
            <span className="text-[10px] text-text-dim">
              Members see this exact note on {activeDay} in their athlete portal
            </span>
          </div>

          <textarea
            rows={10}
            value={currentDayPlan.workout_note}
            onChange={(e) => handleUpdateWorkoutNote(e.target.value)}
            placeholder="Type or paste the full workout routine here...
e.g.
• Incline Barbell Bench: 4 sets x 8 reps (75 kg), rest 90s
• Flat DB Press: 3 sets x 10 reps (28 kg DBs), rest 75s
• Cable Flyes: 3 sets x 15 reps (15 kg), rest 60s
• Form cue: Maintain scapular retraction throughout all pressing."
            className="w-full rounded-2xl border border-border bg-[#10151B] p-4 text-sm text-text-primary font-mono leading-relaxed placeholder:text-text-dim focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-text-muted">
              Fast, flexible & unconstrained &bull; No tedious individual exercise fields needed
            </span>

            <Button
              variant="primary"
              size="default"
              onClick={handleSaveRoutine}
              disabled={isSaving}
              className="font-bold shadow-lime-glow-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : `Save ${activeDay}'s Workout Note`}
            </Button>
          </div>
        </div>
      </Card>
        </>
      )}
    </TrainerShell>
  );
}

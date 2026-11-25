"use client";

import * as React from "react";
import Link from "next/link";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleWeeklyDiet, fitcoreMembers } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";
import { mapMemberRow, type MemberRow } from "@/lib/supabase/mappers";
import { DayDietPlan, DayOfWeek, MemberProfile } from "@/types";
import { UtensilsCrossed, Save, User, Sparkles } from "lucide-react";
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

const DEFAULT_WEEK: DayDietPlan[] = DAYS.map((day) => ({
  day,
  diet_title: "High Protein Daily Fuel",
  daily_calories_target: 2200,
  protein_target_g: 180,
  carbs_target_g: 200,
  fats_target_g: 60,
  water_target_liters: 3.5,
  diet_note: "",
}));

interface DietPlanRow {
  member_id: string;
  day: DayOfWeek;
  diet_title: string | null;
  daily_calories_target: number | null;
  protein_target_g: number | null;
  carbs_target_g: number | null;
  fats_target_g: number | null;
  water_target_liters: number | null;
  diet_note: string | null;
}

function mergePlans(rows: DietPlanRow[]): DayDietPlan[] {
  return DEFAULT_WEEK.map((defaultPlan) => {
    const row = rows.find((r) => r.day === defaultPlan.day);
    if (!row) return { ...defaultPlan };

    return {
      ...defaultPlan,
      diet_title: row.diet_title ?? defaultPlan.diet_title,
      daily_calories_target:
        row.daily_calories_target ?? defaultPlan.daily_calories_target,
      protein_target_g: row.protein_target_g ?? defaultPlan.protein_target_g,
      carbs_target_g: row.carbs_target_g ?? defaultPlan.carbs_target_g,
      fats_target_g: row.fats_target_g ?? defaultPlan.fats_target_g,
      water_target_liters:
        row.water_target_liters ?? defaultPlan.water_target_liters,
      diet_note: row.diet_note ?? "",
    };
  });
}

export default function TrainerDietManagementPage() {
  const [members, setMembers] = React.useState<MemberProfile[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = React.useState(true);
  const [selectedMemberId, setSelectedMemberId] = React.useState("");
  const [activeDay, setActiveDay] = React.useState<DayOfWeek>("Monday");
  const [isSaving, setIsSaving] = React.useState(false);
  const [dietsByMember, setDietsByMember] = React.useState<Record<string, DayDietPlan[]>>({});

  const loadMembers = React.useCallback(async () => {
    const supabase = createClient();

    if (!supabase) {
      setMembers(fitcoreMembers);
      setDietsByMember(
        Object.fromEntries(
          fitcoreMembers.map((m) => [m.id, sampleWeeklyDiet.map((d) => ({ ...d }))])
        )
      );
      setIsLoadingMembers(false);
      return;
    }

    const [{ data: rows, error }, { data: planRows }] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase
        .from("diet_plans")
        .select(
          "member_id, day, diet_title, daily_calories_target, protein_target_g, carbs_target_g, fats_target_g, water_target_liters, diet_note"
        ),
    ]);

    if (error) {
      toast.error(`Could not load athletes: ${error.message}`);
      setIsLoadingMembers(false);
      return;
    }

    const mappedMembers = ((rows ?? []) as MemberRow[]).map((row) => mapMemberRow(row));

    const plansByMemberId = new Map<string, DietPlanRow[]>();
    ((planRows ?? []) as DietPlanRow[]).forEach((row) => {
      const list = plansByMemberId.get(row.member_id) ?? [];
      list.push(row);
      plansByMemberId.set(row.member_id, list);
    });

    setMembers(mappedMembers);
    setDietsByMember(
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

  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];
  const weeklyDiet = dietsByMember[selectedMemberId] || DEFAULT_WEEK;
  const currentDayDiet = weeklyDiet.find((d) => d.day === activeDay) || weeklyDiet[0];

  const updateActiveDay = (updater: (diet: DayDietPlan) => DayDietPlan) => {
    if (!selectedMemberId) return;
    setDietsByMember((prev) => ({
      ...prev,
      [selectedMemberId]: (prev[selectedMemberId] || DEFAULT_WEEK).map((d) =>
        d.day === activeDay ? updater(d) : d
      ),
    }));
  };

  const handleUpdateDietTitle = (newTitle: string) => {
    updateActiveDay((d) => ({ ...d, diet_title: newTitle }));
  };

  const handleUpdateDietNote = (newNote: string) => {
    updateActiveDay((d) => ({ ...d, diet_note: newNote }));
  };

  const handleInsertTemplate = () => {
    const template = `• Breakfast (8:00 AM): 4 whole eggs + 2 egg whites scramble with spinach, 60g oats with berries.
• Morning Snack (11:00 AM): 1 apple or orange + 15g raw almonds.
• Lunch (1:30 PM): 200g grilled chicken breast or paneer, 150g basmati rice, steamed broccoli & cucumber.
• Pre-Workout Fuel (5:00 PM): 1 scoop whey isolate + 1 banana + 2 rice cakes.
• Dinner (8:30 PM): 220g baked fish or tofu, 180g sweet potato, mixed fresh greens with 1 tsp olive oil.
• Hydration: Drink 3.5 Liters of water daily. Avoid sugary drinks and processed food.`;

    handleUpdateDietNote(template);
    toast.success("Inserted nutrition schedule template!");
  };

  const handleSaveDiet = async () => {
    if (!selectedMember) return;

    const supabase = createClient();
    if (!supabase) {
      toast.success(`Saved ${activeDay} diet instructions for ${selectedMember.full_name}!`);
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("diet_plans").upsert(
      {
        member_id: selectedMember.id,
        day: activeDay,
        diet_title: currentDayDiet.diet_title || "High Protein Daily Fuel",
        daily_calories_target: currentDayDiet.daily_calories_target ?? 2200,
        protein_target_g: currentDayDiet.protein_target_g ?? 180,
        carbs_target_g: currentDayDiet.carbs_target_g ?? 200,
        fats_target_g: currentDayDiet.fats_target_g ?? 60,
        water_target_liters: currentDayDiet.water_target_liters ?? 3.5,
        diet_note: currentDayDiet.diet_note,
      },
      { onConflict: "member_id,day" }
    );
    setIsSaving(false);

    if (error) {
      toast.error(`Could not save diet: ${error.message}`);
      return;
    }

    toast.success(`Saved ${activeDay} diet instructions for ${selectedMember.full_name}!`);
  };

  return (
    <TrainerShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Day-by-Day Diet & Nutrition Notes
            </h1>
            <Badge variant="active">Fast Note-Based Nutrition</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Program daily meal plans, food guidelines, and hydration rules directly as notes for Monday through Sunday.
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
            onClick={handleSaveDiet}
            disabled={isSaving || isLoadingMembers || members.length === 0}
            className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Nutrition"}</span>
          </Button>
        </div>
      </div>

      {members.length === 0 ? (
        <Card className="p-10 flex flex-col items-center gap-3 text-center">
          {isLoadingMembers ? (
            <p className="text-sm text-text-muted">Loading your athletes…</p>
          ) : (
            <>
              <User className="h-8 w-8 text-primary" />
              <h3 className="text-base font-bold text-text-primary">No athletes yet</h3>
              <p className="text-xs text-text-muted max-w-sm">
                Add members from your roster and they will appear here for nutrition programming.
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
              const diet = weeklyDiet.find((d) => d.day === day);
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
                  <span className="text-xs font-bold block mb-1">{day}</span>
                  <p className="text-[11px] font-semibold text-text-primary truncate">
                    {diet?.diet_title || "Daily Nutrition"}
                  </p>
                  <span className="text-[10px] text-primary font-mono block mt-0.5">
                    {diet?.daily_calories_target || 2200} kcal
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Diet Note Editor Card */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-6">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider block mb-1">
                  Diet Programming for {activeDay} &bull; {selectedMember.full_name}
                </span>
                <div className="flex items-center gap-3">
                  <Input
                    value={currentDayDiet.diet_title || "Daily Fuel & Macros"}
                    onChange={(e) => handleUpdateDietTitle(e.target.value)}
                    placeholder="Diet Title (e.g. High Protein Training Day Fuel)"
                    className="text-base font-bold text-text-primary bg-[#10151B] max-w-md h-10 border-primary/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleInsertTemplate}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>Insert Diet Template</span>
                </Button>
              </div>
            </div>

            {/* Note Textarea */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-emerald-400" />
                  <span>Daily Meal Schedule, Food Items & Hydration Instructions ({activeDay})</span>
                </label>
                <span className="text-[10px] text-text-dim">
                  Members see this exact nutrition note on {activeDay} in their athlete portal
                </span>
              </div>

              <textarea
                rows={10}
                value={currentDayDiet.diet_note}
                onChange={(e) => handleUpdateDietNote(e.target.value)}
                placeholder="Type or paste the full daily diet plan and food recommendations here...
e.g.
• Breakfast (8:00 AM): 4 whole eggs + 2 egg whites, 60g oats with berries.
• Morning Snack (11:00 AM): 1 apple + 15g almonds.
• Lunch (1:30 PM): 200g chicken/paneer, 150g rice, steamed greens.
• Pre-Workout (5:00 PM): 1 scoop whey + 1 banana.
• Dinner (8:30 PM): 220g fish/tofu, sweet potato mash.
• Hydration: 3.5 Liters water daily."
                className="w-full rounded-2xl border border-border bg-[#10151B] p-4 text-sm text-text-primary font-mono leading-relaxed placeholder:text-text-dim focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-text-muted">
                  Fast, simple & effective &bull; No complex calorie or gram calculators needed
                </span>

                <Button
                  variant="primary"
                  size="default"
                  onClick={handleSaveDiet}
                  disabled={isSaving}
                  className="font-bold shadow-lime-glow-sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : `Save ${activeDay}'s Diet Note`}
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </TrainerShell>
  );
}

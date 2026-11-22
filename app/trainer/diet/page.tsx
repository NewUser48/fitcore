"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleWeeklyDiet, fitcoreMembers } from "@/lib/mock-data";
import { DayDietPlan, DayOfWeek } from "@/types";
import {
  UtensilsCrossed,
  Apple,
  Flame,
  Save,
  User,
  FileText,
  Sparkles,
  Droplets,
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

export default function TrainerDietManagementPage() {
  const [selectedMemberId, setSelectedMemberId] = React.useState(fitcoreMembers[0].id);
  const [activeDay, setActiveDay] = React.useState<DayOfWeek>("Monday");
  const [weeklyDiet, setWeeklyDiet] = React.useState<DayDietPlan[]>(sampleWeeklyDiet);

  const selectedMember = fitcoreMembers.find((m) => m.id === selectedMemberId) || fitcoreMembers[0];
  const currentDayDiet = weeklyDiet.find((d) => d.day === activeDay) || weeklyDiet[0];

  const handleUpdateDietTitle = (newTitle: string) => {
    setWeeklyDiet((prev) =>
      prev.map((d) => (d.day === activeDay ? { ...d, diet_title: newTitle } : d))
    );
  };

  const handleUpdateDietNote = (newNote: string) => {
    setWeeklyDiet((prev) =>
      prev.map((d) => (d.day === activeDay ? { ...d, diet_note: newNote } : d))
    );
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

  const handleSaveDiet = () => {
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
            onClick={handleSaveDiet}
            className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold"
          >
            <Save className="h-4 w-4" />
            <span>Save Nutrition</span>
          </Button>
        </div>
      </div>

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
              className="font-bold shadow-lime-glow-sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save {activeDay}&apos;s Diet Note
            </Button>
          </div>
        </div>
      </Card>
    </TrainerShell>
  );
}

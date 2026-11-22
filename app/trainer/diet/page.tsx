"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleWeeklyDiet, fitcoreMembers } from "@/lib/mock-data";
import { DayDietPlan, DayOfWeek, MealItem } from "@/types";
import {
  UtensilsCrossed,
  Apple,
  Flame,
  Plus,
  Trash2,
  Save,
  User,
  Clock,
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

  const handleUpdateCalorieTarget = (newVal: number) => {
    setWeeklyDiet((prev) =>
      prev.map((d) => (d.day === activeDay ? { ...d, daily_calories_target: newVal } : d))
    );
  };

  const handleAddMeal = () => {
    const newMeal: MealItem = {
      id: `meal_${Date.now()}`,
      meal_type: "Morning Snack",
      timing: "10:30 AM",
      foods: "Custom healthy snack",
      quantity: "150g",
      calories: 200,
      protein_g: 15,
      carbs_g: 20,
      fats_g: 5,
      is_completed: false,
    };
    setWeeklyDiet((prev) =>
      prev.map((d) =>
        d.day === activeDay ? { ...d, meals: [...d.meals, newMeal] } : d
      )
    );
    toast.success("Added meal slot to schedule");
  };

  const handleDeleteMeal = (mealId: string) => {
    setWeeklyDiet((prev) =>
      prev.map((d) =>
        d.day === activeDay
          ? { ...d, meals: d.meals.filter((m) => m.id !== mealId) }
          : d
      )
    );
    toast.success("Removed meal");
  };

  const handleSaveDiet = () => {
    toast.success(`Saved day-by-day nutrition protocol for ${selectedMember.full_name}!`);
  };

  return (
    <TrainerShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Day-by-Day Nutrition Builder
            </h1>
            <Badge variant="active">Trainer Controlled</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Program daily calorie targets, macro splits, and individual meal schedules for Monday through Sunday.
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
              <p className="text-xs font-black text-primary font-mono">
                {diet?.daily_calories_target || 2200} kcal
              </p>
              <span className="text-[10px] text-text-dim block mt-0.5">
                {diet?.protein_target_g || 180}g Protein
              </span>
            </button>
          );
        })}
      </div>

      {/* Daily Macro Targets Card */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider block mb-1">
              Macro Targets for {activeDay} &bull; {selectedMember.full_name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-text-primary">Daily Energy Target:</span>
              <span className="text-xl font-mono font-black text-primary">
                {currentDayDiet.daily_calories_target} kcal
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddMeal}
            className="text-xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" /> Add Meal Slot
          </Button>
        </div>

        {/* Macro Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-3.5 rounded-xl bg-[#151B22] border border-border">
            <label className="block text-[10px] text-text-muted uppercase font-bold mb-1">Calories (kcal)</label>
            <Input
              type="number"
              value={currentDayDiet.daily_calories_target}
              onChange={(e) => handleUpdateCalorieTarget(Number(e.target.value))}
              className="font-mono text-base font-bold text-primary"
            />
          </div>
          <div className="p-3.5 rounded-xl bg-[#151B22] border border-border">
            <label className="block text-[10px] text-text-muted uppercase font-bold mb-1">Protein (g)</label>
            <Input
              type="number"
              value={currentDayDiet.protein_target_g}
              onChange={(e) => {
                const val = Number(e.target.value);
                setWeeklyDiet((prev) =>
                  prev.map((d) => (d.day === activeDay ? { ...d, protein_target_g: val } : d))
                );
              }}
              className="font-mono text-base font-bold text-emerald-400"
            />
          </div>
          <div className="p-3.5 rounded-xl bg-[#151B22] border border-border">
            <label className="block text-[10px] text-text-muted uppercase font-bold mb-1">Carbs (g)</label>
            <Input
              type="number"
              value={currentDayDiet.carbs_target_g}
              onChange={(e) => {
                const val = Number(e.target.value);
                setWeeklyDiet((prev) =>
                  prev.map((d) => (d.day === activeDay ? { ...d, carbs_target_g: val } : d))
                );
              }}
              className="font-mono text-base font-bold text-sky-400"
            />
          </div>
          <div className="p-3.5 rounded-xl bg-[#151B22] border border-border">
            <label className="block text-[10px] text-text-muted uppercase font-bold mb-1">Fats (g)</label>
            <Input
              type="number"
              value={currentDayDiet.fats_target_g}
              onChange={(e) => {
                const val = Number(e.target.value);
                setWeeklyDiet((prev) =>
                  prev.map((d) => (d.day === activeDay ? { ...d, fats_target_g: val } : d))
                );
              }}
              className="font-mono text-base font-bold text-amber-400"
            />
          </div>
        </div>

        {/* Meals Timeline */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Assigned Meal Schedule ({activeDay})
          </h3>

          {currentDayDiet.meals.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border/80 rounded-2xl bg-[#151B22]/50 text-xs text-text-muted">
              No meal slots programmed for {activeDay} yet. Click &quot;Add Meal Slot&quot; to begin.
            </div>
          ) : (
            currentDayDiet.meals.map((meal) => (
              <div
                key={meal.id}
                className="p-4 rounded-xl bg-[#151B22] border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-text-primary">{meal.meal_type}</span>
                    <Input
                      value={meal.timing}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWeeklyDiet((prev) =>
                          prev.map((d) =>
                            d.day === activeDay
                              ? {
                                  ...d,
                                  meals: d.meals.map((m) =>
                                    m.id === meal.id ? { ...m, timing: val } : m
                                  ),
                                }
                              : d
                          )
                        );
                      }}
                      className="w-28 h-7 text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary">{meal.calories} kcal</span>
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="p-1 text-text-muted hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-muted mb-0.5">Recommended Foods & Quantities</label>
                  <Input
                    value={meal.foods}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWeeklyDiet((prev) =>
                        prev.map((d) =>
                          d.day === activeDay
                            ? {
                                ...d,
                                meals: d.meals.map((m) =>
                                  m.id === meal.id ? { ...m, foods: val } : m
                                ),
                              }
                            : d
                        )
                      );
                    }}
                    className="h-8 text-xs font-medium"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </TrainerShell>
  );
}

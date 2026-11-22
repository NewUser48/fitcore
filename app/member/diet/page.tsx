"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleWeeklyDiet } from "@/lib/mock-data";
import { DayOfWeek } from "@/types";
import { UtensilsCrossed, Clock, CheckCircle2, Droplets } from "lucide-react";

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MemberDietPage() {
  const [activeDay, setActiveDay] = React.useState<DayOfWeek>("Monday");
  const diet = sampleWeeklyDiet.find((d) => d.day === activeDay) || sampleWeeklyDiet[0];

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Diet & Meal Plan
            </h1>
            <Badge variant="active">{activeDay}</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Tailored nutrition and hydration goals for {activeDay} &bull; Target: {diet.daily_calories_target} kcal
          </p>
        </div>
      </div>

      {/* 7-Day Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
        {DAYS.map((day) => {
          const d = sampleWeeklyDiet.find((item) => item.day === day);
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
              <p className="text-xs font-black text-primary font-mono">{d?.daily_calories_target || 2200} kcal</p>
            </button>
          );
        })}
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-3 gap-3 text-center mb-6">
          <div className="p-3 rounded-xl bg-[#151B22] border border-border">
            <span className="text-[10px] text-text-muted block">Protein</span>
            <span className="text-lg font-black text-primary font-mono">{diet.protein_target_g}g</span>
          </div>
          <div className="p-3 rounded-xl bg-[#151B22] border border-border">
            <span className="text-[10px] text-text-muted block">Carbohydrates</span>
            <span className="text-lg font-black text-sky-400 font-mono">{diet.carbs_target_g}g</span>
          </div>
          <div className="p-3 rounded-xl bg-[#151B22] border border-border">
            <span className="text-[10px] text-text-muted block">Fats</span>
            <span className="text-lg font-black text-amber-400 font-mono">{diet.fats_target_g}g</span>
          </div>
        </div>

        <div className="space-y-4">
          {diet.meals.map((meal) => (
            <div key={meal.id} className="p-4 rounded-xl bg-[#151B22] border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">{meal.meal_type}</span>
                <span className="text-xs font-mono font-bold text-primary">{meal.calories} kcal</span>
              </div>
              <p className="text-xs text-text-muted">{meal.foods}</p>
              <span className="text-[10px] text-text-dim block font-mono">Timing: {meal.timing}</span>
            </div>
          ))}
        </div>
      </Card>
    </MemberShell>
  );
}

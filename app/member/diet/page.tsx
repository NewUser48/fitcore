"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleWeeklyDiet } from "@/lib/mock-data";
import { DayOfWeek } from "@/types";
import { UtensilsCrossed, Clock, CheckCircle2, Droplets, FileText } from "lucide-react";

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
              Diet & Nutrition Notes
            </h1>
            <Badge variant="active">{activeDay}</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Personalized meal instructions and hydration protocol for {activeDay}
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
              <p className="text-xs font-black text-primary font-mono">{d?.diet_title || "Daily Fuel"}</p>
            </button>
          );
        })}
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">{activeDay} Nutrition</span>
            <h2 className="text-lg font-black text-text-primary mt-1">{diet.diet_title || "Daily Nutrition Plan"}</h2>
            <p className="text-xs text-text-muted">Target: ~{diet.daily_calories_target || 2200} kcal</p>
          </div>
        </div>

        {/* Diet Note */}
        <div className="p-5 rounded-2xl bg-[#10151B] border border-border/80">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3">
            <FileText className="h-4 w-4" />
            <span>Coach Meal & Food Instructions:</span>
          </div>

          <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed">
            {diet.diet_note || "No specific diet note assigned for this day."}
          </pre>
        </div>
      </Card>
    </MemberShell>
  );
}

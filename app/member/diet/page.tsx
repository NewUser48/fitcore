"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemberPortal } from "@/components/member/member-portal-provider";
import { WEEK_DAYS, getTodayDayOfWeek } from "@/lib/utils";
import { UtensilsCrossed, Clock, CheckCircle2, Droplets, FileText, Lock } from "lucide-react";

export default function MemberDietPage() {
  const { diet: dietPlans } = useMemberPortal();
  // Members are restricted to the current date only.
  const activeDay = getTodayDayOfWeek();
  const diet = dietPlans.find((d) => d.day === activeDay) || dietPlans[0];

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
          <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
            Personalized meal instructions and hydration protocol for today
            <Lock className="h-3 w-3 text-primary" />
          </p>
        </div>
      </div>

      {/* Today-only day strip (other days locked) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
        {WEEK_DAYS.map((day) => {
          const d = dietPlans.find((item) => item.day === day);
          const isToday = activeDay === day;

          return (
            <div
              key={day}
              aria-disabled={!isToday}
              title={isToday ? "Today" : "Locked — today only"}
              className={`p-3 rounded-2xl border text-left select-none ${
                isToday
                  ? "bg-[#1C242D] border-primary text-text-primary shadow-lime-glow-sm"
                  : "bg-[#151B22] border-border/60 text-text-muted opacity-45 cursor-not-allowed"
              }`}
            >
              <span className="text-xs font-bold mb-1 flex items-center justify-between">
                {day}
                {!isToday && <Lock className="h-3 w-3 text-text-dim" />}
              </span>
              <p className="text-xs font-black text-primary font-mono">
                {isToday ? d?.diet_title || "Daily Fuel" : "Locked"}
              </p>
            </div>
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

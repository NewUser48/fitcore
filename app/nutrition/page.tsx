"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Plus, Apple, Flame, Droplets, Heart } from "lucide-react";

export default function NutritionPage() {
  const mealPlans = [
    {
      id: "diet_1",
      athlete: "Rohan Malhotra",
      goal: "Fat Loss & Conditioning",
      calories: 2200,
      protein: 180,
      carbs: 200,
      fats: 60,
      water: 4.0,
      status: "Active",
    },
    {
      id: "diet_2",
      athlete: "Kavita Rao",
      goal: "Lean Muscle Hypertrophy",
      calories: 2450,
      protein: 140,
      carbs: 300,
      fats: 70,
      water: 3.5,
      status: "Active",
    },
    {
      id: "diet_3",
      athlete: "Devendra Patel",
      goal: "Metabolic Reset & Recovery",
      calories: 2100,
      protein: 160,
      carbs: 210,
      fats: 55,
      water: 3.5,
      status: "Active",
    },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Diet & Nutrition Protocols
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              Trainer-Controlled Macros
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Assign custom daily calorie targets, protein, carbohydrate, and fat splits tailored to each athlete&apos;s goal.
          </p>
        </div>

        <Button variant="primary" size="sm" className="flex items-center gap-2 shadow-lime-glow-sm">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>New Diet Plan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {mealPlans.map((plan) => (
          <Card key={plan.id} glowOnHover className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Apple className="h-5 w-5" />
                </div>
                <Badge variant="active">{plan.status}</Badge>
              </div>

              <h3 className="text-sm font-bold text-text-primary mb-1">
                {plan.athlete}
              </h3>
              <p className="text-xs text-text-muted mb-4">{plan.goal}</p>

              <div className="rounded-xl bg-[#151B22] p-3 border border-border/60 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-primary" /> Target Calories
                  </span>
                  <span className="text-sm font-black text-primary font-mono">
                    {plan.calories} kcal
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-[#1C242D]">
                    <span className="text-[10px] text-text-muted">Protein</span>
                    <p className="font-bold text-text-primary">{plan.protein}g</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1C242D]">
                    <span className="text-[10px] text-text-muted">Carbs</span>
                    <p className="font-bold text-sky-400">{plan.carbs}g</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#1C242D]">
                    <span className="text-[10px] text-text-muted">Fats</span>
                    <p className="font-bold text-amber-400">{plan.fats}g</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px]">
                  <span className="text-text-muted flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-sky-400" /> Daily Hydration
                  </span>
                  <span className="font-bold text-text-primary font-mono">{plan.water} Liters</span>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full text-xs">
              View Meal Splits & Timings
            </Button>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

"use client";

import * as React from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Apple, Flame, Clock, Droplets, CheckCircle2 } from "lucide-react";

export default function MemberNutritionPage() {
  const [waterGlasses, setWaterGlasses] = React.useState(7);

  const meals = [
    {
      name: "Meal 1: Breakfast",
      time: "08:00 AM",
      calories: 550,
      macros: "40g Protein &bull; 60g Carbs &bull; 15g Fat",
      foods: "4 Whole Eggs + 2 Egg Whites, 60g Rolled Oats with berries & 1 tsp chia seeds.",
      tip: "Drink 500ml water immediately upon waking.",
    },
    {
      name: "Meal 2: Mid-Day Fuel",
      time: "01:00 PM",
      calories: 680,
      macros: "50g Protein &bull; 75g Carbs &bull; 20g Fat",
      foods: "200g Grilled Chicken Breast / Paneer, 150g Basmati Rice, Steamed Broccoli & Cucumber salad.",
      tip: "Keep sodium moderate; chew thoroughly.",
    },
    {
      name: "Meal 3: Pre-Workout Fuel",
      time: "05:00 PM (1.5 hrs before lift)",
      calories: 320,
      macros: "25g Protein &bull; 45g Carbs &bull; 5g Fat",
      foods: "1 Scoop Whey Isolate + 1 Medium Banana + 2 Rice Cakes with a dash of honey.",
      tip: "Light and quick digesting carbs for glycogen availability.",
    },
    {
      name: "Meal 4: Post-Workout Dinner",
      time: "08:30 PM",
      calories: 650,
      macros: "55g Protein &bull; 50g Carbs &bull; 15g Fat",
      foods: "220g Baked Fish / Tofu, Sweet Potato mash (180g), Mixed green salad with 1 tbsp olive oil.",
      tip: "Avoid processed sugars; finish meal 2 hours before sleep.",
    },
  ];

  return (
    <PortalShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Personalized Nutrition Protocol
            </h1>
            <Badge variant="active">Active Plan</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Coach Alex Vance &bull; Tailored for Fat Loss & High-Performance Conditioning
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#151B22] border border-border px-3.5 py-2 rounded-xl text-xs font-mono">
          <Flame className="h-4 w-4 text-primary" />
          <span className="font-bold text-text-primary">Daily Target: 2,200 kcal</span>
        </div>
      </div>

      {/* Macro Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">Daily Calories</span>
          <span className="text-2xl font-black text-primary font-display">2,200</span>
          <span className="text-[10px] text-text-dim block mt-0.5">kcal / day</span>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">Protein Target</span>
          <span className="text-2xl font-black text-emerald-400 font-display">180g</span>
          <span className="text-[10px] text-text-dim block mt-0.5">33% Caloric Share</span>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">Carbs Target</span>
          <span className="text-2xl font-black text-sky-400 font-display">200g</span>
          <span className="text-[10px] text-text-dim block mt-0.5">36% Caloric Share</span>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-[10px] text-text-muted uppercase tracking-wider block">Healthy Fats</span>
          <span className="text-2xl font-black text-amber-400 font-display">60g</span>
          <span className="text-[10px] text-text-dim block mt-0.5">25% Caloric Share</span>
        </Card>
      </div>

      {/* Daily Water Tracker */}
      <Card className="p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141C24] border-sky-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Hydration Compliance</h3>
            <p className="text-xs text-text-muted">
              Target: 3.5 - 4.0 Liters daily. Current: {((waterGlasses * 250) / 1000).toFixed(2)} Liters ({waterGlasses} glasses)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
          >
            - 250ml
          </Button>
          <span className="font-mono font-bold text-base text-sky-400 px-2">
            {waterGlasses} / 14
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setWaterGlasses((prev) => prev + 1)}
          >
            + 250ml Glass
          </Button>
        </div>
      </Card>

      {/* Meal Breakdown Timeline */}
      <div className="space-y-4">
        {meals.map((meal, index) => (
          <Card key={meal.name} glowOnHover className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-6 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                <h3 className="text-sm font-bold text-text-primary">{meal.name}</h3>
                <span className="text-xs text-text-muted flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3" /> {meal.time}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-primary font-mono">{meal.calories} kcal</span>
                <span className="text-text-muted">&bull;</span>
                <span
                  className="text-text-muted"
                  dangerouslySetInnerHTML={{ __html: meal.macros }}
                />
              </div>
            </div>

            <p className="text-xs text-text-primary font-medium leading-relaxed mb-2">
              {meal.foods}
            </p>

            <div className="p-2.5 rounded-lg bg-[#151B22] border border-border/60 text-[11px] text-text-muted italic">
              <strong>Coach Note:</strong> {meal.tip}
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}

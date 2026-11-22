"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dumbbell, Plus, Search, PlayCircle, Flame, Clock, Layers, UserCheck } from "lucide-react";

export default function WorkoutsPage() {
  const [search, setSearch] = React.useState("");

  const templates = [
    {
      id: "tpl_1",
      name: "Hypertrophy Upper/Lower 4-Day Periodization",
      target: "Muscle Building & Strength",
      level: "Intermediate / Advanced",
      splits: 4,
      exercisesCount: 22,
      assignedMembers: 8,
    },
    {
      id: "tpl_2",
      name: "High-Intensity Fat Loss & Athletic Conditioning",
      target: "Conditioning & Caloric Burn",
      level: "All Levels",
      splits: 3,
      exercisesCount: 18,
      assignedMembers: 12,
    },
    {
      id: "tpl_3",
      name: "Knee & Shoulder Joint Restoration Protocol",
      target: "Rehabilitation & Posture",
      level: "Corrective",
      splits: 3,
      exercisesCount: 12,
      assignedMembers: 4,
    },
  ];

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Workout Program Builder
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              Exercise Library & Templates
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Build customized routines, exercise libraries, set/rep protocols, and assign them directly to athletes.
          </p>
        </div>

        <Button variant="primary" size="sm" className="flex items-center gap-2 shadow-lime-glow-sm">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>New Workout Template</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {templates.map((tpl) => (
          <Card key={tpl.id} glowOnHover className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <Badge variant="primary">{tpl.level}</Badge>
              </div>

              <h3 className="text-sm font-bold text-text-primary mb-1">
                {tpl.name}
              </h3>
              <p className="text-xs text-text-muted mb-4">{tpl.target}</p>

              <div className="rounded-xl bg-[#151B22] p-3 border border-border/60 space-y-2 text-xs mb-4">
                <div className="flex justify-between">
                  <span className="text-text-muted">Weekly Split:</span>
                  <span className="font-bold text-text-primary">{tpl.splits} Days / Week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Movements:</span>
                  <span className="font-bold text-text-primary">{tpl.exercisesCount} Exercises</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Assigned Athletes:</span>
                  <span className="font-bold text-primary">{tpl.assignedMembers} Active</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Edit Protocol & Exercises
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Exercise Library Preview */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Exercise Master Library
              </h3>
              <p className="text-[11px] text-text-muted">
                Searchable database of compound & isolation movements with cues
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            Add Exercise
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "Barbell Back Squat", muscle: "Quadriceps & Glutes", type: "Compound" },
            { name: "Trap Bar Deadlift", muscle: "Hamstrings, Glutes & Traps", type: "Compound" },
            { name: "Incline Dumbbell Press", muscle: "Upper Chest & Anterior Delt", type: "Compound" },
            { name: "Chest-Supported T-Bar Row", muscle: "Latissimus Dorsi & Rhomboids", type: "Compound" },
            { name: "Bulgarian Split Squat", muscle: "Unilateral Quads & Glute Medius", type: "Hypertrophy" },
            { name: "Cable Lateral Raise", muscle: "Lateral Deltoids", type: "Isolation" },
          ].map((ex) => (
            <div
              key={ex.name}
              className="p-3 rounded-xl bg-[#151B22] border border-border/70 hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-text-primary">{ex.name}</p>
                <p className="text-[10px] text-text-muted">{ex.muscle}</p>
              </div>
              <Badge variant="neutral">{ex.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}

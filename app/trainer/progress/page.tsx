"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fitcoreMembers } from "@/lib/mock-data";
import { TrendingUp, Scale, Plus, ArrowDownRight, Trophy } from "lucide-react";

export default function TrainerProgressPage() {
  return (
    <TrainerShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Body Progress & Biometrics
            </h1>
            <Badge variant="primary">Weight & PR Assessments</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Review athlete weight loss/gain progress, body measurement trajectories, and verified personal records.
          </p>
        </div>

        <Button variant="primary" size="sm" className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Record New Assessment</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {fitcoreMembers.map((member) => {
          const delta = (member.current_weight_kg - member.starting_weight_kg).toFixed(1);
          const isNegative = Number(delta) < 0;

          return (
            <Card key={member.id} glowOnHover className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || ""}
                      alt={member.full_name}
                      className="h-11 w-11 rounded-2xl object-cover border border-primary/30"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">{member.full_name}</h3>
                      <p className="text-[10px] text-text-muted">{member.fitness_goal}</p>
                    </div>
                  </div>
                  <Badge variant="primary">{member.experience_level}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div className="p-2.5 rounded-xl bg-[#151B22] border border-border">
                    <span className="text-[10px] text-text-muted block">Start</span>
                    <span className="font-bold text-text-primary font-mono">{member.starting_weight_kg} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#151B22] border border-border">
                    <span className="text-[10px] text-text-muted block">Current</span>
                    <span className="font-bold text-primary font-mono">{member.current_weight_kg} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#151B22] border border-border">
                    <span className="text-[10px] text-text-muted block">Delta</span>
                    <span className={`font-bold font-mono ${isNegative ? "text-emerald-400" : "text-sky-400"}`}>
                      {Number(delta) > 0 ? `+${delta}` : delta} kg
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#151B22] border border-border/60 text-xs space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Target Weight:</span>
                    <span className="font-mono font-bold text-text-primary">{member.target_weight_kg || "N/A"} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Height:</span>
                    <span className="font-mono text-text-primary">{member.height_cm} cm</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs">
                View Full Chart & Photos &rarr;
              </Button>
            </Card>
          );
        })}
      </div>
    </TrainerShell>
  );
}

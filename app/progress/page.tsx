"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleMembers } from "@/lib/mock-data";
import { TrendingUp, Scale, Camera, Trophy, Plus, ArrowUpRight } from "lucide-react";

export default function ProgressPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Body Progress & Biometric Tracking
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              Measurements & PRs
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Track body weight trajectories, tape measurements (chest, waist, arms, hips), and personal lift records.
          </p>
        </div>

        <Button variant="primary" size="sm" className="flex items-center gap-2 shadow-lime-glow-sm">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Log Progress Assessment</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {sampleMembers.map((member) => {
          const weightDelta = (member.current_weight_kg - member.starting_weight_kg).toFixed(1);
          const isNegative = Number(weightDelta) < 0;

          return (
            <Card key={member.id} glowOnHover className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || ""}
                      alt={member.full_name}
                      className="h-11 w-11 rounded-2xl object-cover border border-primary/30 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        {member.full_name}
                      </h3>
                      <p className="text-[11px] text-text-muted">{member.fitness_goal}</p>
                    </div>
                  </div>
                  <Badge variant="primary">Enrolled</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div className="p-2.5 rounded-xl bg-[#151B22] border border-border/60">
                    <span className="text-[10px] text-text-muted block">Start</span>
                    <span className="font-bold text-text-primary">{member.starting_weight_kg} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#151B22] border border-border/60">
                    <span className="text-[10px] text-text-muted block">Current</span>
                    <span className="font-bold text-primary">{member.current_weight_kg} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#151B22] border border-border/60">
                    <span className="text-[10px] text-text-muted block">Delta</span>
                    <span className={`font-bold ${isNegative ? "text-emerald-400" : "text-sky-400"}`}>
                      {Number(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} kg
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#151B22] p-3 border border-border/60 space-y-1.5 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Target Weight:</span>
                    <span className="font-mono font-bold text-text-primary">{member.target_weight_kg || "N/A"} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Assessment Due:</span>
                    <span className="font-mono text-emerald-400">In 5 Days</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs">
                View Charts & Photo Logs &rarr;
              </Button>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}

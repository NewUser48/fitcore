"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleMembershipPlans } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Layers, Plus, CheckCircle2 } from "lucide-react";

export default function TrainerMembershipsPage() {
  return (
    <TrainerShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Membership Packages
            </h1>
            <Badge variant="primary">₹ INR Default</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Configure monthly, quarterly, and annual coaching tiers and assigned feature inclusions.
          </p>
        </div>

        <Button variant="primary" size="sm" className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Create New Plan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sampleMembershipPlans.map((plan) => (
          <Card key={plan.id} glowOnHover className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="primary">{plan.duration_type}</Badge>
                <span className="text-xs text-text-muted font-mono">{plan.duration_days} Days</span>
              </div>

              <h3 className="text-base font-bold text-text-primary mb-1">
                {plan.name}
              </h3>
              <p className="text-xs text-text-muted mb-4">{plan.description}</p>

              <div className="mb-4">
                <span className="text-2xl font-black text-primary font-display">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-xs text-text-dim ml-1">/ athlete</span>
              </div>

              <div className="space-y-1.5 border-t border-border/60 pt-3 mb-4">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-text-muted">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-text-muted">{plan.member_count} Athletes Enrolled</span>
              <Button variant="secondary" size="sm">Edit Package</Button>
            </div>
          </Card>
        ))}
      </div>
    </TrainerShell>
  );
}

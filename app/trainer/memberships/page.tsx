"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleMembershipPlans } from "@/lib/mock-data";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import type { MemberProfile } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Layers, Plus, CheckCircle2 } from "lucide-react";

function durationTypeForDays(days: number) {
  if (days >= 365) return "annual";
  if (days >= 90) return "quarterly";
  if (days >= 28) return "monthly";
  return "custom";
}

export default function TrainerMembershipsPage() {
  const { members, isLoading } = useTrainerMembers();

  const plans = React.useMemo(() => {
    if (members.length === 0) {
      return isLoading
        ? []
        : sampleMembershipPlans.map((plan) => ({ ...plan, member_count: 0 }));
    }

    const grouped = new Map<string, MemberProfile[]>();
    members.forEach((member) => {
      const list = grouped.get(member.membership_plan_name) ?? [];
      list.push(member);
      grouped.set(member.membership_plan_name, list);
    });

    return Array.from(grouped.entries())
      .map(([name, group]) => {
        const template = sampleMembershipPlans.find(
          (plan) => plan.name.toLowerCase() === name.toLowerCase()
        );

        const first = group[0];
        const start = first.membership_start_date
          ? new Date(first.membership_start_date)
          : null;
        const end = first.membership_end_date
          ? new Date(first.membership_end_date)
          : null;
        const days =
          start && end
            ? Math.max(
                1,
                Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
              )
            : template?.duration_days ?? 30;

        const price =
          Math.max(...group.map((m) => m.membership_fee ?? 0), 0) ||
          template?.price ||
          0;

        return {
          id: name,
          name,
          duration_type: durationTypeForDays(days),
          duration_days: days,
          price,
          description:
            template?.description ??
            `${group.length} athlete${group.length === 1 ? "" : "s"} enrolled on this plan.`,
          features:
            template?.features ??
            ["Personalized Training", "Nutrition Guidance", "Progress Tracking"],
          member_count: group.length,
        };
      })
      .sort((a, b) => b.member_count - a.member_count);
  }, [members, isLoading]);

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

      {isLoading ? (
        <Card className="p-10 text-center text-sm text-text-muted">Loading membership plans…</Card>
      ) : plans.length === 0 ? (
        <Card className="p-10 flex flex-col items-center gap-3 text-center">
          <Layers className="h-8 w-8 text-primary" />
          <h3 className="text-base font-bold text-text-primary">No plans yet</h3>
          <p className="text-xs text-text-muted max-w-sm">
            Add members to your roster and their membership plans will be grouped here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
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
                  {plan.features.map((f: string) => (
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
      )}
    </TrainerShell>
  );
}

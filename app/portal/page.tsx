"use client";

import * as React from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dumbbell,
  UtensilsCrossed,
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  Trophy,
  Activity,
  ArrowRight,
  TrendingDown,
  Droplets,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";
import { sampleMembers, initialTrainerProfile } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function MemberPortalPage() {
  const member = sampleMembers[0]; // Rohan Malhotra
  const [waterGlasses, setWaterGlasses] = React.useState(6);

  return (
    <PortalShell>
      {/* Athlete Welcome Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[#151B22] via-[#1C242D] to-[#151B22] p-6 shadow-card-subtle">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-5 items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2 text-[10px] font-bold text-primary uppercase">
                <Flame className="h-3 w-3" /> Athlete Dashboard
              </span>
              <span className="text-xs text-text-muted">&bull;</span>
              <span className="text-xs text-emerald-400 font-semibold">Active Plan</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Welcome back, {member.full_name.split(" ")[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-lg">
              Goal: <strong className="text-primary">{member.fitness_goal}</strong> &bull; Assigned by {initialTrainerProfile.name}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-xl bg-[#151B22] border border-border p-3 text-right">
              <span className="text-[10px] text-text-muted block">Current Weight</span>
              <span className="text-lg font-black text-text-primary font-display">
                {member.current_weight_kg} kg
              </span>
              <span className="text-[10px] text-emerald-400 block font-semibold">
                -7.2 kg from start
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Workout, Nutrition, Next Session */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Workout Card */}
        <Card glowOnHover className="p-5 flex flex-col justify-between border-primary/30">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Today&apos;s Workout
                  </h3>
                  <p className="text-[10px] text-text-muted">Assigned Routine</p>
                </div>
              </div>
              <Badge variant="primary">Day 1 of 4</Badge>
            </div>

            <div className="mt-4">
              <h4 className="text-base font-bold text-text-primary">
                Posterior Chain & Deadlift Max Test
              </h4>
              <p className="text-xs text-text-muted mt-1">
                Focus: Hamstrings, Glutes & Upper Back Stabilizers
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#151B22] border border-border/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-text-primary block">1. Trap Bar Deadlift</span>
                    <span className="text-[10px] text-text-muted">4 sets &times; 6-8 reps &bull; 120s rest</span>
                  </div>
                  <span className="text-primary font-bold text-[11px]">Primary Lift</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#151B22] border border-border/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-text-primary block">2. Romanian Dumbbell Deadlift</span>
                    <span className="text-[10px] text-text-muted">3 sets &times; 10-12 reps &bull; 90s rest</span>
                  </div>
                  <span className="text-text-muted font-bold text-[11px]">Hypertrophy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-text-muted">5 exercises total</span>
            <Button variant="primary" size="sm" asChild>
              <Link href="/portal/workouts">
                Open Workout Player &rarr;
              </Link>
            </Button>
          </div>
        </Card>

        {/* Daily Nutrition & Macro Target Card */}
        <Card glowOnHover className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Daily Nutrition
                  </h3>
                  <p className="text-[10px] text-text-muted">Coach Target</p>
                </div>
              </div>
              <span className="text-xs font-mono font-black text-primary">
                2,200 kcal
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {/* Macro Bars */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted font-medium">Protein (Target 180g)</span>
                  <span className="font-bold text-primary">145g / 180g (80%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#151B22] overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted font-medium">Carbohydrates (Target 200g)</span>
                  <span className="font-bold text-sky-400">160g / 200g (80%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#151B22] overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: "80%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted font-medium">Healthy Fats (Target 60g)</span>
                  <span className="font-bold text-amber-400">45g / 60g (75%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#151B22] overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: "75%" }} />
                </div>
              </div>

              {/* Water Intake Tracker */}
              <div className="p-3 rounded-xl bg-[#151B22] border border-border flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-sky-400" />
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      Water Intake
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {waterGlasses * 250} ml / 3500 ml target
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                    className="h-6 w-6 rounded-md bg-[#25303D] text-xs font-bold text-text-primary"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold text-text-primary px-1">
                    {waterGlasses}
                  </span>
                  <button
                    onClick={() => setWaterGlasses((prev) => prev + 1)}
                    className="h-6 w-6 rounded-md bg-primary text-xs font-bold text-primary-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-text-muted">Trainer controlled</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/portal/nutrition">Meal Plan &rarr;</Link>
            </Button>
          </div>
        </Card>

        {/* 1-on-1 Session & Coach Notes */}
        <Card glowOnHover className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Next Coaching Session
                  </h3>
                  <p className="text-[10px] text-text-muted">With Coach Alex</p>
                </div>
              </div>
              <Badge variant="scheduled">Confirmed</Badge>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#151B22] border border-border">
              <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Today &bull; 06:30 AM - 07:30 AM</span>
              </div>
              <h4 className="text-sm font-bold text-text-primary">
                Posterior Chain & Deadlift Max Test
              </h4>
              <p className="text-xs text-text-muted mt-1">
                Apex Performance Lab &bull; Studio 1
              </p>
            </div>

            {/* Coach Observation Box */}
            <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
                Coach Alex&apos;s Instructions:
              </span>
              <p className="text-xs text-text-primary leading-relaxed">
                &ldquo;High discipline on eccentric tempo today. Ensure knee sleeve is worn for left knee precaution.&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-text-muted">Need to reschedule?</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/portal/schedule">View Schedule</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Membership & Milestones Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Membership Status */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Membership Subscription
              </h3>
              <p className="text-xs text-text-muted">{member.membership_plan_name}</p>
            </div>
            <Badge variant="active" dot>Active</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-[#151B22] border border-border">
              <span className="text-[10px] text-text-muted block">Enrolled Date</span>
              <span className="font-mono font-bold text-text-primary">
                {formatDate(member.membership_start_date)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#151B22] border border-border">
              <span className="text-[10px] text-text-muted block">Valid Until</span>
              <span className="font-mono font-bold text-text-primary">
                {formatDate(member.membership_end_date)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#151B22] border border-border">
              <span className="text-[10px] text-text-muted block">Attendance</span>
              <span className="font-mono font-bold text-emerald-400">
                {member.attendance_rate || 92}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#151B22] border border-border">
              <span className="text-[10px] text-text-muted block">Dues Status</span>
              <span className="font-mono font-bold text-primary">All Clear (₹0)</span>
            </div>
          </div>
        </Card>

        {/* Milestone Trophy */}
        <Card className="p-5 flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-lime-glow-sm">
            <Trophy className="h-8 w-8 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Recent Personal Record
            </span>
            <h4 className="text-base font-black text-text-primary">
              160kg Trap Bar Deadlift
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              Achieved in last week&apos;s strength assessment. Verified by Coach Alex.
            </p>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}

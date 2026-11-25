"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fitcoreTrainer } from "@/lib/mock-data";
import { useMemberPortal } from "@/components/member/member-portal-provider";
import { WEEK_DAYS, formatDate, getTodayDayOfWeek, getTodayISODate } from "@/lib/utils";
import {
  Flame,
  Dumbbell,
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  CreditCard,
  Droplets,
  Trophy,
  Sparkles,
  ArrowRight,
  FileText,
  Lock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import Link from "next/link";

export default function MemberDashboardPage() {
  const { member, workouts, diet, sessions, progress, todayStatus, logWorkoutComplete } =
    useMemberPortal();

  // Members are restricted to the current date only.
  const selectedDay = getTodayDayOfWeek();
  const workoutCompleted = todayStatus === "present";

  const statusVariant: "active" | "expiring" | "expired" =
    member.membership_status === "active"
      ? "active"
      : member.membership_status === "expiring"
      ? "expiring"
      : "expired";

  const todaySession = sessions.find(
    (s) => s.member_id === member.id && s.date === getTodayISODate()
  );

  // State for hydration
  const [waterGlasses, setWaterGlasses] = React.useState(7);

  // Rest timer
  const [restTimer, setRestTimer] = React.useState<number | null>(null);

  React.useEffect(() => {
    let interval: any;
    if (restTimer && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => (prev ? prev - 1 : null));
      }, 1000);
    } else if (restTimer === 0) {
      toast.success("Rest timer finished! Time for your next set.");
      setRestTimer(null);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const currentWorkout =
    workouts.find((w) => w.day === selectedDay) || workouts[0];
  const currentDiet =
    diet.find((d) => d.day === selectedDay) || diet[0];

  const handleFinishTodayWorkout = async () => {
    try {
      await logWorkoutComplete();
      toast.success(`Outstanding effort, ${member.full_name.split(" ")[0]}! ${selectedDay}'s workout logged in FITCORE.`);
    } catch (err: any) {
      toast.error(err?.message || "Could not log your workout.");
    }
  };

  const weightData = progress.map((p) => ({ date: p.date, weight: p.weight_kg }));

  const weightChange =
    progress.length > 1
      ? `${(
          progress[progress.length - 1].weight_kg - progress[0].weight_kg
        ).toFixed(1)} kg total`
      : null;

  return (
    <MemberShell>
      {/* 1. WELCOME SECTION */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-[#151B22] via-[#1C242D] to-[#151B22] p-5 sm:p-7 shadow-glass-elevated">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-5 items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2 text-[10px] font-bold text-primary uppercase">
                  <Flame className="h-3 w-3" /> Athlete Portal
                </span>
                <Badge variant={statusVariant} dot>
                  {member.membership_status}
                </Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
                Hello, {member.full_name.split(" ")[0]}!
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                Goal: <strong className="text-primary">{member.fitness_goal}</strong> &bull; Coach {fitcoreTrainer.name}
              </p>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="p-3.5 rounded-2xl bg-[#10151B]/80 border border-border/80 max-w-xs text-xs">
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider flex items-center gap-1 mb-1">
              <Sparkles className="h-3 w-3" /> Daily Coach Motivation:
            </span>
            <p className="text-text-muted italic leading-snug">
              &ldquo;Discipline is choosing between what you want now and what you want most. Focus on the tempo today.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 2. TODAY-ONLY STRIP (OTHER DAYS LOCKED) */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Today&apos;s Plan &bull; {formatDate(new Date())}
          </span>
          <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
            <Lock className="h-3 w-3" /> Members can view the current date only
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {WEEK_DAYS.map((day) => {
            const isToday = selectedDay === day;
            const dayWorkout = workouts.find((w) => w.day === day);

            return (
              <div
                key={day}
                aria-disabled={!isToday}
                title={isToday ? "Today" : "Locked — today only"}
                className={`p-3 rounded-2xl border text-left select-none ${
                  isToday
                    ? "bg-[#1C242D] border-primary shadow-lime-glow-sm text-text-primary"
                    : "bg-[#151B22] border-border/60 text-text-muted opacity-45 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{day}</span>
                  {isToday ? (
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <Lock className="h-3 w-3 text-text-dim" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-text-primary truncate">
                  {isToday ? dayWorkout?.workout_name || "Custom Split" : "Locked"}
                </p>
                <span className="text-[9px] text-text-dim block mt-0.5">
                  {isToday ? (dayWorkout?.is_rest_day ? "Rest Day" : "Training Note") : "Unavailable today"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TODAY'S WORKOUT SECTION (NOTE-BASED ARCHITECTURE) */}
      <Card glowOnHover className="p-6 mb-6 border-primary/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {selectedDay}&apos;s Workout Routine
                </span>
                {currentWorkout.is_rest_day && <Badge variant="neutral">Rest Day</Badge>}
                {workoutCompleted && <Badge variant="completed">Completed Today</Badge>}
              </div>
              <h2 className="text-lg font-black text-text-primary">
                {currentWorkout.workout_name}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Focus: {currentWorkout.focus} &bull; Prepared by Coach Alex Vance
              </p>
            </div>
          </div>

          {/* Rest Timer Widget */}
          <div className="flex items-center gap-2">
            {restTimer !== null ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/20 border border-primary text-primary animate-pulse text-xs font-mono font-bold">
                <Clock className="h-3.5 w-3.5" />
                <span>Rest: {restTimer}s</span>
                <button onClick={() => setRestTimer(null)} className="ml-1 text-text-muted">&times;</button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRestTimer(90)}
                className="text-xs flex items-center gap-1.5"
              >
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Start 90s Rest</span>
              </Button>
            )}
          </div>
        </div>

        {/* Workout Instructions & Note Box */}
        <div className="p-5 rounded-2xl bg-[#10151B] border border-border/80 mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
            <FileText className="h-4 w-4" />
            <span>Coach Alex&apos;s Routine & Exercise Notes:</span>
          </div>

          <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed">
            {currentWorkout.workout_note || "No specific workout note assigned for this day."}
          </pre>
        </div>

        {!currentWorkout.is_rest_day && (
          <div className="flex justify-between items-center pt-2 border-t border-border/50">
            <span className="text-xs text-text-muted">
              {workoutCompleted ? "Workout logged for today ✓" : "Follow the notes above and log when finished"}
            </span>

            <Button
              variant={workoutCompleted ? "secondary" : "primary"}
              size="default"
              onClick={handleFinishTodayWorkout}
              disabled={workoutCompleted}
              className="font-bold shadow-lime-glow"
            >
              <CheckCircle2 className="h-4 w-4 mr-2 stroke-[2.5]" />
              {workoutCompleted ? "Completed Today ✓" : "Complete Today's Workout"}
            </Button>
          </div>
        )}
      </Card>

      {/* 4. TODAY'S DIET SECTION (NOTE-BASED ARCHITECTURE) */}
      <Card glowOnHover className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {selectedDay}&apos;s Nutrition Guidance
              </span>
              <h2 className="text-lg font-black text-text-primary">
                {currentDiet.diet_title || "Daily Nutrition Plan"}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Caloric target: ~{currentDiet.daily_calories_target || 2200} kcal &bull; Coach Alex
              </p>
            </div>
          </div>

          {/* Hydration Tracker */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#151B22] border border-border text-xs">
            <Droplets className="h-4 w-4 text-sky-400" />
            <span className="text-text-muted">Water:</span>
            <span className="font-mono font-bold text-sky-400">{waterGlasses * 250} ml</span>
            <button
              onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
              className="h-5 w-5 rounded bg-[#25303D] font-bold"
            >
              -
            </button>
            <button
              onClick={() => setWaterGlasses((prev) => prev + 1)}
              className="h-5 w-5 rounded bg-primary text-black font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Diet Instructions & Note Box */}
        <div className="p-5 rounded-2xl bg-[#10151B] border border-border/80">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-3">
            <UtensilsCrossed className="h-4 w-4" />
            <span>Meals & Nutrition Notes ({selectedDay}):</span>
          </div>

          <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap leading-relaxed">
            {currentDiet.diet_note || "No specific diet note assigned for this day."}
          </pre>
        </div>
      </Card>

      {/* 5. MY PROGRESS & 6. MY MEMBERSHIP & 7. SCHEDULE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Progress Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-text-primary">My Weight Trajectory</h3>
              </div>
              {weightChange && (
                <span className="text-xs font-mono font-bold text-emerald-400">{weightChange}</span>
              )}
            </div>

            {weightData.length > 1 ? (
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid stroke="#242D37" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis domain={["dataMin - 3", "dataMax + 3"]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="p-2 rounded-lg bg-[#151B22] border border-border text-xs">
                              <span className="text-text-muted">{label}:</span>{" "}
                              <strong className="text-primary">{payload[0].value} kg</strong>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#B8FF3B"
                      strokeWidth={2.5}
                      dot={{ fill: "#B8FF3B", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-52 w-full flex flex-col items-center justify-center text-center gap-1">
                <TrendingUp className="h-7 w-7 text-text-dim" />
                <p className="text-xs font-semibold text-text-primary">No weigh-ins logged yet</p>
                <p className="text-[11px] text-text-muted">Your trainer will log your body-weight progress here.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-text-muted">Target: {member.target_weight_kg} kg</span>
            <Link href="/member/progress" className="text-primary font-bold hover:underline">
              View Personal Records &rarr;
            </Link>
          </div>
        </Card>

        {/* Membership & Schedule Card */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-primary">Subscription</span>
                <h3 className="text-sm font-bold text-text-primary">{member.membership_plan_name}</h3>
              </div>
              <Badge variant={statusVariant} dot>{member.membership_status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="p-2.5 rounded-xl bg-[#151B22] border border-border">
                <span className="text-[10px] text-text-muted block">Valid Till</span>
                <span className="font-mono font-bold text-text-primary">{formatDate(member.membership_end_date)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#151B22] border border-border">
                <span className="text-[10px] text-text-muted block">Fee Status</span>
                <span className="font-mono font-bold text-emerald-400">Paid in Full</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-border/50">
              <span className="text-text-muted">Need renewal assistance?</span>
              <Link href="/member/membership" className="text-primary font-bold hover:underline">
                View Receipt &rarr;
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Next 1-on-1 Session</h3>
                  <p className="text-[10px] text-text-muted">Coach Alex Vance</p>
                </div>
              </div>
              <Badge variant="scheduled">Today</Badge>
            </div>

            <div className="p-3 rounded-xl bg-[#151B22] border border-border text-xs mb-2">
              {todaySession ? (
                <>
                  <p className="font-mono font-bold text-primary">
                    {todaySession.start_time} - {todaySession.end_time}
                  </p>
                  <p className="font-semibold text-text-primary mt-0.5">{todaySession.title}</p>
                </>
              ) : (
                <p className="text-text-muted">No 1-on-1 session booked for today.</p>
              )}
            </div>

            <div className="text-right">
              <Link href="/member/schedule" className="text-xs text-primary font-bold hover:underline">
                View Full Calendar &rarr;
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </MemberShell>
  );
}

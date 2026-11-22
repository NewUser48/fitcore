"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  sampleWeeklyWorkouts,
  sampleWeeklyDiet,
  fitcoreMembers,
  fitcoreTrainer,
  sampleSessions,
} from "@/lib/mock-data";
import { DayOfWeek, ExerciseItem } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  Flame,
  Dumbbell,
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  PlayCircle,
  TrendingUp,
  Scale,
  Calendar,
  CreditCard,
  Droplets,
  Trophy,
  Sparkles,
  ArrowRight,
  Download,
  AlertCircle,
  ExternalLink,
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

const DAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MemberDashboardPage() {
  const member = fitcoreMembers[0]; // Rohan Malhotra

  // Day-by-Day calendar selection (defaults to Monday / current day)
  const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>("Monday");

  // State for exercise completion
  const [completedExercises, setCompletedExercises] = React.useState<Record<string, boolean>>({
    m_1: true,
  });

  // State for meal completion
  const [completedMeals, setCompletedMeals] = React.useState<Record<string, boolean>>({
    d_m_1: true,
  });

  // State for hydration
  const [waterGlasses, setWaterGlasses] = React.useState(7);

  // Video modal
  const [activeVideo, setActiveVideo] = React.useState<{ title: string; url: string } | null>(null);

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
    sampleWeeklyWorkouts.find((w) => w.day === selectedDay) || sampleWeeklyWorkouts[0];
  const currentDiet =
    sampleWeeklyDiet.find((d) => d.day === selectedDay) || sampleWeeklyDiet[0];

  const handleToggleExercise = (id: string, name: string) => {
    setCompletedExercises((prev) => {
      const next = !prev[id];
      if (next) toast.success(`Completed: ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const handleToggleMeal = (id: string, name: string) => {
    setCompletedMeals((prev) => {
      const next = !prev[id];
      if (next) toast.success(`Tracked: ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const handleFinishTodayWorkout = () => {
    toast.success(`Outstanding effort, ${member.full_name.split(" ")[0]}! Today's session logged in FITCORE.`);
  };

  const weightData = [
    { date: "Jun", weight: 89.5 },
    { date: "Jul", weight: 87.8 },
    { date: "Aug", weight: 86.0 },
    { date: "Sep", weight: 84.5 },
    { date: "Oct", weight: 83.2 },
    { date: "Nov", weight: 82.3 },
  ];

  return (
    <MemberShell>
      {/* 1. WELCOME SECTION */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-[#151B22] via-[#1C242D] to-[#151B22] p-5 sm:p-7 shadow-glass-elevated">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={member.avatar_url || ""}
                alt={member.full_name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-primary shadow-lime-glow-sm"
              />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-[#151B22]" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-5 items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2 text-[10px] font-bold text-primary uppercase">
                  <Flame className="h-3 w-3" /> Athlete Portal
                </span>
                <Badge variant="active" dot>
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

      {/* 2. DAY-BY-DAY 7-DAY NAVIGATION STRIP */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Weekly Workout & Nutrition Schedule
          </span>
          <span className="text-[11px] text-primary font-semibold">
            Day: {selectedDay}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            const dayWorkout = sampleWeeklyWorkouts.find((w) => w.day === day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-[#1C242D] border-primary shadow-lime-glow-sm text-text-primary"
                    : "bg-[#151B22] border-border/80 text-text-muted hover:border-primary/40 hover:text-text-primary"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{day}</span>
                  {dayWorkout?.is_rest_day ? (
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-text-primary truncate">
                  {dayWorkout?.workout_name || "Custom"}
                </p>
                <span className="text-[9px] text-text-dim block mt-0.5">
                  {dayWorkout?.is_rest_day ? "Rest Day" : `${dayWorkout?.exercises.length || 0} moves`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TODAY'S WORKOUT SECTION */}
      <Card glowOnHover className="p-6 mb-6 border-primary/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {selectedDay}&apos;s Routine
                </span>
                {currentWorkout.is_rest_day && <Badge variant="neutral">Rest Day</Badge>}
              </div>
              <h2 className="text-lg font-black text-text-primary">
                {currentWorkout.workout_name}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Focus: {currentWorkout.focus} &bull; ~{currentWorkout.estimated_duration_min} mins
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

        {/* Workout Exercises */}
        {currentWorkout.is_rest_day ? (
          <div className="py-8 text-center text-xs text-text-muted">
            <p className="font-bold text-text-primary text-sm mb-1">Rest & Muscle Recovery Day</p>
            <p>Hydrate well, eat according to your rest-day targets, and sleep 8 hours.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {currentWorkout.exercises.map((ex, index) => {
              const isDone = !!completedExercises[ex.id];

              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    isDone
                      ? "bg-[#141C18] border-emerald-500/40"
                      : "bg-[#151B22] border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleExercise(ex.id, ex.name)}
                        className={`mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-emerald-500 border-emerald-400 text-black shadow-md"
                            : "border-border bg-[#1C242D] text-text-muted hover:border-primary"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              isDone ? "text-emerald-300 line-through" : "text-text-primary"
                            }`}
                          >
                            {index + 1}. {ex.name}
                          </h4>
                          <span className="text-[10px] text-text-dim font-mono">
                            {ex.target_muscle}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">
                          <strong>Form cue:</strong> {ex.instructions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="p-1.5 rounded-lg bg-[#1C242D] border border-border font-bold text-text-primary">
                          {ex.sets} sets
                        </span>
                        <span className="p-1.5 rounded-lg bg-[#1C242D] border border-border font-bold text-text-primary">
                          {ex.reps} reps
                        </span>
                        <span className="p-1.5 rounded-lg bg-[#1C242D] border border-border font-bold text-primary">
                          {ex.weight_target}
                        </span>
                      </div>

                      {ex.video_url && (
                        <button
                          onClick={() => setActiveVideo({ title: ex.name, url: ex.video_url! })}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          title="Watch demonstration video"
                        >
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!currentWorkout.is_rest_day && (
          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="default"
              onClick={handleFinishTodayWorkout}
              className="font-bold shadow-lime-glow"
            >
              <CheckCircle2 className="h-4 w-4 mr-2 stroke-[2.5]" />
              Complete Today&apos;s Workout
            </Button>
          </div>
        )}
      </Card>

      {/* 4. TODAY'S DIET SECTION */}
      <Card glowOnHover className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {selectedDay}&apos;s Nutrition Plan
              </span>
              <h2 className="text-lg font-black text-text-primary">
                Daily Macro Targets & Meals
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Target: {currentDiet.daily_calories_target} kcal &bull; {currentDiet.protein_target_g}g Protein
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

        {/* Macro Bars */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-[#151B22] border border-border text-center">
            <span className="text-[10px] text-text-muted block">Protein</span>
            <span className="text-base font-black text-primary font-mono">{currentDiet.protein_target_g}g</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#151B22] border border-border text-center">
            <span className="text-[10px] text-text-muted block">Carbohydrates</span>
            <span className="text-base font-black text-sky-400 font-mono">{currentDiet.carbs_target_g}g</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#151B22] border border-border text-center">
            <span className="text-[10px] text-text-muted block">Healthy Fats</span>
            <span className="text-base font-black text-amber-400 font-mono">{currentDiet.fats_target_g}g</span>
          </div>
        </div>

        {/* Meals Timeline */}
        <div className="space-y-3">
          {currentDiet.meals.map((meal) => {
            const isDone = !!completedMeals[meal.id];

            return (
              <div
                key={meal.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isDone
                    ? "bg-[#141C18] border-emerald-500/40"
                    : "bg-[#151B22] border-border"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/50 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleMeal(meal.id, meal.meal_type)}
                      className={`h-5 w-5 rounded border flex items-center justify-center ${
                        isDone ? "bg-emerald-500 border-emerald-400 text-black" : "border-border bg-[#10151B]"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-text-primary">{meal.meal_type}</span>
                    <span className="text-[10px] text-text-dim font-mono">({meal.timing})</span>
                  </div>

                  <span className="text-xs font-mono font-bold text-primary">{meal.calories} kcal</span>
                </div>

                <p className="text-xs text-text-muted pl-7">{meal.foods}</p>
              </div>
            );
          })}
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
              <span className="text-xs font-mono font-bold text-emerald-400">-7.2 kg total loss</span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#242D37" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis domain={[75, 95]} stroke="#94A3B8" fontSize={10} tickLine={false} />
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
          {/* Membership Card */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-primary">Subscription</span>
                <h3 className="text-sm font-bold text-text-primary">{member.membership_plan_name}</h3>
              </div>
              <Badge variant="active" dot>Active</Badge>
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

          {/* Next Coaching Session */}
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
              <p className="font-mono font-bold text-primary">06:30 AM - 07:30 AM</p>
              <p className="font-semibold text-text-primary mt-0.5">Posterior Chain & Deadlift Max Test</p>
            </div>

            <div className="text-right">
              <Link href="/member/schedule" className="text-xs text-primary font-bold hover:underline">
                View Full Calendar &rarr;
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Video Demonstration Modal */}
      <Modal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        title={activeVideo?.title || "Exercise Demonstration"}
        description="High-definition form guide and biomechanical execution cues."
      >
        <div className="aspect-video w-full rounded-2xl bg-black border border-border overflow-hidden flex items-center justify-center">
          <div className="text-center p-6">
            <PlayCircle className="h-12 w-12 text-primary mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-bold text-text-primary">
              Demo Video: {activeVideo?.title}
            </p>
            <p className="text-xs text-text-muted mt-1">
              (Video stream linked to Coach Alex&apos;s exercise library)
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => setActiveVideo(null)}>
            Close Video
          </Button>
        </div>
      </Modal>
    </MemberShell>
  );
}

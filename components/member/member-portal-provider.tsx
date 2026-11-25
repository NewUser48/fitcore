"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { mapMemberRow, type MemberRow } from "@/lib/supabase/mappers";
import {
  fitcoreMembers,
  sampleWeeklyWorkouts,
  sampleWeeklyDiet,
  sampleSessions,
  samplePayments,
} from "@/lib/mock-data";
import { WEEK_DAYS, getTodayISODate } from "@/lib/utils";
import type {
  MemberProfile,
  DayWorkoutPlan,
  DayDietPlan,
  DayOfWeek,
  TrainingSession,
  PaymentRecord,
} from "@/types";

export interface ProgressPoint {
  id: string;
  date: string;
  weight_kg: number;
  body_fat_pct?: number | null;
}

export interface MemberProfilePatch {
  phone?: string;
  target_weight_kg?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface WeighInInput {
  weight_kg: number;
  body_fat_pct?: number | null;
}

export type AttendanceStatus = "present" | "absent" | "rest_day";

interface MemberPortalContextValue {
  member: MemberProfile;
  workouts: DayWorkoutPlan[];
  diet: DayDietPlan[];
  sessions: TrainingSession[];
  payments: PaymentRecord[];
  progress: ProgressPoint[];
  todayStatus: AttendanceStatus | null;
  isLoading: boolean;
  saveMemberProfile: (patch: MemberProfilePatch) => Promise<void>;
  saveWeighIn: (input: WeighInInput) => Promise<void>;
  logWorkoutComplete: () => Promise<void>;
  logRestDay: () => Promise<void>;
  reload: () => Promise<void>;
}

const DEMO_MEMBER = fitcoreMembers[0];

const DEMO_PROGRESS: ProgressPoint[] = [
  { id: "p1", date: "Jun 15", weight_kg: 89.5 },
  { id: "p2", date: "Jul 15", weight_kg: 87.8 },
  { id: "p3", date: "Aug 15", weight_kg: 86.0 },
  { id: "p4", date: "Sep 15", weight_kg: 84.5 },
  { id: "p5", date: "Oct 15", weight_kg: 83.2 },
  { id: "p6", date: "Nov 22", weight_kg: 82.3 },
];

const MemberPortalContext =
  React.createContext<MemberPortalContextValue | null>(null);

function memberFromUser(user: any): MemberProfile {
  const meta = user?.user_metadata ?? {};
  const rawPhone: string = user?.phone || meta.phone || "";
  const phone = rawPhone
    ? rawPhone.startsWith("+")
      ? rawPhone
      : `+${rawPhone.replace(/^\+/, "")}`
    : "";

  return {
    id: user?.id ?? "",
    trainer_id: "",
    role: "member",
    full_name:
      meta.full_name || meta.name || user?.email?.split("@")[0] || "Athlete",
    phone,
    email: user?.email || meta.email || undefined,
    height_cm: 0,
    starting_weight_kg: 0,
    current_weight_kg: 0,
    fitness_goal: "General Fitness",
    experience_level: "intermediate",
    joining_date: (user?.created_at || "").slice(0, 10),
    membership_plan_name: meta.membership_plan || "Member Plan",
    membership_start_date: "",
    membership_end_date: "",
    payment_status: "paid",
    membership_status: "active",
    pending_dues: 0,
    created_at: user?.created_at || new Date().toISOString(),
  };
}

function mergeWorkouts(rows: any[]): DayWorkoutPlan[] {
  return WEEK_DAYS.map((day) => {
    const row = rows.find((r) => r.day === day);
    if (!row) {
      return {
        day,
        workout_name: "No Routine Assigned",
        is_rest_day: true,
        workout_note: "Your trainer has not assigned a routine for this day yet.",
      };
    }
    return {
      day,
      workout_name: row.workout_name || "Training Split",
      is_rest_day: Boolean(row.is_rest_day),
      estimated_duration_min: row.estimated_duration_min ?? undefined,
      focus: row.focus ?? undefined,
      workout_note: row.workout_note || "",
    };
  });
}

function mergeDiet(rows: any[]): DayDietPlan[] {
  return WEEK_DAYS.map((day) => {
    const row = rows.find((r) => r.day === day);
    if (!row) {
      return {
        day,
        diet_title: "No Diet Plan Assigned",
        diet_note: "Your trainer has not assigned a nutrition plan for this day yet.",
      };
    }
    return {
      day,
      diet_title: row.diet_title || "Daily Nutrition Plan",
      daily_calories_target: row.daily_calories_target ?? undefined,
      protein_target_g: row.protein_target_g ?? undefined,
      carbs_target_g: row.carbs_target_g ?? undefined,
      fats_target_g: row.fats_target_g ?? undefined,
      water_target_liters: row.water_target_liters ?? undefined,
      diet_note: row.diet_note || "",
    };
  });
}

function mapSessions(rows: any[], member: MemberProfile): TrainingSession[] {
  return rows.map((row) => ({
    id: row.id,
    member_id: row.member_id,
    member_name: member.full_name,
    member_avatar: member.avatar_url,
    title: row.focus_area || row.notes || "Training Session",
    focus_area: row.focus_area || undefined,
    date: row.session_date,
    start_time: row.start_time,
    end_time: row.end_time,
    status:
      row.status === "Completed"
        ? "completed"
        : row.status === "Cancelled"
        ? "cancelled"
        : "scheduled",
    notes: row.notes || undefined,
  }));
}

const PAYMENT_METHODS: PaymentRecord["payment_method"][] = [
  "UPI",
  "Cash",
  "Bank Transfer",
  "Card",
];

function mapPayments(rows: any[], member: MemberProfile): PaymentRecord[] {
  return rows.map((row) => {
    const method = PAYMENT_METHODS.includes(row.payment_method)
      ? row.payment_method
      : "UPI";
    const status =
      row.status === "Paid"
        ? "paid"
        : row.status === "Overdue"
        ? "overdue"
        : row.status === "Pending"
        ? "pending"
        : "paid";

    return {
      id: row.id,
      member_id: row.member_id,
      member_name: member.full_name,
      amount: Number(row.amount ?? 0),
      paid_amount: status === "paid" ? Number(row.amount ?? 0) : 0,
      currency: "INR",
      status,
      payment_method: method,
      invoice_number: row.invoice_no || "",
      payment_date: row.payment_date || "",
      due_date: row.due_date || undefined,
      notes: row.plan_name || undefined,
    };
  });
}

function shortDayLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function MemberPortalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [member, setMember] = React.useState<MemberProfile>(DEMO_MEMBER);
  const [workouts, setWorkouts] =
    React.useState<DayWorkoutPlan[]>(sampleWeeklyWorkouts);
  const [diet, setDiet] = React.useState<DayDietPlan[]>(sampleWeeklyDiet);
  const [sessions, setSessions] = React.useState<TrainingSession[]>(sampleSessions);
  const [payments, setPayments] = React.useState<PaymentRecord[]>(samplePayments);
  const [progress, setProgress] = React.useState<ProgressPoint[]>(DEMO_PROGRESS);
  const [todayStatus, setTodayStatus] = React.useState<AttendanceStatus | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadDemo = React.useCallback(() => {
    setMember(DEMO_MEMBER);
    setWorkouts(sampleWeeklyWorkouts);
    setDiet(sampleWeeklyDiet);
    setSessions(sampleSessions);
    setPayments(samplePayments);
    setProgress(DEMO_PROGRESS);
    setTodayStatus(null);
  }, []);

  const reload = React.useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      loadDemo();
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        loadDemo();
        setIsLoading(false);
        return;
      }

      const { data: row } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      let nextMember: MemberProfile;
      if (row) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .maybeSingle();
        nextMember = mapMemberRow(row as MemberRow, profile?.avatar_url);
      } else {
        nextMember = memberFromUser(user);
      }

      const today = getTodayISODate();

      const [workoutRes, dietRes, sessionRes, paymentRes, progressRes, attendanceRes] =
        await Promise.all([
          supabase.from("workout_plans").select("*").eq("member_id", user.id),
          supabase.from("diet_plans").select("*").eq("member_id", user.id),
          supabase
            .from("training_sessions")
            .select("*")
            .eq("member_id", user.id)
            .order("session_date", { ascending: true }),
          supabase
            .from("payments")
            .select("*")
            .eq("member_id", user.id)
            .order("payment_date", { ascending: false }),
          supabase
            .from("progress_records")
            .select("*")
            .eq("member_id", user.id)
            .order("recorded_date", { ascending: true }),
          supabase
            .from("attendance")
            .select("status")
            .eq("member_id", user.id)
            .eq("date", today)
            .maybeSingle(),
        ]);

      setMember(nextMember);
      setWorkouts(mergeWorkouts(workoutRes.data ?? []));
      setDiet(mergeDiet(dietRes.data ?? []));
      setSessions(mapSessions(sessionRes.data ?? [], nextMember));
      setPayments(mapPayments(paymentRes.data ?? [], nextMember));
      setProgress(
        (progressRes.data ?? []).map((r: any) => ({
          id: r.id,
          date: shortDayLabel(r.recorded_date),
          weight_kg: Number(r.weight_kg ?? 0),
          body_fat_pct: r.body_fat_pct != null ? Number(r.body_fat_pct) : null,
        }))
      );
      setTodayStatus(
        (attendanceRes.data?.status as AttendanceStatus | undefined) ?? null
      );
    } catch (err) {
      console.error("Failed to load member portal data:", err);
      loadDemo();
    } finally {
      setIsLoading(false);
    }
  }, [loadDemo]);

  React.useEffect(() => {
    reload();
  }, [reload]);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      // Defer so we don't call other Supabase methods inside the auth callback.
      setTimeout(() => {
        reload();
      }, 0);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [reload]);

  const saveMemberProfile = React.useCallback(
    async (patch: MemberProfilePatch) => {
      const supabase = createClient();
      const emergencyContact =
        patch.emergency_contact_name !== undefined ||
        patch.emergency_contact_phone !== undefined
          ? `${patch.emergency_contact_name ?? ""} (${
              patch.emergency_contact_phone ?? ""
            })`
          : undefined;

      setMember((prev) => ({
        ...prev,
        phone: patch.phone ?? prev.phone,
        target_weight_kg:
          patch.target_weight_kg ?? prev.target_weight_kg,
        emergency_contact_name:
          patch.emergency_contact_name ?? prev.emergency_contact_name,
        emergency_contact_phone:
          patch.emergency_contact_phone ?? prev.emergency_contact_phone,
      }));

      if (!supabase || !member.id) return;

      const dbPatch: Record<string, any> = {};
      if (patch.phone !== undefined) dbPatch.phone = patch.phone;
      if (patch.target_weight_kg !== undefined)
        dbPatch.target_weight_kg = patch.target_weight_kg;
      if (emergencyContact !== undefined)
        dbPatch.emergency_contact = emergencyContact;

      if (Object.keys(dbPatch).length === 0) return;

      const { error } = await supabase
        .from("members")
        .update(dbPatch)
        .eq("id", member.id);

      if (error) {
        console.error("Failed to save member profile:", error.message);
        throw error;
      }
    },
    [member.id]
  );

  const saveWeighIn = React.useCallback(
    async (input: WeighInInput) => {
      const weight = Number(input.weight_kg);
      if (!Number.isFinite(weight) || weight <= 0) {
        throw new Error("Please enter a valid weight in kilograms.");
      }

      const supabase = createClient();
      const today = getTodayISODate();
      const bodyFat =
        input.body_fat_pct == null ? null : Number(input.body_fat_pct);

      // Update the roster weight so dashboards/trends agree with the new weigh-in.
      setMember((prev) => ({ ...prev, current_weight_kg: weight }));
      setProgress((prev) => [
        ...prev,
        {
          id: `local_${Date.now()}`,
          date: shortDayLabel(today),
          weight_kg: weight,
          body_fat_pct: bodyFat,
        },
      ]);

      if (!supabase || !member.id) return;

      const { error } = await supabase.from("progress_records").insert({
        member_id: member.id,
        recorded_date: today,
        weight_kg: weight,
        body_fat_pct: bodyFat,
      });

      if (error) {
        await reload();
        throw new Error(error.message);
      }

      // Keep the members row in sync for dashboards that read current weight.
      await supabase
        .from("members")
        .update({ weight_kg: weight })
        .eq("id", member.id);

      await reload();
    },
    [member.id, reload]
  );

  const markAttendance = React.useCallback(
    async (status: AttendanceStatus) => {
      const supabase = createClient();
      const today = getTodayISODate();

      setTodayStatus(status);

      if (!supabase || !member.id) return;

      const { error } = await supabase.from("attendance").insert({
        member_id: member.id,
        date: today,
        status,
        check_in_time:
          status === "present" ? new Date().toTimeString().slice(0, 8) : null,
      });

      // A duplicate check-in means today is already logged — treat as success.
      if (error && !error.message.toLowerCase().includes("duplicate")) {
        setTodayStatus(null);
        throw new Error(error.message);
      }
    },
    [member.id]
  );

  const logWorkoutComplete = React.useCallback(
    () => markAttendance("present"),
    [markAttendance]
  );

  const logRestDay = React.useCallback(
    () => markAttendance("rest_day"),
    [markAttendance]
  );

  const value = React.useMemo(
    () => ({
      member,
      workouts,
      diet,
      sessions,
      payments,
      progress,
      todayStatus,
      isLoading,
      saveMemberProfile,
      saveWeighIn,
      logWorkoutComplete,
      logRestDay,
      reload,
    }),
    [
      member,
      workouts,
      diet,
      sessions,
      payments,
      progress,
      todayStatus,
      isLoading,
      saveMemberProfile,
      saveWeighIn,
      logWorkoutComplete,
      logRestDay,
      reload,
    ]
  );

  return (
    <MemberPortalContext.Provider value={value}>
      {children}
    </MemberPortalContext.Provider>
  );
}

export function useMemberPortal(): MemberPortalContextValue {
  const ctx = React.useContext(MemberPortalContext);
  if (!ctx) {
    throw new Error("useMemberPortal must be used within a MemberPortalProvider");
  }
  return ctx;
}

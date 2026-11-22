// Domain types for the Gym Trainer Management System

export type MembershipStatus = "active" | "expiring" | "expired" | "inactive" | "pending";

export type FitnessGoal =
  | "Hypertrophy / Muscle Building"
  | "Fat Loss & Conditioning"
  | "Strength & Powerlifting"
  | "Athletic Performance"
  | "Rehabilitation & Mobility"
  | "General Fitness";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface Member {
  id: string;
  trainer_id: string;
  full_name: string;
  avatar_url?: string | null;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: Gender;
  height_cm: number;
  starting_weight_kg: number;
  current_weight_kg: number;
  target_weight_kg?: number;
  fitness_goal: FitnessGoal;
  joining_date: string;
  membership_start_date: string;
  membership_end_date: string;
  membership_plan_id?: string;
  membership_plan_name?: string;
  membership_status: MembershipStatus;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  trainer_notes?: string;
  total_sessions_attended?: number;
  attendance_rate?: number; // e.g. 88%
  pending_dues?: number;
  created_at: string;
  updated_at?: string;
}

export type PlanDurationType = "monthly" | "quarterly" | "half_yearly" | "annual" | "custom";

export interface MembershipPlan {
  id: string;
  name: string;
  duration_type: PlanDurationType;
  duration_days: number;
  price: number;
  currency: string;
  description?: string;
  features: string[];
  is_active: boolean;
  member_count?: number;
  created_at: string;
}

export type PaymentStatus = "paid" | "partial" | "pending" | "overdue";
export type PaymentMethod = "UPI" | "Cash" | "Bank Transfer" | "Credit/Debit Card" | "Cheque";

export interface PaymentRecord {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  amount: number;
  paid_amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  invoice_number: string;
  payment_date: string;
  due_date?: string;
  notes?: string;
  receipt_url?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  date: string;
  check_in_time?: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface TrainingSession {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  title: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  focus_area: string;
  status: "scheduled" | "completed" | "cancelled" | "in_progress";
  notes?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  target_muscle: string;
  sets: number;
  reps: string; // e.g. "8-12" or "10"
  rest_seconds: number;
  instructions?: string;
  video_url?: string;
}

export interface WorkoutPlan {
  id: string;
  member_id: string;
  member_name?: string;
  title: string;
  description?: string;
  split_days: {
    day_name: string; // "Monday", "Tuesday", etc.
    focus: string; // "Chest & Triceps"
    exercises: ExerciseItem[];
  }[];
  active: boolean;
  assigned_date: string;
}

export interface DietMeal {
  id: string;
  meal_name: string; // "Breakfast", "Lunch", "Pre-Workout"
  timing: string; // "08:30 AM"
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  food_items: string;
  trainer_tips?: string;
}

export interface DietPlan {
  id: string;
  member_id: string;
  member_name?: string;
  title: string;
  daily_calories_target: number;
  protein_target_g: number;
  carbs_target_g: number;
  fats_target_g: number;
  hydration_target_liters: number;
  meals: DietMeal[];
  assigned_date: string;
  trainer_notes?: string;
}

export interface ProgressRecord {
  id: string;
  member_id: string;
  recorded_date: string;
  weight_kg: number;
  body_fat_percentage?: number;
  chest_cm?: number;
  waist_cm?: number;
  arms_cm?: number;
  hips_cm?: number;
  thighs_cm?: number;
  notes?: string;
  front_photo_url?: string;
  side_photo_url?: string;
  back_photo_url?: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: "expiring_membership" | "overdue_payment" | "upcoming_session" | "attendance_alert" | "milestone";
  is_read: boolean;
  created_at: string;
  member_id?: string;
  action_url?: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  certifications: string[];
  gym_name: string;
  avatar_url: string;
  currency: string;
  experience_years: number;
}

export interface DashboardMetrics {
  totalMembers: number;
  activeMembers: number;
  expiringMemberships: number;
  monthlyRevenue: number;
  todayAttendance: {
    present: number;
    totalExpected: number;
    percentage: number;
  };
  pendingPaymentsTotal: number;
  pendingPaymentsCount: number;
}

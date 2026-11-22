// FITCORE Domain Models & Interfaces

export type UserRole = "trainer" | "member";

export type MembershipStatus = "active" | "expiring" | "expired" | "inactive" | "pending";

export type FitnessGoal =
  | "Hypertrophy / Muscle Building"
  | "Fat Loss & Conditioning"
  | "Strength & Powerlifting"
  | "Athletic Performance"
  | "Rehabilitation & Mobility"
  | "General Fitness";

export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "elite";

export interface MemberProfile {
  id: string; // Auth User ID
  trainer_id: string;
  role: "member";
  full_name: string;
  phone: string; // E.164 normalized, e.g. "+919876543210"
  email?: string;
  date_of_birth?: string;
  gender?: Gender;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;

  // Fitness details
  height_cm: number;
  starting_weight_kg: number;
  current_weight_kg: number;
  target_weight_kg?: number;
  fitness_goal: FitnessGoal;
  experience_level: ExperienceLevel;
  joining_date: string;
  medical_limitations?: string;
  medical_notes?: string;
  trainer_notes?: string;

  // Membership
  membership_plan_name: string;
  membership_start_date: string;
  membership_end_date: string;
  membership_fee?: number;
  payment_status: "paid" | "partial" | "pending" | "overdue";
  membership_status: MembershipStatus;
  pending_dues: number;
  attendance_rate?: number;
  total_sessions_attended?: number;

  // Auth & Security status
  requires_password_change?: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export type Member = MemberProfile;
export type InAppNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  member_id?: string;
};
export type DashboardMetrics = any;

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ExerciseItem {
  id: string;
  name: string;
  target_muscle: string;
  sets: number;
  reps: string;
  weight_target?: string;
  rest_seconds: number;
  instructions: string;
  video_url?: string;
  is_completed?: boolean;
}

export interface DayWorkoutPlan {
  day: DayOfWeek;
  workout_name: string; // e.g. "Chest & Triceps"
  is_rest_day: boolean;
  estimated_duration_min?: number;
  focus?: string;
  workout_note: string; // Simplified routine note as requested
  exercises?: ExerciseItem[];
}

export interface MealItem {
  id: string;
  meal_type: string;
  timing: string;
  foods: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fats_g?: number;
  is_completed?: boolean;
}

export interface DayDietPlan {
  day: DayOfWeek;
  diet_title?: string;
  daily_calories_target?: number;
  protein_target_g?: number;
  carbs_target_g?: number;
  fats_target_g?: number;
  water_target_liters?: number;
  diet_note: string; // Simplified nutrition & meal note as requested
  meals?: MealItem[];
  instructions?: string;
}

export interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gym_name: string;
  specialization: string;
  currency: string;
  avatar_url: string;
  experience_years?: number;
  role: "trainer";
}

export interface TrainingSession {
  id: string;
  member_id: string;
  member_name: string;
  member_avatar?: string;
  title: string;
  focus_area?: string;
  date: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "completed" | "cancelled" | "in_progress";
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  member_id: string;
  member_name: string;
  amount: number;
  paid_amount: number;
  currency: string;
  status: "paid" | "partial" | "pending" | "overdue";
  payment_method: "UPI" | "Cash" | "Bank Transfer" | "Card";
  invoice_number: string;
  payment_date: string;
  due_date?: string;
  notes?: string;
}

export interface MemberCredentialsHandover {
  member_name: string;
  phone: string;
  temp_password: string;
  plan_name: string;
  portal_url: string;
  created_at: string;
}

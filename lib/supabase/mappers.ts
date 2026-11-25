import type {
  ExperienceLevel,
  FitnessGoal,
  Gender,
  MembershipStatus,
  MemberProfile,
} from "@/types";

export interface MemberRow {
  id: string;
  trainer_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  emergency_contact: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  target_weight_kg: number | null;
  fitness_goal: string;
  experience_level: string;
  medical_notes: string | null;
  trainer_notes: string | null;
  membership_plan: string;
  membership_fee: number | null;
  membership_status: string;
  start_date: string;
  end_date: string;
  must_change_password: boolean;
  created_at: string;
  updated_at: string | null;
}

const GENDERS: Gender[] = ["male", "female", "other", "prefer_not_to_say"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["beginner", "intermediate", "advanced", "elite"];
const MEMBERSHIP_STATUSES: MembershipStatus[] = [
  "active",
  "expiring",
  "expired",
  "inactive",
  "pending",
];

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

function normalizeGender(value: string | null): Gender | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().replace(/\s+/g, "_") as Gender;
  return GENDERS.includes(normalized) ? normalized : undefined;
}

function normalizeExperienceLevel(value: string | null): ExperienceLevel {
  const normalized = (value || "").toLowerCase() as ExperienceLevel;
  return EXPERIENCE_LEVELS.includes(normalized) ? normalized : "intermediate";
}

function normalizeMembershipStatus(value: string | null): MembershipStatus {
  const normalized = (value || "").toLowerCase() as MembershipStatus;
  return MEMBERSHIP_STATUSES.includes(normalized) ? normalized : "inactive";
}

function splitEmergencyContact(value: string | null): {
  name?: string;
  phone?: string;
} {
  if (!value) return {};
  const match = value.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) return { name: match[1].trim(), phone: match[2].trim() };
  return { name: value.trim() };
}

export function mapMemberRow(row: MemberRow, avatarUrl?: string | null): MemberProfile {
  const emergency = splitEmergencyContact(row.emergency_contact);
  const membershipStatus = normalizeMembershipStatus(row.membership_status);

  return {
    id: row.id,
    trainer_id: row.trainer_id || "",
    role: "member",
    full_name: row.full_name,
    phone: row.phone,
    email: row.email || undefined,
    date_of_birth: row.date_of_birth || undefined,
    gender: normalizeGender(row.gender),
    address: row.address || undefined,
    emergency_contact_name: emergency.name,
    emergency_contact_phone: emergency.phone,
    height_cm: Number(row.height_cm ?? 0),
    starting_weight_kg: Number(row.weight_kg ?? 0),
    current_weight_kg: Number(row.weight_kg ?? 0),
    target_weight_kg: row.target_weight_kg != null ? Number(row.target_weight_kg) : undefined,
    fitness_goal: row.fitness_goal as FitnessGoal,
    experience_level: normalizeExperienceLevel(row.experience_level),
    joining_date: (row.created_at || row.start_date || "").slice(0, 10),
    medical_notes: row.medical_notes || undefined,
    trainer_notes: row.trainer_notes || undefined,
    membership_plan_name: row.membership_plan,
    membership_start_date: row.start_date,
    membership_end_date: row.end_date,
    membership_fee: row.membership_fee != null ? Number(row.membership_fee) : undefined,
    payment_status: membershipStatus === "expired" ? "overdue" : "paid",
    membership_status: membershipStatus,
    pending_dues: 0,
    requires_password_change: row.must_change_password,
    avatar_url: avatarUrl || DEFAULT_AVATAR,
    created_at: row.created_at,
    updated_at: row.updated_at || undefined,
  };
}

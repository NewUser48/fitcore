"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeIndianPhoneNumber } from "@/lib/auth-helpers";
import {
  MemberProfile,
  FitnessGoal,
  Gender,
  ExperienceLevel,
  MembershipStatus,
} from "@/types";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  HeartPulse,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface EditMemberDialogProps {
  member: MemberProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onMemberUpdated?: (member: MemberProfile) => void;
}

interface EditForm {
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  gender: Gender;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  medicalLimitations: string;
  trainerNotes: string;
  membershipPlan: string;
  membershipFee: number;
  membershipStatus: MembershipStatus;
  startDate: string;
  endDate: string;
}

function buildForm(member: MemberProfile | null): EditForm {
  return {
    fullName: member?.full_name ?? "",
    phone: member?.phone ?? "",
    email: member?.email ?? "",
    dob: member?.date_of_birth ?? "",
    gender: member?.gender ?? "male",
    address: member?.address ?? "",
    emergencyName: member?.emergency_contact_name ?? "",
    emergencyPhone: member?.emergency_contact_phone ?? "",
    heightCm: member?.height_cm ?? 0,
    currentWeightKg: member?.current_weight_kg ?? 0,
    targetWeightKg: member?.target_weight_kg ?? 0,
    fitnessGoal: member?.fitness_goal ?? "Fat Loss & Conditioning",
    experienceLevel: member?.experience_level ?? "intermediate",
    medicalLimitations:
      member?.medical_notes ?? member?.medical_limitations ?? "",
    trainerNotes: member?.trainer_notes ?? "",
    membershipPlan: member?.membership_plan_name ?? "",
    membershipFee: member?.membership_fee ?? 0,
    membershipStatus: member?.membership_status ?? "active",
    startDate: member?.membership_start_date ?? "",
    endDate: member?.membership_end_date ?? "",
  };
}

export function EditMemberDialog({
  member,
  isOpen,
  onClose,
  onMemberUpdated,
}: EditMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<EditForm>(buildForm(member));

  // Re-seed the form whenever a different member is opened.
  React.useEffect(() => {
    if (isOpen) setFormData(buildForm(member));
  }, [isOpen, member]);

  const setField = <K extends keyof EditForm>(key: K, value: EditForm[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    const phoneNorm = normalizeIndianPhoneNumber(formData.phone);
    if (!phoneNorm.isValid) {
      toast.error(phoneNorm.error || "Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/trainer/members/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: member.id,
          full_name: formData.fullName,
          phone: phoneNorm.e164,
          email: formData.email,
          date_of_birth: formData.dob,
          gender: formData.gender,
          address: formData.address,
          emergency_contact_name: formData.emergencyName,
          emergency_contact_phone: formData.emergencyPhone,
          height_cm: formData.heightCm,
          weight_kg: formData.currentWeightKg,
          target_weight_kg: formData.targetWeightKg,
          fitness_goal: formData.fitnessGoal,
          experience_level: formData.experienceLevel,
          medical_notes: formData.medicalLimitations,
          trainer_notes: formData.trainerNotes,
          membership_plan: formData.membershipPlan,
          membership_fee: formData.membershipFee,
          membership_status: formData.membershipStatus,
          start_date: formData.startDate,
          end_date: formData.endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update member");

      const updated: MemberProfile = {
        ...member,
        full_name: formData.fullName,
        phone: phoneNorm.e164,
        email: formData.email || undefined,
        date_of_birth: formData.dob || undefined,
        gender: formData.gender,
        address: formData.address || undefined,
        emergency_contact_name: formData.emergencyName || undefined,
        emergency_contact_phone: formData.emergencyPhone || undefined,
        height_cm: Number(formData.heightCm),
        current_weight_kg: Number(formData.currentWeightKg),
        target_weight_kg: Number(formData.targetWeightKg),
        fitness_goal: formData.fitnessGoal,
        experience_level: formData.experienceLevel,
        medical_notes: formData.medicalLimitations || undefined,
        medical_limitations: formData.medicalLimitations || undefined,
        trainer_notes: formData.trainerNotes || undefined,
        membership_plan_name: formData.membershipPlan,
        membership_fee: Number(formData.membershipFee),
        membership_status: formData.membershipStatus,
        membership_start_date: formData.startDate,
        membership_end_date: formData.endDate,
        updated_at: new Date().toISOString(),
      };

      onMemberUpdated?.(updated);
      toast.success(`${updated.full_name} updated successfully!`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Member"
      description={
        member ? `Update ${member.full_name}'s records and membership details.` : undefined
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Member Full Name *
          </label>
          <Input
            required
            value={formData.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            icon={<User className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Phone Number (Login ID) *
            </label>
            <Input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setField("phone", e.target.value)}
              icon={<Phone className="h-4 w-4" />}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setField("email", e.target.value)}
              icon={<Mail className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Date of Birth
            </label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => setField("dob", e.target.value)}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setField("gender", e.target.value as Gender)}
              className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">
            Residential Address
          </label>
          <Input
            value={formData.address}
            onChange={(e) => setField("address", e.target.value)}
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Emergency Contact Name
            </label>
            <Input
              value={formData.emergencyName}
              onChange={(e) => setField("emergencyName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Emergency Contact Phone
            </label>
            <Input
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => setField("emergencyPhone", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Height (cm)
            </label>
            <Input
              type="number"
              value={formData.heightCm}
              onChange={(e) => setField("heightCm", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Current Wt (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={formData.currentWeightKg}
              onChange={(e) => setField("currentWeightKg", Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Target Wt (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              value={formData.targetWeightKg}
              onChange={(e) => setField("targetWeightKg", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Fitness Goal
            </label>
            <select
              value={formData.fitnessGoal}
              onChange={(e) => setField("fitnessGoal", e.target.value as FitnessGoal)}
              className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
              <option value="Hypertrophy / Muscle Building">Hypertrophy / Muscle Building</option>
              <option value="Strength & Powerlifting">Strength & Powerlifting</option>
              <option value="Athletic Performance">Athletic Performance</option>
              <option value="Rehabilitation & Mobility">Rehabilitation & Mobility</option>
              <option value="General Fitness">General Fitness</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) =>
                setField("experienceLevel", e.target.value as ExperienceLevel)
              }
              className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="beginner">Beginner (&lt; 1 yr)</option>
              <option value="intermediate">Intermediate (1-3 yrs)</option>
              <option value="advanced">Advanced (3+ yrs)</option>
              <option value="elite">Elite / Competitive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Membership Plan
            </label>
            <select
              value={formData.membershipPlan}
              onChange={(e) => setField("membershipPlan", e.target.value)}
              className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="1-on-1 Monthly Elite">1-on-1 Monthly Elite (₹8,500)</option>
              <option value="Transform 90-Day VIP">Transform 90-Day VIP (₹22,500)</option>
              <option value="Annual High-Performance">Annual High-Performance (₹75,000)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Membership Fee (₹ INR)
            </label>
            <Input
              type="number"
              value={formData.membershipFee}
              onChange={(e) => setField("membershipFee", Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Status
            </label>
            <select
              value={formData.membershipStatus}
              onChange={(e) =>
                setField("membershipStatus", e.target.value as MembershipStatus)
              }
              className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Start Date
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setField("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              End Date
            </label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setField("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Medical Limitations
            </label>
            <textarea
              rows={2}
              value={formData.medicalLimitations}
              onChange={(e) => setField("medicalLimitations", e.target.value)}
              className="w-full rounded-xl border border-border bg-[#151B22] p-3 text-xs text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Trainer Notes
            </label>
            <textarea
              rows={2}
              value={formData.trainerNotes}
              onChange={(e) => setField("trainerNotes", e.target.value)}
              className="w-full rounded-xl border border-border bg-[#151B22] p-3 text-xs text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isSubmitting}
            className="flex items-center gap-2 font-bold shadow-lime-glow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

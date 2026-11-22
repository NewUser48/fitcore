"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { normalizeIndianPhoneNumber, generateStrongPassword } from "@/lib/auth-helpers";
import { MemberProfile, FitnessGoal, Gender, ExperienceLevel } from "@/types";
import {
  User,
  Activity,
  CreditCard,
  KeyRound,
  Sparkles,
  Copy,
  Check,
  Send,
  Lock,
  Phone,
  Mail,
  Calendar,
  MapPin,
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberCreated?: (member: MemberProfile) => void;
}

export function AddMemberDialog({
  isOpen,
  onClose,
  onMemberCreated,
}: AddMemberDialogProps) {
  const [activeStep, setActiveStep] = React.useState<"personal" | "fitness" | "membership" | "credentials">("personal");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    // 1. Personal Details
    fullName: "",
    phone: "",
    email: "",
    dob: "",
    gender: "male" as Gender,
    address: "",
    emergencyName: "",
    emergencyPhone: "",

    // 2. Fitness Details
    heightCm: 175,
    startingWeightKg: 78,
    targetWeightKg: 74,
    fitnessGoal: "Fat Loss & Conditioning" as FitnessGoal,
    experienceLevel: "intermediate" as ExperienceLevel,
    joiningDate: new Date().toISOString().split("T")[0],
    medicalLimitations: "",

    // 3. Membership
    membershipPlan: "Transform 90-Day VIP",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    membershipFee: 22500,
    paymentStatus: "paid" as "paid" | "partial" | "pending",

    // 4. Login Credentials
    tempPassword: generateStrongPassword(),
  });

  // Handover state after creation
  const [createdCredentials, setCreatedCredentials] = React.useState<{
    fullName: string;
    phoneE164: string;
    tempPassword: string;
    plan: string;
  } | null>(null);

  const handleGeneratePassword = () => {
    const pw = generateStrongPassword();
    setFormData((prev) => ({ ...prev, tempPassword: pw }));
    toast.success("Generated cryptographically strong password!");
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `*Welcome to FITCORE, ${createdCredentials.fullName}!*
Your athlete portal account is ready:
• Login URL: http://localhost:3000/login
• Phone Number: ${createdCredentials.phoneE164}
• Temporary Password: ${createdCredentials.tempPassword}
• Plan: ${createdCredentials.plan}

Please change your password after logging in.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Credentials copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneNorm = normalizeIndianPhoneNumber(formData.phone);
    if (!phoneNorm.isValid) {
      toast.error(phoneNorm.error || "Please enter a valid 10-digit Indian phone number.");
      setActiveStep("personal");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newMember: MemberProfile = {
        id: `mem_${Date.now()}`,
        trainer_id: "trainer_fitcore_01",
        role: "member",
        full_name: formData.fullName,
        phone: phoneNorm.e164,
        email: formData.email || `${formData.fullName.toLowerCase().replace(/\s+/g, ".")}@fitcore.athlete`,
        date_of_birth: formData.dob,
        gender: formData.gender,
        address: formData.address,
        emergency_contact_name: formData.emergencyName,
        emergency_contact_phone: formData.emergencyPhone,
        height_cm: Number(formData.heightCm),
        starting_weight_kg: Number(formData.startingWeightKg),
        current_weight_kg: Number(formData.startingWeightKg),
        target_weight_kg: Number(formData.targetWeightKg),
        fitness_goal: formData.fitnessGoal,
        experience_level: formData.experienceLevel,
        joining_date: formData.joiningDate,
        medical_limitations: formData.medicalLimitations,
        membership_plan_name: formData.membershipPlan,
        membership_start_date: formData.startDate,
        membership_end_date: formData.endDate,
        membership_fee: Number(formData.membershipFee),
        payment_status: formData.paymentStatus,
        membership_status: "active",
        pending_dues: 0,
        requires_password_change: true,
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        created_at: new Date().toISOString(),
      };

      setCreatedCredentials({
        fullName: formData.fullName,
        phoneE164: phoneNorm.e164,
        tempPassword: formData.tempPassword,
        plan: formData.membershipPlan,
      });

      if (onMemberCreated) {
        onMemberCreated(newMember);
      }
    }, 800);
  };

  const handleFinish = () => {
    setCreatedCredentials(null);
    setActiveStep("personal");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFinish}
      title={createdCredentials ? "Athlete Account Created!" : "Register & Provision New Member"}
      description={
        createdCredentials
          ? "Secure one-time handover details for athlete credentials."
          : "Complete registration and generate Auth credentials for member login."
      }
      maxWidth="xl"
    >
      {createdCredentials ? (
        /* Secure Credential Handover Screen */
        <div className="space-y-5 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30">
            <div className="h-10 w-10 rounded-xl bg-primary text-black flex items-center justify-center font-bold shrink-0">
              <Check className="h-5 w-5 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">
                Member Provisioned Successfully
              </h4>
              <p className="text-xs text-text-muted">
                Auth account created with role <span className="text-primary font-bold">MEMBER</span>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#151B22] border border-border space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted">Athlete Name</span>
              <span className="font-bold text-text-primary">{createdCredentials.fullName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted">Login Phone (E.164)</span>
              <span className="font-mono font-bold text-primary">{createdCredentials.phoneE164}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted">Temporary Password</span>
              <span className="font-mono font-black text-primary bg-[#10151B] px-2 py-0.5 rounded border border-primary/30">
                {createdCredentials.tempPassword}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Password Policy</span>
              <span className="text-[11px] font-semibold text-orange-400">
                Mandatory change on first login
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <Lock className="h-4 w-4 shrink-0" />
            <span>
              This temporary password is shown <strong>once</strong>. Share it with the athlete now.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleCopyCredentials}
              className="w-full flex items-center justify-center gap-2"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Copied!" : "Copy Handover Summary"}</span>
            </Button>

            <a
              href={`https://wa.me/${createdCredentials.phoneE164.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Hi ${createdCredentials.fullName}, your FITCORE Athlete Portal login is ready!\n\nPortal: http://localhost:3000/login\nPhone: ${createdCredentials.phoneE164}\nTemp Password: ${createdCredentials.tempPassword}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Send via WhatsApp</span>
            </a>
          </div>

          <div className="pt-3 border-t border-border flex justify-end">
            <Button variant="primary" size="sm" onClick={handleFinish}>
              Done & Return to Roster
            </Button>
          </div>
        </div>
      ) : (
        /* Multi-Step Member Registration Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step Navigation Pills */}
          <div className="grid grid-cols-4 gap-1.5 border-b border-border pb-3">
            {[
              { id: "personal", label: "1. Personal", icon: User },
              { id: "fitness", label: "2. Fitness", icon: Activity },
              { id: "membership", label: "3. Plan", icon: CreditCard },
              { id: "credentials", label: "4. Login", icon: KeyRound },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id as any)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-1 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? "bg-[#25303D] text-primary border border-primary/30"
                      : "text-text-muted hover:text-text-primary hover:bg-[#1E2630]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1. PERSONAL DETAILS */}
          {activeStep === "personal" && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Member Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    placeholder="e.g. 98201 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    icon={<Phone className="h-4 w-4" />}
                  />
                  <span className="text-[10px] text-text-dim mt-0.5 block">
                    Normalized to +91 E.164 automatically
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Email Address (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Residential Address
                </label>
                <Input
                  placeholder="Street, City, Postal Code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Emergency Contact Name & Relation
                  </label>
                  <Input
                    placeholder="e.g. Priya Sharma (Spouse)"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Emergency Contact Phone
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveStep("fitness")}
                >
                  Next: Fitness Details &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* 2. FITNESS DETAILS */}
          {activeStep === "fitness" && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Height (cm) *
                  </label>
                  <Input
                    type="number"
                    value={formData.heightCm}
                    onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Starting Wt (kg) *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.startingWeightKg}
                    onChange={(e) => setFormData({ ...formData, startingWeightKg: Number(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Fitness Goal *
                  </label>
                  <select
                    value={formData.fitnessGoal}
                    onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as any })}
                    className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                    <option value="Hypertrophy / Muscle Building">Hypertrophy / Muscle Building</option>
                    <option value="Strength & Powerlifting">Strength & Powerlifting</option>
                    <option value="Athletic Performance">Athletic Performance</option>
                    <option value="Rehabilitation & Mobility">Rehabilitation & Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                    className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="beginner">Beginner (&lt; 1 yr)</option>
                    <option value="intermediate">Intermediate (1-3 yrs)</option>
                    <option value="advanced">Advanced (3+ yrs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Medical Limitations / Pre-existing Injuries
                </label>
                <textarea
                  rows={2}
                  placeholder="Herniated disc, knee ACL repair, hypertension, asthma..."
                  value={formData.medicalLimitations}
                  onChange={(e) => setFormData({ ...formData, medicalLimitations: e.target.value })}
                  className="w-full rounded-xl border border-border bg-[#151B22] p-3 text-xs text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setActiveStep("personal")}>
                  &larr; Back
                </Button>
                <Button type="button" variant="primary" size="sm" onClick={() => setActiveStep("membership")}>
                  Next: Membership &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* 3. MEMBERSHIP */}
          {activeStep === "membership" && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Membership Plan *
                  </label>
                  <select
                    value={formData.membershipPlan}
                    onChange={(e) => setFormData({ ...formData, membershipPlan: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="1-on-1 Monthly Elite">1-on-1 Monthly Elite (₹8,500)</option>
                    <option value="Transform 90-Day VIP">Transform 90-Day VIP (₹22,500)</option>
                    <option value="Annual High-Performance">Annual High-Performance (₹75,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Membership Fee (₹ INR) *
                  </label>
                  <Input
                    type="number"
                    value={formData.membershipFee}
                    onChange={(e) => setFormData({ ...formData, membershipFee: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                  className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="paid">Paid in Full</option>
                  <option value="partial">Partial Payment Received</option>
                  <option value="pending">Payment Pending</option>
                </select>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setActiveStep("fitness")}>
                  &larr; Back
                </Button>
                <Button type="button" variant="primary" size="sm" onClick={() => setActiveStep("credentials")}>
                  Next: Login Credentials &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* 4. LOGIN CREDENTIALS */}
          {activeStep === "credentials" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-[#151B22] border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-text-muted">
                  Auth Account Identification
                </span>
                <p className="text-xs font-bold text-text-primary">
                  Athlete Phone ID: <span className="text-primary font-mono">{formData.phone || "Not set in step 1"}</span>
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-text-primary">
                    Temporary Member Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Generate Strong Password
                  </button>
                </div>

                <div className="relative">
                  <Input
                    required
                    value={formData.tempPassword}
                    onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                    icon={<Lock className="h-4 w-4" />}
                    className="font-mono text-sm tracking-wider"
                  />
                </div>
                <span className="text-[10px] text-text-muted mt-1 block">
                  Athlete will be required to change this temporary password on their first login.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-text-muted space-y-1">
                <p className="font-bold text-primary">Provisioning Security Rules:</p>
                <p>&bull; Auth account provisioned securely via server-only admin API.</p>
                <p>&bull; Row Level Security automatically links all future member logs to this user ID.</p>
                <p>&bull; Plaintext password is never saved in DB.</p>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setActiveStep("membership")}>
                  &larr; Back
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  disabled={isSubmitting}
                  className="font-bold shadow-lime-glow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Provisioning Athlete...
                    </>
                  ) : (
                    "Create Member & Generate Handover"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
}

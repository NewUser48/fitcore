"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleMembershipPlans } from "@/lib/mock-data";
import { FitnessGoal, Gender } from "@/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  HeartPulse,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded?: (memberData: any) => void;
}

export function AddMemberModal({
  isOpen,
  onClose,
  onMemberAdded,
}: AddMemberModalProps) {
  const [activeStep, setActiveStep] = React.useState<"personal" | "fitness" | "membership">("personal");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "male" as Gender,
    heightCm: 175,
    startingWeightKg: 78,
    targetWeightKg: 74,
    fitnessGoal: "Fat Loss & Conditioning" as FitnessGoal,
    planId: sampleMembershipPlans[0].id,
    startDate: new Date().toISOString().split("T")[0],
    emergencyName: "",
    emergencyPhone: "",
    medicalNotes: "",
    trainerNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate validation & saving action
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onMemberAdded) {
        onMemberAdded(formData);
      }
      setTimeout(() => {
        setIsSuccess(false);
        setActiveStep("personal");
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Member"
      description="Register a member under your direct personal training roster."
      maxWidth="xl"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary text-primary shadow-lime-glow mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">
            Member Successfully Added!
          </h3>
          <p className="text-xs text-text-muted mt-1 max-w-xs">
            {formData.fullName || "Member"} is now registered in your personal roster.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step Navigation */}
          <div className="grid grid-cols-3 gap-2 border-b border-border pb-3">
            {[
              { id: "personal", label: "1. Personal Info", icon: User },
              { id: "fitness", label: "2. Biometrics & Goals", icon: Activity },
              { id: "membership", label: "3. Plan & Medical", icon: CreditCard },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              return (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => setActiveStep(step.id as any)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-semibold rounded-lg transition-all ${
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

          {/* Step 1: Personal Info */}
          {activeStep === "personal" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Full Name *
                </label>
                <Input
                  required
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  icon={<User className="h-4 w-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    name="email"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <Input
                    required
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={<Phone className="h-4 w-4" />}
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
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus-visible:outline-none focus-visible:border-primary/70"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveStep("fitness")}
                >
                  Continue to Biometrics &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Biometrics & Goals */}
          {activeStep === "fitness" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Height (cm) *
                  </label>
                  <Input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Starting Wt (kg) *
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    name="startingWeightKg"
                    value={formData.startingWeightKg}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Target Wt (kg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    name="targetWeightKg"
                    value={formData.targetWeightKg}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Primary Fitness Goal *
                </label>
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus-visible:outline-none focus-visible:border-primary/70"
                >
                  <option value="Hypertrophy / Muscle Building">
                    Hypertrophy / Muscle Building
                  </option>
                  <option value="Fat Loss & Conditioning">
                    Fat Loss & Conditioning
                  </option>
                  <option value="Strength & Powerlifting">
                    Strength & Powerlifting
                  </option>
                  <option value="Athletic Performance">
                    Athletic Performance
                  </option>
                  <option value="Rehabilitation & Mobility">
                    Rehabilitation & Mobility
                  </option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Trainer Assessment & Initial Notes
                </label>
                <textarea
                  name="trainerNotes"
                  rows={3}
                  value={formData.trainerNotes}
                  onChange={handleChange}
                  placeholder="Mobility check, posture flags, specific target milestones..."
                  className="w-full rounded-xl border border-border bg-[#151B22] p-3 text-xs text-text-primary placeholder:text-text-dim focus-visible:outline-none focus-visible:border-primary/70"
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveStep("personal")}
                >
                  &larr; Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveStep("membership")}
                >
                  Continue to Membership &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Membership Plan & Medical */}
          {activeStep === "membership" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Select Membership Plan *
                  </label>
                  <select
                    name="planId"
                    value={formData.planId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] px-3 py-2 text-xs text-text-primary focus-visible:outline-none focus-visible:border-primary/70"
                  >
                    {sampleMembershipPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} (₹{plan.price.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Membership Start Date *
                  </label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Emergency Contact Name
                  </label>
                  <Input
                    name="emergencyName"
                    placeholder="Name & Relationship"
                    value={formData.emergencyName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Emergency Contact Phone
                  </label>
                  <Input
                    type="tel"
                    name="emergencyPhone"
                    placeholder="+91 98000 00000"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Medical Notes & Injuries (Restricted Access)
                </label>
                <textarea
                  name="medicalNotes"
                  rows={2}
                  value={formData.medicalNotes}
                  onChange={handleChange}
                  placeholder="Prior surgeries, slipped disc, hypertension, asthma, joint restrictions..."
                  className="w-full rounded-xl border border-border bg-[#151B22] p-3 text-xs text-text-primary placeholder:text-text-dim focus-visible:outline-none focus-visible:border-primary/70"
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveStep("fitness")}
                >
                  &larr; Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  disabled={isSubmitting}
                  className="shadow-lime-glow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering Member...
                    </>
                  ) : (
                    "Complete Registration"
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

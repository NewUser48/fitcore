"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  User,
  Shield,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { normalizeIndianPhoneNumber } from "@/lib/auth-helpers";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"trainer" | "member">("trainer");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Form states
  const [trainerEmail, setTrainerEmail] = React.useState("alex@fitcore.com");
  const [trainerPassword, setTrainerPassword] = React.useState("Trainer@123");

  const [memberPhone, setMemberPhone] = React.useState("+91 98201 12345");
  const [memberPassword, setMemberPassword] = React.useState("Member@123");

  const handleTrainerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (trainerEmail.toLowerCase().includes("alex") || trainerEmail.includes("fitcore")) {
        toast.success("Welcome Coach Alex! Authenticated as Sole Trainer.");
        router.push("/trainer/dashboard");
      } else {
        setErrorMessage("Invalid trainer credentials. Public accounts are prohibited.");
      }
    }, 600);
  };

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const norm = normalizeIndianPhoneNumber(memberPhone);
    if (!norm.isValid) {
      setErrorMessage(norm.error || "Invalid mobile number");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Welcome Rohan! Logging into your athlete dashboard.`);
      router.push("/member/dashboard");
    }, 600);
  };

  // Quick autofill buttons for testing
  const autofillTrainer = () => {
    setActiveTab("trainer");
    setTrainerEmail("alex@fitcore.com");
    setTrainerPassword("Trainer@123");
    setErrorMessage(null);
  };

  const autofillMember = (name: string, phone: string) => {
    setActiveTab("member");
    setMemberPhone(phone);
    setMemberPassword("Member@123");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Ambience & Grid */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-sky-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-card border border-primary/40 flex items-center justify-center text-primary shadow-lime-glow-sm">
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-wider text-text-primary">
              FIT<span className="text-primary font-bold">CORE</span>
            </span>
            <span className="block text-[10px] font-bold text-text-muted tracking-widest uppercase">
              Dual-Role Management OS
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted bg-[#151B22] border border-border px-3 py-1.5 rounded-xl">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>Strict Role-Based Access Control</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="p-6 sm:p-8 border-border bg-[#151B22]/95 backdrop-blur-xl shadow-glass-elevated">
            {/* Header copy */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black tracking-tight text-text-primary font-display">
                Sign in to FITCORE
              </h1>
              <p className="text-xs text-text-muted mt-1">
                Authorized entry for the Sole Trainer or Enrolled Athletes
              </p>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#10151B] border border-border mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("trainer");
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                  activeTab === "trainer"
                    ? "bg-[#1C242D] text-primary shadow-lime-glow-sm border border-primary/30"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Trainer Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("member");
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                  activeTab === "member"
                    ? "bg-[#1C242D] text-primary shadow-lime-glow-sm border border-primary/30"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Member Login</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Tab 1: Trainer Login */}
            {activeTab === "trainer" ? (
              <form onSubmit={handleTrainerLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Trainer Email
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="alex@fitcore.com"
                    value={trainerEmail}
                    onChange={(e) => setTrainerEmail(e.target.value)}
                    icon={<Mail className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-text-primary">
                      Trainer Password
                    </label>
                    <span className="text-[10px] text-text-dim">Sole Administrator</span>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={trainerPassword}
                      onChange={(e) => setTrainerPassword(e.target.value)}
                      icon={<Lock className="h-4 w-4" />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-text-muted hover:text-text-primary"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full mt-2 font-bold shadow-lime-glow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying Administrator...
                    </>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Access Trainer Command Center <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              /* Tab 2: Member Login */
              <form onSubmit={handleMemberLogin} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-text-primary">
                      Registered Mobile Number
                    </label>
                    <span className="text-[10px] text-primary font-mono">E.164 Format</span>
                  </div>
                  <Input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    icon={<Phone className="h-4 w-4" />}
                  />
                  <span className="text-[10px] text-text-muted mt-1 block">
                    Use the mobile number provided by Coach Alex at enrollment.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-text-primary">
                      Password
                    </label>
                    <span className="text-[10px] text-text-dim">Assigned by Trainer</span>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={memberPassword}
                      onChange={(e) => setMemberPassword(e.target.value)}
                      icon={<Lock className="h-4 w-4" />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-text-muted hover:text-text-primary"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full mt-2 font-bold shadow-lime-glow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating Athlete...
                    </>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Open Athlete Dashboard <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}

            {/* Quick Demo Credential Pills */}
            <div className="mt-6 pt-5 border-t border-border/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-2 text-center">
                Review & Testing Quick-Access
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={autofillTrainer}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#10151B] border border-border hover:border-primary/50 text-[11px] text-text-muted hover:text-text-primary text-center transition-colors"
                >
                  <strong className="text-primary">Trainer:</strong> Alex Vance
                </button>
                <button
                  type="button"
                  onClick={() => autofillMember("Rohan", "+91 98201 12345")}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#10151B] border border-border hover:border-primary/50 text-[11px] text-text-muted hover:text-text-primary text-center transition-colors"
                >
                  <strong className="text-primary">Member:</strong> Rohan M.
                </button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-text-dim border-t border-border/40">
        FITCORE OS &bull; Single-Trainer Architecture &bull; Native Phone Auth Normalized
      </footer>
    </div>
  );
}

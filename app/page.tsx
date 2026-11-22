"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Shield,
  User,
  ArrowRight,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Lock,
  Phone,
  Layers,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RootHomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-card border border-primary/40 flex items-center justify-center text-primary shadow-lime-glow-sm">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-wider text-text-primary">
              FIT<span className="text-primary font-bold">CORE</span>
            </span>
            <span className="block text-[10px] font-bold text-text-muted tracking-widest uppercase">
              Gym Trainer & Member Management OS
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C242D] border border-border text-xs font-bold text-text-primary hover:border-primary/50 transition-colors"
        >
          <span>Sign In</span>
          <ArrowRight className="h-3.5 w-3.5 text-primary" />
        </Link>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wide mb-6">
          <Sparkles className="h-3.5 w-3.5" /> High-Performance Dual-Role Architecture
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight font-display mb-4">
          One Trainer. Unlimited Athletes.{" "}
          <span className="gradient-text-lime block">Complete Synchronization.</span>
        </h1>

        <p className="text-sm sm:text-base text-text-muted max-w-2xl mb-10 leading-relaxed">
          FITCORE provides the sole certified trainer with absolute oversight of workouts, diets, attendance, and fees, while giving every enrolled athlete their own private mobile-first training portal.
        </p>

        {/* Dual Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl text-left">
          {/* Trainer Card */}
          <Link
            href="/login"
            className="group p-6 rounded-3xl border border-border bg-[#151B22]/90 hover:border-primary/50 hover:bg-[#1A222B] transition-all duration-300 shadow-glass-elevated relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase">
                Administrator
              </span>
            </div>

            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
              Trainer Command Center &rarr;
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Program Monday-Sunday workouts, assign macro plans, register athletes, log fees in ₹ INR, and manage attendance.
            </p>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5 text-xs text-text-dim">
              <Lock className="h-3.5 w-3.5" />
              <span>Email + Password Auth</span>
            </div>
          </Link>

          {/* Member Card */}
          <Link
            href="/login"
            className="group p-6 rounded-3xl border border-border bg-[#151B22]/90 hover:border-primary/50 hover:bg-[#1A222B] transition-all duration-300 shadow-glass-elevated relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-all pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <User className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full uppercase">
                Enrolled Athlete
              </span>
            </div>

            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
              Athlete Fitness Portal &rarr;
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Access your daily workout split, check off exercises with rest timers, track meals, view weight trends, and download receipts.
            </p>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5 text-xs text-text-dim">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>Phone (+91 E.164) Auth</span>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-xs text-text-dim border-t border-border/40">
        FITCORE &bull; Midnight Charcoal &bull; Graphite &bull; Electric Lime &bull; Production Next.js 14
      </footer>
    </div>
  );
}

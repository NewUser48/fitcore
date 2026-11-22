"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fitcoreTrainer } from "@/lib/mock-data";
import { Settings, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function TrainerSettingsPage() {
  const [profile, setProfile] = React.useState(fitcoreTrainer);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Trainer profile updated successfully!");
  };

  return (
    <TrainerShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Trainer Profile & Studio Configuration
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              Sole Administrator Role
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Configure your professional coaching credentials, studio name, currency preferences, and notification rules.
          </p>
        </div>

        <Button onClick={handleSave} variant="primary" size="sm" className="shadow-lime-glow-sm font-bold">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center text-center">
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="h-24 w-24 rounded-3xl object-cover border-2 border-primary shadow-lime-glow mb-4"
          />
          <h2 className="text-base font-bold text-text-primary">{profile.name}</h2>
          <p className="text-xs text-primary font-semibold mt-0.5">{profile.specialization}</p>
          <p className="text-xs text-text-muted mt-1">{profile.gym_name}</p>

          <div className="mt-5 w-full pt-4 border-t border-border space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-text-muted">Role:</span>
              <span className="font-bold text-text-primary">Sole Trainer (Administrator)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Currency:</span>
              <span className="font-bold text-primary">₹ INR (Indian Rupee)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Security:</span>
              <span className="font-bold text-emerald-400">Row Level Security Enforced</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">Coach Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Trainer Full Name</label>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Gym / Studio Name</label>
                <Input value={profile.gym_name} onChange={(e) => setProfile({ ...profile, gym_name: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Official Email</label>
                <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Phone Number</label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Specialization</label>
              <Input value={profile.specialization} onChange={(e) => setProfile({ ...profile, specialization: e.target.value })} />
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" variant="primary">
                Update Studio Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </TrainerShell>
  );
}

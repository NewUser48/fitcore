"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialTrainerProfile } from "@/lib/mock-data";
import { Settings, User, Shield, Key, Bell, Sliders, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [trainerProfile, setTrainerProfile] = React.useState(initialTrainerProfile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Trainer profile preferences updated successfully!");
  };

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Trainer Profile & System Settings
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              Single-Trainer Provisioning
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Configure your professional coaching credentials, studio name, currency preferences, and notification rules.
          </p>
        </div>

        <Button
          onClick={handleSave}
          variant="primary"
          size="sm"
          className="shadow-lime-glow-sm"
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={trainerProfile.avatar_url}
              alt={trainerProfile.name}
              className="h-24 w-24 rounded-3xl object-cover border-2 border-primary shadow-lime-glow"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-[#1C242D]" />
          </div>

          <h3 className="text-base font-bold text-text-primary">
            {trainerProfile.name}
          </h3>
          <p className="text-xs text-primary font-semibold mt-0.5">
            {trainerProfile.specialization}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {trainerProfile.gym_name} &bull; {trainerProfile.experience_years} Years Coaching
          </p>

          <div className="mt-5 w-full pt-4 border-t border-border space-y-2 text-xs text-left">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Account Model:</span>
              <span className="font-bold text-text-primary">Solo Certified Trainer</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Default Currency:</span>
              <span className="font-bold text-primary">₹ INR (Indian Rupee)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Security:</span>
              <span className="font-bold text-emerald-400">Row Level Security (RLS)</span>
            </div>
          </div>
        </Card>

        {/* Configuration Form */}
        <Card className="p-6 lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">
              Professional Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Trainer Full Name
                </label>
                <Input
                  value={trainerProfile.name}
                  onChange={(e) =>
                    setTrainerProfile({ ...trainerProfile, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Gym / Studio Name
                </label>
                <Input
                  value={trainerProfile.gym_name}
                  onChange={(e) =>
                    setTrainerProfile({ ...trainerProfile, gym_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Official Email
                </label>
                <Input
                  type="email"
                  value={trainerProfile.email}
                  onChange={(e) =>
                    setTrainerProfile({ ...trainerProfile, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Phone (WhatsApp)
                </label>
                <Input
                  value={trainerProfile.phone}
                  onChange={(e) =>
                    setTrainerProfile({ ...trainerProfile, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Specialization & Focus Areas
              </label>
              <Input
                value={trainerProfile.specialization}
                onChange={(e) =>
                  setTrainerProfile({
                    ...trainerProfile,
                    specialization: e.target.value,
                  })
                }
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" variant="primary" size="default">
                Update Preferences
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardShell>
  );
}

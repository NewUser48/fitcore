"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fitcoreMembers, fitcoreTrainer } from "@/lib/mock-data";
import { User, Phone, Save } from "lucide-react";
import { toast } from "sonner";

export default function MemberProfilePage() {
  const member = fitcoreMembers[0];
  const [phone, setPhone] = React.useState(member.phone);
  const [targetWeight, setTargetWeight] = React.useState(member.target_weight_kg || 78);
  const [emergencyName, setEmergencyName] = React.useState(member.emergency_contact_name || "");
  const [emergencyPhone, setEmergencyPhone] = React.useState(member.emergency_contact_phone || "");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile preferences updated!");
  };

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Athlete Profile & Account
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              Permitted Self-Updates
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Update your contact preferences, emergency info, and target weight.
          </p>
        </div>

        <Button onClick={handleSave} variant="primary" size="sm" className="shadow-lime-glow-sm">
          <Save className="h-4 w-4 mr-1.5" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center text-center">
          <img
            src={member.avatar_url || ""}
            alt={member.full_name}
            className="h-24 w-24 rounded-3xl object-cover border-2 border-primary shadow-lime-glow mb-4"
          />
          <h2 className="text-base font-bold text-text-primary">{member.full_name}</h2>
          <p className="text-xs text-primary font-semibold mt-0.5">{member.fitness_goal}</p>
          <p className="text-xs text-text-muted mt-1">Coached by {fitcoreTrainer.name}</p>

          <div className="mt-5 w-full pt-4 border-t border-border space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-text-muted">Auth Phone (Login):</span>
              <span className="font-mono font-bold text-primary">{member.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Height:</span>
              <span className="font-bold text-text-primary">{member.height_cm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Starting Weight:</span>
              <span className="font-bold text-text-primary">{member.starting_weight_kg} kg</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-text-primary mb-3">Editable Contact Preferences</h3>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">WhatsApp Phone Number</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} icon={<Phone className="h-4 w-4" />} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Emergency Contact Name</label>
                <Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Emergency Contact Phone</label>
                <Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Target Weight (kg)</label>
              <Input type="number" step="0.1" value={targetWeight} onChange={(e) => setTargetWeight(Number(e.target.value))} />
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" variant="primary">
                Update Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MemberShell>
  );
}

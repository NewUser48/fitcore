"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useMemberPortal } from "@/components/member/member-portal-provider";
import { Scale, TrendingUp, Plus, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

export default function MemberProgressPage() {
  const { member, progress, saveWeighIn, isLoading } = useMemberPortal();

  const [isOpen, setIsOpen] = React.useState(false);
  const [weight, setWeight] = React.useState("");
  const [bodyFat, setBodyFat] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const weightData = progress.map((p) => ({ date: p.date, weight: p.weight_kg }));

  const firstWeight = weightData[0]?.weight ?? member.starting_weight_kg;
  const lastWeight =
    weightData[weightData.length - 1]?.weight ?? member.current_weight_kg;
  const delta = (lastWeight - firstWeight).toFixed(1);
  const hasTrend = weightData.length > 1;

  const latest = progress[progress.length - 1];

  const openDialog = () => {
    setWeight(latest ? String(latest.weight_kg) : String(member.current_weight_kg || ""));
    setBodyFat(latest?.body_fat_pct != null ? String(latest.body_fat_pct) : "");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedWeight = Number(weight);
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      toast.error("Please enter a valid weight in kilograms.");
      return;
    }

    setIsSaving(true);
    try {
      await saveWeighIn({
        weight_kg: parsedWeight,
        body_fat_pct: bodyFat.trim() === "" ? null : Number(bodyFat),
      });
      toast.success("Weigh-in logged!");
      setIsOpen(false);
      setWeight("");
      setBodyFat("");
    } catch (err: any) {
      toast.error(err?.message || "Could not save your weigh-in.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              My Body Progress & PRs
            </h1>
            {hasTrend && <Badge variant="primary">{delta} kg</Badge>}
          </div>
          <p className="text-xs text-text-muted mt-1">
            Weight trajectory, verified lift achievements, and body fat tracking.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="shadow-lime-glow-sm"
          onClick={openDialog}
        >
          <Plus className="h-4 w-4 mr-1.5" /> Log Weigh-In
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            <Scale className="h-3.5 w-3.5 text-primary" /> Current Weight
          </div>
          <p className="text-2xl font-black text-text-primary mt-1">
            {lastWeight.toFixed(1)} <span className="text-sm text-text-muted">kg</span>
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> Total Change
          </div>
          <p className="text-2xl font-black text-text-primary mt-1">
            {delta} <span className="text-sm text-text-muted">kg</span>
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            <Scale className="h-3.5 w-3.5 text-primary" /> Target Weight
          </div>
          <p className="text-2xl font-black text-text-primary mt-1">
            {member.target_weight_kg ? member.target_weight_kg.toFixed(1) : "—"}{" "}
            <span className="text-sm text-text-muted">kg</span>
          </p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-sm font-bold text-text-primary mb-4">Weight Trend History (kg)</h3>
        {isLoading ? (
          <div className="h-64 w-full flex items-center justify-center text-xs text-text-muted">
            Loading progress…
          </div>
        ) : hasTrend ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#242D37" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={["dataMin - 3", "dataMax + 3"]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#B8FF3B" strokeWidth={3} dot={{ fill: "#B8FF3B", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 w-full flex flex-col items-center justify-center text-center gap-2">
            <TrendingUp className="h-7 w-7 text-text-dim" />
            <p className="text-xs font-semibold text-text-primary">
              {progress.length === 1 ? "One weigh-in recorded" : "No weigh-in records yet"}
            </p>
            <p className="text-[11px] text-text-muted">
              {progress.length === 1
                ? "Log another weigh-in to see your trend line."
                : "Log your first weigh-in to start tracking your trend."}
            </p>
            <Button variant="outline" size="sm" onClick={openDialog} className="mt-1">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Log Weigh-In
            </Button>
          </div>
        )}
      </Card>

      {progress.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border bg-[#151B22]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Weigh-In History
            </h3>
          </div>
          <div className="divide-y divide-border/60">
            {[...progress].reverse().map((p) => (
              <div key={p.id} className="px-4 py-3 flex items-center justify-between text-xs">
                <span className="text-text-muted font-mono">{p.date}</span>
                <div className="flex items-center gap-4">
                  {p.body_fat_pct != null && (
                    <span className="text-text-dim">{p.body_fat_pct}% BF</span>
                  )}
                  <span className="font-bold text-text-primary font-mono">
                    {p.weight_kg.toFixed(1)} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Log Weigh-In"
        description="Record today's body weight so your trainer can track your progress."
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Weight (kg) *
            </label>
            <Input
              type="number"
              step="0.1"
              min="1"
              required
              autoFocus
              placeholder="e.g. 82.3"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              icon={<Scale className="h-4 w-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Body Fat % (optional)
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="70"
              placeholder="e.g. 18.5"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving…
                </>
              ) : (
                "Save Weigh-In"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </MemberShell>
  );
}

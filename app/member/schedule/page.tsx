"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { fitcoreTrainer } from "@/lib/mock-data";
import { useMemberPortal } from "@/components/member/member-portal-provider";
import { formatDate, getTodayISODate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Dumbbell,
  Plus,
  Lock,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function MemberSchedulePage() {
  const { member, sessions, reload } = useMemberPortal();
  // Members are restricted to the current date only.
  const todayISO = getTodayISODate();
  const todaySessions = sessions.filter(
    (ses) => ses.member_id === member.id && ses.date === todayISO
  );
  const upcomingSessions = sessions.filter(
    (ses) => ses.member_id === member.id && ses.date > todayISO
  );

  const [isRequestOpen, setIsRequestOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sessionDate, setSessionDate] = React.useState(todayISO);
  const [startTime, setStartTime] = React.useState("07:00");
  const [endTime, setEndTime] = React.useState("08:00");
  const [focusArea, setFocusArea] = React.useState("1-on-1 Personal Training");
  const [notes, setNotes] = React.useState("");

  const openRequest = () => {
    setSessionDate(todayISO);
    setStartTime("07:00");
    setEndTime("08:00");
    setFocusArea("1-on-1 Personal Training");
    setNotes("");
    setIsRequestOpen(true);
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (endTime <= startTime) {
      toast.error("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/member/sessions/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_date: sessionDate,
          start_time: startTime,
          end_time: endTime,
          focus_area: focusArea,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not book session.");
      }

      toast.success("Session request sent to your trainer!");
      setIsRequestOpen(false);
      await reload();
      window.dispatchEvent(new CustomEvent("fitcore:sessions-changed"));
    } catch (err: any) {
      toast.error(err?.message || "Could not book session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              1-on-1 Sessions Schedule
            </h1>
            <Badge variant="primary">Studio Appointments</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
            <Lock className="h-3 w-3 text-primary" /> Today&apos;s appointments with {fitcoreTrainer.name} at{" "}
            {fitcoreTrainer.gym_name} &bull; {formatDate(new Date())}
          </p>
        </div>

        <Button onClick={openRequest} variant="primary" size="sm" className="shadow-lime-glow-sm">
          <Plus className="h-4 w-4 mr-1.5" /> Request Session Slot
        </Button>
      </div>

      <div className="space-y-4">
        {todaySessions.length === 0 && (
          <Card className="p-8 text-center">
            <Calendar className="h-8 w-8 text-text-muted mx-auto mb-2" />
            <p className="text-sm font-bold text-text-primary">No sessions scheduled for today</p>
            <p className="text-xs text-text-muted mt-1">
              Your schedule only shows the current date. Ask Coach Alex to book a slot.
            </p>
          </Card>
        )}

        {todaySessions.map((ses) => (
          <Card key={ses.id} glowOnHover className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">{ses.title}</h3>
                <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                  <Dumbbell className="h-3 w-3 text-primary" />
                  <span>{ses.focus_area} &bull; Studio 1</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-mono font-bold text-text-primary block">
                {ses.start_time} - {ses.end_time}
              </span>
              <span className="text-[10px] text-text-dim block font-mono">{ses.date}</span>
            </div>
          </Card>
        ))}
      </div>

      {upcomingSessions.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-text-primary">Upcoming Session Requests</h2>
            <Badge variant="neutral">{upcomingSessions.length}</Badge>
          </div>
          <div className="space-y-3">
            {upcomingSessions.map((ses) => (
              <Card key={ses.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{ses.title}</h3>
                  <p className="text-xs text-text-muted">
                    {ses.focus_area || "Training Session"}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-text-primary block">
                    {ses.start_time} - {ses.end_time}
                  </span>
                  <span className="text-[10px] text-text-dim block font-mono">
                    {formatDate(ses.date)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        title="Request a Training Session"
        description="Choose a date and time that suits you — your trainer will see it in their schedule immediately."
        maxWidth="md"
      >
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Session Date
            </label>
            <Input
              type="date"
              required
              value={sessionDate}
              min={todayISO}
              onChange={(e) => setSessionDate(e.target.value)}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Start Time
              </label>
              <Input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                icon={<Clock className="h-4 w-4" />}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                End Time
              </label>
              <Input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                icon={<Clock className="h-4 w-4" />}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Focus Area
            </label>
            <Input
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. Upper Body Strength"
              icon={<Dumbbell className="h-4 w-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Notes for Trainer (optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 h-4 w-4 text-text-muted pointer-events-none" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything your coach should know?"
                className="w-full rounded-xl border border-border bg-[#151B22] pl-10 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-primary/70"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsRequestOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="shadow-lime-glow-sm font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </MemberShell>
  );
}

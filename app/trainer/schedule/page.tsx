"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import { getTodayISODate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Plus,
  Dumbbell,
  Loader2,
  User,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface SessionRow {
  id: string;
  member_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  focus_area: string | null;
  status: string;
  notes: string | null;
}

interface SessionForm {
  memberId: string;
  date: string;
  start: string;
  end: string;
  focus: string;
  notes: string;
}

function normalizeStatus(status: string): "scheduled" | "completed" | "cancelled" {
  const value = status.toLowerCase();
  if (value === "completed") return "completed";
  if (value === "cancelled") return "cancelled";
  return "scheduled";
}

function hhmm(value: string): string {
  return (value || "").slice(0, 5);
}

const EMPTY_FORM = (memberId: string): SessionForm => ({
  memberId,
  date: getTodayISODate(),
  start: "07:00",
  end: "08:00",
  focus: "1-on-1 Personal Training",
  notes: "",
});

export default function TrainerSchedulePage() {
  const { members } = useTrainerMembers();
  const [sessions, setSessions] = React.useState<SessionRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [form, setForm] = React.useState<SessionForm>(EMPTY_FORM(""));

  const loadSessions = React.useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("training_sessions")
      .select("id, member_id, session_date, start_time, end_time, focus_area, status, notes")
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      toast.error(`Could not load sessions: ${error.message}`);
    } else {
      setSessions((data ?? []) as SessionRow[]);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    const run = async () => {
      if (!active) return;
      await loadSessions();
    };
    run();

    return () => {
      active = false;
    };
  }, [loadSessions]);

  // Keep the trainer calendar in sync with member bookings that happen in another
  // session/tab: refresh periodically, on focus, and on a same-tab event.
  React.useEffect(() => {
    const refresh = () => loadSessions();
    const interval = setInterval(refresh, 15000);

    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("fitcore:sessions-changed", refresh);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("fitcore:sessions-changed", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadSessions]);

  const memberNames = React.useMemo(
    () => new Map(members.map((m) => [m.id, m.full_name])),
    [members]
  );

  const openBook = () => {
    setEditingId(null);
    setForm(EMPTY_FORM(members[0]?.id || ""));
    setIsModalOpen(true);
  };

  const openReschedule = (session: SessionRow) => {
    setEditingId(session.id);
    setForm({
      memberId: session.member_id,
      date: session.session_date,
      start: hhmm(session.start_time) || "07:00",
      end: hhmm(session.end_time) || "08:00",
      focus: session.focus_area || "1-on-1 Personal Training",
      notes: session.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.memberId) {
      toast.error("Please select an athlete.");
      return;
    }
    if (!form.date) {
      toast.error("Please choose a session date.");
      return;
    }
    if (!form.start || !form.end || form.end <= form.start) {
      toast.error("End time must be after start time.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("training_sessions")
          .update({
            session_date: form.date,
            start_time: form.start,
            end_time: form.end,
            focus_area: form.focus || "1-on-1 Personal Training",
            notes: form.notes || null,
          })
          .eq("id", editingId);

        if (error) throw new Error(error.message);
        toast.success("Session rescheduled!");
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase.from("training_sessions").insert({
          member_id: form.memberId,
          trainer_id: user?.id ?? null,
          session_date: form.date,
          start_time: form.start,
          end_time: form.end,
          focus_area: form.focus || "1-on-1 Personal Training",
          status: "Scheduled",
          notes: form.notes || null,
        });

        if (error) throw new Error(error.message);
        toast.success("Training session booked!");
      }

      setIsModalOpen(false);
      setEditingId(null);
      await loadSessions();
      window.dispatchEvent(new CustomEvent("fitcore:sessions-changed"));
    } catch (err: any) {
      toast.error(err?.message || "Could not save session.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TrainerShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Training Schedule & 1-on-1 Sessions
            </h1>
            <Badge variant="primary">Calendar View</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Prevent overlapping trainer appointments, manage session statuses, and view daily bookings.
          </p>
        </div>

        <Button
          onClick={openBook}
          variant="primary"
          size="sm"
          className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Book Training Session</span>
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-10 text-center text-sm text-text-muted">Loading sessions…</Card>
      ) : sessions.length === 0 ? (
        <Card className="p-10 flex flex-col items-center gap-3 text-center">
          <Calendar className="h-8 w-8 text-primary" />
          <h3 className="text-base font-bold text-text-primary">No sessions booked</h3>
          <p className="text-xs text-text-muted max-w-sm">
            Book a 1-on-1 session with any athlete and it will appear on this schedule.
          </p>
          <Button onClick={openBook} variant="primary" size="sm" className="shadow-lime-glow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Book Training Session
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const status = normalizeStatus(session.status);

            return (
              <Card key={session.id} glowOnHover className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-text-primary">
                        {memberNames.get(session.member_id) || "Unknown athlete"}
                      </h3>
                      <Badge variant={status === "completed" ? "completed" : status === "scheduled" ? "scheduled" : "expired"}>
                        {status}
                      </Badge>
                      {session.notes?.includes("Requested by member") && (
                        <Badge variant="expiring">Member Request</Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5 font-medium">
                      <Dumbbell className="h-3 w-3 text-primary" />
                      <span>{session.focus_area || "Training Session"}</span>
                    </p>
                    {session.notes && (
                      <p className="text-[11px] text-text-dim mt-1">{session.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-text-primary flex items-center gap-1 sm:justify-end">
                      <Clock className="h-3.5 w-3.5 text-text-muted" />
                      <span>{hhmm(session.start_time)} - {hhmm(session.end_time)}</span>
                    </span>
                    <span className="text-[10px] text-text-muted block mt-0.5 font-mono">
                      {session.session_date}
                    </span>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => openReschedule(session)}>
                    Reschedule
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Reschedule Session" : "Book Training Session"}
        description={
          editingId
            ? "Update the date, time, or focus of this appointment."
            : "Create a new 1-on-1 session for an athlete."
        }
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Athlete
            </label>
            <div className="relative flex items-center w-full">
              <User className="absolute left-3.5 h-4 w-4 text-text-muted pointer-events-none" />
              <select
                value={form.memberId}
                onChange={(e) => setForm({ ...form, memberId: e.target.value })}
                disabled={!!editingId}
                className="flex h-10 w-full rounded-xl border border-border bg-[#151B22] pl-10 pr-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary/70 disabled:opacity-60"
              >
                {members.length === 0 && <option value="">No athletes available</option>}
                {members.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#151B22] text-text-primary">
                    {m.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Session Date
            </label>
            <Input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
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
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
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
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                icon={<Clock className="h-4 w-4" />}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Focus Area
            </label>
            <Input
              value={form.focus}
              onChange={(e) => setForm({ ...form, focus: e.target.value })}
              placeholder="e.g. Upper Body Strength"
              icon={<Dumbbell className="h-4 w-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Notes (optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 h-4 w-4 text-text-muted pointer-events-none" />
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Session plan or athlete instructions..."
                className="w-full rounded-xl border border-border bg-[#151B22] pl-10 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-primary/70"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving || members.length === 0}
              className="shadow-lime-glow-sm font-bold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Book Session"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </TrainerShell>
  );
}

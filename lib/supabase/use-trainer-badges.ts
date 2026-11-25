"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { getTodayISODate } from "@/lib/utils";
import {
  fitcoreMembers,
  sampleNotifications,
  samplePayments,
  sampleSessions,
} from "@/lib/mock-data";

interface AttendanceRow {
  member_id: string;
  status: string;
}

interface SessionRow {
  session_date: string;
  status: string;
}

interface PaymentRow {
  member_id: string;
  status: string;
}

interface NotificationRow {
  read: boolean;
}

export interface TrainerBadges {
  members: string | null;
  attendance: string | null;
  attendanceAbsent: string | null;
  schedule: string | null;
  payments: string | null;
  notifications: string | null;
}

const EMPTY_BADGES: TrainerBadges = {
  members: null,
  attendance: null,
  attendanceAbsent: null,
  schedule: null,
  payments: null,
  notifications: null,
};

const BADGE_EVENTS = [
  "fitcore:members-changed",
  "fitcore:member-created",
  "fitcore:sessions-changed",
  "fitcore:attendance-changed",
  "fitcore:payments-changed",
  "fitcore:notifications-changed",
  "fitcore:badges-refresh",
];

function isPresent(status: string): boolean {
  return status.toLowerCase() === "present";
}

function isAbsent(status: string): boolean {
  return status.toLowerCase() === "absent";
}

function isCancelled(status: string): boolean {
  return status.toLowerCase() === "cancelled";
}

function isPaid(status: string): boolean {
  return status.toLowerCase() === "paid";
}

/**
 * Counts how many invoices are still owed. Mirrors the payments page: every
 * non-paid payment is due, and a member with no payment record at all shows a
 * pending proforma invoice.
 */
function countDues(memberIds: string[], payments: PaymentRow[]): number {
  const paymentsByMember = new Map<string, PaymentRow[]>();
  payments.forEach((payment) => {
    const list = paymentsByMember.get(payment.member_id) ?? [];
    list.push(payment);
    paymentsByMember.set(payment.member_id, list);
  });

  let dues = 0;
  memberIds.forEach((id) => {
    const memberPayments = paymentsByMember.get(id) ?? [];
    if (memberPayments.length === 0) {
      dues += 1;
      return;
    }
    dues += memberPayments.filter((payment) => !isPaid(payment.status)).length;
  });
  return dues;
}

function buildBadges(
  memberIds: string[],
  attendance: AttendanceRow[],
  sessions: SessionRow[],
  payments: PaymentRow[],
  notifications: NotificationRow[],
  today: string
): TrainerBadges {
  const presentToday = attendance.filter(
    (row) => row.status && isPresent(row.status)
  ).length;

  const absentToday = attendance.filter(
    (row) => row.status && isAbsent(row.status)
  ).length;

  const sessionsToday = sessions.filter(
    (row) => row.session_date?.slice(0, 10) === today && !isCancelled(row.status)
  ).length;

  const dues = countDues(memberIds, payments);
  const unread = notifications.filter((row) => !row.read).length;

  return {
    members: memberIds.length > 0 ? String(memberIds.length) : null,
    attendance: memberIds.length > 0 ? `${presentToday}/${memberIds.length}` : null,
    attendanceAbsent: absentToday > 0 ? `${absentToday} Absent` : null,
    schedule: sessionsToday > 0 ? `${sessionsToday} Today` : null,
    payments: dues > 0 ? `${dues} Due` : null,
    notifications: unread > 0 ? String(unread) : null,
  };
}

function mockBadges(): TrainerBadges {
  const today = getTodayISODate();
  return buildBadges(
    fitcoreMembers.map((member) => member.id),
    [],
    sampleSessions.map((session) => ({
      session_date: session.date,
      status: session.status,
    })),
    samplePayments.map((payment) => ({
      member_id: payment.member_id,
      status: payment.status,
    })),
    sampleNotifications.map((notification) => ({ read: notification.is_read })),
    today
  );
}

/**
 * Live sidebar badge counts for the trainer module, derived from the same
 * Supabase tables the pages read. Falls back to the bundled demo data when
 * Supabase is not configured.
 */
export function useTrainerBadges() {
  const [badges, setBadges] = React.useState<TrainerBadges>(EMPTY_BADGES);

  const reload = React.useCallback(async () => {
    const supabase = createClient();

    if (!supabase) {
      setBadges(mockBadges());
      return;
    }

    const today = getTodayISODate();

    const [membersRes, attendanceRes, sessionsRes, paymentsRes, notificationsRes] =
      await Promise.all([
        supabase.from("members").select("id"),
        supabase.from("attendance").select("member_id, status").eq("date", today),
        supabase.from("training_sessions").select("session_date, status"),
        supabase.from("payments").select("member_id, status"),
        supabase.from("notifications").select("read"),
      ]);

    if (membersRes.error) {
      setBadges(EMPTY_BADGES);
      return;
    }

    setBadges(
      buildBadges(
        ((membersRes.data ?? []) as { id: string }[]).map((row) => row.id),
        (attendanceRes.data ?? []) as AttendanceRow[],
        (sessionsRes.data ?? []) as SessionRow[],
        (paymentsRes.data ?? []) as PaymentRow[],
        (notificationsRes.data ?? []) as NotificationRow[],
        today
      )
    );
  }, []);

  React.useEffect(() => {
    reload();

    const refresh = () => reload();
    BADGE_EVENTS.forEach((event) => window.addEventListener(event, refresh));
    window.addEventListener("focus", refresh);

    const onVisible = () => {
      if (document.visibilityState === "visible") reload();
    };
    document.addEventListener("visibilitychange", onVisible);

    // Attendance and roster edits can also happen from another tab/session, so
    // keep the counts converging without relying only on local events.
    const interval = window.setInterval(refresh, 20000);

    return () => {
      BADGE_EVENTS.forEach((event) => window.removeEventListener(event, refresh));
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
    };
  }, [reload]);

  return badges;
}

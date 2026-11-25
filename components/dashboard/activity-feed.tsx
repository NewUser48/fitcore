"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Activity, Receipt, UserPlus, Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PaymentRow {
  id: string;
  member_id: string;
  amount: number;
  status: string;
  payment_date: string | null;
}

interface FeedEvent {
  id: string;
  athlete: string;
  action: string;
  details: string;
  time: string;
  icon: typeof Activity;
  accent: string;
}

export function ActivityFeedWidget() {
  const { members } = useTrainerMembers();
  const [payments, setPayments] = React.useState<PaymentRow[]>([]);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("id, member_id, amount, status, payment_date")
        .order("payment_date", { ascending: false })
        .limit(5);

      if (!active || error) return;
      setPayments((data ?? []) as PaymentRow[]);
    })();

    return () => {
      active = false;
    };
  }, []);

  const memberNames = React.useMemo(
    () => new Map(members.map((m) => [m.id, m.full_name])),
    [members]
  );

  const events = React.useMemo<FeedEvent[]>(() => {
    const paymentEvents: FeedEvent[] = payments.map((payment) => {
      const isPaid = payment.status.toLowerCase() === "paid";
      return {
        id: `payment_${payment.id}`,
        athlete: memberNames.get(payment.member_id) || "Unknown athlete",
        action: isPaid ? "Payment Received" : `Payment ${payment.status}`,
        details: `${formatCurrency(Number(payment.amount))} recorded`,
        time: payment.payment_date ? formatDate(payment.payment_date) : "—",
        icon: Receipt,
        accent: isPaid
          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          : "text-amber-400 bg-amber-500/10 border-amber-500/20",
      };
    });

    const enrollmentEvents: FeedEvent[] = members.slice(0, 5).map((member) => ({
      id: `member_${member.id}`,
      athlete: member.full_name,
      action: "New Athlete Enrolled",
      details: `${member.membership_plan_name} • ${member.phone}`,
      time: member.created_at ? formatDate(member.created_at) : "—",
      icon: UserPlus,
      accent: "text-primary bg-primary/10 border-primary/20",
    }));

    return [...paymentEvents, ...enrollmentEvents];
  }, [payments, members, memberNames]);

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Live Member Activity Feed
              </h3>
              <p className="text-[11px] text-text-muted">
                Recent enrollments & fee collections
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
            Auto-Sync
          </span>
        </div>

        <div className="space-y-3 mt-4">
          {events.length === 0 ? (
            <p className="py-6 text-center text-xs text-text-muted">
              No member activity recorded yet.
            </p>
          ) : (
            events.map((ev) => {
              const Icon = ev.icon;
              return (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl bg-[#151B22] border border-border hover:border-primary/30 transition-colors flex items-start gap-3"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${ev.accent}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary">
                        {ev.athlete}
                      </span>
                      <span className="text-[10px] text-text-dim flex items-center gap-1 font-mono">
                        <Clock className="h-2.5 w-2.5" />
                        {ev.time}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-primary mt-0.5">
                      {ev.action}
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                      {ev.details}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          All milestones saved to progress history
        </span>
        <Link
          href="/trainer/progress"
          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
        >
          View Progress &rarr;
        </Link>
      </div>
    </Card>
  );
}

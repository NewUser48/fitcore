"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import { formatCurrency } from "@/lib/utils";

interface PendingPaymentRow {
  id: string;
  member_id: string;
  amount: number;
  status: string;
}

interface AttentionFlag {
  id: string;
  member: string;
  issue: string;
  severity: "high" | "critical" | "medium";
  type: string;
  contact: string;
  action: string;
}

export function AttentionWidget() {
  const { members } = useTrainerMembers();
  const [pendingPayments, setPendingPayments] = React.useState<PendingPaymentRow[]>([]);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("id, member_id, amount, status");

      if (!active || error) return;

      setPendingPayments(
        ((data ?? []) as PendingPaymentRow[]).filter((p) => {
          const status = p.status.toLowerCase();
          return status === "pending" || status === "overdue";
        })
      );
    })();

    return () => {
      active = false;
    };
  }, []);

  const flags = React.useMemo(() => {
    const list: AttentionFlag[] = [];
    const memberById = new Map(members.map((m) => [m.id, m]));

    members.forEach((member) => {
      if (member.membership_status === "expired") {
        list.push({
          id: `expired_${member.id}`,
          member: member.full_name,
          issue: `Membership expired — ${member.membership_plan_name} needs renewal`,
          severity: "critical",
          type: "Overdue Renewal",
          contact: member.phone,
          action: "Review Dues",
        });
      } else if (member.membership_status === "expiring") {
        list.push({
          id: `expiring_${member.id}`,
          member: member.full_name,
          issue: `${member.membership_plan_name} expires soon`,
          severity: "high",
          type: "Expiring Soon",
          contact: member.phone,
          action: "Message Athlete",
        });
      } else if (member.membership_status === "inactive") {
        list.push({
          id: `inactive_${member.id}`,
          member: member.full_name,
          issue: "Membership is inactive",
          severity: "medium",
          type: "Inactive Athlete",
          contact: member.phone,
          action: "Message Athlete",
        });
      }
    });

    pendingPayments.forEach((payment) => {
      const member = memberById.get(payment.member_id);
      if (!member) return;

      list.push({
        id: `payment_${payment.id}`,
        member: member.full_name,
        issue: `${formatCurrency(Number(payment.amount))} balance pending (${payment.status})`,
        severity: payment.status.toLowerCase() === "overdue" ? "critical" : "high",
        type: "Balance Pending",
        contact: member.phone,
        action: "Review Dues",
      });
    });

    return list;
  }, [members, pendingPayments]);

  const highPriority = flags.filter((f) => f.severity !== "medium").length;

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Members Requiring Attention
              </h3>
              <p className="text-[11px] text-text-muted">
                Retention, drop-off & payment alerts
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            {highPriority} High Priority
          </span>
        </div>

        <div className="space-y-3 mt-4">
          {flags.length === 0 ? (
            <p className="py-6 text-center text-xs text-text-muted">
              No athletes require attention right now.
            </p>
          ) : (
            flags.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#151B22] border border-border hover:border-rose-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">
                        {item.member}
                      </span>
                      <Badge variant={item.severity === "critical" ? "expired" : "pending"}>
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-text-muted mt-1 leading-snug">
                      {item.issue}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[10px] text-text-dim">
                    Phone: {item.contact}
                  </span>
                  <a
                    href={`https://wa.me/${item.contact.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>{item.action}</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Continuous drop-off detection
        </span>
        <Link
          href="/trainer/members"
          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
        >
          Open Member Directory &rarr;
        </Link>
      </div>
    </Card>
  );
}

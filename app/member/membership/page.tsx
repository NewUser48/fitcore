"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemberPortal } from "@/components/member/member-portal-provider";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Receipt, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function MemberMembershipPage() {
  const { member, payments } = useMemberPortal();

  const handleDownload = () => {
    toast.success(`Downloaded official receipt for ${member.membership_plan_name}`);
  };

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              My Membership & Invoices
            </h1>
            <Badge variant={member.membership_status === "active" ? "active" : "expiring"}>
              {member.membership_status}
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Active subscription terms, valid duration, and downloadable payment receipts in ₹ INR.
          </p>
        </div>
      </div>

      <Card glowOnHover className="p-6 mb-6 border-primary/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
              Active Tier
            </span>
            <h2 className="text-lg font-bold text-text-primary">{member.membership_plan_name}</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Valid from {formatDate(member.membership_start_date)} to {formatDate(member.membership_end_date)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-text-muted block">Fee Paid</span>
            <span className="text-2xl font-black text-primary font-display">{formatCurrency(member.membership_fee || 22500)}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5 text-primary" /> Download Invoice PDF
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
          <Receipt className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-text-primary">Payment Receipts</h3>
        </div>

        {payments.length === 0 ? (
          <p className="text-xs text-text-muted">No payment records yet.</p>
        ) : (
          <div className="space-y-2">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#151B22] border border-border/60 text-xs"
              >
                <div>
                  <p className="font-bold text-text-primary">{payment.notes || payment.invoice_number}</p>
                  <p className="text-[10px] text-text-muted font-mono">
                    {payment.invoice_number} &bull; {payment.payment_date ? formatDate(payment.payment_date) : "—"} &bull; {payment.payment_method}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-primary">{formatCurrency(payment.amount)}</p>
                  <p className="text-[10px] uppercase text-emerald-400">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </MemberShell>
  );
}

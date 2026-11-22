"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fitcoreMembers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Receipt, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function MemberMembershipPage() {
  const member = fitcoreMembers[0];

  const handleDownload = () => {
    toast.success("Downloaded official receipt for Transform 90-Day VIP");
  };

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              My Membership & Invoices
            </h1>
            <Badge variant="active">All Fees Paid</Badge>
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
    </MemberShell>
  );
}

"use client";

import * as React from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleMembers, samplePayments } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Receipt, Download, CheckCircle2, ShieldCheck, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function MemberBillingPage() {
  const member = sampleMembers[0];

  const handleDownloadReceipt = (invoice: string) => {
    toast.success(`Downloaded official payment receipt for ${invoice}`);
  };

  return (
    <PortalShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Membership Plan & Receipts
            </h1>
            <Badge variant="active">All Fees Paid</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Subscription duration, payment receipts in ₹ INR, and invoice history.
          </p>
        </div>
      </div>

      {/* Current Active Plan Card */}
      <Card glowOnHover className="p-6 mb-6 border-primary/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
              Current Active Package
            </span>
            <h2 className="text-lg font-bold text-text-primary">
              {member.membership_plan_name}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Valid from {formatDate(member.membership_start_date)} to {formatDate(member.membership_end_date)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-text-muted block">Fee Paid</span>
            <span className="text-2xl font-black text-primary font-display">
              {formatCurrency(22500)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-text-muted">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>36 Coaching Sessions Included</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>Customized Macro & Diet Protocols</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>Direct Trainer In-App Support</span>
          </div>
        </div>
      </Card>

      {/* Receipts Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-[#151B22] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Payment & Invoice History
          </h3>
          <span className="text-xs text-text-dim">Official Trainer Receipts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151B22] text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-[#1E2630] transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-text-primary">
                  INV-2026-089
                </td>
                <td className="py-3.5 px-4 font-medium text-text-primary">
                  Transform 90-Day VIP Package
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-primary">
                  {formatCurrency(22500)}
                </td>
                <td className="py-3.5 px-4 text-text-muted">UPI / Direct</td>
                <td className="py-3.5 px-4 text-text-muted">Nov 20, 2026</td>
                <td className="py-3.5 px-4">
                  <Badge variant="paid">Paid in Full</Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadReceipt("INV-2026-089")}
                    className="h-8 px-2 text-primary hover:text-primary"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" /> PDF
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </PortalShell>
  );
}

"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { samplePayments, sampleMembershipPlans } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { IndianRupee, Plus, Download, Receipt, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function BillingPage() {
  const handleDownloadReceipt = (invoice: string) => {
    toast.success(`Generated printable PDF receipt for ${invoice}`);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Membership Plans & Fee Collection
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              ₹ INR Default
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Trainer fee billing, partial payments, automated invoices, and plan management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="sm" className="flex items-center gap-2 shadow-lime-glow-sm">
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Record Payment</span>
          </Button>
        </div>
      </div>

      {/* Plan Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {sampleMembershipPlans.map((plan) => (
          <Card key={plan.id} glowOnHover className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="primary">{plan.duration_type}</Badge>
                <span className="text-xs text-text-muted font-mono">{plan.duration_days} Days</span>
              </div>

              <h3 className="text-base font-bold text-text-primary mb-1">
                {plan.name}
              </h3>
              <p className="text-xs text-text-muted mb-4">{plan.description}</p>

              <div className="mb-4">
                <span className="text-2xl font-black text-primary font-display">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-xs text-text-dim ml-1">/ athlete</span>
              </div>

              <div className="space-y-1.5 border-t border-border/60 pt-3 mb-4">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-text-muted">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-text-muted">{plan.member_count} Enrolled</span>
              <Button variant="secondary" size="sm">Edit Plan</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Invoices and Payments Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-[#151B22] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Payment Transactions</h3>
            <p className="text-xs text-text-muted">Direct receipts issued to athletes</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151B22] text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {samplePayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-[#1E2630] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-text-primary">
                    {pay.invoice_number}
                  </td>
                  <td className="py-3 px-4 font-bold text-text-primary">
                    {pay.member_name}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-text-primary">
                    {formatCurrency(pay.amount)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {formatCurrency(pay.paid_amount)}
                  </td>
                  <td className="py-3 px-4 text-text-muted">{pay.payment_method}</td>
                  <td className="py-3 px-4 text-text-muted">{formatDate(pay.payment_date)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={pay.status === "paid" ? "paid" : pay.status === "partial" ? "pending" : "overdue"}>
                      {pay.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadReceipt(pay.invoice_number)}
                      className="h-8 px-2 text-primary hover:text-primary"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}

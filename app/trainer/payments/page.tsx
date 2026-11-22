"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { samplePayments } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { IndianRupee, Plus, Download, Receipt } from "lucide-react";
import { toast } from "sonner";

export default function TrainerPaymentsPage() {
  const handleReceipt = (inv: string) => {
    toast.success(`Generated official PDF invoice for ${inv}`);
  };

  return (
    <TrainerShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              Payment Transactions & Invoices
            </h1>
            <Badge variant="primary">₹ INR Currency</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Track collected coaching fees, partial payments, and overdue balances.
          </p>
        </div>

        <Button variant="primary" size="sm" className="shadow-lime-glow-sm flex items-center gap-1.5 font-bold">
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Record Payment</span>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151B22] text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Total Amount</th>
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
                      onClick={() => handleReceipt(pay.invoice_number)}
                      className="h-8 px-2 text-primary"
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
    </TrainerShell>
  );
}

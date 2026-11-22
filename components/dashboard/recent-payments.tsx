"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { samplePayments } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { IndianRupee, Download, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function RecentPaymentsWidget() {
  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <IndianRupee className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Recent Fee Payments
              </h3>
              <p className="text-[11px] text-text-muted">
                Direct member fee collection log (₹ INR)
              </p>
            </div>
          </div>
          <Link
            href="/billing"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            All Invoices &rarr;
          </Link>
        </div>

        <div className="space-y-3 mt-4">
          {samplePayments.map((payment) => {
            const isPaid = payment.status === "paid";
            const isPartial = payment.status === "partial";
            const isOverdue = payment.status === "overdue";

            return (
              <div
                key={payment.id}
                className="p-3.5 rounded-xl bg-[#151B22] border border-border hover:border-border-highlight transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isPaid
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : isPartial
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    ₹
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">
                        {payment.member_name}
                      </span>
                      <Badge variant={isPaid ? "paid" : isPartial ? "pending" : "overdue"}>
                        {payment.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">
                      {payment.invoice_number} &bull; {payment.payment_method} &bull; {formatDate(payment.payment_date)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-text-primary block">
                    {formatCurrency(payment.paid_amount)}
                  </span>
                  {payment.amount > payment.paid_amount && (
                    <span className="text-[10px] text-rose-400 block font-medium">
                      Bal: {formatCurrency(payment.amount - payment.paid_amount)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Printable receipts enabled
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/billing">Record New Payment</Link>
        </Button>
      </div>
    </Card>
  );
}

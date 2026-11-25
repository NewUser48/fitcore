"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import { formatCurrency, formatDate } from "@/lib/utils";
import { IndianRupee } from "lucide-react";
import Link from "next/link";

interface PaymentRow {
  id: string;
  member_id: string;
  invoice_no: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_date: string | null;
}

function normalizeStatus(status: string): "paid" | "pending" | "overdue" {
  const value = status.toLowerCase();
  if (value === "paid") return "paid";
  if (value === "overdue") return "overdue";
  return "pending";
}

export function RecentPaymentsWidget() {
  const { members } = useTrainerMembers();
  const [payments, setPayments] = React.useState<PaymentRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("id, member_id, invoice_no, amount, status, payment_method, payment_date")
        .order("payment_date", { ascending: false })
        .limit(5);

      if (!active) return;

      if (!error) setPayments((data ?? []) as PaymentRow[]);
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const memberNames = React.useMemo(
    () => new Map(members.map((m) => [m.id, m.full_name])),
    [members]
  );

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
            href="/trainer/payments"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            All Invoices &rarr;
          </Link>
        </div>

        <div className="space-y-3 mt-4">
          {isLoading ? (
            <p className="py-6 text-center text-xs text-text-muted">Loading payments…</p>
          ) : payments.length === 0 ? (
            <p className="py-6 text-center text-xs text-text-muted">
              No payments recorded yet.
            </p>
          ) : (
            payments.map((payment) => {
              const status = normalizeStatus(payment.status);
              const isPaid = status === "paid";
              const isPartial = status === "pending";
              const paidAmount = isPaid ? Number(payment.amount) : 0;

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
                          {memberNames.get(payment.member_id) || "Unknown athlete"}
                        </span>
                        <Badge variant={isPaid ? "paid" : isPartial ? "pending" : "overdue"}>
                          {status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {payment.invoice_no} &bull; {payment.payment_method} &bull;{" "}
                        {payment.payment_date ? formatDate(payment.payment_date) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-text-primary block">
                      {formatCurrency(paidAmount)}
                    </span>
                    {!isPaid && (
                      <span className="text-[10px] text-rose-400 block font-medium">
                        Bal: {formatCurrency(Number(payment.amount))}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Printable receipts enabled
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/trainer/payments">Record New Payment</Link>
        </Button>
      </div>
    </Card>
  );
}

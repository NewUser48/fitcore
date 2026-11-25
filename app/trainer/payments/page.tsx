"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useTrainerMembers } from "@/lib/supabase/use-trainer-members";
import { openInvoicePdf, downloadInvoicePdf } from "@/lib/pdf/invoice";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface PaymentRow {
  id: string;
  member_id: string;
  invoice_no: string;
  plan_name: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_date: string | null;
  due_date: string | null;
}

interface InvoiceRow {
  key: string;
  isProforma: boolean;
  invoiceNo: string;
  status: "paid" | "pending" | "overdue";
  memberName: string;
  memberPhone: string;
  planName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  paymentMethod: string | null;
  paymentDate: string | null;
  dueDate: string | null;
}

function normalizeStatus(status: string): "paid" | "pending" | "overdue" {
  const value = status.toLowerCase();
  if (value === "paid") return "paid";
  if (value === "overdue") return "overdue";
  return "pending";
}

export default function TrainerPaymentsPage() {
  const { members, isLoading: isLoadingMembers } = useTrainerMembers();
  const [payments, setPayments] = React.useState<PaymentRow[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoadingPayments(false);
      return;
    }

    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("id, member_id, invoice_no, plan_name, amount, status, payment_method, payment_date, due_date")
        .order("payment_date", { ascending: false });

      if (!active) return;

      if (error) {
        toast.error(`Could not load payments: ${error.message}`);
      } else {
        setPayments((data ?? []) as PaymentRow[]);
      }
      setIsLoadingPayments(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const invoiceRows = React.useMemo<InvoiceRow[]>(() => {
    const paymentsByMember = new Map<string, PaymentRow[]>();
    payments.forEach((payment) => {
      const list = paymentsByMember.get(payment.member_id) ?? [];
      list.push(payment);
      paymentsByMember.set(payment.member_id, list);
    });

    const rows: InvoiceRow[] = [];

    members.forEach((member) => {
      const memberPayments = paymentsByMember.get(member.id) ?? [];

      if (memberPayments.length === 0) {
        const amount = Number(member.membership_fee ?? 0);
        rows.push({
          key: `proforma_${member.id}`,
          isProforma: true,
          invoiceNo: `PRO-${member.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
          status: "pending",
          memberName: member.full_name,
          memberPhone: member.phone,
          planName: member.membership_plan_name,
          amount,
          paidAmount: 0,
          balance: amount,
          paymentMethod: null,
          paymentDate: null,
          dueDate: member.membership_start_date || null,
        });
        return;
      }

      memberPayments.forEach((payment) => {
        const status = normalizeStatus(payment.status);
        const amount = Number(payment.amount ?? 0);
        const paidAmount = status === "paid" ? amount : 0;

        rows.push({
          key: payment.id,
          isProforma: false,
          invoiceNo: payment.invoice_no,
          status,
          memberName: member.full_name,
          memberPhone: member.phone,
          planName: payment.plan_name || member.membership_plan_name,
          amount,
          paidAmount,
          balance: amount - paidAmount,
          paymentMethod: payment.payment_method,
          paymentDate: payment.payment_date,
          dueDate: payment.due_date,
        });
      });
    });

    return rows;
  }, [members, payments]);

  const isLoading = isLoadingMembers || isLoadingPayments;

  const handleOpenPdf = (row: InvoiceRow) => {
    try {
      openInvoicePdf(row);
    } catch (error: any) {
      toast.error(`Could not open invoice: ${error.message}`);
    }
  };

  const handleDownloadPdf = (row: InvoiceRow) => {
    try {
      downloadInvoicePdf(row);
      toast.success(`Downloaded invoice ${row.invoiceNo}.pdf`);
    } catch (error: any) {
      toast.error(`Could not download invoice: ${error.message}`);
    }
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
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              {isLoading ? "…" : `${members.length} Athletes`}
            </span>
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
                <th className="py-3 px-4 text-right">Invoice PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-text-muted">
                    Loading invoices…
                  </td>
                </tr>
              ) : invoiceRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-text-muted">
                    No athletes on the roster yet.
                  </td>
                </tr>
              ) : (
                invoiceRows.map((row) => (
                  <tr key={row.key} className="hover:bg-[#1E2630] transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-text-primary">{row.invoiceNo}</p>
                      {row.isProforma && (
                        <p className="text-[10px] text-text-dim mt-0.5">Proforma (not billed)</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-text-primary">{row.memberName}</p>
                      <p className="text-[10px] text-text-muted font-mono">{row.memberPhone}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-text-primary">
                      {formatCurrency(row.amount)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {formatCurrency(row.paidAmount)}
                    </td>
                    <td className="py-3 px-4 text-text-muted">{row.paymentMethod || "—"}</td>
                    <td className="py-3 px-4 text-text-muted">
                      {row.paymentDate ? formatDate(row.paymentDate) : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          row.status === "paid"
                            ? "paid"
                            : row.status === "pending"
                            ? "pending"
                            : "overdue"
                        }
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenPdf(row)}
                          className="h-8 px-2"
                          title="Open invoice PDF"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDownloadPdf(row)}
                          className="h-8 px-2"
                          title="Download invoice PDF"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" /> PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </TrainerShell>
  );
}

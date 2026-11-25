import { jsPDF } from "jspdf";

export interface InvoicePdfData {
  invoiceNo: string;
  isProforma?: boolean;
  status: "paid" | "pending" | "overdue";
  memberName: string;
  memberPhone?: string;
  planName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  paymentMethod?: string | null;
  paymentDate?: string | null;
  dueDate?: string | null;
}

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 18;

function money(value: number) {
  return `INR ${Math.round(value).toLocaleString("en-IN")}`;
}

function displayDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function buildInvoicePdf(data: InvoicePdfData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const left = MARGIN;
  const right = PAGE_WIDTH - MARGIN;
  const contentWidth = right - left;

  // Header band
  doc.setFillColor(16, 21, 27);
  doc.rect(0, 0, PAGE_WIDTH, 46, "F");

  doc.setTextColor(184, 255, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("FITCORE", left, 21);

  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Performance Center | Trainer Admin OS", left, 28);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(data.isProforma ? "PROFORMA INVOICE" : "INVOICE", right, 21, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text(`# ${data.invoiceNo}`, right, 28, { align: "right" });

  // Billed to / invoice meta
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("BILLED TO", left, 60);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(13);
  doc.text(data.memberName || "Athlete", left, 68);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  if (data.memberPhone) doc.text(data.memberPhone, left, 74);
  doc.text(`Plan: ${data.planName}`, left, 79);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("INVOICE DATE", right - 50, 60);
  doc.text("DUE DATE", right - 50, 70);
  doc.text("STATUS", right - 50, 80);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);
  const invoiceDate = data.paymentDate || new Date().toISOString();
  doc.text(displayDate(invoiceDate), right, 60, { align: "right" });
  doc.text(displayDate(data.dueDate), right, 70, { align: "right" });
  doc.text(data.status.toUpperCase(), right, 80, { align: "right" });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(left, 88, right, 88);

  // Line items table
  const tableTop = 96;
  doc.setFillColor(243, 244, 246);
  doc.rect(left, tableTop, contentWidth, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);
  doc.text("DESCRIPTION", left + 3, tableTop + 6.5);
  doc.text("AMOUNT", 125, tableTop + 6.5);
  doc.text("PAID", 158, tableTop + 6.5);
  doc.text("BALANCE", right - 3, tableTop + 6.5, { align: "right" });

  const rowY = tableTop + 21;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  const description = doc.splitTextToSize(
    `${data.planName} - coaching membership`,
    95
  );
  doc.text(description, left + 3, rowY);

  doc.setFont("helvetica", "normal");
  doc.text(money(data.amount), 125, rowY);
  doc.text(money(data.paidAmount), 158, rowY);
  doc.text(money(data.balance), right - 3, rowY, { align: "right" });

  doc.setDrawColor(226, 232, 240);
  doc.line(left, rowY + 6, right, rowY + 6);

  // Totals block
  const totalsTop = rowY + 18;
  const labelX = 125;

  const totalRow = (label: string, value: string, y: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 9.5);
    doc.setTextColor(bold ? 17 : 71, bold ? 24 : 85, bold ? 39 : 105);
    doc.text(label, labelX, y);
    doc.text(value, right - 3, y, { align: "right" });
  };

  totalRow("Subtotal", money(data.amount), totalsTop);
  totalRow("Amount paid", money(data.paidAmount), totalsTop + 8);

  doc.setDrawColor(226, 232, 240);
  doc.line(labelX, totalsTop + 12, right, totalsTop + 12);

  totalRow("Balance due", money(data.balance), totalsTop + 19, true);

  // Payment details
  const detailsTop = totalsTop + 38;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("PAYMENT DETAILS", left, detailsTop);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Method: ${data.paymentMethod || "Not recorded"}`, left, detailsTop + 7);
  doc.text(`Payment date: ${displayDate(data.paymentDate)}`, left, detailsTop + 13);

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(left, PAGE_HEIGHT - 26, right, PAGE_HEIGHT - 26);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "This is a computer generated invoice from FITCORE Trainer OS. No signature required.",
    left,
    PAGE_HEIGHT - 19
  );
  doc.text(`Generated on ${displayDate(new Date().toISOString())}`, right, PAGE_HEIGHT - 19, {
    align: "right",
  });

  return doc;
}

export function openInvoicePdf(data: InvoicePdfData) {
  const url = buildInvoicePdf(data).output("bloburl").toString();
  window.open(url, "_blank", "noopener,noreferrer");
}

export function downloadInvoicePdf(data: InvoicePdfData) {
  const safeName = data.invoiceNo.replace(/[^\w-]+/g, "_");
  buildInvoicePdf(data).save(`${safeName}.pdf`);
}

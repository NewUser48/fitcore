"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, UserX, AlertTriangle, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AttentionWidget() {
  const flags = [
    {
      id: "flag_1",
      member: "Arjun Singhania",
      issue: "Missed 3 consecutive scheduled workouts",
      severity: "high",
      type: "Attendance Dropped",
      contact: "+91 97112 34567",
      action: "Message Athlete",
    },
    {
      id: "flag_2",
      member: "Devendra Patel",
      issue: "Membership expired 2 days ago & balance pending ₹8,500",
      severity: "critical",
      type: "Overdue Renewal",
      contact: "+91 98980 11223",
      action: "Review Dues",
    },
    {
      id: "flag_3",
      member: "Rohan Malhotra",
      issue: "ACL sprain follow-up due before next heavy leg session",
      severity: "medium",
      type: "Injury Protocol",
      contact: "+91 98201 12345",
      action: "View Medical Notes",
    },
  ];

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
                Retention, drop-off & medical alerts
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            3 High Priority
          </span>
        </div>

        <div className="space-y-3 mt-4">
          {flags.map((item) => (
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
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Continuous drop-off detection
        </span>
        <Link
          href="/members"
          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
        >
          Open Member Directory &rarr;
        </Link>
      </div>
    </Card>
  );
}

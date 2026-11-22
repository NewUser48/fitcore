"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleMembers } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Clock, AlertTriangle, ArrowRight, PhoneCall, RefreshCw } from "lucide-react";
import Link from "next/link";

export function ExpiringMembersWidget() {
  const expiringMembers = sampleMembers.filter(
    (m) => m.membership_status === "expiring" || m.membership_status === "expired"
  );

  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Membership Expirations
              </h3>
              <p className="text-[11px] text-text-muted">
                Requires renewal attention
              </p>
            </div>
          </div>
          <Badge variant="expiring">
            {expiringMembers.length} Action Needed
          </Badge>
        </div>

        <div className="space-y-3 mt-4">
          {expiringMembers.map((member) => {
            const isExpired = member.membership_status === "expired";

            return (
              <div
                key={member.id}
                className="p-3.5 rounded-xl bg-[#151B22] border border-border hover:border-orange-500/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar_url || ""}
                      alt={member.full_name}
                      className="h-10 w-10 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary">
                          {member.full_name}
                        </span>
                        <Badge variant={isExpired ? "expired" : "expiring"}>
                          {isExpired ? "Expired" : "Expiring Soon"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {member.membership_plan_name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-text-primary block">
                      {formatDate(member.membership_end_date)}
                    </span>
                    <span className="text-[10px] text-text-dim block mt-0.5">
                      {member.phone}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[10px] text-text-muted truncate">
                    Goal: {member.fitness_goal}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <PhoneCall className="h-3 w-3" /> Remind
                    </a>
                    <Button variant="primary" size="sm" className="h-7 text-[11px] px-2.5">
                      <RefreshCw className="h-3 w-3 mr-1" /> Renew
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Automated renewal alerts active
        </span>
        <Link
          href="/billing"
          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
        >
          Manage Plans &rarr;
        </Link>
      </div>
    </Card>
  );
}

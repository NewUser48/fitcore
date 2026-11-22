"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleNotifications } from "@/lib/mock-data";
import { Bell, Clock, AlertTriangle, CheckCircle2, Check } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(sampleNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              System Notifications & Alerts
            </h1>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              Database-Backed
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time triggers for expiring memberships, overdue payments, and missed attendance sessions.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead}>
          <Check className="h-4 w-4 mr-1.5" />
          <span>Mark All Read</span>
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card key={notif.id} className="p-4 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#25303D] border border-border text-primary shrink-0 mt-0.5">
              {notif.type === "expiring_membership" ? (
                <Clock className="h-4 w-4 text-orange-400" />
              ) : notif.type === "overdue_payment" ? (
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-primary">
                  {notif.title}
                </h3>
                <span className="text-[10px] text-text-dim font-mono">
                  {notif.created_at}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                {notif.message}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}

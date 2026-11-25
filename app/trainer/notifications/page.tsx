"use client";

import * as React from "react";
import { TrainerShell } from "@/components/trainer/trainer-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Bell, Clock, AlertTriangle, CheckCircle2, Check } from "lucide-react";
import { toast } from "sonner";

interface NotificationRow {
  id: string;
  title: string;
  message: string;
  type: string | null;
  read: boolean;
  created_at: string;
}

export default function TrainerNotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
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
        .from("notifications")
        .select("id, title, message, type, read, created_at")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        toast.error(`Could not load notifications: ${error.message}`);
      } else {
        setNotifications((data ?? []) as NotificationRow[]);
      }
      setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    if (unreadIds.length === 0) return;

    const supabase = createClient();
    if (!supabase) {
      toast.success("All notifications marked as read");
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", unreadIds);

    if (error) {
      toast.error(`Could not update notifications: ${error.message}`);
      return;
    }

    window.dispatchEvent(new CustomEvent("fitcore:notifications-changed"));
    toast.success("All notifications marked as read");
  };

  return (
    <TrainerShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              System Notifications & Alerts
            </h1>
            <Badge variant="primary">Database Backed</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time alerts for expiring memberships, overdue balances, and missed attendance sessions.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} disabled={notifications.length === 0}>
          <Check className="h-4 w-4 mr-1.5" />
          <span>Mark All Read</span>
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-10 text-center text-sm text-text-muted">Loading notifications…</Card>
      ) : notifications.length === 0 ? (
        <Card className="p-10 flex flex-col items-center gap-3 text-center">
          <Bell className="h-8 w-8 text-primary" />
          <h3 className="text-base font-bold text-text-primary">No notifications</h3>
          <p className="text-xs text-text-muted max-w-sm">
            Alerts for expiring memberships, overdue balances, and missed attendance will appear here.
          </p>
        </Card>
      ) : (
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
                    {formatDate(notif.created_at)}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </TrainerShell>
  );
}

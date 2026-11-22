"use client";

import * as React from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleSessions, initialTrainerProfile } from "@/lib/mock-data";
import { Calendar, Clock, Dumbbell, MapPin, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function MemberSchedulePage() {
  const [requestSent, setRequestSent] = React.useState(false);

  const handleRequestSession = () => {
    setRequestSent(true);
    toast.success("Training session request sent to Coach Alex Vance!");
  };

  return (
    <PortalShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              1-on-1 Coaching Schedule
            </h1>
            <Badge variant="primary">Studio Sessions</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Confirmed private training slots with {initialTrainerProfile.name} at {initialTrainerProfile.gym_name}.
          </p>
        </div>

        <Button
          onClick={handleRequestSession}
          variant="primary"
          size="sm"
          disabled={requestSent}
          className="shadow-lime-glow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {requestSent ? "Request Pending Review" : "Request Additional Slot"}
        </Button>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sampleSessions.map((session) => (
          <Card key={session.id} glowOnHover className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text-primary">
                      {session.title}
                    </h3>
                    <Badge variant={session.status === "completed" ? "completed" : session.status === "in_progress" ? "primary" : "scheduled"}>
                      {session.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                    <Dumbbell className="h-3 w-3 text-primary" />
                    <span>Focus: {session.focus_area}</span>
                  </p>
                  <p className="text-xs text-text-dim mt-0.5 flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    <span>Apex Performance Lab &bull; Studio 1</span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                <span className="text-xs font-mono font-bold text-text-primary flex items-center gap-1 sm:justify-end">
                  <Clock className="h-3.5 w-3.5 text-text-muted" />
                  <span>{session.start_time} - {session.end_time}</span>
                </span>
                <span className="text-[11px] text-text-muted block mt-0.5 font-mono">
                  {session.date}
                </span>

                {session.notes && (
                  <span className="mt-2 block text-[10px] text-primary italic">
                    Note: {session.notes}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}

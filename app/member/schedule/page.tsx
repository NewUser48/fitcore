"use client";

import * as React from "react";
import { MemberShell } from "@/components/member/member-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleSessions, fitcoreTrainer } from "@/lib/mock-data";
import { Calendar, Clock, Dumbbell, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";

export default function MemberSchedulePage() {
  const handleRequest = () => {
    toast.success("Training session request delivered to Coach Alex!");
  };

  return (
    <MemberShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight font-display">
              1-on-1 Sessions Schedule
            </h1>
            <Badge variant="primary">Studio Appointments</Badge>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Confirmed private appointments with {fitcoreTrainer.name} at {fitcoreTrainer.gym_name}.
          </p>
        </div>

        <Button onClick={handleRequest} variant="primary" size="sm" className="shadow-lime-glow-sm">
          <Plus className="h-4 w-4 mr-1.5" /> Request Session Slot
        </Button>
      </div>

      <div className="space-y-4">
        {sampleSessions.map((ses) => (
          <Card key={ses.id} glowOnHover className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">{ses.title}</h3>
                <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5">
                  <Dumbbell className="h-3 w-3 text-primary" />
                  <span>{ses.focus_area} &bull; Studio 1</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-mono font-bold text-text-primary block">
                {ses.start_time} - {ses.end_time}
              </span>
              <span className="text-[10px] text-text-dim block font-mono">{ses.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </MemberShell>
  );
}

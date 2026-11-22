"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleSessions } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";
import { Calendar, Clock, Dumbbell, Check, Play, UserCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function TodayScheduleWidget() {
  return (
    <Card className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Today&apos;s Training Schedule
              </h3>
              <p className="text-[11px] text-text-muted">
                {sampleSessions.length} sessions booked for today
              </p>
            </div>
          </div>
          <Link
            href="/schedule"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            Full Calendar &rarr;
          </Link>
        </div>

        <div className="space-y-3 mt-4">
          {sampleSessions.map((session) => {
            const isCompleted = session.status === "completed";
            const isInProgress = session.status === "in_progress";

            return (
              <div
                key={session.id}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  isInProgress
                    ? "bg-[#1C2622] border-primary/40 shadow-lime-glow-sm"
                    : isCompleted
                    ? "bg-[#151B22]/60 border-border/50 opacity-75"
                    : "bg-[#151B22] border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={session.member_avatar || ""}
                      alt={session.member_name}
                      className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary">
                          {session.member_name}
                        </span>
                        {isInProgress && (
                          <Badge variant="primary" dot>
                            Live Now
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="completed">
                            Done
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5 font-medium flex items-center gap-1.5">
                        <Dumbbell className="h-3 w-3 text-primary" />
                        <span>{session.title}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-text-primary">
                      <Clock className="h-3 w-3 text-text-muted" />
                      <span>{session.start_time} - {session.end_time}</span>
                    </div>
                    <span className="text-[10px] text-text-dim block mt-0.5">
                      {session.focus_area}
                    </span>
                  </div>
                </div>

                {session.notes && (
                  <div className="mt-2.5 pt-2 border-t border-border/40 text-[10px] text-text-muted italic flex items-center justify-between">
                    <span>Note: {session.notes}</span>
                    {isInProgress && (
                      <span className="text-primary font-bold not-italic">
                        In Progress
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Overlaps prevented &bull; Real-time status
        </span>
        <Button variant="outline" size="sm" asChild>
          <Link href="/schedule">Add Appointment</Link>
        </Button>
      </div>
    </Card>
  );
}

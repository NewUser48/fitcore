"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Dumbbell,
  UtensilsCrossed,
  CalendarCheck,
  CreditCard,
  Calendar,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  onOpenAddMember?: () => void;
}

export function QuickActions({ onOpenAddMember }: QuickActionsProps) {
  const actions = [
    {
      title: "Add New Member",
      description: "Enroll athlete into roster",
      icon: UserPlus,
      accent: "text-primary border-primary/30 bg-primary/10",
      onClick: onOpenAddMember,
      href: undefined,
    },
    {
      title: "Create Workout",
      description: "Build sets, reps & routines",
      icon: Dumbbell,
      accent: "text-sky-400 border-sky-500/30 bg-sky-500/10",
      href: "/workouts",
    },
    {
      title: "Assign Nutrition",
      description: "Macro targets & meal plans",
      icon: UtensilsCrossed,
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      href: "/nutrition",
    },
    {
      title: "Mark Attendance",
      description: "Log today's check-ins",
      icon: CalendarCheck,
      accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      href: "/attendance",
    },
    {
      title: "Record Payment",
      description: "Log fee receipt in ₹",
      icon: CreditCard,
      accent: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      href: "/billing",
    },
    {
      title: "Book 1-on-1 Session",
      description: "Reserve trainer time slot",
      icon: Calendar,
      accent: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      href: "/schedule",
    },
  ];

  return (
    <Card className="p-5 my-6">
      <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Quick Trainer Command Center
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Frequent single-trainer administrative actions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          const content = (
            <div className="h-full flex flex-col items-center text-center p-3.5 rounded-xl bg-[#151B22] border border-border/70 hover:border-primary/50 hover:bg-[#1E2630] transition-all duration-200 group cursor-pointer">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${act.accent} mb-2.5 transition-transform duration-200 group-hover:scale-110 shadow-sm`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                {act.title}
              </span>
              <span className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
                {act.description}
              </span>
            </div>
          );

          if (act.href) {
            return (
              <Link key={act.title} href={act.href}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={act.title}
              type="button"
              onClick={act.onClick}
              className="text-left w-full"
            >
              {content}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors uppercase tracking-wider",
  {
    variants: {
      variant: {
        active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        expiring: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
        expired: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
        inactive: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
        pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        paid: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        overdue: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
        primary: "bg-primary/15 text-primary border border-primary/40",
        neutral: "bg-[#25303D] text-text-muted border border-border",
        scheduled: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
        completed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "active" && "bg-emerald-400 animate-pulse",
            variant === "expiring" && "bg-orange-400",
            variant === "expired" && "bg-rose-400",
            variant === "pending" && "bg-amber-400",
            variant === "primary" && "bg-primary animate-pulse",
            variant === "neutral" && "bg-slate-400"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground font-semibold shadow-lime-glow-sm hover:bg-primary-hover hover:shadow-lime-glow hover:brightness-105",
        secondary:
          "bg-[#242D37] text-text-primary border border-border hover:bg-[#2C3744] hover:border-[#425060]",
        outline:
          "border border-border bg-transparent text-text-primary hover:bg-sidebar-hover hover:border-primary/50 hover:text-primary",
        ghost:
          "text-text-muted hover:text-text-primary hover:bg-sidebar-hover",
        danger:
          "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-500/50",
        limeOutline:
          "border border-primary/50 text-primary bg-primary/5 hover:bg-primary/15 hover:border-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-semibold",
        icon: "h-9 w-9 p-0",
        iconSm: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

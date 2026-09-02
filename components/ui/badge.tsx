import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-none px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider uppercase whitespace-nowrap transition-colors border",
  {
    variants: {
      variant: {
        default: "bg-[#141414] text-white border-[#141414]",
        secondary: "bg-zinc-100 text-[#141414] border-[#141414]/30",
        outline: "border-[#141414] text-[#141414] bg-white",
        success: "bg-emerald-50 text-emerald-800 border-emerald-600",
        warning: "bg-amber-50 text-amber-800 border-amber-600",
        danger: "bg-red-50 text-red-800 border-red-600",
        info: "bg-sky-50 text-sky-800 border-sky-600",
        indigo: "bg-[#141414] text-[#E4E3E0] border-[#141414]",
        urgent: "bg-[#F27D26]/10 text-[#F27D26] border-[#F27D26]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

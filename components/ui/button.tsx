import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#141414] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.99]",
  {
    variants: {
      variant: {
        default: "bg-[#141414] text-[#E4E3E0] hover:bg-zinc-800 border border-[#141414]",
        destructive: "bg-red-600 text-white hover:bg-red-700 border border-red-700",
        outline: "border border-[#141414] bg-white text-[#141414] hover:bg-zinc-100",
        secondary: "bg-zinc-200 text-[#141414] hover:bg-zinc-300 border border-zinc-300",
        ghost: "hover:bg-black/5 text-[#141414]",
        accent: "bg-[#F27D26] text-white hover:bg-[#d96a1a] border border-[#d96a1a]",
        link: "text-[#141414] underline-offset-4 hover:underline lowercase tracking-normal font-normal",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-11 px-6 text-sm",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

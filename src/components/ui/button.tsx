import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-royal text-white hover:bg-royal-light shadow-lg shadow-royal/20 hover:shadow-xl hover:shadow-royal/30 hover:-translate-y-0.5",
        saffron:
          "bg-gradient-to-r from-saffron to-saffron-light text-white shadow-lg shadow-saffron/25 hover:shadow-xl hover:shadow-saffron/35 hover:-translate-y-0.5",
        outline:
          "border border-current/20 bg-transparent hover:bg-foreground/5 hover:-translate-y-0.5",
        ghost: "hover:bg-foreground/5",
        glass: "glass text-white hover:bg-white/15 hover:-translate-y-0.5",
        link: "underline-offset-4 hover:underline text-royal-light",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
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

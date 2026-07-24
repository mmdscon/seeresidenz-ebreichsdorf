import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `inline-flex items-center justify-center whitespace-nowrap
   text-sm font-semibold rounded-xl
   transition-all duration-300 ease-out
   hover:-translate-y-0.5
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: [
          "bg-[#547587] text-white border border-[#547587]",
          "hover:bg-[#65879B]",
          "focus-visible:ring-[#547587]",
        ].join(" "),
        outline: [
          "bg-transparent text-[#547587] border border-[#547587]",
          "hover:bg-[#C9E3EC]",
          "focus-visible:ring-[#547587]",
        ].join(" "),
        ghost: "bg-transparent text-[#547587] border-transparent hover:bg-[#C9E3EC]",
        light: [
          "bg-white text-[#547587] border border-white",
          "focus-visible:ring-white hover:opacity-90",
        ].join(" "),
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs rounded-lg",
        lg: "h-[52px] px-8 text-base",
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
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
export default Button;

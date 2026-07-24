import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const GOLD = "#D4AF37";

const buttonVariants = cva(
  `group/btn btn-fx inline-flex items-center justify-center gap-2 whitespace-nowrap
   text-sm font-semibold rounded-full border
   transition-all duration-[450ms] ease-out
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: [
          "text-white border-transparent",
          "bg-[linear-gradient(135deg,#4C6C7D_0%,#547587_45%,#65879B_100%)]",
          "shadow-[0_0_0_0_rgba(212,175,55,0)]",
          "hover:bg-[linear-gradient(135deg,#D4AF37_0%,#E4C158_50%,#D4AF37_100%)]",
          "hover:shadow-[0_0_0_4px_rgba(212,175,55,0.22)]",
          "focus-visible:ring-[#547587]",
        ].join(" "),
        outline: [
          "bg-transparent text-[#547587] border-[#547587]",
          "hover:text-white hover:border-transparent",
          "hover:bg-[linear-gradient(135deg,#D4AF37_0%,#E4C158_50%,#D4AF37_100%)]",
          "hover:shadow-[0_0_0_4px_rgba(212,175,55,0.22)]",
          "focus-visible:ring-[#547587]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[#547587] border-transparent",
          "hover:text-white",
          "hover:bg-[linear-gradient(135deg,#D4AF37_0%,#E4C158_50%,#D4AF37_100%)]",
          "hover:shadow-[0_0_0_4px_rgba(212,175,55,0.18)]",
        ].join(" "),
        light: [
          "bg-white text-[#547587] border-white",
          "hover:text-white hover:border-transparent",
          "hover:bg-[linear-gradient(135deg,#D4AF37_0%,#E4C158_50%,#D4AF37_100%)]",
          "hover:shadow-[0_0_0_4px_rgba(212,175,55,0.22)]",
          "focus-visible:ring-white",
        ].join(" "),
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
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

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-1"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  hideArrow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, hideArrow = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props}>
        <span className="inline-flex items-center gap-2">
          {children}
          {!hideArrow && <ArrowIcon />}
        </span>
      </Comp>
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants, GOLD };
export default Button;

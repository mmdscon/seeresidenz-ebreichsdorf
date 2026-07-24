import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap
   text-sm font-semibold rounded-full
   transition-all duration-300 ease-out
   hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(84,117,135,0.28)]
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
        {children}
        {!hideArrow && <ArrowIcon />}
      </Comp>
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
export default Button;

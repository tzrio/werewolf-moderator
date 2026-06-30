"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "outline" | "ember";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: "btn-primary text-moon",
  danger: "btn-danger text-moon",
  ghost: "bg-transparent hover:bg-white/5 border border-transparent text-moon",
  outline: "bg-transparent border border-white/15 hover:border-white/30 text-moon",
  ember: "bg-gradient-to-b from-ember to-amber-700 border border-amber-300/20 text-forest-950 font-semibold",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-7 py-3.5 text-lg rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed select-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

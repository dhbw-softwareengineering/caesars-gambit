"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "secondary" | "destructive" | "ghost",
  size?: "sm" | "default" | "lg"
}

const base =
  "inline-flex items-center cursor-pointer justify-center rounded-md font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50 disabled:pointer-events-none w-full"

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-blue-500 border border-blue-500/20 text-[rgba(225,255,255)] hover:bg-blue-600",
  primary: "bg-[#3B82F6] text-white font-bold hover:bg-[#2563EB]",
  secondary: "bg-[#1E40AF] text-white font-bold hover:bg-[#1E3A8A]",
  destructive:
    "bg-[#B94A5A] text-white font-bold hover:bg-[#A03D50] focus-visible:ring-[#B94A5A]/40",
  ghost: "bg-transparent text-black border border-black hover:bg-gray-100 border border-black/10",
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2 py-1 text-sm",
  default: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export default Button
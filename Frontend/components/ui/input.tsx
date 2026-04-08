"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string | null
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col w-full", className)}>
        {label && (
          <label className="text-sm font-medium mb-1 text-muted-foreground">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "bg-background border border-input px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring/50",
            error ? "border-red-500" : "",
            "w-full"
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }

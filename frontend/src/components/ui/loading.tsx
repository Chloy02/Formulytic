"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "secondary"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6", 
      lg: "h-8 w-8",
    }

    const variantClasses = {
      default: "border-primary",
      secondary: "border-secondary",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-transparent border-t-current",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-1 w-1",
      md: "h-2 w-2",
      lg: "h-3 w-3",
    }

    const gapClasses = {
      sm: "gap-1",
      md: "gap-1.5", 
      lg: "gap-2",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          gapClasses[size],
          className
        )}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-current animate-pulse",
              sizeClasses[size]
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
      </div>
    )
  }
)
LoadingDots.displayName = "LoadingDots"

interface LoadingBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number
  variant?: "default" | "success" | "warning" | "destructive"
}

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>(
  ({ className, progress, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-yellow-500", 
      destructive: "bg-red-500",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-secondary rounded-full h-2 overflow-hidden",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out",
            variantClasses[variant]
          )}
          style={{
            width: progress !== undefined ? `${Math.min(100, Math.max(0, progress))}%` : "0%",
          }}
        />
      </div>
    )
  }
)
LoadingBar.displayName = "LoadingBar"

// Skeleton components for loading states
interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  className?: string
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-muted rounded animate-pulse",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    )
  }
)
SkeletonText.displayName = "SkeletonText"

export { 
  LoadingSpinner, 
  LoadingDots, 
  LoadingBar, 
  SkeletonText 
}

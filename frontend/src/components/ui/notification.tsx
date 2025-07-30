"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

interface NotificationProps {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "success" | "error" | "warning" | "info"
  onClose?: () => void
  autoClose?: boolean
  duration?: number
  className?: string
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ 
    title, 
    description, 
    variant = "default", 
    onClose, 
    autoClose = true, 
    duration = 5000,
    className,
    ...props 
  }, ref) => {
    React.useEffect(() => {
      if (autoClose && onClose) {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
      }
    }, [autoClose, duration, onClose])

    const variants = {
      default: {
        className: "border bg-background text-foreground",
        icon: null,
      },
      success: {
        className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
        icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
      },
      error: {
        className: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
        icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      },
      warning: {
        className: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />,
      },
      info: {
        className: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
        icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      },
    }

    const currentVariant = variants[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-top-2",
          currentVariant.className,
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {currentVariant.icon}
          <div className="flex-1 space-y-1">
            {title && (
              <div className="font-semibold leading-none tracking-tight">
                {title}
              </div>
            )}
            {description && (
              <div className="text-sm opacity-90">
                {description}
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }
)
Notification.displayName = "Notification"

// Container for notifications
const NotificationContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
  }
>(({ className, position = "top-right", ...props }, ref) => {
  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4", 
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "fixed z-50 flex max-w-sm flex-col gap-2",
        positions[position],
        className
      )}
      {...props}
    />
  )
})
NotificationContainer.displayName = "NotificationContainer"

export { Notification, NotificationContainer }

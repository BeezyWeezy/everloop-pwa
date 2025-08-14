"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils/css"

const notificationVariants = cva(
  "relative w-full rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
        error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
        warning: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
        info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconVariants = cva("h-5 w-5", {
  variants: {
    variant: {
      default: "text-foreground",
      success: "text-green-600 dark:text-green-400",
      error: "text-red-600 dark:text-red-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      info: "text-blue-600 dark:text-blue-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const textVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-foreground",
      success: "text-green-800 dark:text-green-200",
      error: "text-red-800 dark:text-red-200",
      warning: "text-yellow-800 dark:text-yellow-200",
      info: "text-blue-800 dark:text-blue-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string
  description?: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, variant, title, description, onClose, autoClose = true, duration = 5000, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    React.useEffect(() => {
      if (autoClose && duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setTimeout(() => onClose?.(), 300) // Ждем анимацию исчезновения
        }, duration)

        return () => clearTimeout(timer)
      }
    }, [autoClose, duration, onClose])

    const getIcon = () => {
      switch (variant) {
        case "success":
          return <CheckCircle className={cn(iconVariants({ variant }))} />
        case "error":
          return <AlertCircle className={cn(iconVariants({ variant }))} />
        case "warning":
          return <AlertTriangle className={cn(iconVariants({ variant }))} />
        case "info":
          return <Info className={cn(iconVariants({ variant }))} />
        default:
          return <Info className={cn(iconVariants({ variant }))} />
      }
    }

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({ variant }),
          "animate-in slide-in-from-right-full duration-300",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 space-y-1">
            {title && (
              <h4 className={cn(textVariants({ variant }), "font-semibold")}>
                {title}
              </h4>
            )}
            {description && (
              <p className={cn(textVariants({ variant }), "text-xs opacity-90")}>
                {description}
              </p>
            )}
          </div>
          {onClose && (
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose(), 300)
              }}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)
Notification.displayName = "Notification"

export { Notification, notificationVariants }

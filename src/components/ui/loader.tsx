import * as React from "react"
import { cn } from "@/lib/utils/css"
import { Loader2 } from "lucide-react"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl"
    variant?: "spinner" | "dots" | "pulse" | "bars"
    text?: string
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "error"
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
    ({ className, size = "md", variant = "spinner", text, color = "default", ...props }, ref) => {
        const sizeClasses = {
            sm: "w-4 h-4",
            md: "w-8 h-8", 
            lg: "w-12 h-12",
            xl: "w-16 h-16"
        }

        const colorClasses = {
            default: "text-slate-600 dark:text-slate-400",
            primary: "text-blue-600 dark:text-blue-400",
            secondary: "text-slate-600 dark:text-slate-400",
            success: "text-green-600 dark:text-green-400",
            warning: "text-yellow-600 dark:text-yellow-400",
            error: "text-red-600 dark:text-red-400"
        }

        const renderSpinner = () => (
            <Loader2 className={cn(
                "animate-spin",
                sizeClasses[size],
                colorClasses[color]
            )} />
        )

        const renderDots = () => (
            <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "rounded-full animate-bounce",
                            size === "sm" ? "w-1.5 h-1.5" : 
                            size === "md" ? "w-2 h-2" :
                            size === "lg" ? "w-3 h-3" : "w-4 h-4",
                            colorClasses[color]
                        )}
                        style={{
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "0.6s"
                        }}
                    />
                ))}
            </div>
        )

        const renderPulse = () => (
            <div className={cn(
                "rounded-full animate-pulse",
                size === "sm" ? "w-4 h-4" : 
                size === "md" ? "w-8 h-8" :
                size === "lg" ? "w-12 h-12" : "w-16 h-16",
                "bg-gradient-to-r from-brand-yellow to-yellow-400"
            )} />
        )

        const renderBars = () => (
            <div className="flex space-x-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "animate-pulse",
                            size === "sm" ? "w-1 h-3" : 
                            size === "md" ? "w-1.5 h-6" :
                            size === "lg" ? "w-2 h-8" : "w-3 h-12",
                            "bg-gradient-to-t from-brand-yellow to-yellow-400 rounded-full"
                        )}
                        style={{
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "0.8s"
                        }}
                    />
                ))}
            </div>
        )

        const renderLoader = () => {
            switch (variant) {
                case "dots":
                    return renderDots()
                case "pulse":
                    return renderPulse()
                case "bars":
                    return renderBars()
                default:
                    return renderSpinner()
            }
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col items-center justify-center",
                    className
                )}
                {...props}
            >
                {renderLoader()}
                {text && (
                    <p className={cn(
                        "mt-2 text-sm font-medium",
                        colorClasses[color]
                    )}>
                        {text}
                    </p>
                )}
            </div>
        )
    }
)

Loader.displayName = "Loader"

export { Loader }

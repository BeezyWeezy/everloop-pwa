import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
    max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value, max = 100, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700", className)}
            {...props}
        >
            <div
                className="h-full bg-gradient-to-r from-brand-yellow to-yellow-400 transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${(value ?? 0) / max * 100}%` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
        </div>
    )
)
Progress.displayName = "Progress"

export { Progress }

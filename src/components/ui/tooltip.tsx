"use client"

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils/css";

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, side = "right", ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        side={side}
        className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
            className
        )}
        {...props}
    />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent
}

import * as React from "react";
import { cn } from "@/lib/utils/css";

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <aside 
            className={cn(
                "flex h-full flex-col",
                "bg-white dark:bg-gradient-to-b dark:from-brand-accent dark:to-brand-muted",
                "border-r border-slate-200 dark:border-slate-600",
                "shadow-lg dark:shadow-dark smooth-transition",
                className
            )} 
            {...props} 
        />
    )
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div 
            className={cn(
                "sticky top-0 z-10 border-b border-slate-200 dark:border-slate-600",
                "bg-white/80 dark:bg-brand-accent/80 backdrop-blur-sm",
                "smooth-transition",
                className
            )} 
            {...props} 
        />
    )
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />
}

export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("space-y-1 px-2", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div 
            className={cn(
                "sticky bottom-0 border-t border-slate-200 dark:border-slate-600",
                "bg-white/80 dark:bg-brand-accent/80 backdrop-blur-sm px-4 py-3",
                "smooth-transition",
                className
            )} 
            {...props} 
        />
    )
}

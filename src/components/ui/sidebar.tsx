import * as React from "react";
import { cn } from "@/lib/utils";

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    return <aside className={cn("flex h-full flex-col bg-background", className)} {...props} />
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("sticky top-0 z-10 border-b bg-background", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />
}

export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("space-y-1 px-2", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("sticky bottom-0 border-t bg-background px-4 py-3", className)} {...props} />
}

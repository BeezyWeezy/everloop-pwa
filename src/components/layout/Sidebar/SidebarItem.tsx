import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SidebarItem({ icon: Icon, href, label, collapsed }: { icon: any; href: string; label: string; collapsed: boolean }) {
    const router = useRouter()
    const isActive = router.pathname === href

    const linkContent = (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all",
                isActive ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
        >
            <Icon className="w-5 h-5" />
            {!collapsed && <span>{label}</span>}
        </Link>
    )

    return collapsed ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900 text-white border-none shadow-md">
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : linkContent
}

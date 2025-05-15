import { SidebarItem } from "./SidebarItem"
import {
    LayoutDashboard,
    Globe,
    MonitorPlay,
    Link as LinkIcon,
    User,
    CreditCard,
    LogOut,
    Bell,
    Star,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarFooter
} from "@/components/ui/sidebar"

export default function AppSidebar({ collapsed }: { collapsed: boolean }) {

    return (
        <Sidebar
            className={`h-screen flex flex-col border-r bg-background transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
        >
            <SidebarHeader className="flex items-center justify-between px-4 py-2 border-b">
                {!collapsed && <span className="font-semibold text-lg">logo</span>}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarItem icon={LayoutDashboard} href="/" label="Dashboard" collapsed={collapsed} />
                    <SidebarItem icon={Globe} href="/pwa" label="Мои PWAs" collapsed={collapsed} />
                    <SidebarItem icon={MonitorPlay} href="/spy" label="Spy Креативы" collapsed={collapsed} />
                    <SidebarItem icon={LinkIcon} href="/linked" label="Связки" collapsed={collapsed} />
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer transition">
                            <img
                                src="https://github.com/shadcn.png"
                                alt="avatar"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            {!collapsed && (
                                <div className="flex flex-col text-xs">
                                    <span className="font-medium">shadcn</span>
                                    <span className="text-muted-foreground">m@example.com</span>
                                </div>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    {!collapsed && (
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem><Star className="w-4 h-4 mr-2" /> Upgrade to Pro</DropdownMenuItem>
                            <DropdownMenuItem><User className="w-4 h-4 mr-2" /> Account</DropdownMenuItem>
                            <DropdownMenuItem><CreditCard className="w-4 h-4 mr-2" /> Billing</DropdownMenuItem>
                            <DropdownMenuItem><Bell className="w-4 h-4 mr-2" /> Notifications</DropdownMenuItem>
                            <DropdownMenuItem><LogOut className="w-4 h-4 mr-2" /> Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

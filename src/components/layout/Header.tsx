import { Menu, User, CreditCard, LogOut, Bell, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MobileSidebar } from "./Sidebar/MobileSidebar";
import { ThemeToggle } from "../ui/themetoggle";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const router = useRouter()

    const generateBreadcrumbs = () => {
        const pathSegments = router.pathname.split("/").filter(Boolean)
        const breadcrumbs = pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/")
            const label = decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1))
            return { label, href }
        })
        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()

    return (
        <>
            <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white dark:bg-brand-dark shadow gap-2">
                <div className="flex items-center gap-4 w-full">
                    <button
                        className="block md:hidden"
                        onClick={() => setShowMobileMenu(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <button onClick={toggleSidebar} className="rounded p-2 hover:bg-muted transition">
                        <Menu className="w-5 h-5" />
                    </button>
                    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Link href="/" className="hover:underline">Dashboard</Link>
                        {breadcrumbs.map((crumb, idx) => (
                            <span key={crumb.href} className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4" />
                <Link href={crumb.href} className="hover:underline">
                  {crumb.label}
                </Link>
              </span>
                        ))}
                    </nav>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
                    <Link href="/" className="text-xl font-bold dark:text-brand-primary hover:underline">
                        Everloop
                    </Link>
                </div>

                <div className="flex items-center gap-4 whitespace-nowrap">
                    <ThemeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer rounded-md hover:bg-muted px-2 py-1 transition">
                                <img
                                    src="https://github.com/shadcn.png"
                                    alt="avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem><User className="w-4 h-4 mr-2" /> Профиль</DropdownMenuItem>
                            <DropdownMenuItem><CreditCard className="w-4 h-4 mr-2" /> Подписка</DropdownMenuItem>
                            <DropdownMenuItem><Bell className="w-4 h-4 mr-2" /> Уведомления</DropdownMenuItem>
                            <DropdownMenuItem><LogOut className="w-4 h-4 mr-2" /> Выйти</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <MobileSidebar open={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
        </>
    )
}

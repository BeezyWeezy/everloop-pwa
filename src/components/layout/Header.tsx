import { Menu, User, CreditCard, LogOut, Bell, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MobileSidebar } from "./Sidebar/MobileSidebar";
import { ThemeToggle } from "../ui/themetoggle";
import { usePwa } from "@/context/PwaContext";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { t } = useTranslation();
    const { currentPwaName } = usePwa();

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const router = useRouter()

    const generateBreadcrumbs = () => {
        const pathSegments = router.pathname.split("/").filter(Boolean)
        const breadcrumbs = pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/")
            // Translate segment labels
            let label = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            // Map specific segments to translations
            switch(segment.toLowerCase()) {
                case 'pwa': label = t('myPwa'); break;
                case 'create': label = t('createPwa'); break;
                case 'spy': label = t('spyCreo'); break;
                case 'linked': label = t('bundles'); break;
                case 'profile': label = t('profile'); break;
                case 'analytics': label = t('analyticsLabel'); break;
                case 'settings': label = t('settings'); break;
                case '[id]': 
                    // Если это динамический сегмент [id] и есть название PWA, используем его
                    if (currentPwaName) {
                        label = currentPwaName;
                    } else {
                        // Если название еще не загружено, пропускаем этот сегмент
                        return null;
                    }
                    break;
                default: 
                    // Проверяем, если это UUID (динамический ID)
                    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(segment) && currentPwaName) {
                        label = currentPwaName;
                    } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(segment)) {
                        // Если это UUID но название еще не загружено, пропускаем
                        return null;
                    } else {
                        label = decodeURIComponent(label);
                    }
                    break;
            }
            
            return { label, href }
        }).filter(Boolean) // Убираем null значения
        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()

    return (
        <>
            <header className="bg-white/95 backdrop-blur-sm dark:bg-brand-accent/95 shadow-lg dark:shadow-dark border-b border-slate-200 dark:border-slate-700 smooth-transition">
                {/* Mobile Header */}
                <div className="flex md:hidden items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            onClick={() => setShowMobileMenu(true)}
                        >
                            <Menu size={20} className="text-slate-700 dark:text-slate-300" />
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-lg flex items-center justify-center">
                                <span className="text-black font-bold text-sm">E</span>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-brand-yellow to-yellow-400 bg-clip-text text-transparent">
                                Everloop
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4 w-full">
                        <button onClick={toggleSidebar} className="rounded p-2 hover:bg-muted transition">
                            <Menu className="w-5 h-5" />
                        </button>
                        <nav className="flex items-center gap-1 text-sm text-muted-foreground overflow-hidden">
                            <Link href="/" className="hover:underline whitespace-nowrap">{t("dashboard")}</Link>
                            {breadcrumbs.map((crumb, idx) => (
                                <span key={crumb.href} className="flex items-center gap-1 min-w-0">
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <Link href={crumb.href} className="hover:underline truncate">
                      {crumb.label}
                    </Link>
                  </span>
                            ))}
                        </nav>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-lg flex items-center justify-center">
                                <span className="text-black font-bold text-sm">E</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-brand-yellow to-yellow-400 bg-clip-text text-transparent">
                                Everloop
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 whitespace-nowrap">
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>
            <MobileSidebar open={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
        </>
    )
}

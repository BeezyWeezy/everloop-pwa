import { 
    LayoutDashboard, 
    Globe, 
    MonitorPlay, 
    Link as LinkIcon, 
    User, 
    X, 
    LogOut,
    Star
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/store/useUserStore";

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { t } = useTranslation();

    function handleLogout() {
        supabase.auth.signOut()
        useUserStore.getState().setUser(null)
        onClose()
    }

    const menuItems = [
        {
            href: "/",
            icon: LayoutDashboard,
            label: t("dashboard")
        },
        {
            href: "/pwa",
            icon: Globe,
            label: t("myPwa")
        },
        {
            href: "/spy",
            icon: MonitorPlay,
            label: t("spyCreo")
        },
        {
            href: "/linked",
            icon: LinkIcon,
            label: t("bundles")
        },
        {
            href: "/profile",
            icon: User,
            label: t("profile")
        }
    ];

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div
                className={`absolute left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-sm dark:bg-brand-accent/95 border-r border-slate-200 dark:border-slate-700 shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                        <div className="w-8 h-8 bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-sm">E</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-brand-yellow to-yellow-400 bg-clip-text text-transparent">
                            Everloop
                        </span>
                    </Link>
                    <button 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition" 
                        onClick={onClose}
                    >
                        <X size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                <Link 
                                    href={item.href} 
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition group"
                                    onClick={onClose}
                                >
                                    <item.icon size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-brand-yellow transition" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition">
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <div className="space-y-2">
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-brand-yellow to-yellow-400 text-black font-medium hover:shadow-lg transition">
                            <Star size={18} />
                            <span>{t("upgradeToPro")}</span>
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition"
                        >
                            <LogOut size={18} />
                            <span>{t("logout")}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Home, PlusCircle, Settings, X, User, SunMoon } from 'lucide-react';
import Link from 'next/link';

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <div
            className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div
                className="absolute left-0 top-0 h-full w-64 bg-brand-light dark:bg-brand-dark text-brand-black dark:text-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="absolute top-4 right-4 text-brand-black" onClick={onClose}>
                    <X size={20} />
                </button>
                <div className="text-lg font-semibold mb-4">Menu</div>
                <ul className="space-y-4">
                    <li className="hover:text-brand-black">
                        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                            <Home size={20} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="hover:text-brand-black">
                        <Link href="/new" className="flex items-center gap-2" onClick={onClose}>
                            <PlusCircle size={20} />
                            <span>New PWA</span>
                        </Link>
                    </li>
                    <li className="hover:text-brand-black">
                        <Link href="/settings" className="flex items-center gap-2" onClick={onClose}>
                            <Settings size={20} />
                            <span>Settings</span>
                        </Link>
                    </li>
                    <li className="hover:text-brand-black">
                        <Link href="/profile" className="flex items-center gap-2" onClick={onClose}>
                            <User size={20} />
                            <span>Profile</span>
                        </Link>
                    </li>
                </ul>
                <div className="mt-6">
                    <button className="flex items-center gap-2 text-brand-gray hover:text-brand-black">
                        <SunMoon size={18} />
                        <span>Toggle Theme</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

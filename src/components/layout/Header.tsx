import { UserCircle, Menu, SunMoon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { MobileSidebar } from './MobileSidebar';

export function Header() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <>
            <header className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-white shadow gap-2">
                <div className="flex items-center gap-4 w-full justify-between sm:justify-start">
                    <button
                        className="block md:hidden text-brand-black"
                        onClick={() => setShowMobileMenu(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="text-xl font-bold text-brand-black">Everloop PWA</div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-brand-gray hover:text-brand-black">
                        <SunMoon size={20} />
                    </button>
                    <Link href="/profile" className="flex items-center gap-2 hover:underline">
                        <UserCircle className="w-6 h-6 text-brand-gray" />
                        <span className="text-sm text-brand-gray">My Profile</span>
                    </Link>
                </div>
            </header>
            <MobileSidebar open={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
        </>
    );
}
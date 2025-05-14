import { Home, PlusCircle, Settings } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
    return (
        <aside className="hidden md:block w-60 bg-brand-light border-r h-screen p-6 space-y-4 text-brand-gray">
            <div className="text-lg font-semibold mb-4">Menu</div>
            <ul className="space-y-2">
                <li className="flex items-center gap-2 cursor-pointer hover:text-brand-black">
                    <Link href="/"><Home size={18} /> Dashboard</Link>
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-brand-black">
                    <Link href="/new"><PlusCircle size={18} /> New PWA</Link>
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-brand-black">
                    <Link href="/settings"><Settings size={18} /> Settings</Link>
                </li>
            </ul>
        </aside>
    );
}
import { useState } from "react";
import { Header } from './Header';
import { Footer } from './Footer';
import AppSidebar from "./Sidebar/Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {

    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-brand-dark smooth-transition">
            <AppSidebar collapsed={collapsed} />
            <div className="flex flex-col flex-1 min-w-0">
                <Header toggleSidebar={() => setCollapsed(prev => !prev)} />
                <main className="flex-1 p-3 sm:p-6">{children}</main>
                <Footer />
            </div>
        </div>
    );
}

'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            className="relative h-9 w-9 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 shadow-md hover:shadow-lg dark:shadow-dark smooth-transition active:scale-95"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Theme"
        >
            <div className="relative w-4 h-4 mx-auto">
                <Sun 
                    size={16} 
                    className={`absolute top-0 left-0 transition-all duration-500 ${
                        resolvedTheme === 'dark' 
                        ? 'rotate-90 scale-0 opacity-0' 
                        : 'rotate-0 scale-100 opacity-100'
                    }`} 
                />
                <Moon 
                    size={16} 
                    className={`absolute top-0 left-0 transition-all duration-500 ${
                        resolvedTheme === 'dark' 
                        ? 'rotate-0 scale-100 opacity-100' 
                        : '-rotate-90 scale-0 opacity-0'
                    }`} 
                />
            </div>
        </button>
    );
};

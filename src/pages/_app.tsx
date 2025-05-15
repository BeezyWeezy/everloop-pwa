import '@/styles/global.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="min-h-screen bg-white text-brand-black dark:bg-brand-dark dark:text-white transition-colors duration-300">
                <Component {...pageProps} />
            </main>
        </ThemeProvider>
    )
}

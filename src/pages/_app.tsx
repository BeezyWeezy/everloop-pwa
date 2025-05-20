import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/store/useUserStore";
import { Layout } from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

export default function App({Component, pageProps}: AppProps) {
    const [loading, setLoading] = useState(true)
    const user = useUserStore((s) => s.user)
    const setUser = useUserStore((s) => s.setUser)
    const router = useRouter()

    const isClient = typeof window !== "undefined"
    const currentPath = isClient ? router.asPath : router.pathname

    useEffect(() => {
        supabase.auth.getUser().then(({data}) => {
            setUser(data.user)
            setLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    if (loading) return null

    const publicRoutes = ["/signin", "/signup", "/check-email"]
    const isPublicRoute = publicRoutes.includes(currentPath)

    if (!user && !isPublicRoute) {
        if (isClient && currentPath !== "/signin") {
            router.replace("/signin")
        }
        return null
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main
                className="min-h-screen bg-white text-brand-black dark:bg-brand-dark dark:text-white transition-colors duration-300">
                { isPublicRoute ? (
                    <Component { ...pageProps } />
                ) : (
                    <Layout>
                        <Component { ...pageProps } />
                    </Layout>
                ) }
            </main>
        </ThemeProvider>
    )
}

import { useEffect, useState } from "react"
import type { AppProps } from "next/app"
import { supabase } from "@/lib/supabaseClient"
import { useUserStore } from "@/store/useUserStore"
import { Layout } from "@/components/layout/Layout"
import { AuthForm } from "@/components/auth/AuthForm"
import { ThemeProvider } from "@/components/theme-provider"
import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    const [loading, setLoading] = useState(true)
    const user = useUserStore((s) => s.user)
    const setUser = useUserStore((s) => s.setUser)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <AuthForm />
            </div>
        )
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="min-h-screen bg-white text-brand-black dark:bg-brand-dark dark:text-white transition-colors duration-300">
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </main>
        </ThemeProvider>
    )
}

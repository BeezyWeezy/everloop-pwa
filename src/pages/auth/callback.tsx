import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/store/useUserStore";

export default function AuthCallbackPage() {
    const router = useRouter();
    const setUser = useUserStore((s) => s.setUser);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                setUser(session?.user ?? null)
                await router.push('/')
            }
        })

        return () => {
            authListener?.subscription?.unsubscribe();
        }
    }, [router, setUser]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground">Выполняется вход...</p>
        </div>
    );
}

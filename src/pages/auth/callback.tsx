import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/store/useUserStore";

export default function AuthCallbackPage() {
    const router = useRouter();
    const setUser = useUserStore((s) => s.setUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            try {
                if (event === 'SIGNED_IN') {
                    setUser(session?.user ?? null);
                    setIsLoading(false); // Скрываем лоадер
                    await router.push('/');
                } else {
                    await router.push('/signin');
                }
            } catch (error) {
                console.error("Ошибка во время авторизации:", error);
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [router, setUser]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            {isLoading && (
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
                    <p className="text-muted-foreground">Выполняется вход...</p>
                </div>
            )}
        </div>
    );
}

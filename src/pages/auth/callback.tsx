import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/providers/supabase";
import { useUserStore } from "@/store/useUserStore";
import { useLogger } from '@/lib/utils/logger';
import { useTranslation } from 'react-i18next';

export default function AuthCallbackPage() {
    const router = useRouter();
    const logger = useLogger('auth');
    const setUser = useUserStore((s) => s.setUser);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            try {
                if (event === 'SIGNED_IN') {
                    logger.user.success('OAuth авторизация', t('notifications.auth.oauthSuccess'))
                    setUser(session?.user ?? null);
                    setIsLoading(false); // Скрываем лоадер
                    await router.push('/');
                } else {
                    logger.user.error('OAuth авторизация', t('notifications.auth.oauthError'))
                    await router.push('/signin');
                }
            } catch (error) {
                logger.user.error('OAuth авторизация', t('notifications.auth.oauthGeneralError'))
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [router, setUser, t]);

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

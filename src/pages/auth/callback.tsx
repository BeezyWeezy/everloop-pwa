import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/providers/supabase";
import { useUserStore } from "@/store/useUserStore";
import { useLogger } from '@/lib/utils/logger';
import { useTranslation } from 'react-i18next';
import { Loader } from "@/components/ui/loader";

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
                    logger.user.success(t('auth.oauthAuthorization'), t('notifications.auth.oauthSuccess'))
                    setUser(session?.user ?? null);
                    setIsLoading(false); // Hide loader
                    await router.push('/');
                } else {
                    logger.user.error(t('auth.oauthAuthorization'), t('notifications.auth.oauthError'))
                    await router.push('/signin');
                }
            } catch (error) {
                logger.user.error(t('auth.oauthAuthorization'), t('notifications.auth.oauthGeneralError'))
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
                    <Loader size="xl" variant="pulse" text={t('auth.signingIn')} color="primary" />
                </div>
            )}
        </div>
    );
}

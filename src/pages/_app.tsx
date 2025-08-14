import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import { supabase } from "@/lib/providers/supabase";
import { useUserStore } from "@/store/useUserStore";
import { Layout } from "@/components/layout/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaProvider } from "@/context/PwaContext";
import { NotificationProvider } from "@/context/NotificationContext";
import "@/styles/globals.css";
import "@/i18n/i18n";

export default function App({ Component, pageProps }: AppProps) {
    const [loading, setLoading] = useState(true); // Лоадер пока данные загружаются
    const user = useUserStore((s) => s.user); // Данные авторизованного пользователя
    const setUser = useUserStore((s) => s.setUser); // Метод для установки текущего пользователя
    const [isRecovery, setIsRecovery] = useState(false); // Флаг восстановления пароля
    const router = useRouter();

    const currentPath = router.asPath;
    const queryParams = new URLSearchParams(router.asPath.split("?")[1]);

    // Проверяем наличие токена восстановления пароля
    const hasAccessToken = queryParams.has("access_token");
    const isRecoveryFlow = hasAccessToken && queryParams.get("type") === "recovery";

    // Список публичных маршрутов (без авторизации)
    const publicRoutes = ["/signin", "/signup", "/check-email", "/forgot-password", "/reset-password"];

    // Список маршрутов БЕЗ Layout
    const noLayoutRoutes = ["/reset-password", "/signin", "/signup", "/check-email", "/forgot-password"];

    useEffect(() => {
        const checkSession = async () => {
            // Если пользователь находится в восстановлении пароля
            if (isRecoveryFlow) {
                setIsRecovery(true);
                setLoading(false); // Завершаем загрузку
                return; // Прекращаем дальнейшие проверки сессии
            }

            // Проверяем активную сессию (из Supabase)
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                setUser(data.session.user); // Устанавливаем авторизованного пользователя
            } else {
                setUser(null); // Если нет сессии, сбрасываем
                if (!publicRoutes.includes(router.pathname)) {
                    // Если это не публичный маршрут, перенаправляем на /signin
                    router.replace("/signin");
                }
            }

            setLoading(false);
        };

        checkSession();

        // Подписка на изменения статуса авторизации (Supabase)
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user); // Устанавливаем нового пользователя
            } else {
                setUser(null); // Сбрасываем, если сессия удалена
            }
        });

        return () => {
            listener.subscription.unsubscribe(); // Отключаем подписку на изменения при размонтировании
        };
    }, [isRecoveryFlow, router, setUser]);

    // Если страница ещё загружается, показываем заглушку
    if (loading) return null;

    // Если это восстановление пароля, ограничиваем доступ только этой страницей
    if (isRecovery) {
        if (router.pathname !== "/reset-password") {
            router.replace("/reset-password"); // Принудительно редиректим на восстановление
            return null;
        }
    }

    // Проверка приватный маршрут: если пользователь не авторизован
    const isPublicRoute = publicRoutes.includes(router.pathname);
    if (!user && !isPublicRoute) {
        router.replace("/signin"); // Неавторизованный пользователь перенаправляется на логин
        return null;
    }

    // Проверяем маршруты, на которых НЕ нужен Layout
    const noLayout = noLayoutRoutes.includes(router.pathname);

    // Рендерим страницу с Layout или без Layout
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta name="theme-color" content="#F5BE37" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Everloop" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/icon-192.svg" />
            </Head>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <NotificationProvider>
                    <PwaProvider>
                        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 dark:from-brand-darker dark:to-brand-dark dark:text-slate-100 smooth-transition">
                            {noLayout ? (
                                <Component {...pageProps} /> // Без Layout
                            ) : (
                                <Layout>
                                    <Component {...pageProps} /> {/* С Layout */}
                                </Layout>
                            )}
                        </main>
                    </PwaProvider>
                </NotificationProvider>
            </ThemeProvider>
        </>
    );
}

import { useState } from "react";
import { supabase } from "@/lib/providers/supabase";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ui/themetoggle";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";
import { useLogger } from "@/lib/utils/logger";

export default function ForgotPasswordPage() {
    const { t } = useTranslation()
    const logger = useLogger('ForgotPasswordPage')
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // Отправляем запрос на сброс пароля
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`, // URL для перенаправления после сброса
            });

            if (resetError) {
                // Безопасное сообщение - не раскрываем информацию о существующих пользователях
                logger.user.success(t('passwordReset'), t('notifications.auth.passwordResetSuccess'))
                setSuccess(t('notifications.auth.passwordResetSuccess'));
            } else {
                // Успешная отправка письма
                logger.user.success(t('passwordReset'), t('notifications.auth.passwordResetSuccess'))
                setSuccess(t('notifications.auth.passwordResetSuccess'));
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t('notifications.general.unknownError');
            logger.user.error(t('passwordReset'), t('notifications.auth.passwordResetError'))
            setError(t('notifications.auth.passwordResetError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-brand-darker dark:to-brand-dark smooth-transition px-4 sm:px-6 lg:px-8">
            {/* Переключатели темы и языка */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-2 z-10">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>

            {/* Логотип */}
            <div className="text-center mb-6 sm:mb-8">
                <Link href="/" className="inline-block">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-yellow to-yellow-400 bg-clip-text text-transparent smooth-transition">
                        Everloop
                    </h1>
                </Link>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 text-center">
                {t('passwordReset')}
            </h1>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6 max-w-md text-sm sm:text-base px-4">
                {t('enterNewPasswordForRecover')}
            </p>
            <form
                onSubmit={handlePasswordReset}
                className="flex flex-col gap-4 max-w-md w-full bg-white/90 dark:bg-brand-accent/90 backdrop-blur-sm border border-slate-200 dark:border-slate-600 p-4 sm:p-6 shadow-2xl dark:shadow-dark rounded-xl smooth-transition"
            >
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email')}
                    className="w-full p-3 h-11 sm:h-12 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-background text-foreground placeholder:text-muted-foreground smooth-transition text-base"
                    required
                />
                {/* Уведомления показываются через логгер в правом верхнем углу */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 h-11 sm:h-12 bg-brand-yellow text-black font-medium rounded-lg hover:bg-yellow-400 disabled:opacity-50 smooth-transition text-sm sm:text-base flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader size="sm" variant="spinner" color="default" />
                            {t('sending')}
                        </>
                    ) : (
                        t('passwordReset')
                    )}
                </button>
                <div className="text-center">
                    <Link
                        href="/signin"
                        className="text-slate-600 dark:text-slate-400 hover:text-brand-yellow text-xs sm:text-sm smooth-transition"
                    >
                        ← {t('ui.backToLogin')}
                    </Link>
                </div>
            </form>
        </div>
    );
}

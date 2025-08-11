import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ui/themetoggle";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const { t } = useTranslation()
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
                if (resetError.message === "User not found") {
                    // Если email отсутствует в базе данных
                    setError("Пользователь с таким email не найден.");
                } else {
                    // Для всех остальных ошибок
                    throw new Error(resetError.message);
                }
            } else {
                // Успешная отправка письма
                setSuccess("Инструкция по восстановлению пароля отправлена на ваш email.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка.");
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
                Введите ваш email, чтобы восстановить доступ к аккаунту.
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
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-sm text-center">
                            {error}
                        </p>
                    </div>
                )}
                {success && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm text-center">
                            {success}
                        </p>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 h-11 sm:h-12 bg-brand-yellow text-black font-medium rounded-lg hover:bg-yellow-400 disabled:opacity-50 smooth-transition text-sm sm:text-base"
                >
                    {loading ? t('sending') : 'Восстановить пароль'}
                </button>
                <div className="text-center">
                    <Link
                        href="/signin"
                        className="text-slate-600 dark:text-slate-400 hover:text-brand-yellow text-xs sm:text-sm smooth-transition"
                    >
                        ← Вернуться к входу
                    </Link>
                </div>
            </form>
        </div>
    );
}

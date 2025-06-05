import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
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
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">
                Восстановление пароля
            </h1>
            <p className="text-center text-muted-foreground mb-6">
                Введите ваш email, чтобы восстановить доступ к аккаунту.
            </p>
            <form
                onSubmit={handlePasswordReset}
                className="flex flex-col gap-4 max-w-sm w-full"
            >
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введите ваш email"
                    className="w-full p-2 border border-border rounded-md focus:outline-primary"
                    required
                />
                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 text-sm text-center">
                        {success}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? "Отправка..." : "Восстановить пароль"}
                </button>
            </form>
        </div>
    );
}

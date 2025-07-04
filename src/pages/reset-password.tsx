import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
    const { t } = useTranslation()
    const router = useRouter();
    const { access_token, type } = router.query; // Получаем токены из URL
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Проверяем параметры из URL: если токен отсутствует, перенаправляем или показываем ошибку
    useEffect(() => {
        if (!access_token || type !== "recovery") {
            router.push("/"); // Перенаправляем пользователя, если это не процесс восстановления
        }
    }, [access_token, type, router]);

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            // Обновляем пароль через API Supabase
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) throw new Error(updateError.message);

            // Если всё успешно
            setSuccess(true);
            setTimeout(() => router.push("/signin"), 2000); // Редирект на страницу входа
        } catch (err) {
            setError(err instanceof Error ? err.message : `${t("anErrorOccurred")}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {access_token && type === "recovery" ? (
                <>
                    <h1 className="text-2xl font-semibold text-primary mb-4">
                        {t("passwordReset")}
                    </h1>
                    <p className="text-center text-muted-foreground mb-6">
                        {t("enterNewPasswordForRecover")}
                    </p>
                    <form
                        onSubmit={handlePasswordReset}
                        className="flex flex-col gap-4 max-w-md w-full bg-white p-6 shadow rounded-md"
                    >
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t("enterNewPassword")}
                            className="w-full p-2 border border-border rounded-md focus:outline-primary"
                            required
                        />
                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}
                        {success && (
                            <p className="text-green-500 text-sm text-center">
                                {t("passwordChangeSuccess")}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full p-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? `${t("passwordChangeInProgress")}...` : `${t("changePassword")}`}
                        </button>
                    </form>
                </>
            ) : (
                <p className="text-lg text-center text-red-500">
                    {t("invalidRecoveryLink")}
                </p>
            )}
        </div>
    );
}

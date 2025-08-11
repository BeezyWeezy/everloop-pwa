import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next";

// Пропсы компонента
interface SubscriptionSectionProps {
    subscriptionType: string | null // Тип подписки (например, "Премиум"). null, если подписки нет.
    expiresAt?: string | null // Дата окончания подписки (опционально, ISO-формат).
    onUpgrade: () => void // Обработчик для обновления подписки.
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
    subscriptionType,
    expiresAt,
    onUpgrade,
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {t("subscriptionManagement")}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
                    Управляйте своим планом подписки и получайте доступ к дополнительным функциям
                </p>
            </div>

            {/* Subscription Status Card */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Current Subscription */}
                        <div className="text-center space-y-3 sm:space-y-4">
                            {subscriptionType ? (
                                <div className="space-y-3">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full">
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                            {subscriptionType}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                            {t("currentSubscription")}
                                        </p>
                                    </div>
                                    {expiresAt && (
                                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4">
                                            <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {t("activeUntil")}: {new Date(expiresAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 dark:bg-slate-700 rounded-full">
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                            Бесплатный план
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                                            {t("dontHaveActiveSubscription")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="pt-2 sm:pt-4">
                            <Button 
                                onClick={onUpgrade} 
                                className="w-full h-11 sm:h-12 bg-brand-yellow text-black hover:bg-yellow-400 font-medium text-sm sm:text-base"
                                size="lg"
                            >
                                {subscriptionType ? `${t("renewSubscription")}` : `${t("subscribe")}`}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

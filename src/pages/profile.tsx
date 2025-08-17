import { useState, useEffect } from "react"
import { ProfileDetails, UserProfile } from "@/components/profile/ProfileDetails"
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm"
import { SubscriptionSection } from "@/components/profile/SubscriptionSection"
import { TwoFactorAuthSetup } from "@/components/profile/TwoFactorAuthSetup"
import { Loader } from "@/components/ui/loader"
import { useTranslation } from "react-i18next";
import { useLogger } from '@/lib/utils/logger';

export default function ProfilePage() {
    const { t } = useTranslation();
    const logger = useLogger('pages');

    const tabs = [
        { id: "details", label: `${t("profileInfo")}`, component: "details" },
        { id: "password", label: `${t("changePassword")}`, component: "password" },
        { id: "subscription", label: `${t("subscription")}`, component: "subscription" },
        { id: "2fa", label: `${t("twofa")}`, component: "2fa" },
    ]

    const [activeTab, setActiveTab] = useState("details")
    const [user, setUser] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Имитация загрузки данных пользователя
    useEffect(() => {
        // Получение данных пользователя (например, из API)
        setTimeout(() => {
            setUser({
                email: "ivan.ivanov@example.com",
                name: "Иван Иванов",
                registeredAt: "2023-01-01T00:00:00.000Z",
                avatar: null,
                lastLoginAt: "2023-10-20T12:00:00.000Z",
            })
            setIsLoading(false)
        }, 1000) // Задержка для имитации
    }, [])

    // Данные для подписки
    const subscriptionData = {
        subscriptionType: t('subscription.premium'),
        expiresAt: "2024-01-01T00:00:00.000Z",
    }

    // Состояние для 2FA
    const [qrCodeUrl] = useState<string | null>("https://via.placeholder.com/150")
    const [is2FAError, set2FAError] = useState<string | null>(null)
    const [is2FALoading, set2FALoading] = useState(false)

    const handleActivate2FA = async (code: string) => {
        set2FALoading(true)
        set2FAError(null)
        // Пример проверки кода
        if (code === "123456") {
            logger.success(t('twofa'), t('notifications.auth.2faEnabled'))
        } else {
            set2FAError(t('notifications.auth.invalid2faCode'))
        }
        set2FALoading(false)
    }

    const handlePasswordChange = async (data: {
        currentPassword: string
        newPassword: string
        confirmPassword: string
    }) => {
        logger.info(t('changePassword'), t('notifications.auth.passwordChangeInitiated'))
        logger.success(t('changePassword'), t('notifications.auth.passwordChangeSuccess'))
    }

    const handleUpgradeSubscription = () => {
        logger.info(t('subscription'), t('notifications.subscription.upgradeInitiated'))
    }

    const renderActiveComponent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Loader 
                        size="lg" 
                        variant="bars" 
                        text={t('loading')} 
                        color="primary"
                    />
                </div>
            )
        }

        switch (activeTab) {
            case "details":
                return user ? (
                    <ProfileDetails
                        user={user}
                        onEdit={() => logger.info(t('profileInfo'), t('notifications.profile.editInitiated'))}
                    />
                ) : (
                    <p>{t('notifications.profile.notFound')}</p>
                )
            case "password":
                return <ChangePasswordForm onSubmit={handlePasswordChange} isLoading={false} error={null} />
            case "subscription":
                return (
                    <SubscriptionSection
                        subscriptionType={subscriptionData.subscriptionType}
                        expiresAt={subscriptionData.expiresAt}
                        onUpgrade={handleUpgradeSubscription}
                    />
                )
            case "2fa":
                return (
                    <TwoFactorAuthSetup
                        qrCodeUrl={qrCodeUrl}
                        onActivate={handleActivate2FA}
                        isLoading={is2FALoading}
                        error={is2FAError}
                    />
                )
            default:
                return <p>{t('ui.selectSection')}</p>
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-brand-darker dark:to-brand-dark smooth-transition">
            <div className="container mx-auto p-6 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar с навигацией */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white/90 dark:bg-brand-accent/90 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl dark:shadow-dark p-6 sticky top-6">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-600">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-yellow to-yellow-400 flex items-center justify-center">
                                    <span className="text-black font-bold text-lg">
                                        {user?.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                                        {user?.name || t('ui.user')}
                                    </h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {t('profile')}
                                    </p>
                                </div>
                            </div>
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-medium smooth-transition ${
                                            tab.id === activeTab
                                                ? "bg-brand-yellow text-black shadow-lg"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="lg:col-span-3">
                        <div className="bg-white/90 dark:bg-brand-accent/90 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl dark:shadow-dark p-8">
                            {renderActiveComponent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

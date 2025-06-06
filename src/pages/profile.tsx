import { useState, useEffect } from "react"
import { ProfileDetails, UserProfile } from "@/components/profile/ProfileDetails"
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm"
import { SubscriptionSection } from "@/components/profile/SubscriptionSection"
import { TwoFactorAuthSetup } from "@/components/profile/TwoFactorAuthSetup"
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
    const { t } = useTranslation();

    const tabs = [
        { id: "details", label: `${t("profileInfo")}`, component: "details" },
        { id: "password", label: `${t("changePassword")}`, component: "password" },
        { id: "subscription", label: "Подписка", component: "subscription" },
        { id: "2fa", label: "Двухфакторная аутентификация", component: "2fa" },
    ]

    const [activeTab, setActiveTab] = useState("details")
    const [user, setUser] = useState<UserProfile | null>(null) // Данные пользователя
    const [isLoading, setIsLoading] = useState(true) // Состояние загрузки

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
        subscriptionType: "Премиум",
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
            alert("Двухфакторная аутентификация успешно включена!")
        } else {
            set2FAError("Неверный код. Попробуйте ещё раз.")
        }
        set2FALoading(false)
    }

    const handlePasswordChange = async (data: {
        currentPassword: string
        newPassword: string
        confirmPassword: string
    }) => {
        console.log("Смена пароля:", data)
        alert("Пароль успешно обновлён")
    }

    const handleUpgradeSubscription = () => {
        alert("Обновление подписки...")
    }

    const renderActiveComponent = () => {
        if (isLoading) {
            return <p>Загрузка...</p>
        }

        switch (activeTab) {
            case "details":
                return user ? (
                    <ProfileDetails
                        user={user}
                        onEdit={() => alert("Редактирование профиля")}
                    />
                ) : (
                    <p>Данные профиля не найдены.</p>
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
                return <p>Выберите раздел</p>
        }
    }

    return (
        <div className="container mx-auto p-6 flex space-x-8">
            {/* Сайдбар */}
            <aside className="w-1/4 bg-gray-50 p-4 rounded-lg shadow">
                <ul className="space-y-4">
                    {tabs.map((tab) => (
                        <li key={tab.id}>
                            <button
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left py-2 px-4 rounded ${
                                    tab.id === activeTab
                                        ? "bg-blue-500 text-white"
                                        : "text-blue-600 hover:bg-blue-100"
                                }`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Контент */}
            <main className="w-3/4 bg-white p-6 rounded-lg shadow">
                {renderActiveComponent()}
            </main>
        </div>
    )
}

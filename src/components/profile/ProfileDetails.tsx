import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next";

// Интерфейс для исходных данных
export interface UserProfile {
    email: string
    name: string
    registeredAt: string
    avatar?: string
    lastLoginAt?: string
}

// Пропсы компонента
interface ProfileDetailsProps {
    user: UserProfile
    onEdit?: () => void // Callback для кнопки t('ui.edit')
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user, onEdit }) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            {/* Header with title and edit button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {t("profileInfo")}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        {t("mainProfileInfo")}
                    </p>
                </div>
                {onEdit && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="self-start sm:self-auto"
                    >
                        {t("edit")}
                    </Button>
                )}
            </div>

            {/* Profile Card */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                        {/* Avatar section */}
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white dark:border-slate-600 shadow-xl">
                                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                                <AvatarFallback className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-brand-yellow to-yellow-400 text-black">
                                    {user.name
                                        .split(" ")
                                        .map((word) => word.charAt(0))
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center lg:text-left">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {user.name}
                                </h2>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {/* User information grid */}
                        <div className="flex-1 mt-6 lg:mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4">
                                    <dt className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        {t("name")}
                                    </dt>
                                    <dd className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        {user.name}
                                    </dd>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4">
                                    <dt className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        {t("email")}
                                    </dt>
                                    <dd className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 break-all">
                                        {user.email}
                                    </dd>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4">
                                    <dt className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        {t("registrationDate")}
                                    </dt>
                                    <dd className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        {new Date(user.registeredAt).toLocaleDateString()}
                                    </dd>
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4">
                                    <dt className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        {t("lastLogin")}
                                    </dt>
                                    <dd className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        {user.lastLoginAt 
                                            ? new Date(user.lastLoginAt).toLocaleDateString()
                                            : t('ui.noData')
                                        }
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

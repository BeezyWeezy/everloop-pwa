import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    onEdit?: () => void // Callback для кнопки "Редактировать"
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user, onEdit }) => {
    return (
        <Card className="p-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold">Информация профиля</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Основная информация о вашем аккаунте
                    </p>
                </div>
                {/* Кнопка редактирования профиля */}
                {onEdit && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                    >
                        Редактировать
                    </Button>
                )}
            </CardHeader>

            <CardContent className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
                {/* Аватар */}
                <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback>
                        {user.name
                            .split(" ")
                            .map((word) => word.charAt(0))
                            .join("")
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Информация о пользователе */}
                <div className="mt-4 lg:mt-0 flex-1 space-y-4 text-sm">
                    <p>
                        <strong>Имя:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Дата регистрации:</strong> {new Date(user.registeredAt).toLocaleDateString()}
                    </p>
                    {user.lastLoginAt ? (
                        <p>
                            <strong>Последний вход:</strong> {new Date(user.lastLoginAt).toLocaleDateString()}
                        </p>
                    ) : (
                        <p>
                            <strong>Последний вход:</strong> Нет данных
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

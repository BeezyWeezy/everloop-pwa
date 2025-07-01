import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next";

// Пропсы компонента
interface ChangePasswordFormProps {
    onSubmit: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void
    isLoading?: boolean
    error?: string | null
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
                                                                          onSubmit,
                                                                          isLoading = false,
                                                                          error = null,
                                                                      }) => {
    const { t } = useTranslation();

    // Локальное состояние для полей ввода
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    // Обработчик изменения полей ввода
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Обработчик отправки формы
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{t("changePassword")}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Текущий пароль */}
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                        <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder={t("enterCurrentPassword")}
                            required
                        />
                    </div>

                    {/* Новый пароль */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">{t("newPassword")}</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder={t("enterNewPassword")}
                            required
                        />
                    </div>

                    {/* Подтверждение нового пароля */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t("passwordConfirmation")}</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder={t("confirmNewPassword")}
                            required
                        />
                    </div>

                    {/* Ошибка (при наличии) */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Кнопка "Сменить пароль" */}
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? `${t("sending")}` : `${t("changePassword")}`}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

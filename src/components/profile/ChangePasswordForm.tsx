import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
                <CardTitle className="text-2xl font-bold">Сменить пароль</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Текущий пароль */}
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Текущий пароль</Label>
                        <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Введите текущий пароль"
                            required
                        />
                    </div>

                    {/* Новый пароль */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Новый пароль</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Введите новый пароль"
                            required
                        />
                    </div>

                    {/* Подтверждение нового пароля */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Повторите новый пароль"
                            required
                        />
                    </div>

                    {/* Ошибка (при наличии) */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Кнопка "Сменить пароль" */}
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Идёт отправка..." : "Сменить пароль"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

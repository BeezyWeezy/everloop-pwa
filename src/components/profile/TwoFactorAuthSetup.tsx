import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TwoFactorAuthSetupProps {
    qrCodeUrl?: string | null // URL для отображения QR-кода
    onActivate: (code: string) => void // Обработчик для активации 2FA
    onCancel?: () => void // Обработчик для отмены настройки (опционально)
    isLoading?: boolean // Состояние загрузки
    error?: string | null // Сообщение об ошибке
}

export const TwoFactorAuthSetup: React.FC<TwoFactorAuthSetupProps> = ({
                                                                          qrCodeUrl = null,
                                                                          onActivate,
                                                                          onCancel,
                                                                          isLoading = false,
                                                                          error = null,
                                                                      }) => {
    const [otpCode, setOtpCode] = useState("") // Локальное состояние для одноразового кода

    // Обработчик изменения ввода
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtpCode(e.target.value)
    }

    // Обработчик отправки формы
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onActivate(otpCode) // Передача введённого кода
    }

    return (
        <Card className="p-6 space-y-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Настройка двухфакторной аутентификации</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* QR-код или инструкции */}
                    {qrCodeUrl ? (
                        <div className="text-center">
                            <img
                                src={qrCodeUrl}
                                alt="QR-код для настройки двухфакторной аутентификации"
                                className="mx-auto mb-4 w-48 h-48"
                            />
                            <p className="text-sm text-muted-foreground">
                                Отсканируйте QR-код с помощью приложения для двухфакторной аутентификации (например, Google Authenticator).
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Ссылка для настройки двухфакторной аутентификации пока недоступна.
                        </p>
                    )}

                    {/* Поле ввода OTP */}
                    <div>
                        <label htmlFor="otpCode" className="block text-sm font-medium">
                            Введите код из приложения
                        </label>
                        <Input
                            id="otpCode"
                            name="otpCode"
                            type="text"
                            placeholder="6-значный код"
                            value={otpCode}
                            onChange={handleChange}
                            required
                            maxLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Ошибка */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Кнопки */}
                    <div className="flex gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Активируем..." : "Активировать"}
                        </Button>
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Отменить
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

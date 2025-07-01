import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next";

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

    const { t } = useTranslation();

    return (
        <Card className="p-6 space-y-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{t("twofasetup")}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* QR-код или инструкции */}
                    {qrCodeUrl ? (
                        <div className="text-center">
                            <img
                                src={qrCodeUrl}
                                alt={t("qrcodesetup")}
                                className="mx-auto mb-4 w-48 h-48"
                            />
                            <p className="text-sm text-muted-foreground">
                                {t("scanqr2fa")}                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {t("notlink2fa")}
                        </p>
                    )}

                    {/* Поле ввода OTP */}
                    <div>
                        <label htmlFor="otpCode" className="block text-sm font-medium">
                            {t("qrcodefromapp")}
                        </label>
                        <Input
                            id="otpCode"
                            name="otpCode"
                            type="text"
                            placeholder={t("sixDigitCode")}
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
                            {isLoading ? `${t("activating2fa")}` : `${t("activate2fa")}`}
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

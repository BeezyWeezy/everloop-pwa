import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    return (
        <Card className="p-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Управление подпиской</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Информация о подписке */}
                {subscriptionType ? (
                    <div>
                        <p className="text-sm">
                            <strong>Текущая подписка:</strong> {subscriptionType}
                        </p>
                        {expiresAt && (
                            <p className="text-sm text-muted-foreground">
                                Активна до: {new Date(expiresAt).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        У вас нет активной подписки.
                    </p>
                )}

                {/* Кнопка для обновления/оформления */}
                <Button onClick={onUpgrade} className="w-full">
                    {subscriptionType ? "Обновить подписку" : "Оформить подписку"}
                </Button>
            </CardContent>
        </Card>
    )
}

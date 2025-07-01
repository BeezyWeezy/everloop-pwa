import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next";

export function CreativeCard({ creative }: { creative: any }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("creative")} #{creative.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm line-clamp-3">{creative.text}</p>
                <Button size="sm">{t("addToBundle")}</Button>
            </CardContent>
        </Card>
    )
}

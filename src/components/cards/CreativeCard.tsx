import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next";

export function CreativeCard({ creative }: { creative: any }) {
    const { t } = useTranslation();

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">{t("creative")} #{creative.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                <p className="text-xs sm:text-sm line-clamp-3">{creative.text}</p>
                <Button size="sm" className="w-full sm:w-auto">{t("addToBundle")}</Button>
            </CardContent>
        </Card>
    )
}

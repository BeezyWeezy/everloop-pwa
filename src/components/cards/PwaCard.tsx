import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next";

export function PwaCard({ pwa }: { pwa: any }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{pwa.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">{pwa.description}</p>
                <Button variant="outline">{t("open")}</Button>
            </CardContent>
        </Card>
    )
}

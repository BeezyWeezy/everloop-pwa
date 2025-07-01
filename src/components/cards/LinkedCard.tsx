import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTranslation } from "react-i18next";

export function LinkedCard({ link }: { link: any }) {
    const { t } = useTranslation();


    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("bundle")} #{link.id}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm mb-2">CR: {link.stats.cr}%, ROI: {link.stats.roi}%</p>
                <Progress value={link.stats.cr} />
            </CardContent>
        </Card>
    )
}

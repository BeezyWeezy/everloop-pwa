import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTranslation } from "react-i18next";

export function LinkedCard({ link }: { link: any }) {
    const { t } = useTranslation();


    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">{t("bundle")} #{link.id}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <p className="text-muted-foreground text-xs sm:text-sm mb-3">CR: {link.stats.cr}%, ROI: {link.stats.roi}%</p>
                <Progress value={link.stats.cr} />
            </CardContent>
        </Card>
    )
}

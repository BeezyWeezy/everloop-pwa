import { pwas } from "@/lib/mocks/pwas"
import { creatives } from "@/lib/mocks/creatives"
import { linkedSets } from "@/lib/mocks/linkedSets"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Head from "next/head"
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
    const { t } = useTranslation()
    const topLinked = linkedSets[0]
    const topPwa = pwas.find((p) => p.id === topLinked.pwaId)
    const topCreative = creatives.find((c) => c.id === topLinked.creativeIds[0])

    const avgCr = linkedSets.length
        ? linkedSets.reduce((acc, l) => acc + l.stats.cr, 0) / linkedSets.length
        : 0

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div className="grid gap-4 p-6">
                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader><CardTitle>{t("myPwa")}</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{pwas.length}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{t("creativesInUse")}</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{creatives.length}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{t("bundles")}</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{linkedSets.length}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{t("avgCr")}</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600">
                                {avgCr.toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Быстрые действия */}
                <div className="flex flex-wrap gap-4 mt-6">
                    <Link href="/pwa"><Button>{t("createPwa")}</Button></Link>
                    <Link href="/spy"><Button variant="outline">{t("spyCreo")}</Button></Link>
                    <Link href="/linked"><Button variant="brand">{t("myBundles")}</Button></Link>
                </div>

                {/* Топ связка */}
                {topPwa && topCreative && (
                    <div className="mt-8">
                        <Card>
                            <CardHeader><CardTitle>🔥 {t("topBundleOfTheWeek")}</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    {topPwa.name} + {topCreative.text.slice(0, 40)}
                                </p>
                                <Progress value={topLinked.stats.cr} />
                                <p className="mt-2 text-green-600">
                                    CR: {topLinked.stats.cr}%, ROI: {topLinked.stats.roi}%
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    )
}

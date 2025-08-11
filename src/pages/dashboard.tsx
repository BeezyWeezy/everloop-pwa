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
            <div className="grid gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                    <Card className="relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 group-hover:opacity-20 smooth-transition"></div>
                        <CardHeader className="pb-2"><CardTitle className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{t("myPwa")}</CardTitle></CardHeader>
                        <CardContent className="pt-0"><p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{pwas.length}</p></CardContent>
                    </Card>
                    <Card className="relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-600 opacity-10 group-hover:opacity-20 smooth-transition"></div>
                        <CardHeader className="pb-2"><CardTitle className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{t("creativesInUse")}</CardTitle></CardHeader>
                        <CardContent className="pt-0"><p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{creatives.length}</p></CardContent>
                    </Card>
                    <Card className="relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-10 group-hover:opacity-20 smooth-transition"></div>
                        <CardHeader className="pb-2"><CardTitle className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{t("bundles")}</CardTitle></CardHeader>
                        <CardContent className="pt-0"><p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{linkedSets.length}</p></CardContent>
                    </Card>
                    <Card className="relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 opacity-10 group-hover:opacity-20 smooth-transition"></div>
                        <CardHeader className="pb-2"><CardTitle className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{t("avgCr")}</CardTitle></CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                {avgCr.toFixed(1)}%
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Быстрые действия */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <Link href="/pwa" className="w-full sm:w-auto"><Button variant="brand" size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl">{t("createPwa")}</Button></Link>
                    <Link href="/spy" className="w-full sm:w-auto"><Button variant="outline" size="lg" className="w-full sm:w-auto">{t("spyCreo")}</Button></Link>
                    <Link href="/linked" className="w-full sm:w-auto"><Button variant="default" size="lg" className="w-full sm:w-auto">{t("myBundles")}</Button></Link>
                </div>

                {/* Топ связка */}
                {topPwa && topCreative && (
                    <div className="mt-6 sm:mt-8">
                        <Card>
                            <CardHeader><CardTitle className="text-lg sm:text-xl">🔥 {t("topBundleOfTheWeek")}</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                                    {topPwa.name} + {topCreative.text.slice(0, 40)}
                                </p>
                                <Progress value={topLinked.stats.cr} />
                                <p className="mt-2 text-green-600 text-sm sm:text-base">
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

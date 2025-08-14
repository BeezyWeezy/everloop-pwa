import { useState, useEffect } from "react"
import { supabase } from "@/lib/providers/supabase"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Head from "next/head"
import { useTranslation } from "react-i18next";
import { useLogger } from '@/lib/utils/logger';

interface PWA {
    id: string;
    name: string;
    domain: string;
    status: 'draft' | 'building' | 'ready' | 'deployed' | 'paused' | 'error';
    created_at: string;
    installs?: number;
}

export default function DashboardPage() {
    const { t } = useTranslation()
    const logger = useLogger('pages');
    const [pwas, setPwas] = useState<PWA[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        loadPwas()
    }, [])
    
    const loadPwas = async () => {
        try {
            logger.info('Loading PWAs from Supabase...');
            const { data, error } = await supabase
                .from('pwa_projects')
                .select('id, name, domain, status, created_at, installs')
                .order('created_at', { ascending: false })
            
            logger.info('Supabase response', JSON.stringify({ data, error }));
            
            if (error) {
                logger.error('Ошибка загрузки PWA', t('notifications.pwa.loadListError'))
            } else {
                logger.info('Loaded PWAs count', `Found ${data?.length || 0} PWAs`);
                setPwas(data || [])
            }
        } catch (error) {
            logger.error('Error loading PWAs:', error)
        } finally {
            setIsLoading(false)
        }
    }
    
    // Заглушки для статистики (пока без реальных данных)
    const totalCreatives = 0;
    const totalLinkedSets = 0;
    const avgCr = 0;

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
                        <CardContent className="pt-0"><p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{totalCreatives}</p></CardContent>
                    </Card>
                    <Card className="relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-10 group-hover:opacity-20 smooth-transition"></div>
                        <CardHeader className="pb-2"><CardTitle className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{t("bundles")}</CardTitle></CardHeader>
                        <CardContent className="pt-0"><p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{totalLinkedSets}</p></CardContent>
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
            </div>
        </>
    )
}

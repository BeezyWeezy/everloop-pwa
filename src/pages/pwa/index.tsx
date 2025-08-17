import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { Plus, BarChart3, Settings, Search, X, Globe } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { getUserPWAs } from "@/lib/api/pwa";
import { usePWAStore } from "@/store/usePWAStore";
import { PWAListItem } from "@/types/pwa";
import { useLogger } from "@/lib/utils/logger";
import FilterTabs from "@/components/pwa/FilterTabs";
import SearchBar from "@/components/pwa/SearchBar";
import SortDropdown from "@/components/pwa/SortDropdown";
import ViewToggle from "@/components/pwa/ViewToggle";
import PwaGridView from "@/components/pwa/PwaGridView";
import PwaListView from "@/components/pwa/PwaListView";

export default function PwaIndexPage() {
    const { t } = useTranslation();
    const logger = useLogger('PwaIndexPage');
    const { 
        pwas, 
        loading, 
        error, 
        setPWAs, 
        setLoading, 
        setError,
        getFilteredPWAs,
        clearFilters,
        viewMode
    } = usePWAStore();

    // Загрузка PWA при монтировании компонента
    useEffect(() => {
        loadUserPWAs();
    }, []);

    const loadUserPWAs = async () => {
        setLoading(true);
        setError(null);
        
        const { data, error } = await getUserPWAs();
        
        if (error) {
            setError(error.message || t('notifications.pwa.loadListError'));
        } else {
            setPWAs(data || []);
        }
        
        setLoading(false);
    };

    // Получаем отфильтрованные и отсортированные PWA
    const filteredPwas = getFilteredPWAs();

    return (
        <>
            <Head>
                <title>{t('myPwa')} - Everloop</title>
            </Head>
            <div className="p-3 sm:p-6 space-y-6">
                {/* Header with Quick Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {t("myPwa")}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            {t('pwaManagement')}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Link href="/pwa/create" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-brand-yellow text-black hover:bg-yellow-400 font-medium">
                                <Plus className="w-4 h-4 mr-2" />
                                {t('createPwa')}
                            </Button>
                        </Link>
                        <Link href="/pwa/analytics" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                {t('ui.analytics')}
                            </Button>
                        </Link>
                    </div>
                </div>



                {/* Filters Section */}
                {pwas.length > 0 && (
                    <div className="space-y-4">
                        {/* Search, Sort and View Toggle */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <SearchBar className="flex-1" />
                            <div className="flex items-center gap-2">
                                <SortDropdown />
                                <ViewToggle />
                            </div>
                        </div>
                        
                        {/* Filter Tabs */}
                        <FilterTabs />
                    </div>
                )}

                {/* PWA List */}
                <div className="space-y-4">
                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader 
                                size="lg" 
                                variant="dots" 
                                text={t('loadingPwa')} 
                                color="primary"
                            />
                        </div>
                    ) : error ? (
                        <Card className="text-center py-12 border-red-200 dark:border-red-800">
                            <CardContent>
                                <div className="text-red-500 mb-4">
                                    <X className="w-12 h-12 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                                    {t('loadError')}
                                </h3>
                                <p className="text-red-600 dark:text-red-400 mb-6">
                                    {error}
                                </p>
                                <Button variant="outline" onClick={loadUserPWAs}>
                                    {t('tryAgain')}
                                </Button>
                            </CardContent>
                        </Card>
                    ) : filteredPwas.length > 0 ? (
                        viewMode === 'grid' ? (
                            <PwaGridView pwas={filteredPwas} />
                        ) : (
                            <PwaListView pwas={filteredPwas} />
                        )
                    ) : pwas.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    {t('noPwaYet')}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    {t('createFirstPwa')}
                                </p>
                                <Link href="/pwa/create">
                                    <Button className="bg-brand-yellow text-black hover:bg-yellow-400">
                                        <Plus className="w-4 h-4 mr-2" />
                                        {t('createFirstPwaButton')}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    {t('nothingFound')}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    {t('tryDifferentSearch')}
                                </p>
                                <Button variant="outline" onClick={clearFilters}>
                                    <X className="w-4 h-4 mr-2" />
                                    {t('resetFilters')}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

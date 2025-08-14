import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    TrendingUp, 
    Users, 
    Download, 
    Star,
    Calendar,
    BarChart3,
    Globe,
    Smartphone,
    Search,
    Filter,
    SortAsc,
    SortDesc,
    X,
    RefreshCw
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Head from "next/head";
import { supabase } from "@/lib/providers/supabase";
import { useLogger } from '@/lib/utils/logger';

interface PWA {
    id: string;
    name: string;
    domain: string;
    status: 'draft' | 'building' | 'ready' | 'deployed' | 'paused' | 'error';
    installs?: number;
    rating?: number;
}

export default function PwaAnalyticsPage() {
    const { t } = useTranslation();
    const logger = useLogger('pwa');
    const [pwas, setPwas] = useState<PWA[]>([]);

    useEffect(() => {
        loadPwas();
    }, []);

    const loadPwas = async () => {
        try {
            const { data, error } = await supabase
                .from('pwa_projects')
                .select('id, name, domain, status, installs')
                .order('created_at', { ascending: false });
            
            if (error) {
                logger.error(t('notifications.pwa.loadListError'), t('notifications.pwa.loadListError'))
            } else {
                // Добавляем рейтинг как моковые данные пока
                const pwasWithRating = (data || []).map(pwa => ({
                    ...pwa,
                    rating: Math.random() * 2 + 3 // рейтинг от 3 до 5
                }));
                setPwas(pwasWithRating);
            }
        } catch (error) {
            logger.error(t('notifications.pwa.loadListError'), t('notifications.pwa.loadListError'))
        }
    };

    // States for filtering
    const [timeRange, setTimeRange] = useState("30d");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPwas, setSelectedPwas] = useState<string[]>([]);

    // Мок данные для аналитики  
    const analyticsData = {
        totalDownloads: pwas.reduce((sum, p) => sum + (p.installs || 0), 0),
        totalUsers: 45670,
        avgRating: 4.5,
        conversionRate: 23.8,
        monthlyGrowth: 15.2,
        topPwa: pwas.find(p => p.installs === Math.max(...pwas.map(p => p.installs || 0))),
        installsByMonth: [
            { month: t('analytics.jan'), installs: 1200 },
            { month: t('analytics.feb'), installs: 1800 },
            { month: t('analytics.mar'), installs: 2400 },
            { month: t('analytics.apr'), installs: 3200 },
            { month: t('analytics.may'), installs: 4100 },
            { month: t('analytics.jun'), installs: 5200 },
        ],
        deviceStats: [
            { device: t('analytics.android'), percentage: 67, color: 'bg-green-500' },
            { device: t('analytics.ios'), percentage: 28, color: 'bg-blue-500' },
            { device: t('analytics.desktop'), percentage: 5, color: 'bg-gray-500' },
        ],
    };

    // Filtered PWAs for analytics
    const filteredPwas = useMemo(() => {
        let filtered = pwas;

        if (searchQuery.trim()) {
            filtered = filtered.filter(pwa => 
                pwa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pwa.domain.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedPwas.length > 0) {
            filtered = filtered.filter(pwa => selectedPwas.includes(pwa.id));
        }

        return filtered;
    }, [searchQuery, selectedPwas]);

    const togglePwaSelection = (pwaId: string) => {
        setSelectedPwas(prev => 
            prev.includes(pwaId) 
                ? prev.filter(id => id !== pwaId)
                : [...prev, pwaId]
        );
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedPwas([]);
        setTimeRange("30d");
    };

    return (
        <>
            <Head>
                <title>{t('analytics.title')} - Everloop</title>
            </Head>
            <div className="p-3 sm:p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/pwa">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('analytics.backToPwa')}
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {t('analytics.title')}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t('analytics.description')}
                        </p>
                    </div>
                </div>

                {/* Filters Panel */}
                <Card className="mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder={t('analytics.searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                    {searchQuery && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Time Range */}
                                <div className="min-w-[200px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {timeRange === "7d" ? t('analytics.last7Days') :
                                                     timeRange === "30d" ? t('analytics.last30Days') :
                                                     timeRange === "90d" ? t('analytics.last90Days') : t('analytics.last12Months')}
                                                </div>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setTimeRange("7d")}>
                                                {t('analytics.last7Days')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTimeRange("30d")}>
                                                {t('analytics.last30Days')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTimeRange("90d")}>
                                                {t('analytics.last90Days')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setTimeRange("12m")}>
                                                {t('analytics.last12Months')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Refresh */}
                                <Button variant="outline" className="whitespace-nowrap">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    {t('analytics.refresh')}
                                </Button>

                                {/* Clear Filters */}
                                {(searchQuery || selectedPwas.length > 0 || timeRange !== "30d") && (
                                    <Button variant="ghost" onClick={clearFilters} className="whitespace-nowrap">
                                        <X className="w-4 h-4 mr-2" />
                                        {t('analytics.reset')}
                                    </Button>
                                )}
                            </div>

                            {/* PWA Selection */}
                            {pwas.length > 0 && (
                                <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                                        {t('analytics.selectPwaForAnalysis')}:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={selectedPwas.length === 0 ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedPwas([])}
                                        >
                                            {t('analytics.allPwa')} ({filteredPwas.length})
                                        </Button>
                                        {filteredPwas.map(pwa => (
                                            <Button
                                                key={pwa.id}
                                                variant={selectedPwas.includes(pwa.id) ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => togglePwaSelection(pwa.id)}
                                                className="relative"
                                            >
                                                {pwa.name}
                                                {pwa.installs && (
                                                    <Badge variant="secondary" className="ml-2 text-xs">
                                                        {pwa.installs.toLocaleString()}
                                                    </Badge>
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Active Filters Display */}
                            {(searchQuery || selectedPwas.length > 0) && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Filter className="w-4 h-4" />
                                    <span>Активные фильтры:</span>
                                    {searchQuery && (
                                        <Badge variant="secondary">
                                            Поиск: "{searchQuery}"
                                        </Badge>
                                    )}
                                    {selectedPwas.length > 0 && (
                                        <Badge variant="secondary">
                                            Выбрано PWA: {selectedPwas.length}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Скачиваний</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {analyticsData.totalDownloads.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Пользователи</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {analyticsData.totalUsers.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                    <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Рейтинг</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {analyticsData.avgRating}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Конверсия</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {analyticsData.conversionRate}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Downloads Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Скачивания по месяцам
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.installsByMonth.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{item.month}</span>
                                        <div className="flex items-center gap-3 flex-1 ml-4">
                                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-brand-yellow h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(item.installs / 5200) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[60px] text-right">
                                                {item.installs.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Device Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                Статистика устройств
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.deviceStats.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{item.device}</span>
                                        <div className="flex items-center gap-3 flex-1 ml-4">
                                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                                <div 
                                                    className={`${item.color} h-3 rounded-full transition-all duration-500`}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[40px] text-right">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top PWA */}
                {analyticsData.topPwa && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Топ PWA этого месяца
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-yellow/10 to-yellow-400/10 rounded-lg">
                                <div className="w-12 h-12 bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-lg flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{analyticsData.topPwa.name}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{analyticsData.topPwa.domain}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            <Download className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm">{analyticsData.topPwa.installs?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span className="text-sm">{analyticsData.topPwa.rating}</span>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Топ исполнитель
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        +{analyticsData.monthlyGrowth}%
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">рост за месяц</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* PWA Performance List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Производительность PWA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pwas.map((pwa, index) => (
                                <div key={pwa.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-lg flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-black" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{pwa.name}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{pwa.domain}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <p className="font-semibold">{pwa.installs?.toLocaleString() || '0'}</p>
                                            <p className="text-slate-600 dark:text-slate-400">скачиваний</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold">{pwa.rating || 'N/A'}</p>
                                            <p className="text-slate-600 dark:text-slate-400">рейтинг</p>
                                        </div>
                                        <Badge className={
                                            pwa.status === 'deployed' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                        }>
                                            {pwa.status === 'deployed' ? t('ui.active') : t('ui.inactive')}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

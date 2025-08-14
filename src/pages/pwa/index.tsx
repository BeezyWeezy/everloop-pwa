import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart3, Settings, Globe, TrendingUp, Users, Search, Filter, SortAsc, SortDesc, X, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Head from "next/head";
import { getUserPWAs } from "@/lib/api/pwa";
import { usePWAStore } from "@/store/usePWAStore";
import { PWAListItem } from "@/types/pwa";
import { useLogger } from "@/lib/utils/logger";

export default function PwaIndexPage() {
    const { t } = useTranslation();
    const logger = useLogger('PwaIndexPage');
    const { pwas, loading, error, setPWAs, setLoading, setError } = usePWAStore();

    // States for filtering and searching
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

    const stats = {
        totalPwas: pwas.length,
        activePwas: pwas.filter(p => p.status === 'deployed').length,
        draftPwas: pwas.filter(p => p.status === 'draft').length,
        readyPwas: pwas.filter(p => p.status === 'ready').length,
        pausedPwas: pwas.filter(p => p.status === 'paused').length
    };

    // Filtered and sorted PWAs
    const filteredAndSortedPwas = useMemo(() => {
        let filtered = pwas;

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(pwa => 
                pwa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pwa.domain.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(pwa => pwa.status === statusFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortBy) {
                case "name":
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case "status":
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case "created":
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
                    break;
                case "updated":
                    aValue = new Date(a.updated_at);
                    bValue = new Date(b.updated_at);
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [pwas, searchQuery, statusFilter, sortBy, sortOrder]);

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setSortBy("name");
        setSortOrder("asc");
    };

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
                                {t('analytics')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('totalPwa')}</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.totalPwas}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('active')}</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.activePwas}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('draft')}</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.draftPwas}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('paused')}</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.pausedPwas}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* PWA List */}
                <div className="space-y-4">
                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                            <span className="ml-2 text-slate-600 dark:text-slate-400">{t('loadingPwa')}</span>
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
                    ) : filteredAndSortedPwas.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {filteredAndSortedPwas.map(pwa => (
                                <PWACardSimple key={pwa.id} pwa={pwa} />
                            ))}
                        </div>
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

// Простая карточка PWA
    function PWACardSimple({ pwa }: { pwa: PWAListItem }) {
        const { t } = useTranslation();
    const logger = useLogger('PWACardSimple');
    const { updatePWAInStore, removePWA } = usePWAStore();
    const [loading, setLoading] = useState<string | null>(null);

    const getStatusColor = (status: PWAListItem['status']) => {
        switch (status) {
            case 'deployed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'ready': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'building': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'paused': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusText = (status: PWAListItem['status']) => {
        switch (status) {
            case 'deployed': return t('ui.active');
            case 'ready': return t('ui.ready');
            case 'building': return t('ui.building');
            case 'error': return t('ui.failed');
            case 'paused': return t('ui.paused');
            case 'draft': return t('ui.draft');
            default: return status;
        }
    };

    const handleStatusChange = async (newStatus: 'deployed' | 'paused') => {
        setLoading(newStatus);
        try {
            const { updatePWAStatus } = await import('@/lib/api/pwa');
            const { data, error } = await updatePWAStatus(pwa.id, newStatus);
            
            if (error) {
                logger.error(t('notifications.pwa.statusChangeError'), error.message || t('notifications.general.unknownError'));
                return;
            }

            if (data) {
                updatePWAInStore(pwa.id, { status: data.status, published_at: data.published_at });
            }
        } catch (error) {
            logger.error(t('notifications.pwa.statusChangeError'), t('notifications.pwa.statusChangeError'))
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async () => {
        if (!confirm(t('confirmDeletePwa'))) {
            return;
        }

        setLoading('delete');
        try {
            const { deletePWA } = await import('@/lib/api/pwa');
            const { error } = await deletePWA(pwa.id);
            
            if (error) {
                logger.error(t('notifications.pwa.deleteError'), t('notifications.pwa.deleteError'))
                return;
            }

            removePWA(pwa.id);
        } catch (error) {
            logger.error(t('notifications.pwa.deleteError'), t('notifications.general.unknownError'));
        } finally {
            setLoading(null);
        }
    };

    // Моковые данные метрик (в реальности будут приходить с сервера)
    // Заглушка для метрик (пока без реальных данных)
    const metrics = {
        clicks: 0,
        click2inst: 0,
        installs: pwa.installs || 0,
        ftds: 0,
        cr: 0,
        last_updated: new Date().toISOString()
    };    return (
        <Card className="hover:shadow-lg transition-shadow group">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                            {pwa.logo_url ? (
                                <img 
                                    src={pwa.logo_url} 
                                    alt={`${pwa.name} логотип`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                pwa.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {pwa.name}
                            </h3>
                        </div>
                    </div>
                    <Badge className={getStatusColor(pwa.status)}>
                        {getStatusText(pwa.status)}
                    </Badge>
                </div>
                
                {/* Метрики производительности */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-5 gap-2 text-center">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Clicks</p>
                            <p className="font-semibold text-sm">{metrics.clicks.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Click2Inst</p>
                            <p className="font-semibold text-sm">{metrics.click2inst}%</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Installs</p>
                            <p className="font-semibold text-sm">{metrics.installs.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">FTDs</p>
                            <p className="font-semibold text-sm">{metrics.ftds.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">CR</p>
                            <p className="font-semibold text-sm">{metrics.cr}%</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span>{t('created')}: {new Date(pwa.created_at).toLocaleDateString()}</span>
                    {pwa.domain && <span>🌐 {pwa.domain}</span>}
                </div>
                
                {/* Действия */}
                <div className="flex gap-2">
                    <Link href={`/pwa/${pwa.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            <Settings className="w-4 h-4 mr-2" />
                            {t('settings')}
                        </Button>
                    </Link>
                    
                    {/* Активировать/Приостановить */}
                    {pwa.status === 'deployed' ? (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusChange('paused')}
                            disabled={loading === 'paused'}
                        >
                            {loading === 'paused' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                '⏸️'
                            )}
                        </Button>
                    ) : pwa.status === 'paused' || pwa.status === 'ready' || pwa.status === 'draft' ? (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusChange('deployed')}
                            disabled={loading === 'deployed'}
                        >
                            {loading === 'deployed' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                '▶️'
                            )}
                        </Button>
                    ) : null}
                    
                    {/* Удалить */}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDelete}
                        disabled={loading === 'delete'}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                        {loading === 'delete' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            '🗑️'
                        )}
                    </Button>
                    
                    {/* Просмотр (если развернуто) */}
                    {pwa.status === 'deployed' && pwa.domain && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={`https://${pwa.domain}`} target="_blank" rel="noopener noreferrer">
                                <Globe className="w-4 h-4" />
                            </a>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart3, Settings, Globe, TrendingUp, Users, Download, Search, Filter, SortAsc, SortDesc, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Head from "next/head";
import { pwas } from "@/lib/mocks/pwas";
import { PwaCard } from "@/components/cards/PwaCard";

export default function PwaIndexPage() {
    const { t } = useTranslation();

    // States for filtering and searching
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const stats = {
        totalPwas: pwas.length,
        activePwas: pwas.filter(p => p.status === 'active').length,
        totalDownloads: pwas.reduce((sum, p) => sum + (p.downloads || 0), 0),
        avgRating: 4.6
    };

    // Filtered and sorted PWAs
    const filteredAndSortedPwas = useMemo(() => {
        let filtered = pwas;

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(pwa => 
                pwa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pwa.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (pwa.description && pwa.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
                case "downloads":
                    aValue = a.downloads || 0;
                    bValue = b.downloads || 0;
                    break;
                case "rating":
                    aValue = a.rating || 0;
                    bValue = b.rating || 0;
                    break;
                case "created":
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
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
    }, [searchQuery, statusFilter, sortBy, sortOrder]);

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setSortBy("name");
        setSortOrder("asc");
    };

    return (
        <>
            <Head>
                <title>PWA Приложения - Everloop</title>
            </Head>
            <div className="p-3 sm:p-6 space-y-6">
                {/* Header with Quick Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {t("myPwa")}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Управляйте своими Progressive Web Applications
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Link href="/pwa/create" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-brand-yellow text-black hover:bg-yellow-400 font-medium">
                                <Plus className="w-4 h-4 mr-2" />
                                Создать PWA
                            </Button>
                        </Link>
                        <Link href="/pwa/analytics" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Аналитика
                            </Button>
                        </Link>
                        <Link href="/pwa/settings" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Settings className="w-4 h-4 mr-2" />
                                Настройки
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
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Всего PWA</p>
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
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Активных</p>
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
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Скачиваний</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.totalDownloads.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                    <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Рейтинг</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                                        {stats.avgRating}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Поиск по названию, домену или описанию..."
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

                            {/* Filters Row */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {/* Status Filter */}
                                <div className="flex-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Filter className="w-4 h-4" />
                                                    {statusFilter === "all" ? "Все статусы" : 
                                                     statusFilter === "active" ? "Активные" :
                                                     statusFilter === "draft" ? "Черновики" : "Приостановленные"}
                                                </div>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                                                Все статусы
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="default" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                                                    Активные
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-yellow-500"></Badge>
                                                    Черновики
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setStatusFilter("paused")}>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="w-2 h-2 p-0 rounded-full bg-slate-400"></Badge>
                                                    Приостановленные
                                                </div>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Sort Options */}
                                <div className="flex-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                <div className="flex items-center gap-2">
                                                    {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                                                    {sortBy === "name" ? "По названию" :
                                                     sortBy === "downloads" ? "По скачиваниям" :
                                                     sortBy === "rating" ? "По рейтингу" : "По дате"}
                                                </div>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuItem onClick={() => setSortBy("name")}>
                                                По названию
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy("downloads")}>
                                                По скачиваниям
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy("rating")}>
                                                По рейтингу
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortBy("created")}>
                                                По дате создания
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                                className="border-t mt-1 pt-1"
                                            >
                                                {sortOrder === "asc" ? "По убыванию" : "По возрастанию"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Clear Filters */}
                                {(searchQuery || statusFilter !== "all" || sortBy !== "name" || sortOrder !== "asc") && (
                                    <Button variant="ghost" onClick={clearFilters} className="whitespace-nowrap">
                                        <X className="w-4 h-4 mr-2" />
                                        Сбросить
                                    </Button>
                                )}
                            </div>

                            {/* Results Count */}
                            <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                                <span>
                                    Найдено: {filteredAndSortedPwas.length} из {pwas.length} PWA
                                </span>
                                {(searchQuery || statusFilter !== "all") && (
                                    <span className="text-brand-yellow">
                                        Применены фильтры
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PWA List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                            Ваши PWA приложения
                        </h2>
                        <Link href="/pwa/settings">
                            <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Настройки
                            </Button>
                        </Link>
                    </div>
                    
                    {filteredAndSortedPwas.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {filteredAndSortedPwas.map(pwa => (
                                <PwaCard key={pwa.id} pwa={pwa} />
                            ))}
                        </div>
                    ) : pwas.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Пока нет PWA приложений
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    Создайте свое первое Progressive Web Application
                                </p>
                                <Link href="/pwa/create">
                                    <Button className="bg-brand-yellow text-black hover:bg-yellow-400">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Создать первое PWA
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Ничего не найдено
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    Попробуйте изменить параметры поиска или фильтры
                                </p>
                                <Button variant="outline" onClick={clearFilters}>
                                    <X className="w-4 h-4 mr-2" />
                                    Сбросить фильтры
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

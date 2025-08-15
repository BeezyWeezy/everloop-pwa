import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Globe, Download, Star, Calendar, MoreVertical, Play, Pause, Edit } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PWA {
    id: string;
    name: string;
    domain: string;
    url?: string;
    status: 'active' | 'draft' | 'paused';
    created_at: string;
    description?: string;
    downloads?: number;
    rating?: number;
    updated_at?: string;
    category?: string;
    icon_url?: string;
    logo_url?: string;
}

export function PwaCard({ pwa }: { pwa: PWA }) {
    const { t } = useTranslation();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'paused': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return t('active');
            case 'draft': return t('draft');
            case 'paused': return t('paused');
            default: return status;
        }
    };

    return (
        <Card className="h-full hover:shadow-lg transition-all duration-200 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-brand-yellow to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {pwa.logo_url ? (
                                <img 
                                    src={pwa.logo_url} 
                                    alt={`${pwa.name} ${t('pwaCard.logo')}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Globe className="w-6 h-6 text-black" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg truncate group-hover:text-brand-yellow transition-colors">
                                {pwa.name}
                            </CardTitle>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                                {pwa.domain}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/pwa/${pwa.id}`}>
                                <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    {t('pwaCard.edit')}
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                {pwa.status === 'active' ? (
                                    <>
                                        <Pause className="w-4 h-4 mr-2" />
                                        {t('pwaCard.pause')}
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        {t('pwaCard.activate')}
                                    </>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Badge className={`w-fit text-xs ${getStatusColor(pwa.status)}`}>
                    {getStatusText(pwa.status)}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                {pwa.description && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {pwa.description}
                    </p>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                        <Download className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                            {pwa.downloads?.toLocaleString() || '0'}
                        </span>
                    </div>
                    {pwa.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-slate-600 dark:text-slate-400">
                                {pwa.rating}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                        {t('pwaCard.created')} {new Date(pwa.created_at).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                        {t("open")}
                    </Button>
                    <Button variant="default" size="sm" className="flex-1 text-xs">
                        {t('pwaCard.configure')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

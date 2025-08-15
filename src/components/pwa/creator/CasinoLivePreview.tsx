import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { 
    Smartphone, 
    Monitor, 
    Link2, 
    CheckCircle, 
    AlertCircle,
    Clock,
    Target,
    BarChart,
    Bell
} from 'lucide-react';

interface CasinoLivePreviewProps {
    data: {
        name: string;
        description: string;
        domain: string;
        category: string;
        affiliateSettings: {
            casinoUrl: string;
            autoRedirect: {
                enabled: boolean;
                delay: number;
            };
            personalizedLinks: {
                enabled: boolean;
            };
        };
        tracking: {
            facebookPixelId?: string;
            googleAnalyticsId?: string;
        };
        pushNotifications: {
            enabled: boolean;
            scenarios: any[];
        };
    };
}

export default function CasinoLivePreview({ data }: CasinoLivePreviewProps) {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = React.useState<'mobile' | 'desktop'>('mobile');

    return (
        <Card className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                        Live Preview
                    </h3>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <Button
                            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('mobile')}
                            className="h-6 px-2 text-xs"
                        >
                            <Smartphone className="w-3 h-3" />
                        </Button>
                        <Button
                            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('desktop')}
                            className="h-6 px-2 text-xs"
                        >
                            <Monitor className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t('livePreview.description')}
                </p>
            </div>

            {/* Phone Preview */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="mx-auto max-w-xs">
                    {/* Phone Frame */}
                    <div className="bg-black rounded-3xl p-2 shadow-2xl">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden min-h-[600px]">
                            {/* Status Bar */}
                            <div className="bg-slate-900 text-white text-xs px-4 py-2 flex justify-between">
                                <span>9:41 AM</span>
                                <span>100%</span>
                            </div>
                            
                            {/* PWA Header */}
                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="font-bold text-lg">
                                            {data.name || t('livePreview.defaultName')}
                                        </h1>
                                        <p className="text-red-100 text-sm">
                                            {data.description || t('livePreview.defaultDescription')}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-red-800 rounded-lg flex items-center justify-center">
                                        🎰
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-4 space-y-4">
                                {/* Welcome Banner */}
                                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 rounded-lg text-center">
                                    <h2 className="font-bold text-lg">{t('livePreview.welcomeBonus')}</h2>
                                    <p className="text-sm">{t('livePreview.bonusText')}</p>
                                    <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                                        {t('livePreview.claimNow')}
                                    </Button>
                                </div>
                                
                                {/* Games Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[t('livePreview.slots'), t('livePreview.poker'), t('livePreview.blackjack'), t('livePreview.roulette')].map((game) => (
                                        <div key={game} className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                                            <div className="text-2xl mb-1">🎯</div>
                                            <p className="text-sm font-medium">{game}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Auto-redirect indicator */}
                                {data.affiliateSettings.autoRedirect.enabled && (
                                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                            <Link2 className="w-4 h-4" />
                                            <span className="text-sm font-medium">{t('livePreview.autoRedirectEnabled')}</span>
                                        </div>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            {t('livePreview.redirectsIn', { seconds: data.affiliateSettings.autoRedirect.delay })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* PWA Info */}
                    <div className="mt-4 space-y-3">
                        <div className="text-center">
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                {data.name || t('livePreview.defaultName')}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {data.domain || 'casino.app'}
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Badge variant="secondary">{data.category || t('livePreview.games')}</Badge>
                                <Badge variant="outline">PWA</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Summary */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">{t('livePreview.configurationStatus')}</h4>
                
                <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Link2 className="w-3 h-3" />
                            {t('livePreview.casinoUrl')}
                        </span>
                        <div className="flex items-center gap-1">
                            {data.affiliateSettings.casinoUrl ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {t('livePreview.tracking')}
                        </span>
                        <div className="flex items-center gap-1">
                            {(data.tracking.facebookPixelId || data.tracking.googleAnalyticsId) ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            {t('livePreview.notifications')}
                        </span>
                        <div className="flex items-center gap-1">
                            {data.pushNotifications.enabled ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

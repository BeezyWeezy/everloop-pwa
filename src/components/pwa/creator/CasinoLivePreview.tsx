import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Star, Link2, BarChart, Bell } from "lucide-react";

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
    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Live Preview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Как выглядит ваше казино PWA
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
                                            {data.name || 'Casino PWA'}
                                        </h1>
                                        <p className="text-red-100 text-sm">
                                            {data.description || 'Best Casino Experience'}
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
                                    <h2 className="font-bold text-lg">Welcome Bonus!</h2>
                                    <p className="text-sm">Get $1000 + 100 Free Spins</p>
                                    <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                                        Claim Now
                                    </Button>
                                </div>
                                
                                {/* Games Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {['Slots', 'Poker', 'Blackjack', 'Roulette'].map((game) => (
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
                                            <span className="text-sm font-medium">Auto-redirect enabled</span>
                                        </div>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            Redirects to casino in {data.affiliateSettings.autoRedirect.delay}s
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
                                {data.name || 'Casino PWA'}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {data.domain || 'casino.app'}
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Badge variant="secondary">{data.category || 'Games'}</Badge>
                                <Badge variant="outline">PWA</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Summary */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Configuration Status</h4>
                
                <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Link2 className="w-3 h-3" />
                            Casino URL
                        </span>
                        <Badge variant={data.affiliateSettings.casinoUrl ? "default" : "secondary"} className="text-xs">
                            {data.affiliateSettings.casinoUrl ? 'Set' : 'Not set'}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <BarChart className="w-3 h-3" />
                            Analytics
                        </span>
                        <Badge 
                            variant={(data.tracking.facebookPixelId || data.tracking.googleAnalyticsId) ? "default" : "secondary"} 
                            className="text-xs"
                        >
                            {(data.tracking.facebookPixelId || data.tracking.googleAnalyticsId) ? 'Connected' : 'Not connected'}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            Push Notifications
                        </span>
                        <Badge variant={data.pushNotifications.enabled ? "default" : "secondary"} className="text-xs">
                            {data.pushNotifications.enabled ? `${data.pushNotifications.scenarios.length} scenarios` : 'Disabled'}
                        </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3" />
                            Personalized Links
                        </span>
                        <Badge variant={data.affiliateSettings.personalizedLinks.enabled ? "default" : "secondary"} className="text-xs">
                            {data.affiliateSettings.personalizedLinks.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}

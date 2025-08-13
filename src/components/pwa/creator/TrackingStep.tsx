import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
    BarChart, 
    Eye, 
    Mouse, 
    Download, 
    UserPlus, 
    DollarSign,
    Facebook,
    Chrome,
    Activity
} from "lucide-react";

interface TrackingStepProps {
    data: {
        tracking: {
            facebookPixelId?: string;
            googleAnalyticsId?: string;
            customEvents: {
                pageView: boolean;
                appInstall: boolean;
                linkClick: boolean;
                registration: boolean;
                deposit: boolean;
            };
        };
    };
    onChange: (updates: Partial<TrackingStepProps['data']>) => void;
}

export default function TrackingStep({ data, onChange }: TrackingStepProps) {
    const updateTracking = (updates: Partial<typeof data.tracking>) => {
        onChange({
            tracking: {
                ...data.tracking,
                ...updates
            }
        });
    };

    const updateCustomEvents = (event: keyof typeof data.tracking.customEvents, enabled: boolean) => {
        updateTracking({
            customEvents: {
                ...data.tracking.customEvents,
                [event]: enabled
            }
        });
    };

    const events = [
        {
            key: 'pageView' as const,
            label: 'Просмотр страницы',
            description: 'Отслеживание загрузки PWA',
            icon: Eye,
            recommended: true
        },
        {
            key: 'appInstall' as const,
            label: 'Установка приложения',
            description: 'Установка PWA на устройство',
            icon: Download,
            recommended: true
        },
        {
            key: 'linkClick' as const,
            label: 'Клик по ссылке',
            description: 'Переход в казино',
            icon: Mouse,
            recommended: true
        },
        {
            key: 'registration' as const,
            label: 'Регистрация',
            description: 'Регистрация в казино',
            icon: UserPlus,
            recommended: false
        },
        {
            key: 'deposit' as const,
            label: 'Депозит',
            description: 'Пополнение счета в казино',
            icon: DollarSign,
            recommended: false
        }
    ];

    return (
        <>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-purple-600" />
                    Аналитика и трекинг
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Настройте отслеживание конверсий и аналитику для оптимизации кампаний
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Facebook Pixel */}
                <div className="space-y-2">
                    <Label htmlFor="facebook-pixel" className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook Pixel ID
                    </Label>
                    <Input
                        id="facebook-pixel"
                        value={data.tracking.facebookPixelId || ''}
                        onChange={(e) => updateTracking({ facebookPixelId: e.target.value })}
                        placeholder="123456789012345"
                    />
                    <p className="text-xs text-slate-500">
                        ID пикселя Facebook для отслеживания конверсий из Facebook Ads
                    </p>
                </div>

                {/* Google Analytics */}
                <div className="space-y-2">
                    <Label htmlFor="google-analytics" className="flex items-center gap-2">
                        <Chrome className="w-4 h-4 text-orange-600" />
                        Google Analytics ID
                    </Label>
                    <Input
                        id="google-analytics"
                        value={data.tracking.googleAnalyticsId || ''}
                        onChange={(e) => updateTracking({ googleAnalyticsId: e.target.value })}
                        placeholder="G-XXXXXXXXXX или UA-XXXXXXXX-X"
                    />
                    <p className="text-xs text-slate-500">
                        ID Google Analytics для подробной аналитики пользователей
                    </p>
                </div>

                {/* Custom Events */}
                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4" />
                        <Label className="text-base">Отслеживаемые события</Label>
                    </div>
                    
                    <div className="space-y-4">
                        {events.map((event) => {
                            const Icon = event.icon;
                            const isEnabled = data.tracking.customEvents[event.key];
                            
                            return (
                                <div key={event.key} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Icon className={`w-5 h-5 mt-0.5 ${
                                            isEnabled ? 'text-green-600' : 'text-slate-400'
                                        }`} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{event.label}</span>
                                                {event.recommended && (
                                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                        Рекомендуется
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={isEnabled}
                                        onCheckedChange={(checked) => updateCustomEvents(event.key, checked)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <BarChart className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                Настроенные системы аналитики:
                            </h4>
                            <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                                {data.tracking.facebookPixelId && (
                                    <div>✓ Facebook Pixel: {data.tracking.facebookPixelId}</div>
                                )}
                                {data.tracking.googleAnalyticsId && (
                                    <div>✓ Google Analytics: {data.tracking.googleAnalyticsId}</div>
                                )}
                                <div>
                                    ✓ Активных событий: {Object.values(data.tracking.customEvents).filter(Boolean).length} из {events.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                                Важно для медиабайеров
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                События "Регистрация" и "Депозит" требуют настройки postback-уведомлений 
                                от казино. Обратитесь к вашему аффилиат менеджеру для получения webhooks.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Validation Status */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Этот шаг:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-blue-600">Опционально</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    );
}

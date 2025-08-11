import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Download, Check, Eye, Share2, Settings } from "lucide-react";
import { GooglePlayPreview } from "./GooglePlayPreview";

interface PreviewStepProps {
    data: {
        name: string;
        description: string;
        domain: string;
        category: string;
        logo?: string;
        themeColor: string;
        backgroundColor: string;
        accentColor: string;
        features: string[];
        template?: string;
    };
    onCreatePwa: () => void;
}

const availableFeatures = [
    { id: 'push-notifications', name: 'Push-уведомления' },
    { id: 'offline-mode', name: 'Оффлайн режим' },
    { id: 'social-sharing', name: 'Социальные сети' },
    { id: 'payments', name: 'Платежи' },
    { id: 'geolocation', name: 'Геолокация' },
    { id: 'camera', name: 'Камера' },
    { id: 'gaming', name: 'Игровые функции' },
    { id: 'security', name: 'Безопасность' },
    { id: 'performance', name: 'Производительность' },
    { id: 'analytics', name: 'Аналитика' }
];

const categories = [
    { id: 'casino', name: 'Казино', emoji: '🎰' },
    { id: 'slots', name: 'Слоты', emoji: '🎲' },
    { id: 'sports', name: 'Спорт', emoji: '⚽' },
    { id: 'finance', name: 'Финансы', emoji: '💰' },
    { id: 'crypto', name: 'Криптовалюта', emoji: '₿' }
];

export function PreviewStep({ data, onCreatePwa }: PreviewStepProps) {
    const selectedCategory = categories.find(c => c.id === data.category);
    const selectedFeatures = data.features?.map(fId => 
        availableFeatures.find(f => f.id === fId)?.name
    ).filter(Boolean) || [];

    return (
        <div className="space-y-6">
            {/* Success Message */}
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
                <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                        PWA готово к созданию!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                        Проверьте настройки и создайте ваше Progressive Web Application
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Settings Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Сводка настроек
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                {data.logo ? (
                                    <img src={data.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        {selectedCategory?.emoji || '📱'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold">{data.name}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{data.domain}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                                    <span className="text-slate-600 dark:text-slate-400">Категория:</span>
                                    <Badge variant="outline">
                                        {selectedCategory?.emoji} {selectedCategory?.name}
                                    </Badge>
                                </div>
                                
                                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                                    <span className="text-slate-600 dark:text-slate-400">Основной цвет:</span>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: data.themeColor }}
                                        ></div>
                                        <span className="font-mono text-xs">{data.themeColor}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                                    <span className="text-slate-600 dark:text-slate-400">Цвет фона:</span>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-4 h-4 rounded border"
                                            style={{ backgroundColor: data.backgroundColor }}
                                        ></div>
                                        <span className="font-mono text-xs">{data.backgroundColor}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                                    <span className="text-slate-600 dark:text-slate-400">Акцентный цвет:</span>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: data.accentColor }}
                                        ></div>
                                        <span className="font-mono text-xs">{data.accentColor}</span>
                                    </div>
                                </div>
                                
                                <div className="py-2">
                                    <span className="text-slate-600 dark:text-slate-400">Функции ({selectedFeatures.length}):</span>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {selectedFeatures.map((feature, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {feature}
                                            </Badge>
                                        ))}
                                        {selectedFeatures.length === 0 && (
                                            <span className="text-xs text-slate-500">Базовые функции</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {data.description && (
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        "{data.description}"
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Final Preview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Финальный предпросмотр
                                {data.template === 'google-play' && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        Google Play Store
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                                {data.template === 'google-play' ? (
                                    <GooglePlayPreview data={data} />
                                ) : (
                                    <div 
                                        className="w-full max-w-sm mx-auto rounded-2xl border-4 border-slate-300 dark:border-slate-600 overflow-hidden"
                                        style={{ backgroundColor: data.backgroundColor }}
                                    >
                                        {/* Status Bar */}
                                        <div 
                                            className="h-8 flex items-center justify-center text-white text-xs font-medium"
                                            style={{ backgroundColor: data.themeColor }}
                                        >
                                            9:41 AM • PWA Preview
                                        </div>
                                        
                                        {/* Header */}
                                        <div 
                                            className="p-4 text-white"
                                            style={{ backgroundColor: data.themeColor }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {data.logo ? (
                                                    <img src={data.logo} alt="Logo" className="w-10 h-10 rounded-lg" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg">
                                                        {selectedCategory?.emoji || '📱'}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-sm">
                                                        {data.name || 'Приложение'}
                                                    </h3>
                                                    <p className="text-xs opacity-90">{data.domain}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Добро пожаловать!</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                                {data.description || 'Описание приложения...'}
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <div 
                                                className="p-2 rounded text-white text-xs text-center font-medium"
                                                style={{ backgroundColor: data.themeColor }}
                                            >
                                                Войти
                                            </div>
                                            <div 
                                                className="p-2 rounded text-xs text-center"
                                                style={{ 
                                                    backgroundColor: data.accentColor, 
                                                    color: data.backgroundColor 
                                                }}
                                            >
                                                Регистрация
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div 
                                                className="h-2 rounded"
                                                style={{ backgroundColor: data.accentColor, opacity: 0.3 }}
                                            ></div>
                                            <div 
                                                className="h-2 w-3/4 rounded"
                                                style={{ backgroundColor: data.accentColor, opacity: 0.2 }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={onCreatePwa}
                            className="w-full bg-brand-yellow text-black hover:bg-yellow-400 py-3 text-lg font-semibold"
                            size="lg"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Создать PWA приложение
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="flex items-center justify-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Поделиться
                            </Button>
                            <Button variant="outline" className="flex items-center justify-center gap-2">
                                <Smartphone className="w-4 h-4" />
                                Тест на устройстве
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

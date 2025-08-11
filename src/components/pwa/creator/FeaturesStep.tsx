import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Smartphone, Users, Share2, CreditCard, MapPin, Camera, Gamepad2, Shield, Zap } from "lucide-react";

interface FeaturesStepProps {
    data: {
        features: string[];
        pushNotifications: boolean;
        offlineMode: boolean;
    };
    onChange: (updates: Partial<FeaturesStepProps['data']>) => void;
}

const availableFeatures = [
    {
        id: 'push-notifications',
        name: 'Push-уведомления',
        description: 'Отправка уведомлений пользователям',
        icon: Bell,
        category: 'Коммуникация',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
        id: 'offline-mode',
        name: 'Оффлайн режим',
        description: 'Работа приложения без интернета',
        icon: Smartphone,
        category: 'Основные',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    },
    {
        id: 'social-sharing',
        name: 'Социальные сети',
        description: 'Интеграция с соцсетями',
        icon: Share2,
        category: 'Коммуникация',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
        id: 'payments',
        name: 'Платежи',
        description: 'Интеграция платежных систем',
        icon: CreditCard,
        category: 'Коммерция',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    {
        id: 'geolocation',
        name: 'Геолокация',
        description: 'Определение местоположения',
        icon: MapPin,
        category: 'Сервисы',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    },
    {
        id: 'camera',
        name: 'Камера',
        description: 'Доступ к камере устройства',
        icon: Camera,
        category: 'Медиа',
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
    },
    {
        id: 'gaming',
        name: 'Игровые функции',
        description: 'Игровые механики и геймификация',
        icon: Gamepad2,
        category: 'Развлечения',
        color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
    },
    {
        id: 'security',
        name: 'Безопасность',
        description: 'Дополнительная защита данных',
        icon: Shield,
        category: 'Безопасность',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    },
    {
        id: 'performance',
        name: 'Производительность',
        description: 'Оптимизация скорости работы',
        icon: Zap,
        category: 'Оптимизация',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    },
    {
        id: 'analytics',
        name: 'Аналитика',
        description: 'Сбор и анализ данных пользователей',
        icon: Users,
        category: 'Аналитика',
        color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400'
    }
];

const categories = Array.from(new Set(availableFeatures.map(f => f.category)));

export function FeaturesStep({ data, onChange }: FeaturesStepProps) {
    const toggleFeature = (featureId: string) => {
        const currentFeatures = data.features || [];
        const newFeatures = currentFeatures.includes(featureId)
            ? currentFeatures.filter(f => f !== featureId)
            : [...currentFeatures, featureId];
        
        onChange({ features: newFeatures });
    };

    const selectPreset = (preset: string) => {
        const presets = {
            'basic': ['push-notifications', 'offline-mode'],
            'social': ['push-notifications', 'offline-mode', 'social-sharing', 'camera'],
            'commerce': ['push-notifications', 'payments', 'security', 'analytics'],
            'gaming': ['push-notifications', 'offline-mode', 'gaming', 'performance', 'analytics'],
            'premium': availableFeatures.map(f => f.id)
        };
        
        onChange({ features: presets[preset as keyof typeof presets] || [] });
    };

    return (
        <div className="space-y-6">
            {/* Feature Presets */}
            <Card>
                <CardHeader>
                    <CardTitle>Готовые наборы функций</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <button
                            onClick={() => selectPreset('basic')}
                            className="p-3 text-center border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="font-medium text-sm">Базовый</div>
                            <div className="text-xs text-slate-500 mt-1">2 функции</div>
                        </button>
                        <button
                            onClick={() => selectPreset('social')}
                            className="p-3 text-center border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="font-medium text-sm">Социальный</div>
                            <div className="text-xs text-slate-500 mt-1">4 функции</div>
                        </button>
                        <button
                            onClick={() => selectPreset('commerce')}
                            className="p-3 text-center border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="font-medium text-sm">Коммерция</div>
                            <div className="text-xs text-slate-500 mt-1">4 функции</div>
                        </button>
                        <button
                            onClick={() => selectPreset('gaming')}
                            className="p-3 text-center border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="font-medium text-sm">Игровой</div>
                            <div className="text-xs text-slate-500 mt-1">5 функций</div>
                        </button>
                        <button
                            onClick={() => selectPreset('premium')}
                            className="p-3 text-center border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="font-medium text-sm">Премиум</div>
                            <div className="text-xs text-slate-500 mt-1">Все функции</div>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Features by Category */}
            <div className="space-y-6">
                {categories.map(category => (
                    <Card key={category}>
                        <CardHeader>
                            <CardTitle className="text-lg">{category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableFeatures
                                    .filter(feature => feature.category === category)
                                    .map(feature => {
                                        const isSelected = data.features?.includes(feature.id);
                                        const Icon = feature.icon;
                                        
                                        return (
                                            <div
                                                key={feature.id}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                                    isSelected 
                                                        ? 'border-brand-yellow bg-yellow-50 dark:bg-yellow-900/10' 
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                                onClick={() => toggleFeature(feature.id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${feature.color}`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-medium text-sm">{feature.name}</h3>
                                                            {isSelected && (
                                                                <Badge variant="default" className="bg-brand-yellow text-black">
                                                                    Выбрано
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Selected Features Summary */}
            {data.features && data.features.length > 0 && (
                <Card className="border-brand-yellow/20 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
                    <CardHeader>
                        <CardTitle>Выбранные функции ({data.features.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {data.features.map(featureId => {
                                const feature = availableFeatures.find(f => f.id === featureId);
                                if (!feature) return null;
                                
                                return (
                                    <Badge 
                                        key={featureId} 
                                        className={feature.color}
                                        onClick={() => toggleFeature(featureId)}
                                    >
                                        {feature.name} ×
                                    </Badge>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

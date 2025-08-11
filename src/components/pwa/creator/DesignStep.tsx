import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Smartphone, Monitor, Eye, Wand2, Play, Globe, ShoppingBag } from "lucide-react";

interface DesignStepProps {
    data: {
        themeColor: string;
        backgroundColor: string;
        accentColor: string;
        name: string;
        logo?: string;
        template?: string;
    };
    onChange: (updates: Partial<DesignStepProps['data']>) => void;
}

const designTemplates = [
    {
        id: 'google-play',
        name: 'Google Play Store',
        description: 'Точная копия дизайна Google Play Store',
        icon: Play,
        preview: '/templates/google-play-preview.jpg',
        colors: {
            themeColor: '#1976D2',
            backgroundColor: '#FFFFFF', 
            accentColor: '#4CAF50'
        }
    },
    {
        id: 'casino-classic',
        name: 'Классическое казино',
        description: 'Роскошный дизайн казино с золотыми акцентами',
        icon: ShoppingBag,
        preview: '/templates/casino-preview.jpg',
        colors: {
            themeColor: '#B8860B',
            backgroundColor: '#000000',
            accentColor: '#FFD700'
        }
    },
    {
        id: 'modern-app',
        name: 'Современное приложение',
        description: 'Минималистичный современный дизайн',
        icon: Smartphone,
        preview: '/templates/modern-preview.jpg',
        colors: {
            themeColor: '#3B82F6',
            backgroundColor: '#F8FAFC',
            accentColor: '#10B981'
        }
    }
];

const colorPresets = [
    { name: 'Google Play', theme: '#1976D2', bg: '#FFFFFF', accent: '#4CAF50' },
    { name: 'Классический', theme: '#3B82F6', bg: '#F8FAFC', accent: '#10B981' },
    { name: 'Тёмный', theme: '#1F2937', bg: '#111827', accent: '#F59E0B' },
    { name: 'Неон', theme: '#8B5CF6', bg: '#0F0F23', accent: '#00D9FF' },
    { name: 'Закат', theme: '#F97316', bg: '#FFF7ED', accent: '#EC4899' },
    { name: 'Океан', theme: '#0EA5E9', bg: '#F0F9FF', accent: '#06B6D4' },
    { name: 'Лес', theme: '#059669', bg: '#F0FDF4', accent: '#84CC16' }
];

export function DesignStep({ data, onChange }: DesignStepProps) {
    const applyTemplate = (template: typeof designTemplates[0]) => {
        onChange({
            template: template.id,
            themeColor: template.colors.themeColor,
            backgroundColor: template.colors.backgroundColor,
            accentColor: template.colors.accentColor
        });
    };

    const applyPreset = (preset: typeof colorPresets[0]) => {
        onChange({
            themeColor: preset.theme,
            backgroundColor: preset.bg,
            accentColor: preset.accent
        });
    };

    const generateRandomColors = () => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        const randomTheme = colors[Math.floor(Math.random() * colors.length)];
        const randomAccent = colors[Math.floor(Math.random() * colors.length)];
        
        onChange({
            themeColor: randomTheme,
            accentColor: randomAccent
        });
    };

    return (
        <div className="space-y-6">
            {/* Design Templates */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Шаблоны дизайна PWA
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {designTemplates.map((template) => {
                            const Icon = template.icon;
                            const isSelected = data.template === template.id;
                            
                            return (
                                <div
                                    key={template.id}
                                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                                        isSelected 
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => applyTemplate(template)}
                                >
                                    {isSelected && (
                                        <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white">
                                            Выбрано
                                        </Badge>
                                    )}
                                    
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{template.name}</h3>
                                            <p className="text-xs text-gray-500">{template.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mb-2">
                                        <div 
                                            className="w-6 h-6 rounded-full border" 
                                            style={{ backgroundColor: template.colors.themeColor }}
                                        ></div>
                                        <div 
                                            className="w-6 h-6 rounded-full border" 
                                            style={{ backgroundColor: template.colors.backgroundColor }}
                                        ></div>
                                        <div 
                                            className="w-6 h-6 rounded-full border" 
                                            style={{ backgroundColor: template.colors.accentColor }}
                                        ></div>
                                    </div>
                                    
                                    {template.id === 'google-play' && (
                                        <div className="text-xs text-green-600 font-medium">
                                            🎯 Точная копия Google Play Store
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="text-center text-sm text-gray-600">
                        💡 Выберите шаблон дизайна, который лучше всего подходит для вашего PWA
                    </div>
                </CardContent>
            </Card>

            {/* Color Presets */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Готовые цветовые схемы
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {colorPresets.map((preset, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all"
                                onClick={() => applyPreset(preset)}
                            >
                                <div className="flex gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.theme }}></div>
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.bg }}></div>
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                                </div>
                                <p className="text-sm font-medium">{preset.name}</p>
                            </div>
                        ))}
                    </div>
                    <Button onClick={generateRandomColors} variant="outline" className="w-full">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Случайные цвета
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Color Controls */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Настройка цветов</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="themeColor" className="text-sm font-medium">
                                    Основной цвет
                                </Label>
                                <div className="flex items-center gap-3 mt-2">
                                    <input
                                        type="color"
                                        id="themeColor"
                                        value={data.themeColor}
                                        onChange={(e) => onChange({ themeColor: e.target.value })}
                                        className="w-12 h-12 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
                                    />
                                    <Input
                                        value={data.themeColor}
                                        onChange={(e) => onChange({ themeColor: e.target.value })}
                                        className="flex-1"
                                        placeholder="#3B82F6"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="backgroundColor" className="text-sm font-medium">
                                    Цвет фона
                                </Label>
                                <div className="flex items-center gap-3 mt-2">
                                    <input
                                        type="color"
                                        id="backgroundColor"
                                        value={data.backgroundColor}
                                        onChange={(e) => onChange({ backgroundColor: e.target.value })}
                                        className="w-12 h-12 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
                                    />
                                    <Input
                                        value={data.backgroundColor}
                                        onChange={(e) => onChange({ backgroundColor: e.target.value })}
                                        className="flex-1"
                                        placeholder="#F8FAFC"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="accentColor" className="text-sm font-medium">
                                    Акцентный цвет
                                </Label>
                                <div className="flex items-center gap-3 mt-2">
                                    <input
                                        type="color"
                                        id="accentColor"
                                        value={data.accentColor}
                                        onChange={(e) => onChange({ accentColor: e.target.value })}
                                        className="w-12 h-12 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer"
                                    />
                                    <Input
                                        value={data.accentColor}
                                        onChange={(e) => onChange({ accentColor: e.target.value })}
                                        className="flex-1"
                                        placeholder="#10B981"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Предпросмотр дизайна
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Mobile Preview */}
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Smartphone className="w-4 h-4" />
                                    <span className="text-sm font-medium">Мобильная версия</span>
                                </div>
                                <div 
                                    className="w-64 h-96 mx-auto rounded-2xl border-4 border-slate-300 dark:border-slate-600 overflow-hidden"
                                    style={{ backgroundColor: data.backgroundColor }}
                                >
                                    {/* Status Bar */}
                                    <div 
                                        className="h-8 flex items-center justify-center text-white text-xs font-medium"
                                        style={{ backgroundColor: data.themeColor }}
                                    >
                                        9:41 AM
                                    </div>
                                    
                                    {/* Header */}
                                    <div 
                                        className="p-4 text-white"
                                        style={{ backgroundColor: data.themeColor }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {data.logo ? (
                                                <img src={data.logo} alt="Logo" className="w-8 h-8 rounded-lg" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                                    📱
                                                </div>
                                            )}
                                            <h3 className="font-semibold text-sm">
                                                {data.name || 'Приложение'}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 space-y-3">
                                        <div 
                                            className="h-3 rounded"
                                            style={{ backgroundColor: data.accentColor, opacity: 0.8 }}
                                        ></div>
                                        <div 
                                            className="h-2 w-3/4 rounded"
                                            style={{ backgroundColor: data.accentColor, opacity: 0.5 }}
                                        ></div>
                                        <div 
                                            className="h-2 w-1/2 rounded"
                                            style={{ backgroundColor: data.accentColor, opacity: 0.3 }}
                                        ></div>
                                        
                                        <div 
                                            className="mt-4 p-3 rounded-lg text-white text-xs text-center font-medium"
                                            style={{ backgroundColor: data.themeColor }}
                                        >
                                            Кнопка действия
                                        </div>
                                        
                                        <div 
                                            className="p-3 rounded-lg text-center text-xs"
                                            style={{ 
                                                backgroundColor: data.accentColor, 
                                                color: data.backgroundColor,
                                                opacity: 0.9 
                                            }}
                                        >
                                            Акцентный элемент
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Preview */}
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Monitor className="w-4 h-4" />
                                    <span className="text-sm font-medium">Десктоп версия</span>
                                </div>
                                <div 
                                    className="w-full h-32 rounded-lg border overflow-hidden"
                                    style={{ backgroundColor: data.backgroundColor }}
                                >
                                    {/* Header */}
                                    <div 
                                        className="h-8 flex items-center px-4 text-white text-xs"
                                        style={{ backgroundColor: data.themeColor }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {data.logo ? (
                                                <img src={data.logo} alt="Logo" className="w-4 h-4 rounded" />
                                            ) : (
                                                <span>📱</span>
                                            )}
                                            <span className="font-medium">{data.name || 'Приложение'}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-4 space-y-2">
                                        <div 
                                            className="h-2 w-1/4 rounded"
                                            style={{ backgroundColor: data.accentColor, opacity: 0.8 }}
                                        ></div>
                                        <div 
                                            className="h-1 w-3/4 rounded"
                                            style={{ backgroundColor: data.accentColor, opacity: 0.5 }}
                                        ></div>
                                        <div className="flex gap-2 mt-2">
                                            <div 
                                                className="h-6 w-16 rounded text-white text-xs flex items-center justify-center"
                                                style={{ backgroundColor: data.themeColor }}
                                            >
                                                Button
                                            </div>
                                            <div 
                                                className="h-6 w-16 rounded text-xs flex items-center justify-center"
                                                style={{ 
                                                    backgroundColor: data.accentColor, 
                                                    color: data.backgroundColor,
                                                    opacity: 0.9 
                                                }}
                                            >
                                                Accent
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    Save,
    Eye,
    Download,
    ExternalLink,
    Settings,
    Smartphone,
    Monitor,
    Palette,
    Code2,
    Globe,
    Star,
    Trash2
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { pwas, PWA } from "@/lib/mocks/pwas";

export default function EditPwaPage() {
    const router = useRouter();
    const { id } = router.query;
    const { t } = useTranslation();
    
    const [pwa, setPwa] = useState<PWA | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (id) {
            const foundPwa = pwas.find(p => p.id === id);
            setPwa(foundPwa || null);
            setIsLoading(false);
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!pwa) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    PWA не найдено
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Запрашиваемое PWA приложение не существует или было удалено.
                </p>
                <Link href="/pwa">
                    <Button>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Назад к PWA
                    </Button>
                </Link>
            </div>
        );
    }

    const handleInputChange = (field: string, value: any) => {
        setPwa(prev => prev ? { ...prev, [field]: value } : null);
    };

    const tabs = [
        { id: 'basic', label: 'Основные', icon: Settings },
        { id: 'design', label: 'Дизайн', icon: Palette },
        { id: 'features', label: 'Функции', icon: Code2 },
        { id: 'analytics', label: 'Аналитика', icon: Globe },
    ];

    return (
        <>
            <Head>
                <title>Редактировать {pwa.name} - Everloop</title>
            </Head>
            <div className="p-3 sm:p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/pwa">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Назад к PWA
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                                {pwa.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={pwa.status === 'active' ? 'default' : 'secondary'}>
                                    {pwa.status === 'active' ? 'Активно' : 'Неактивно'}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                    <Download className="w-3 h-3" />
                                    {pwa.downloads.toLocaleString()} установок
                                </div>
                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                    <Star className="w-3 h-3" />
                                    {pwa.rating}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Предпросмотр
                        </Button>
                        <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Открыть
                        </Button>
                        <Button className="bg-brand-yellow text-black hover:bg-yellow-400">
                            <Save className="w-4 h-4 mr-2" />
                            Сохранить
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Button
                                key={tab.id}
                                variant={activeTab === tab.id ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveTab(tab.id)}
                                className="whitespace-nowrap"
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </Button>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === 'basic' && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Основная информация</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Название</Label>
                                            <Input
                                                id="name"
                                                value={pwa.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="description">Описание</Label>
                                            <Input
                                                id="description"
                                                value={pwa.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="url">URL</Label>
                                            <Input
                                                id="url"
                                                value={pwa.url || ''}
                                                onChange={(e) => handleInputChange('url', e.target.value)}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="shortName">Короткое название</Label>
                                            <Input
                                                id="shortName"
                                                value={pwa.name.slice(0, 12)}
                                                placeholder="Короткое название для иконки"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Настройки публикации</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <div>
                                                <h3 className="font-medium">Опубликовано</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    PWA доступно для установки
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={pwa.status === 'active'}
                                                onChange={(e) => handleInputChange('status', e.target.checked ? 'active' : 'inactive')}
                                                className="w-5 h-5"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {activeTab === 'design' && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Цветовая схема</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="themeColor">Основной цвет</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input
                                                    id="themeColor"
                                                    type="color"
                                                    value="#3B82F6"
                                                    className="w-20"
                                                />
                                                <Input
                                                    value="#3B82F6"
                                                    placeholder="#3B82F6"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="backgroundColor">Цвет фона</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input
                                                    id="backgroundColor"
                                                    type="color"
                                                    value="#FFFFFF"
                                                    className="w-20"
                                                />
                                                <Input
                                                    value="#FFFFFF"
                                                    placeholder="#FFFFFF"
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Иконки</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label>Загрузить иконку</Label>
                                            <div className="mt-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                                    <Smartphone className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    Перетащите файл или нажмите для выбора
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                                    PNG, JPG до 2MB. Рекомендуемый размер: 512x512px
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {activeTab === 'features' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Доступные функции</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {pwa.features.map((feature, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                            <div>
                                                <h3 className="font-medium capitalize">{feature}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {feature === 'offline' && 'Работа без интернета'}
                                                    {feature === 'notifications' && 'Push-уведомления'}
                                                    {feature === 'background-sync' && 'Синхронизация в фоне'}
                                                    {feature === 'geolocation' && 'Определение местоположения'}
                                                    {feature === 'camera' && 'Доступ к камере'}
                                                </p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                className="w-5 h-5"
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'analytics' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Статистика использования</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                {pwa.downloads.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Установок</div>
                                        </div>
                                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {Math.floor(pwa.downloads * 0.7).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Активных</div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Android</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div className="bg-green-500 h-2 rounded-full" style={{width: '65%'}}></div>
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400">65%</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">iOS</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400">30%</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Desktop</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '5%'}}></div>
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-400">5%</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Preview */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Monitor className="w-5 h-5" />
                                    Предпросмотр
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">
                                            {pwa.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                        {pwa.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        {pwa.description}
                                    </p>
                                    <Button size="sm" className="mt-3 w-full bg-brand-yellow text-black hover:bg-yellow-400">
                                        Установить
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600 dark:text-red-400">
                                    Опасная зона
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Удалить PWA
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info, Settings, Globe, FileText, Star, Users, Search, ShoppingCart, Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import DomainConfirmModal from "./DomainConfirmModal";

interface DomainSearchResult {
    domain: string;
    available: boolean;
    price: number;
    extension: string;
    recommended?: boolean;
}

interface BasicInfoStepProps {
    data: {
        // Базовые поля (оставляем как есть)
        name: string;
        description: string;
        domain: string;
        category: string;
        
        // Домен данные
        selectedDomain?: string;
        domainPurchased?: boolean;
        
        // Новые поля для Google Play Store
        language?: string;
        internalName?: string;
        pwaName?: string;
        developer?: string;
        isVerified?: boolean;
        hasAds?: boolean;
        hasInAppPurchases?: boolean;
        isEditorsChoice?: boolean;
        rating?: number;
        reviewsCount?: number;
        downloadsCount?: string;
        ageRating?: string;
        descriptionTitle?: string;
        version?: string;
        lastUpdated?: string;
    };
    onChange: (updates: Partial<BasicInfoStepProps['data']>) => void;
}

type BasicInfoData = BasicInfoStepProps['data'];

export default function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
    const [domainSearch, setDomainSearch] = useState('');
    const [searchResults, setSearchResults] = useState<DomainSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [userBalance] = useState(150); // Мок баланса пользователя
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<{domain: string, price: number} | null>(null);

    // Debounce для поиска доменов
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (domainSearch.trim() && domainSearch.length >= 2) {
                searchDomains(domainSearch);
            } else {
                setSearchResults([]);
            }
        }, 500); // Задержка 500ms

        return () => clearTimeout(timeoutId);
    }, [domainSearch]);

    const updateField = (field: keyof BasicInfoData, value: string) => {
        onChange({ [field]: value });
    };

    // Реальная функция поиска доменов через API
    const searchDomains = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        
        try {
            const response = await fetch('/api/domains/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query.trim() })
            });

            const data = await response.json();
            
            if (data.success && data.domains) {
                // Преобразуем данные от API в формат компонента
                const results: DomainSearchResult[] = data.domains.map((domain: any) => ({
                    domain: domain.domain,
                    available: domain.available,
                    price: domain.price || 0,
                    extension: '.' + domain.domain.split('.')[1],
                    recommended: domain.domain.endsWith('.site') || domain.domain.endsWith('.online')
                }));
                setSearchResults(results);
            } else {
                console.error('Domain search failed:', data.error);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Domain search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const purchaseDomain = async (domain: string, price: number) => {
        setSelectedDomain({ domain, price });
        setShowConfirmModal(true);
    };

    const handleConfirmPurchase = async () => {
        if (!selectedDomain) return;

        const { domain, price } = selectedDomain;
        
        try {
            // Упрощенная покупка без данных регистранта
            const response = await fetch('/api/domains/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    domain,
                    price,
                    userId: 'user123' // Здесь будет реальный ID пользователя
                })
            });

            const data = await response.json();
            
            if (data.success) {
                onChange({ 
                    selectedDomain: domain,
                    domainPurchased: true,
                    domain: domain 
                });
                setShowConfirmModal(false);
                setSelectedDomain(null);
                alert(`✅ Домен успешно куплен и привязан к PWA!\n\n🌐 Домен: ${domain}\n💰 Стоимость: $${price}/год\n🔗 Статус: Привязан к PWA\n📄 Transaction ID: ${data.transactionId}\n\nТеперь ваше PWA будет доступно по адресу ${domain}`);
            } else {
                alert(`Ошибка при покупке домена: ${data.error}`);
            }
        } catch (error) {
            console.error('Domain purchase error:', error);
            alert('Произошла ошибка при покупке домена. Попробуйте позже.');
        }
    };

    const categories = [
        'Casino', 'Sports Betting', 'Poker', 'Slots', 'Live Casino', 'Bingo', 'Lottery', 'Other'
    ];

    const languages = [
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'de', label: 'Deutsch' },
        { value: 'fr', label: 'Français' },
    ];

    const ageRatings = ['3+', '7+', '12+', '16+', '18+'];
    const downloadsOptions = ['1K+', '5K+', '10K+', '50K+', '100K+', '500K+', '1M+', '5M+', '10M+'];

    return (
        <>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    Основная информация PWA
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Сначала выберите домен для вашего PWA, затем настройте основные параметры
                </p>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Domain Search Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">Выбор домена</h3>
                        <Badge variant="outline" className="text-xs">
                            Баланс: ${userBalance}
                        </Badge>
                    </div>
                    
                    {data.selectedDomain ? (
                        // Выбранный домен
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-600" />
                                    <div>
                                        <div className="font-medium text-green-900 dark:text-green-100">
                                            {data.selectedDomain}
                                        </div>
                                        <div className="text-sm text-green-700 dark:text-green-300">
                                            Домен куплен и готов к использованию
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onChange({ selectedDomain: undefined, domainPurchased: false, domain: '' })}
                                >
                                    Изменить
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Поиск домена
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    value={domainSearch}
                                    onChange={(e) => {
                                        setDomainSearch(e.target.value);
                                    }}
                                    placeholder="Введите имя домена (поиск начнется через 0.5 сек)"
                                    className="pl-10"
                                />
                            </div>
                            
                            {domainSearch.length > 0 && domainSearch.length < 2 && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Введите минимум 2 символа для поиска
                                </div>
                            )}
                            
                            {isSearching && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                                    <span className="ml-2">Поиск доменов...</span>
                                </div>
                            )}
                            
                            {searchResults.length > 0 && !isSearching && (
                                <div className="space-y-2 animate-in fade-in-50 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Результаты поиска:
                                        </h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {searchResults.length} доменов найдено
                                        </span>
                                    </div>
                                    <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent border border-gray-200 dark:border-gray-700 rounded-lg">
                                        <div className="grid gap-2 p-2">
                                            {searchResults.map((result, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center justify-between p-3 border rounded-lg ${
                                                    result.available 
                                                        ? result.recommended
                                                            ? 'border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800'
                                                            : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
                                                        : 'border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 opacity-60'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {result.available ? (
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-red-500" />
                                                    )}
                                                    <span className="font-medium">{result.domain}</span>
                                                    {result.recommended && (
                                                        <Badge className="bg-purple-600 text-white text-xs">
                                                            Рекомендуем
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {result.available ? (
                                                        <>
                                                            <span className="font-semibold text-lg">
                                                                ${result.price}/год
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => purchaseDomain(result.domain, result.price)}
                                                                disabled={userBalance < result.price}
                                                                className={result.recommended ? 'bg-purple-600 hover:bg-purple-700' : ''}
                                                            >
                                                                <ShoppingCart className="w-4 h-4 mr-1" />
                                                                Купить и привязать
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <span className="text-red-500 font-medium">Занят</span>
                                                    )}
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Разделитель */}
                <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">Настройки PWA</h3>
                    </div>

                    {/* PWA Name */}
                    <div className="space-y-2">
                        <Label htmlFor="pwa-name" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Название PWA *
                        </Label>
                        <Input
                            id="pwa-name"
                            value={data.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="Golden Casino PWA"
                        className="text-lg"
                    />
                    <p className="text-xs text-slate-500">
                        Это внутреннее название для управления PWA. Пользователи увидят другое название.
                    </p>
                </div>

                {/* Domain */}
                <div className="space-y-2">
                    <Label htmlFor="domain" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Домен *
                    </Label>
                    <Input
                        id="domain"
                        value={data.domain}
                        onChange={(e) => updateField('domain', e.target.value)}
                        placeholder="goldencasino.com"
                    />
                    <p className="text-xs text-slate-500">
                        Домен где будет размещено PWA приложение
                    </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">
                        Описание (опционально)
                    </Label>
                    <Input
                        id="description"
                        value={data.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Лучшее казино с бонусами и джекпотами"
                    />
                    <p className="text-xs text-slate-500">
                        Краткое описание для внутреннего использования
                    </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label>Категория</Label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Badge
                                key={category}
                                variant={data.category === category ? "default" : "outline"}
                                className={`cursor-pointer transition-all ${
                                    data.category === category 
                                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                                onClick={() => updateField('category', category)}
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Дополнительные поля PWA */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-600" />
                        Настройки Play Store
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Язык интерфейса */}
                        <div className="space-y-2">
                            <Label htmlFor="language">Язык интерфейса PWA</Label>
                            <select
                                id="language"
                                value={data.language || 'ru'}
                                onChange={(e) => onChange({ language: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                {languages.map((lang) => (
                                    <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Внутреннее название */}
                        <div className="space-y-2">
                            <Label htmlFor="internalName">Название (внутри сервиса)</Label>
                            <Input
                                id="internalName"
                                value={data.internalName || ''}
                                onChange={(e) => onChange({ internalName: e.target.value })}
                                placeholder="Казино Фортуна - Промо PWA"
                            />
                        </div>

                        {/* Название PWA */}
                        <div className="space-y-2">
                            <Label htmlFor="pwaName">Название PWA</Label>
                            <Input
                                id="pwaName"
                                value={data.pwaName || ''}
                                onChange={(e) => onChange({ pwaName: e.target.value })}
                                placeholder="Fortune Casino"
                            />
                        </div>

                        {/* Разработчик */}
                        <div className="space-y-2">
                            <Label htmlFor="developer">Разработчик</Label>
                            <Input
                                id="developer"
                                value={data.developer || ''}
                                onChange={(e) => onChange({ developer: e.target.value })}
                                placeholder="Fortune Games Ltd."
                            />
                        </div>

                        {/* Рейтинг */}
                        <div className="space-y-2">
                            <Label htmlFor="rating">Рейтинг</Label>
                            <Input
                                id="rating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={data.rating || 4.5}
                                onChange={(e) => onChange({ rating: parseFloat(e.target.value) || 4.5 })}
                                placeholder="4.5"
                            />
                        </div>

                        {/* Кол-во отзывов */}
                        <div className="space-y-2">
                            <Label htmlFor="reviewsCount">Кол-во отзывов</Label>
                            <Input
                                id="reviewsCount"
                                type="number"
                                value={data.reviewsCount || 1000}
                                onChange={(e) => onChange({ reviewsCount: parseInt(e.target.value) || 1000 })}
                                placeholder="1000"
                            />
                        </div>

                        {/* Кол-во скачиваний */}
                        <div className="space-y-2">
                            <Label htmlFor="downloadsCount">Кол-во скачиваний</Label>
                            <select
                                id="downloadsCount"
                                value={data.downloadsCount || '10K+'}
                                onChange={(e) => onChange({ downloadsCount: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                {downloadsOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Возраст */}
                        <div className="space-y-2">
                            <Label htmlFor="ageRating">Возраст</Label>
                            <select
                                id="ageRating"
                                value={data.ageRating || '18+'}
                                onChange={(e) => onChange({ ageRating: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                {ageRatings.map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Переключатели */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Верификация</Label>
                            <Switch
                                checked={data.isVerified || false}
                                onCheckedChange={(checked) => onChange({ isVerified: checked })}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Есть реклама</Label>
                            <Switch
                                checked={data.hasAds || false}
                                onCheckedChange={(checked) => onChange({ hasAds: checked })}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Покупки в приложении</Label>
                            <Switch
                                checked={data.hasInAppPurchases || false}
                                onCheckedChange={(checked) => onChange({ hasInAppPurchases: checked })}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Выбор редакции</Label>
                            <Switch
                                checked={data.isEditorsChoice || false}
                                onCheckedChange={(checked) => onChange({ isEditorsChoice: checked })}
                            />
                        </div>
                    </div>

                    {/* Заголовок описания и версия */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="descriptionTitle">Заголовок описания</Label>
                            <Input
                                id="descriptionTitle"
                                value={data.descriptionTitle || ''}
                                onChange={(e) => onChange({ descriptionTitle: e.target.value })}
                                placeholder="🎰 Лучшее казино с огромными бонусами!"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="version">Версия</Label>
                            <Input
                                id="version"
                                value={data.version || '1.0.0'}
                                onChange={(e) => onChange({ version: e.target.value })}
                                placeholder="1.0.0"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="lastUpdated">Последнее обновление</Label>
                            <Input
                                id="lastUpdated"
                                type="date"
                                value={data.lastUpdated || new Date().toISOString().split('T')[0]}
                                onChange={(e) => onChange({ lastUpdated: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                Что происходит дальше?
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                После заполнения основной информации мы настроим параметры казино, 
                                трекинг для аналитики и push-уведомления для ретаргетинга пользователей.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Validation Status */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Готовность к следующему шагу:</span>
                        <div className="flex items-center gap-2">
                            {data.name.trim() && data.selectedDomain ? (
                                <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-green-600">Готово</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <span className="text-sm text-amber-600">
                                        {!data.selectedDomain ? 'Выберите домен' : 'Заполните название PWA'}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                </div>
            </CardContent>
            
            {/* Domain Confirmation Modal */}
            {selectedDomain && (
                <DomainConfirmModal
                    domain={selectedDomain.domain}
                    price={selectedDomain.price}
                    isOpen={showConfirmModal}
                    onClose={() => {
                        setShowConfirmModal(false);
                        setSelectedDomain(null);
                    }}
                    onConfirm={handleConfirmPurchase}
                    userBalance={userBalance}
                />
            )}
        </>
    );
}

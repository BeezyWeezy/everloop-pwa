import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';;
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info, Settings, Globe, FileText, Star, Users, Search, Loader2, Check, X } from "lucide-react";
import DomainConfirmModal from "./DomainConfirmModal";
import { useLogger } from "@/lib/utils/logger";

interface BasicInfoStepProps {
    data: {
        // Базовые поля (оставляем как есть)
        name: string;
        description: string;
        domain: string;
        category: string;
        
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
    const { t } = useTranslation();
    const [domainSearch, setDomainSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<any>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [userBalance] = useState(1000); // Mock баланс
    const [searchMessage, setSearchMessage] = useState<string | null>(null);
    const logger = useLogger('BasicInfoStep');

    const updateField = (field: keyof BasicInfoData, value: string) => {
        onChange({ [field]: value });
    };

    // Поиск доменов
    const handleDomainSearch = async () => {
        if (!domainSearch.trim() || domainSearch.trim().length < 2) return;

        setIsSearching(true);
        setSearchResults([]); // Очищаем предыдущие результаты
        setSearchMessage(null); // Очищаем предыдущие сообщения
        try {
            const response = await fetch('/api/domains/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: domainSearch.trim() })
            });

            const data = await response.json();
            
            if (data.success) {
                setSearchResults(data.domains);
                
                // Уведомляем пользователя, если домены не найдены
                if (data.domains.length === 0) {
                    setSearchMessage(`${t('domain.searchNoResults')}`);
                    logger.domain.search(domainSearch.trim(), 0);
                    logger.warning('Домены не найдены', `${t('domain.searchNoResultsSuggestion')}`);
                } else {
                    logger.domain.search(domainSearch.trim(), data.domains.length);
                }
            } else {
                throw new Error(data.error || 'Ошибка поиска доменов');
            }
        } catch (error) {
            logger.api.error('/api/domains/search', error);
            setSearchMessage(t('notifications.domain.searchError'));
        } finally {
            setIsSearching(false);
        }
    };

    // Покупка домена
    const handlePurchaseDomain = async () => {
        if (!selectedDomain) return;

        setIsPurchasing(true);
        try {
            // Покупаем домен напрямую через Namecheap API
            const response = await fetch('/api/domains/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    domain: selectedDomain.domain,
                    price: selectedDomain.price,
                    registrant: {
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'user3312@gmail.com',
                        phone: '1934567890',
                        address1: '123 Main Street',
                        city: 'Los Angeles',
                        stateProvince: 'CA',
                        postalCode: '90210',
                        country: 'US'
                    }
                })
            });

            const result = await response.json();

            if (result.success) {
                updateField('domain', selectedDomain.domain);
                setShowConfirmModal(false);
                setSelectedDomain(null);
                setSearchResults([]);
                setDomainSearch('');
                logger.domain.purchase(selectedDomain.domain, true);
            } else {
                logger.domain.purchase(selectedDomain.domain, false, t('notifications.domain.purchaseError'));
            }
        } catch (error) {
            logger.api.error('/api/domains/purchase', 'Ошибка при покупке домена');
        } finally {
            setIsPurchasing(false);
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
                    {t('basicInformation')}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('fillBasicDetails')}
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* PWA Name */}
                <div className="space-y-2">
                    <Label htmlFor="pwa-name" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {t('appNameLabel')} *
                    </Label>
                    <Input
                        id="pwa-name"
                        value={data.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Golden Casino PWA"
                        className="text-lg"
                    />
                    <p className="text-xs text-slate-500">
                        {t('basicInfoDescription')}
                    </p>
                </div>

                {/* Domain Search */}
                <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {t('domain.search')} *
                    </Label>
                    
                    {/* Поиск доменов */}
                    <div className="flex gap-2">
                        <Input
                            value={domainSearch}
                            onChange={(e) => setDomainSearch(e.target.value)}
                            placeholder={t('domain.searchPlaceholder')}
                            onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                        />
                        <Button
                            onClick={handleDomainSearch}
                            disabled={isSearching || !domainSearch.trim()}
                            className="px-4"
                        >
                            {isSearching ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    {/* Сообщение о результате поиска */}
                    {searchMessage && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                {searchMessage}
                            </p>
                        </div>
                    )}

                    {/* Результаты поиска */}
                    {searchResults.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">{t('domain.availableDomains')}</h4>
                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                {searchResults.map((domain) => (
                                    <div
                                        key={domain.domain}
                                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                            domain.price && domain.price <= 5
                                                ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                                                : domain.price && domain.price <= 15
                                                ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                                                : 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                                        }`}
                                        onClick={() => {
                                            setSelectedDomain(domain);
                                            setShowConfirmModal(true);
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{domain.domain}</span>
                                            <Check className="w-4 h-4 text-green-600" />
                                            {domain.price && domain.price <= 5 && (
                                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                                    {t('domain.cheapDomain')}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-semibold ${
                                                domain.price && domain.price <= 5
                                                    ? 'text-blue-600'
                                                    : domain.price && domain.price <= 15
                                                    ? 'text-green-600'
                                                    : 'text-purple-600'
                                            }`}>
                                                ${domain.price ? domain.price.toFixed(2) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {searchResults.length === 10 && (
                                <p className="text-xs text-slate-500 text-center">
                                    {t('domain.showFirstTenDomains')}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Текущий домен */}
                    {data.domain && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-blue-900 dark:text-blue-100">
                                    {t('selectedDomain')}: {data.domain}
                                </span>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                    {t('domain.active')}
                                </Badge>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-slate-500">
                        {t('domain.searchTips')}
                    </p>
                    
                    {/* Подсказки для поиска */}
                    {!searchResults.length && !searchMessage && !isSearching && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                💡 <strong>{t('domain.tipsTitle')}:</strong>
                            </p>
                            <ul className="text-xs text-slate-500 dark:text-slate-500 space-y-1">
                                <li>• {t('domain.tip1')}</li>
                                <li>• {t('domain.tip2')}</li>
                                <li>• {t('domain.tip3')}</li>
                                <li>• {t('domain.tip4')}</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">
                        {t('description')}
                    </Label>
                    <Input
                        id="description"
                        value={data.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Лучшее казино с бонусами и джекпотами"
                    />
                    <p className="text-xs text-slate-500">
                        {t('descriptionDescription')}
                    </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label>{t('category')}</Label>
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
                        {t('playStoreSettings')}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Язык интерфейса */}
                        <div className="space-y-2">
                            <Label htmlFor="language">{t('language')}</Label>
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
                            <Label htmlFor="internalName">{t('internalName')}</Label>
                            <Input
                                id="internalName"
                                value={data.internalName || ''}
                                onChange={(e) => onChange({ internalName: e.target.value })}
                                placeholder="Казино Фортуна - Промо PWA"
                            />
                        </div>

                        {/* Название PWA */}
                        <div className="space-y-2">
                            <Label htmlFor="pwaName">{t('pwaName')}</Label>
                            <Input
                                id="pwaName"
                                value={data.pwaName || ''}
                                onChange={(e) => onChange({ pwaName: e.target.value })}
                                placeholder="Fortune Casino"
                            />
                        </div>

                        {/* Разработчик */}
                        <div className="space-y-2">
                            <Label htmlFor="developer">{t('developer')}</Label>
                            <Input
                                id="developer"
                                value={data.developer || ''}
                                onChange={(e) => onChange({ developer: e.target.value })}
                                placeholder="Fortune Games Ltd."
                            />
                        </div>

                        {/* Рейтинг */}
                        <div className="space-y-2">
                            <Label htmlFor="rating">{t('rating')}</Label>
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
                            <Label htmlFor="reviewsCount">{t('reviewsCount')}</Label>
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
                            <Label htmlFor="downloadsCount">{t('downloadsCount')}</Label>
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
                            <Label htmlFor="ageRating">{t('ageRating')}</Label>
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
                            <Label className="text-sm">{t('verification')}</Label>
                            <Switch
                                checked={data.isVerified || false}
                                onCheckedChange={(checked) => onChange({ isVerified: checked })}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">{t('hasAds')}</Label>
                            <Switch
                                checked={data.hasAds || false}
                                onCheckedChange={(checked) => onChange({ hasAds: checked })}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">{t('inAppPurchases')}</Label>
                            <Switch
                                checked={data.hasInAppPurchases || false}
                                onCheckedChange={(checked) => onChange({ hasInAppPurchases: checked })}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">{t('editorsChoice')}</Label>
                            <Switch
                                checked={data.isEditorsChoice || false}
                                onCheckedChange={(checked) => onChange({ isEditorsChoice: checked })}
                            />
                        </div>
                    </div>

                    {/* Заголовок описания и версия */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="descriptionTitle">{t('descriptionTitle')}</Label>
                            <Input
                                id="descriptionTitle"
                                value={data.descriptionTitle || ''}
                                onChange={(e) => onChange({ descriptionTitle: e.target.value })}
                                placeholder="🎰 Лучшее казино с огромными бонусами!"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="version">{t('version')}</Label>
                            <Input
                                id="version"
                                value={data.version || '1.0.0'}
                                onChange={(e) => onChange({ version: e.target.value })}
                                placeholder="1.0.0"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="lastUpdated">{t('lastUpdated')}</Label>
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
                                {t('whatsNext')}
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                {t('whatsNextDescription')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Validation Status */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('readiness')}:</span>
                        <div className="flex items-center gap-2">
                            {data.name.trim() && data.domain.trim() ? (
                                <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-green-600">{t('ready')}</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <span className="text-sm text-amber-600">
                                        {t('fillRequiredFields')}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Модальное окно подтверждения покупки домена */}
            <DomainConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handlePurchaseDomain}
                domain={selectedDomain || { domain: '', price: 0 }}
                userBalance={userBalance}
                isLoading={isPurchasing}
            />
        </>
    );
}

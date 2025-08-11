'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Monitor, 
    Smartphone, 
    Star, 
    Share2, 
    Play,
    Info
} from 'lucide-react';

export interface LivePreviewProps {
    data: {
        name?: string;
        description?: string;
        logo?: string;
        themeColor?: string;
        backgroundColor?: string;
        tags?: string[];
        category?: string;
        developer?: string;
    };
}

export default function LivePreview({ data }: LivePreviewProps) {
    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

    return (
        <div className="sticky top-20 h-[calc(100vh-80px)] flex flex-col bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-4">
                <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                
                {/* View Mode Toggle */}
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('mobile')}
                        className="flex items-center gap-2"
                    >
                        <Smartphone className="w-4 h-4" />
                        Mobile
                    </Button>
                    <Button
                        variant={viewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('desktop')}
                        className="flex items-center gap-2"
                    >
                        <Monitor className="w-4 h-4" />
                        Desktop
                    </Button>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-4 overflow-auto">
                {viewMode === 'mobile' ? (
                    <GooglePlayPreview data={data} />
                ) : (
                    <WebAppPreview data={data} />
                )}
            </div>
        </div>
    );
}

function GooglePlayPreview({ data }: { data: LivePreviewProps['data'] }) {
    return (
        <div className="max-w-sm mx-auto">
            {/* Phone Frame */}
            <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-gray-900 rounded-[2rem] overflow-hidden h-[720px] text-white">
                    {/* Status Bar */}
                    <div className="bg-gray-900 h-7 flex items-center justify-between px-6 text-xs font-medium text-white pt-2">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                            </div>
                            <div className="w-6 h-3 border border-white rounded-sm ml-2">
                                <div className="w-full h-full bg-green-500 rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* Google Play Store Header */}
                    <div className="bg-gray-900 px-4 py-2 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                </div>
                                <span className="text-lg font-normal text-white">
                                    Google Play
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">B</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* App Page Content */}
                    <div className="bg-gray-900 overflow-y-auto h-[calc(100%-70px)]">
                        {/* Hero Image/Trailer */}
                        <div className="relative h-48 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-500 flex items-center justify-center">
                            {/* Simulated game screenshot with play button */}
                            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center mb-2">
                                    <Play className="w-8 h-8 text-white fill-white" />
                                </div>
                                <span className="text-white text-sm font-medium">Трейлер</span>
                            </div>
                            {/* Game elements overlay */}
                            <div className="absolute top-4 left-4 text-white text-xs">
                                <div className="bg-orange-600 px-2 py-1 rounded">15</div>
                            </div>
                            <div className="absolute top-4 right-4 text-white text-xs">
                                <div className="bg-black bg-opacity-50 px-2 py-1 rounded">76,730,663</div>
                            </div>
                        </div>

                        {/* App Info Section */}
                        <div className="p-4">
                            <div className="flex items-start gap-4 mb-4">
                                {/* App Icon */}
                                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                                    {data.logo ? (
                                        <img src={data.logo} alt="App Icon" className="w-full h-full object-cover" />
                                    ) : (
                                        <div 
                                            className="w-full h-full flex items-center justify-center text-white font-bold text-xl relative"
                                            style={{ backgroundColor: data.themeColor || '#F59E0B' }}
                                        >
                                            {/* Simulated game logo with "2025" badge */}
                                            <span className="text-2xl">{data.name ? data.name.charAt(0).toUpperCase() : 'A'}</span>
                                            <div className="absolute bottom-0 left-0 bg-red-600 text-white text-xs px-1 rounded-tr">
                                                2025
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* App Info */}
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl font-normal text-white mb-1 leading-tight">
                                        {data.name || 'Cash Tornado™ Slots — казино'}
                                    </h1>
                                    <div className="text-sm text-green-400 mb-2 font-medium">
                                        {data.developer || 'Zeroo Gravity Games'}
                                    </div>
                                    <div className="text-xs text-gray-400 mb-3">
                                        Есть реклама · Покупки в приложении
                                    </div>
                                </div>
                            </div>

                            {/* Rating and Downloads Row */}
                            <div className="flex items-center justify-between mb-4 text-center">
                                <div>
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <span className="text-white font-medium">4.9</span>
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="text-xs text-gray-400">Отзывы: 282 тыс.</div>
                                </div>
                                <div>
                                    <div className="text-white font-medium mb-1">10 млн+</div>
                                    <div className="text-xs text-gray-400">(количество скачиваний)</div>
                                </div>
                                <div>
                                    <div className="bg-gray-700 px-2 py-1 rounded text-xs mb-1">
                                        <span className="text-white">18+</span>
                                    </div>
                                    <div className="text-xs text-gray-400">Возраст</div>
                                </div>
                            </div>

                            {/* Install Button */}
                            <div className="mb-4">
                                <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-base">
                                    Установить
                                </Button>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center justify-around mb-6">
                                <button className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                                        <Share2 className="w-5 h-5 text-green-400" />
                                    </div>
                                    <span className="text-xs text-green-400">Поделиться</span>
                                </button>
                                <button className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-green-400 rounded flex items-center justify-center">
                                            <div className="w-2 h-2 bg-green-400"></div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-green-400">Добавить в список желаний</span>
                                </button>
                            </div>

                            {/* Device Compatibility */}
                            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <Info className="w-4 h-4" />
                                    <span>Это приложение недоступно для вашего устройства.</span>
                                </div>
                            </div>

                            {/* Screenshots Section */}
                            <div className="mb-6">
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-40 h-72 bg-gradient-to-b from-orange-500 to-red-600 rounded-lg flex-shrink-0 relative overflow-hidden">
                                            {/* Simulated slot machine interface */}
                                            <div className="absolute inset-0 flex flex-col">
                                                <div className="h-1/3 bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                                                    <div className="text-white font-bold text-xl">💰</div>
                                                </div>
                                                <div className="flex-1 grid grid-cols-3 gap-1 p-2">
                                                    {[...Array(9)].map((_, j) => (
                                                        <div key={j} className="bg-yellow-400 rounded flex items-center justify-center text-xl">
                                                            {['🔥', '💎', '⭐', '🍀'][j % 4]}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Navigation */}
                            <div className="bg-gray-900 border-t border-gray-700 mt-4 pt-2">
                                <div className="flex justify-around py-2">
                                    <div className="flex flex-col items-center py-1">
                                        <div className="w-6 h-6 text-gray-400 mb-1">🎮</div>
                                        <span className="text-xs text-gray-400">Игры</span>
                                    </div>
                                    <div className="flex flex-col items-center py-1">
                                        <div className="w-6 h-6 text-gray-400 mb-1">📱</div>
                                        <span className="text-xs text-gray-400">Приложения</span>
                                    </div>
                                    <div className="flex flex-col items-center py-1">
                                        <div className="w-6 h-6 text-gray-400 mb-1">📚</div>
                                        <span className="text-xs text-gray-400">Книги</span>
                                    </div>
                                    <div className="flex flex-col items-center py-1">
                                        <div className="w-6 h-6 text-gray-400 mb-1">👶</div>
                                        <span className="text-xs text-gray-400">Детям</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WebAppPreview({ data }: { data: LivePreviewProps['data'] }) {
    return (
        <div className="w-full">
            {/* Browser Window */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Browser Header */}
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-white dark:bg-slate-700 rounded px-3 py-1 text-sm text-slate-600 dark:text-slate-400 ml-4">
                            {data.name ? `${data.name.toLowerCase().replace(/\s+/g, '')}.app` : 'yourapp.app'}
                        </div>
                    </div>
                </div>

                {/* Web App Content */}
                <div className="p-8 min-h-[500px]" style={{ backgroundColor: data.backgroundColor || '#FFFFFF' }}>
                    <div className="max-w-2xl mx-auto text-center">
                        {/* App Icon */}
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
                            {data.logo ? (
                                <img src={data.logo} alt="App Icon" className="w-full h-full object-cover" />
                            ) : (
                                <div 
                                    className="w-full h-full flex items-center justify-center text-white font-bold text-3xl"
                                    style={{ backgroundColor: data.themeColor || '#10B981' }}
                                >
                                    {data.name ? data.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                            )}
                        </div>

                        {/* App Title */}
                        <h1 className="text-4xl font-bold mb-4" style={{ color: data.themeColor || '#10B981' }}>
                            {data.name || 'Your App Name'}
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            {data.description || 'Описание вашего веб-приложения будет отображаться здесь. Расскажите, что делает ваше приложение особенным и почему пользователи должны им воспользоваться.'}
                        </p>

                        {/* CTA Button */}
                        <Button 
                            size="lg" 
                            className="px-8 py-3 text-lg font-medium rounded-xl"
                            style={{ backgroundColor: data.themeColor || '#10B981' }}
                        >
                            Начать использование
                        </Button>

                        {/* Tags */}
                        {data.tags && data.tags.length > 0 && (
                            <div className="flex justify-center flex-wrap gap-3 mt-8">
                                {data.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="px-3 py-1">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BasicInfoStep } from "./BasicInfoStep";
import LivePreview from "./LivePreview";

interface PwaData {
    // Basic Info
    name: string;
    description: string;
    tags: string[];
    collaborators: string[];
    developer?: string;
    
    // Design & Branding
    logo?: string;
    themeColor: string;
    backgroundColor: string;
    accentColor: string;
    template?: string;
    
    // Technical
    domain: string;
    category: string;
    
    // Features
    features: string[];
    pushNotifications: boolean;
    offlineMode: boolean;
    analytics: boolean;
    seo: boolean;
}

const initialData: PwaData = {
    name: "",
    description: "",
    tags: [],
    collaborators: [],
    developer: "",
    domain: "",
    category: "",
    themeColor: "#10B981", // Emerald-500
    backgroundColor: "#FFFFFF", 
    accentColor: "#F59E0B", // Amber-500
    features: [],
    pushNotifications: false,
    offlineMode: false,
    analytics: true,
    seo: true
};

export default function PwaCreator() {
    const { t } = useTranslation();
    const [pwaData, setPwaData] = useState<PwaData>(initialData);
    const [isCreating, setIsCreating] = useState(false);

    const updatePwaData = (updates: Partial<PwaData>) => {
        setPwaData(prev => ({ ...prev, ...updates }));
    };

    const handleCreatePwa = async () => {
        setIsCreating(true);
        // Simulate PWA creation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsCreating(false);
        // Here you would handle the actual PWA creation
        console.log('Creating PWA with data:', pwaData);
    };

    const handlePreview = () => {
        const previewData = {
            name: pwaData.name || 'Мое PWA Приложение',
            description: pwaData.description || 'Современное Progressive Web Application с отличной функциональностью и пользовательским интерфейсом.',
            logo: pwaData.logo,
            themeColor: pwaData.themeColor || '#10B981',
            backgroundColor: pwaData.backgroundColor || '#FFFFFF',
            tags: pwaData.tags || ['веб-приложение', 'современный', 'быстрый'],
            developer: pwaData.developer || 'Разработчик',
            category: pwaData.category || 'Утилиты'
        };

        const previewHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${previewData.name} - Google Play</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
</head>
<body class="bg-white">
    <!-- Google Play Header -->
    <header class="bg-white shadow-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 py-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-3">
                        <svg class="w-8 h-8" viewBox="0 0 24 24">
                            <path fill="#34A853" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5Z"/>
                            <path fill="#FBBC04" d="M16.81,15.12L6.05,21.34C5.78,21.48 5.49,21.52 5.2,21.47L16.81,15.12Z"/>
                            <path fill="#EA4335" d="M20.16,10.85C20.47,11.11 20.65,11.54 20.65,12C20.65,12.46 20.47,12.89 20.16,13.15L17.89,14.5L6.05,2.66C5.78,2.52 5.49,2.48 5.2,2.53L16.81,8.88L20.16,10.85Z"/>
                            <path fill="#4285F4" d="M17.89,9.5L16.81,8.88L5.2,2.53C5.49,2.48 5.78,2.52 6.05,2.66L17.89,9.5Z"/>
                        </svg>
                        <span class="text-xl font-normal text-gray-700">Google Play</span>
                    </div>
                    <nav class="hidden md:flex items-center gap-6 text-sm">
                        <a href="#" class="text-emerald-600 font-medium border-b-2 border-emerald-600 pb-2">Игры</a>
                        <a href="#" class="text-gray-600 hover:text-gray-900">Приложения</a>
                        <a href="#" class="text-gray-600 hover:text-gray-900">Книги</a>
                        <a href="#" class="text-gray-600 hover:text-gray-900">Детям</a>
                    </nav>
                </div>
                <div class="flex items-center gap-4">
                    <input type="text" placeholder="Поиск приложений и игр" 
                           class="hidden md:block w-80 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
        </div>
    </header>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center gap-2 text-sm text-gray-600">
            <a href="#" class="hover:underline">Игры</a>
            <span>›</span>
            <a href="#" class="hover:underline">${previewData.category}</a>
            <span>›</span>
            <span class="text-gray-900">${previewData.name}</span>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 pb-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column -->
            <div class="lg:col-span-2">
                <!-- App Header -->
                <div class="flex gap-6 mb-8">
                    <div class="w-32 h-32 flex-shrink-0">
                        ${previewData.logo ? 
                            `<img src="${previewData.logo}" alt="${previewData.name}" class="w-full h-full rounded-2xl shadow-lg object-cover">` :
                            `<div class="w-full h-full rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-4xl" 
                                  style="background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)">
                                ${previewData.name.charAt(0).toUpperCase()}
                             </div>`
                        }
                    </div>
                    <div class="flex-1">
                        <h1 class="text-3xl font-normal text-gray-900 mb-3">${previewData.name}</h1>
                        <div class="flex items-center gap-2 mb-4">
                            <a href="#" class="text-emerald-600 hover:underline text-sm font-medium">${previewData.developer}</a>
                            <span class="text-gray-400">•</span>
                            <span class="text-gray-600 text-sm">Есть реклама</span>
                            <span class="text-gray-400">•</span>
                            <span class="text-gray-600 text-sm">Покупки в приложении</span>
                        </div>
                        <div class="flex items-center gap-6 mb-6">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl font-normal">4.5</span>
                                <div class="flex items-center gap-1">
                                    <span class="text-orange-400">★★★★★</span>
                                </div>
                                <span class="text-gray-600 text-sm">247 тыс. отзывов</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <span class="text-gray-600 text-sm">10 млн+</span>
                            </div>
                            <div class="bg-gray-100 px-2 py-1 rounded">
                                <span class="text-xs font-medium text-gray-700">3+</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <button class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-md transition-colors">
                                Установить
                            </button>
                            <button class="p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">⚐</button>
                            <button class="p-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">⚠</button>
                        </div>
                    </div>
                </div>

                <!-- Screenshots -->
                <div class="mb-8">
                    <div class="flex gap-4 overflow-x-auto pb-4">
                        ${[1,2,3,4,5].map(i => `
                            <div class="w-48 h-80 bg-gradient-to-b from-purple-400 via-pink-500 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg relative overflow-hidden">
                                <div class="absolute inset-0 bg-black/20"></div>
                                <div class="relative text-white text-center">
                                    <div class="w-12 h-12 mx-auto mb-2 flex items-center justify-center">▶</div>
                                    <span class="text-sm font-medium">Скриншот ${i}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Description -->
                <div class="mb-8">
                    <h2 class="text-xl font-medium mb-4 text-gray-900">Описание приложения</h2>
                    <div class="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                        ${previewData.description}
                    </div>
                    <div class="mt-4 flex items-center gap-4 text-sm text-gray-500">
                        <span>Последнее обновление</span>
                        <span>11 авг. 2025 г.</span>
                        <span>•</span>
                        <a href="#" class="text-emerald-600 hover:underline">${previewData.category}</a>
                    </div>
                </div>

                <!-- Tags -->
                ${previewData.tags.length > 0 ? `
                <div class="mb-8">
                    <h2 class="text-xl font-medium mb-4 text-gray-900">Теги</h2>
                    <div class="flex flex-wrap gap-2">
                        ${previewData.tags.map(tag => `
                            <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">#${tag}</span>
                        `).join('')}
                    </div>
                </div>` : ''}
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-medium mb-3 text-gray-900">Похожие приложения</h3>
                    <div class="space-y-4">
                        ${[1,2,3].map(i => `
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex-shrink-0"></div>
                                <div class="flex-1">
                                    <div class="text-sm font-medium text-gray-900">Похожее приложение ${i}</div>
                                    <div class="text-xs text-gray-600">Разработчик</div>
                                    <div class="flex items-center gap-1 mt-1">
                                        <span class="text-xs">4.${i}</span>
                                        <span class="text-orange-400 text-xs">★</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

        const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        if (newWindow) {
            newWindow.document.write(previewHtml);
            newWindow.document.close();
        } else {
            alert('Пожалуйста, разрешите всплывающие окна для предпросмотра');
        }
    };

    const canCreate = () => {
        return pwaData.name.trim() && pwaData.domain.trim() && pwaData.category;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <div className="max-w-screen-2xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    PWA Creator Pro
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Создание Progressive Web App
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex max-w-screen-2xl mx-auto min-h-[calc(100vh-80px)]">
                {/* Left Panel - Form */}
                <div className="flex-1 p-6">
                    <div className="max-w-4xl">
                        <BasicInfoStep 
                            data={pwaData} 
                            onChange={updatePwaData} 
                        />
                        
                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <Button 
                                onClick={handlePreview}
                                variant="outline"
                                className="flex items-center gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            >
                                <Eye className="w-5 h-5" />
                                Предпросмотр
                            </Button>
                            
                            <Button 
                                onClick={handleCreatePwa}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 py-3 text-white"
                                disabled={!canCreate()}
                                size="lg"
                            >
                                <Wand2 className="w-5 h-5" />
                                Создать PWA
                            </Button>
                        </div>
                    </div>
                </div>
                
                {/* Right Panel - Live Preview */}
                <div className="w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700">
                    <LivePreview data={pwaData} />
                </div>
            </div>

            {/* Loading State */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="p-6 text-center max-w-sm mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Создание PWA</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Пожалуйста, подождите...
                        </p>
                    </Card>
                </div>
            )}
        </div>
    );
}

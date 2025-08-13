import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { usePwa } from "@/context/PwaContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { 
    uploadPwaLogo, 
    uploadPwaScreenshot, 
    deleteFileFromR2, 
    validateImageFile, 
    createImagePreview 
} from "@/lib/uploadHelpers";
import { 
    updatePWALogo, 
    addPWAScreenshot, 
    removePWAScreenshot, 
    removePWALogo,
    updatePWAScreenshotsOrder
} from "@/lib/pwaApi";
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
    Trash2,
    Image,
    Loader2
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";

interface PWA {
    id: string;
    name: string;
    domain: string;
    url?: string;
    status: 'draft' | 'building' | 'ready' | 'deployed' | 'paused' | 'error';
    created_at: string;
    description?: string;
    installs?: number;
    rating?: number;
    logo_url?: string;
    screenshots?: string[];
    updated_at?: string;
    icon_url?: string;
    user_id: string;
}

export default function EditPwaPage() {
    const router = useRouter();
    const { id } = router.query;
    const { t } = useTranslation();
    const { setCurrentPwaName } = usePwa();
    
    const [pwa, setPwa] = useState<PWA | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('basic');
    
    // Состояния для изображений
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [isDeletingLogo, setIsDeletingLogo] = useState(false);
    const [isUploadingScreenshots, setIsUploadingScreenshots] = useState(false);
    const [isDeletingScreenshot, setIsDeletingScreenshot] = useState<string | null>(null);
    const [isDeletingAllScreenshots, setIsDeletingAllScreenshots] = useState(false);
    const [draggedScreenshotIndex, setDraggedScreenshotIndex] = useState<number | null>(null);
    const [isReorderingScreenshots, setIsReorderingScreenshots] = useState(false);

    // Refs для файловых инпутов
    const logoInputRef = useRef<HTMLInputElement>(null);
    const screenshotsInputRef = useRef<HTMLInputElement>(null);

    const getStatusText = (status: string) => {
        switch(status) {
            case 'deployed': return 'Активно';
            case 'ready': return 'Готово';
            case 'building': return 'Сборка';
            case 'draft': return 'Черновик';
            case 'paused': return 'Приостановлено';
            case 'error': return 'Ошибка';
            default: return 'Неизвестно';
        }
    };

    // Функции для загрузки файлов
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleLogoFile(file);
        }
        // Очищаем значение инпута для возможности повторной загрузки
        event.target.value = '';
    };

    const handleScreenshotsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            handleScreenshotFiles(Array.from(files));
        }
        // Очищаем значение инпута для возможности повторной загрузки
        event.target.value = '';
    };

    const handleLogoFile = async (file: File) => {
        // Валидация файла
        const validation = validateImageFile(file, 2);
        if (!validation.isValid) {
            alert(validation.error);
            return;
        }

        setIsUploadingLogo(true);
        
        try {
            // Если есть старый логотип, удаляем его сначала
            if (pwa?.logo_url) {
                try {
                    await deleteFileFromR2(pwa.logo_url);
                    console.log('Старый логотип удален из R2');
                } catch (error) {
                    console.warn('Не удалось удалить старый логотип из R2:', error);
                    // Продолжаем загрузку нового логотипа даже если не удалось удалить старый
                }
            }

            // Создаем превью
            const preview = await createImagePreview(file);
            setLogoPreview(preview);

            // Загружаем на R2
            const logoUrl = await uploadPwaLogo(file, pwa!.id);
            
            // Обновляем в базе данных
            const { error } = await updatePWALogo(pwa!.id, logoUrl);
            if (error) {
                throw new Error('Не удалось сохранить логотип в базе данных');
            }

            // Обновляем локальное состояние
            setPwa(prev => prev ? { ...prev, logo_url: logoUrl } : null);
            
            console.log('Логотип успешно загружен:', logoUrl);
        } catch (error) {
            console.error('Ошибка загрузки логотипа:', error);
            alert('Не удалось загрузить логотип');
            setLogoPreview('');
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleScreenshotFiles = async (files: File[]) => {
        // Проверка количества файлов
        const currentCount = pwa?.screenshots?.length || 0;
        if (currentCount + files.length > 6) {
            alert(`Максимальное количество скриншотов: 6. У вас уже ${currentCount}, можно добавить еще ${6 - currentCount}`);
            return;
        }

        // Валидация каждого файла
        for (const file of files) {
            const validation = validateImageFile(file, 5);
            if (!validation.isValid) {
                alert(validation.error);
                return;
            }
        }

        setIsUploadingScreenshots(true);

        try {
            const successfulUploads: { url: string; preview: string }[] = [];
            const failedUploads: string[] = [];

            // Загружаем файлы по одному для лучшего контроля ошибок
            for (const file of files) {
                try {
                    // Создаем превью
                    const preview = await createImagePreview(file);
                    
                    // Загружаем на R2
                    const screenshotUrl = await uploadPwaScreenshot(file, pwa!.id);
                    
                    // Добавляем в базу данных
                    const { error } = await addPWAScreenshot(pwa!.id, screenshotUrl);
                    if (error) {
                        throw new Error('Не удалось сохранить скриншот в базе данных');
                    }

                    successfulUploads.push({ url: screenshotUrl, preview });
                    console.log(`Скриншот ${file.name} успешно загружен:`, screenshotUrl);
                } catch (error) {
                    console.error(`Ошибка загрузки скриншота ${file.name}:`, error);
                    failedUploads.push(file.name);
                }
            }
            
            // Обновляем локальное состояние только для успешно загруженных файлов
            if (successfulUploads.length > 0) {
                setPwa(prev => {
                    if (!prev) return null;
                    const currentScreenshots = prev.screenshots || [];
                    const newScreenshots = successfulUploads.map(r => r.url);
                    return { 
                        ...prev, 
                        screenshots: [...currentScreenshots, ...newScreenshots] 
                    };
                });

                const newPreviews = successfulUploads.map(r => r.preview);
                setScreenshotPreviews(prev => [...prev, ...newPreviews]);
            }
            
            // Показываем результат
            if (failedUploads.length > 0) {
                alert(`Загружено: ${successfulUploads.length}/${files.length}. Не удалось загрузить: ${failedUploads.join(', ')}`);
            } else {
                console.log(`Все скриншоты успешно загружены: ${successfulUploads.length}`);
            }
        } catch (error) {
            console.error('Ошибка загрузки скриншотов:', error);
            alert('Не удалось загрузить скриншоты');
        } finally {
            setIsUploadingScreenshots(false);
        }
    };

    const handleRemoveLogo = async () => {
        if (!pwa?.logo_url) return;

        setIsDeletingLogo(true);

        try {
            // Удаляем из R2
            await deleteFileFromR2(pwa.logo_url);
            
            // Удаляем из базы данных
            const { error } = await removePWALogo(pwa.id);
            if (error) {
                throw new Error('Не удалось удалить логотип из базы данных');
            }

            // Обновляем локальное состояние
            setPwa(prev => prev ? { ...prev, logo_url: undefined } : null);
            setLogoPreview('');
            
            console.log('Логотип успешно удален');
        } catch (error) {
            console.error('Ошибка удаления логотипа:', error);
            alert('Не удалось удалить логотип');
        } finally {
            setIsDeletingLogo(false);
        }
    };

    const handleRemoveScreenshot = async (screenshotUrl: string) => {
        setIsDeletingScreenshot(screenshotUrl);
        
        try {
            // Удаляем из R2
            await deleteFileFromR2(screenshotUrl);
            
            // Удаляем из базы данных
            const { error } = await removePWAScreenshot(pwa!.id, screenshotUrl);
            if (error) {
                throw new Error('Не удалось удалить скриншот из базы данных');
            }

            // Обновляем локальное состояние
            setPwa(prev => {
                if (!prev) return null;
                const currentScreenshots = prev.screenshots || [];
                return { 
                    ...prev, 
                    screenshots: currentScreenshots.filter(url => url !== screenshotUrl) 
                };
            });

            // Обновляем превью скриншотов
            setScreenshotPreviews(prev => prev.filter(url => url !== screenshotUrl));

            console.log('Скриншот успешно удален');
        } catch (error) {
            console.error('Ошибка удаления скриншота:', error);
            alert('Не удалось удалить скриншот');
        } finally {
            setIsDeletingScreenshot(null);
        }
    };

    const handleRemoveAllScreenshots = async () => {
        if (!pwa?.screenshots?.length) return;

        if (!confirm(`Вы уверены, что хотите удалить все ${pwa.screenshots.length} скриншотов? Это действие нельзя отменить.`)) {
            return;
        }

        setIsDeletingAllScreenshots(true);

        try {
            // Удаляем все скриншоты из R2 и базы данных
            const deletePromises = pwa.screenshots.map(async (screenshotUrl) => {
                try {
                    await deleteFileFromR2(screenshotUrl);
                    const { error } = await removePWAScreenshot(pwa.id, screenshotUrl);
                    if (error) {
                        console.error(`Ошибка удаления скриншота из БД: ${screenshotUrl}`, error);
                    }
                    return true;
                } catch (error) {
                    console.error(`Ошибка удаления скриншота: ${screenshotUrl}`, error);
                    return false;
                }
            });

            await Promise.all(deletePromises);

            // Обновляем локальное состояние
            setPwa(prev => prev ? { ...prev, screenshots: [] } : null);
            setScreenshotPreviews([]);

            console.log('Все скриншоты успешно удалены');
        } catch (error) {
            console.error('Ошибка удаления всех скриншотов:', error);
            alert('Не удалось удалить все скриншоты');
        } finally {
            setIsDeletingAllScreenshots(false);
        }
    };

    const handleLogoDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleLogoFile(files[0]);
        }
    };

    const handleScreenshotsDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleScreenshotFiles(Array.from(files));
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const triggerLogoUpload = () => {
        logoInputRef.current?.click();
    };

    const triggerScreenshotsUpload = () => {
        screenshotsInputRef.current?.click();
    };

    // Функции для drag-and-drop скриншотов (изменение порядка)
    const handleScreenshotReorderDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedScreenshotIndex(index);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', index.toString());
    };

    const handleScreenshotReorderDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        setDraggedScreenshotIndex(null);
    };

    const handleScreenshotReorderDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const handleScreenshotReorderDrop = async (event: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        event.preventDefault();
        
        if (draggedScreenshotIndex === null || draggedScreenshotIndex === dropIndex) {
            return;
        }

        const currentScreenshots = pwa?.screenshots || [];
        const newScreenshots = [...currentScreenshots];
        const draggedScreenshot = newScreenshots[draggedScreenshotIndex];
        
        // Удаляем элемент из старой позиции
        newScreenshots.splice(draggedScreenshotIndex, 1);
        
        // Вставляем элемент в новую позицию
        newScreenshots.splice(dropIndex, 0, draggedScreenshot);

        // Обновляем превью локально для мгновенного отклика
        setScreenshotPreviews(newScreenshots);
        
        // Обновляем локальное состояние PWA
        setPwa(prev => prev ? { ...prev, screenshots: newScreenshots } : null);

        // Сохраняем в базе данных
        setIsReorderingScreenshots(true);
        try {
            const { error } = await updatePWAScreenshotsOrder(pwa!.id, newScreenshots);
            if (error) {
                console.error('Ошибка обновления порядка скриншотов:', error);
                // Откатываем изменения в случае ошибки
                const originalScreenshots = pwa?.screenshots || [];
                setScreenshotPreviews(originalScreenshots);
                setPwa(prev => prev ? { ...prev, screenshots: originalScreenshots } : null);
                alert('Не удалось сохранить новый порядок скриншотов');
            } else {
                console.log('Порядок скриншотов успешно обновлен');
            }
        } catch (error) {
            console.error('Ошибка при сохранении порядка скриншотов:', error);
            alert('Не удалось сохранить новый порядок скриншотов');
        } finally {
            setIsReorderingScreenshots(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadPwa(id as string);
        }
        
        // Очищаем название PWA при размонтировании компонента
        return () => {
            setCurrentPwaName(null);
        };
    }, [id, setCurrentPwaName]);

    // Функция для загрузки PWA из Supabase
    const loadPwa = async (pwaId: string) => {
        try {
            console.log('Loading PWA:', pwaId);
            const { data, error } = await supabase
                .from('pwa_projects')
                .select('*')
                .eq('id', pwaId)  // Изменено с app_id на id
                .single();

            console.log('PWA load response:', { data, error });

            if (error) {
                console.error('Error loading PWA:', error);
                setPwa(null);
                setCurrentPwaName(null); // Сбрасываем название в контексте
            } else {
                setPwa(data);
                setCurrentPwaName(data.name); // Устанавливаем название в контекст
                
                // Инициализируем превью изображений
                if (data.logo_url) {
                    setLogoPreview(data.logo_url);
                }
                
                if (data.screenshots && Array.isArray(data.screenshots)) {
                    setScreenshotPreviews(data.screenshots);
                }
            }
        } catch (error) {
            console.error('Error loading PWA:', error);
            setPwa(null);
            setCurrentPwaName(null); // Сбрасываем название в контексте
        } finally {
            setIsLoading(false);
        }
    };

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
        
        // Если изменяется название PWA, обновляем его в контексте
        if (field === 'name') {
            setCurrentPwaName(value);
        }
    };

    const tabs = [
        { id: 'basic', label: 'Основные', icon: Settings },
        { id: 'design', label: 'Дизайн', icon: Palette },
        { id: 'analytics', label: 'Аналитика', icon: Globe },
    ];

    return (
        <>
            <Head>
                <title>Редактировать {pwa.name} - Everloop</title>
            </Head>
            <div className="p-3 sm:p-6 max-w-6xl mx-auto">
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
                                <Badge variant={pwa.status === 'deployed' ? 'default' : 'secondary'}>
                                    {pwa.status === 'deployed' ? 'Активно' : getStatusText(pwa.status)}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                    <Download className="w-3 h-3" />
                                    {pwa.installs?.toLocaleString() || '0'} установок
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
                                                checked={pwa.status === 'deployed'}
                                                onChange={(e) => handleInputChange('status', e.target.checked ? 'deployed' : 'draft')}
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
                                        <CardTitle>Логотип</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Отображение текущего логотипа */}
                                        {logoPreview && (
                                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 relative">
                                                {/* Лоадер при удалении */}
                                                {isDeletingLogo && (
                                                    <div className="absolute inset-0 bg-white bg-opacity-80 dark:bg-slate-900 dark:bg-opacity-80 rounded-lg flex items-center justify-center z-10">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                                                            <span className="text-sm font-medium text-red-600">
                                                                Удаляю логотип...
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className={`flex items-start justify-between transition-all ${isDeletingLogo ? 'opacity-50 filter blur-sm' : ''}`}>
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={logoPreview} 
                                                            alt="Логотип PWA" 
                                                            className="w-16 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-sm">Текущий логотип</p>
                                                            <p className="text-xs text-slate-500">512x512px</p>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={handleRemoveLogo}
                                                        disabled={isDeletingLogo || isUploadingLogo}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        {isDeletingLogo ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <Label>Загрузить логотип</Label>
                                            <div 
                                                className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 relative ${
                                                    isUploadingLogo || isDeletingLogo
                                                        ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 cursor-wait'
                                                        : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                                                }`}
                                                onClick={!isUploadingLogo && !isDeletingLogo ? triggerLogoUpload : undefined}
                                                onDrop={!isUploadingLogo && !isDeletingLogo ? handleLogoDrop : undefined}
                                                onDragOver={!isUploadingLogo && !isDeletingLogo ? handleDragOver : undefined}
                                            >
                                                {/* Лоадер при загрузке */}
                                                {isUploadingLogo && (
                                                    <div className="absolute inset-0 bg-white bg-opacity-80 dark:bg-slate-900 dark:bg-opacity-80 rounded-lg flex items-center justify-center z-10">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                                Загружаю логотип...
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className={`w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center ${
                                                    isUploadingLogo || isDeletingLogo ? 'opacity-50' : ''
                                                }`}>
                                                    <Image className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className={`text-sm text-slate-600 dark:text-slate-400 mb-3 ${
                                                    isUploadingLogo || isDeletingLogo ? 'opacity-50' : ''
                                                }`}>
                                                    {isUploadingLogo
                                                        ? 'Загружаю логотип...'
                                                        : isDeletingLogo
                                                            ? 'Удаляю логотип...'
                                                            : 'Перетащите файл или нажмите для выбора'
                                                    }
                                                </p>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm"
                                                    disabled={isUploadingLogo || isDeletingLogo}
                                                    className={isUploadingLogo || isDeletingLogo ? 'opacity-50' : ''}
                                                >
                                                    {isUploadingLogo ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Загружается...
                                                        </>
                                                    ) : isDeletingLogo ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Удаляется...
                                                        </>
                                                    ) : (
                                                        'Загрузить'
                                                    )}
                                                </Button>
                                                <p className={`text-xs text-slate-500 dark:text-slate-500 mt-2 ${
                                                    isUploadingLogo || isDeletingLogo ? 'opacity-50' : ''
                                                }`}>
                                                    PNG, JPG до 2MB. Рекомендуемый размер: 512x512px
                                                </p>
                                            </div>
                                            <input
                                                ref={logoInputRef}
                                                type="file"
                                                accept=".png,.jpg,.jpeg"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Скриншоты</CardTitle>
                                            {screenshotPreviews.length > 0 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleRemoveAllScreenshots}
                                                    disabled={isUploadingScreenshots || isDeletingAllScreenshots}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 hover:border-red-300"
                                                >
                                                    {isDeletingAllScreenshots ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Удаляю...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Удалить все
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Отображение текущих скриншотов */}
                                        {screenshotPreviews.length > 0 && (
                                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300">
                                                        Текущие скриншоты ({screenshotPreviews.length}/6)
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Перетащите для изменения порядка
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {screenshotPreviews.map((screenshot, index) => (
                                                        <div 
                                                            key={`${screenshot}-${index}`} 
                                                            className="relative group cursor-move"
                                                            draggable={!isDeletingScreenshot && !isDeletingAllScreenshots && !isReorderingScreenshots}
                                                            onDragStart={(e) => handleScreenshotReorderDragStart(e, index)}
                                                            onDragEnd={handleScreenshotReorderDragEnd}
                                                            onDragOver={handleScreenshotReorderDragOver}
                                                            onDrop={(e) => handleScreenshotReorderDrop(e, index)}
                                                        >
                                                            <img 
                                                                src={screenshot} 
                                                                alt={`Скриншот ${index + 1}`}
                                                                className={`w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm group-hover:shadow-md transition-all ${
                                                                    isDeletingScreenshot === screenshot || isDeletingAllScreenshots || isReorderingScreenshots
                                                                        ? 'opacity-50 filter blur-sm' 
                                                                        : ''
                                                                }`}
                                                            />
                                                            
                                                            {/* Индикатор перетаскивания */}
                                                            {!isDeletingScreenshot && !isDeletingAllScreenshots && !isReorderingScreenshots && (
                                                                <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    ⋮⋮
                                                                </div>
                                                            )}
                                                            
                                                            {/* Лоадер при удалении */}
                                                            {(isDeletingScreenshot === screenshot || isDeletingAllScreenshots) && (
                                                                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                                                                    <div className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg">
                                                                        <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Лоадер при изменении порядка */}
                                                            {isReorderingScreenshots && (
                                                                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                                                                    <div className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg">
                                                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Overlay с кнопкой удаления */}
                                                            {!isDeletingScreenshot && !isDeletingAllScreenshots && !isReorderingScreenshots && (
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveScreenshot(screenshot)}
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-90 hover:scale-100 transform"
                                                                        disabled={isDeletingScreenshot === screenshot}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Номер скриншота */}
                                                            <div className={`absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded transition-opacity ${
                                                                isDeletingScreenshot === screenshot || isDeletingAllScreenshots || isReorderingScreenshots ? 'opacity-50' : ''
                                                            }`}>
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <Label>Загрузить скриншоты</Label>
                                            <div 
                                                className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 relative ${
                                                    screenshotPreviews.length >= 6 
                                                        ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-60' 
                                                        : isUploadingScreenshots
                                                            ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                                                }`}
                                                onClick={screenshotPreviews.length < 6 && !isUploadingScreenshots ? triggerScreenshotsUpload : undefined}
                                                onDrop={screenshotPreviews.length < 6 && !isUploadingScreenshots ? handleScreenshotsDrop : undefined}
                                                onDragOver={screenshotPreviews.length < 6 && !isUploadingScreenshots ? handleDragOver : undefined}
                                            >
                                                {/* Лоадер при загрузке */}
                                                {isUploadingScreenshots && (
                                                    <div className="absolute inset-0 bg-white bg-opacity-80 dark:bg-slate-900 dark:bg-opacity-80 rounded-lg flex items-center justify-center z-10">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                                Загружаю скриншоты...
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                                    <Monitor className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                                    {screenshotPreviews.length >= 6 
                                                        ? 'Достигнуто максимальное количество скриншотов'
                                                        : isUploadingScreenshots
                                                            ? 'Загружаю файлы...'
                                                            : 'Перетащите файлы или нажмите для выбора'
                                                    }
                                                </p>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm"
                                                    disabled={isUploadingScreenshots || screenshotPreviews.length >= 6}
                                                >
                                                    {isUploadingScreenshots 
                                                        ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Загружается...
                                                            </>
                                                        )
                                                        : screenshotPreviews.length >= 6 
                                                            ? 'Максимум достигнут' 
                                                            : 'Загрузить'
                                                    }
                                                </Button>
                                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                                    PNG, JPG до 5MB каждый. Осталось: {6 - screenshotPreviews.length} из 6
                                                </p>
                                            </div>
                                            <input
                                                ref={screenshotsInputRef}
                                                type="file"
                                                accept=".png,.jpg,.jpeg"
                                                multiple
                                                onChange={handleScreenshotsUpload}
                                                className="hidden"
                                                disabled={screenshotPreviews.length >= 6 || isUploadingScreenshots}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
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
                                                {pwa.installs?.toLocaleString() || '0'}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">Установок</div>
                                        </div>
                                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {Math.floor((pwa.installs || 0) * 0.7).toLocaleString()}
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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, 
    Settings, 
    Globe, 
    Shield, 
    Bell,
    Download,
    Trash2,
    ExternalLink,
    Copy,
    Save
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";

export default function PwaSettingsPage() {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        defaultDomain: 'yourdomain.com',
        apiKey: 'pk_live_51H*********************',
        webhookUrl: 'https://yourdomain.com/webhook',
        autoGenerate: true,
        notifications: {
            newInstall: true,
            errors: true,
            analytics: false,
        },
        security: {
            httpsOnly: true,
            corsOrigins: ['https://yourdomain.com'],
        }
    });

    const handleSettingChange = (path: string, value: any) => {
        setSettings(prev => {
            const keys = path.split('.');
            const newSettings = { ...prev };
            let current = newSettings;
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            
            return newSettings;
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <Head>
                <title>Настройки PWA - Everloop</title>
            </Head>
            <div className="p-3 sm:p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/pwa">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Назад к PWA
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Настройки PWA
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Глобальные настройки для создания и управления PWA
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Основные настройки
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="defaultDomain">Домен по умолчанию</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        id="defaultDomain"
                                        value={settings.defaultDomain}
                                        onChange={(e) => handleSettingChange('defaultDomain', e.target.value)}
                                        placeholder="yourdomain.com"
                                    />
                                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(settings.defaultDomain)}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="apiKey">API ключ</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        id="apiKey"
                                        type="password"
                                        value={settings.apiKey}
                                        onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                                        placeholder="Введите API ключ"
                                    />
                                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(settings.apiKey)}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    Используется для интеграции с внешними сервисами
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="webhookUrl">Webhook URL</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        id="webhookUrl"
                                        value={settings.webhookUrl}
                                        onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                                        placeholder="https://yourdomain.com/webhook"
                                    />
                                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(settings.webhookUrl)}>
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    URL для получения уведомлений о событиях PWA
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <div>
                                    <h3 className="font-medium">Автоматическая генерация PWA</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Автоматически создавать файлы PWA при сохранении
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.autoGenerate}
                                    onChange={(e) => handleSettingChange('autoGenerate', e.target.checked)}
                                    className="w-5 h-5"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Уведомления
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <div>
                                    <h3 className="font-medium">Новые установки</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Получать уведомления о новых установках PWA
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.newInstall}
                                    onChange={(e) => handleSettingChange('notifications.newInstall', e.target.checked)}
                                    className="w-5 h-5"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <div>
                                    <h3 className="font-medium">Ошибки</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Получать уведомления об ошибках PWA
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.errors}
                                    onChange={(e) => handleSettingChange('notifications.errors', e.target.checked)}
                                    className="w-5 h-5"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <div>
                                    <h3 className="font-medium">{t('analyticsLabel')}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {t('settings.analyticsDescription')}
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications.analytics}
                                    onChange={(e) => handleSettingChange('notifications.analytics', e.target.checked)}
                                    className="w-5 h-5"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Безопасность
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                <div>
                                    <h3 className="font-medium">Только HTTPS</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Требовать HTTPS для всех PWA
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.security.httpsOnly}
                                    onChange={(e) => handleSettingChange('security.httpsOnly', e.target.checked)}
                                    className="w-5 h-5"
                                />
                            </div>

                            <div>
                                <Label>CORS Origins</Label>
                                <div className="space-y-2 mt-1">
                                    {settings.security.corsOrigins.map((origin, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={origin}
                                                onChange={(e) => {
                                                    const newOrigins = [...settings.security.corsOrigins];
                                                    newOrigins[index] = e.target.value;
                                                    handleSettingChange('security.corsOrigins', newOrigins);
                                                }}
                                                placeholder="https://example.com"
                                            />
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => {
                                                    const newOrigins = settings.security.corsOrigins.filter((_, i) => i !== index);
                                                    handleSettingChange('security.corsOrigins', newOrigins);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            const newOrigins = [...settings.security.corsOrigins, ''];
                                            handleSettingChange('security.corsOrigins', newOrigins);
                                        }}
                                    >
                                        Добавить origin
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    Разрешенные источники для CORS запросов
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Быстрая статистика
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">47</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Всего PWA</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">42</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Активных</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="text-2xl font-bold text-brand-yellow">156K</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Установок</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4.6</div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">Рейтинг</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                        <Button variant="outline">
                            Сбросить настройки
                        </Button>
                        <Button className="bg-brand-yellow text-black hover:bg-yellow-400">
                            <Save className="w-4 h-4 mr-2" />
                            Сохранить настройки
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

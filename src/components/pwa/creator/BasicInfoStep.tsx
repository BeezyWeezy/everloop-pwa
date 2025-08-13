import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Info, Settings, Globe, FileText } from "lucide-react";

interface BasicInfoStepProps {
    data: {
        name: string;
        description: string;
        domain: string;
        category: string;
    };
    onChange: (updates: Partial<BasicInfoStepProps['data']>) => void;
}

type BasicInfoData = BasicInfoStepProps['data'];

export default function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
    const updateField = (field: keyof BasicInfoData, value: string) => {
        onChange({ [field]: value });
    };

    const categories = [
        'Casino', 'Sports Betting', 'Poker', 'Slots', 'Live Casino', 'Bingo', 'Lottery', 'Other'
    ];

    return (
        <>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    Основная информация PWA
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Укажите базовые параметры вашего Casino PWA приложения
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
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
                            {data.name.trim() && data.domain.trim() ? (
                                <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-green-600">Готово</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <span className="text-sm text-amber-600">
                                        Заполните обязательные поля
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    );
}

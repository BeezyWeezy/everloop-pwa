import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Bell, 
    Plus, 
    X, 
    Clock, 
    AlertTriangle,
    Target,
    MessageSquare,
    Users
} from "lucide-react";
import { useState } from "react";

interface PushNotificationsStepProps {
    data: {
        pushNotifications: {
            enabled: boolean;
            welcomeMessage: string;
            scenarios: Array<{
                id: string;
                name: string;
                message: string;
                triggerDelay: number;
                condition: 'no_click' | 'no_install' | 'no_registration' | 'no_deposit';
            }>;
        };
    };
    onChange: (updates: Partial<PushNotificationsStepProps['data']>) => void;
}

export default function PushNotificationsStep({ data, onChange }: PushNotificationsStepProps) {
    const [newScenario, setNewScenario] = useState({
        name: '',
        message: '',
        triggerDelay: 24,
        condition: 'no_click' as const
    });

    const updatePushNotifications = (updates: Partial<typeof data.pushNotifications>) => {
        onChange({
            pushNotifications: {
                ...data.pushNotifications,
                ...updates
            }
        });
    };

    const addScenario = () => {
        if (newScenario.name && newScenario.message) {
            const scenario = {
                id: Date.now().toString(),
                ...newScenario
            };
            
            updatePushNotifications({
                scenarios: [...data.pushNotifications.scenarios, scenario]
            });
            
            setNewScenario({
                name: '',
                message: '',
                triggerDelay: 24,
                condition: 'no_click'
            });
        }
    };

    const removeScenario = (id: string) => {
        updatePushNotifications({
            scenarios: data.pushNotifications.scenarios.filter(s => s.id !== id)
        });
    };

    const conditions = [
        { value: 'no_click', label: 'Не перешел в казино', color: 'bg-red-100 text-red-700' },
        { value: 'no_install', label: 'Не установил PWA', color: 'bg-orange-100 text-orange-700' },
        { value: 'no_registration', label: 'Не зарегистрировался', color: 'bg-yellow-100 text-yellow-700' },
        { value: 'no_deposit', label: 'Не сделал депозит', color: 'bg-blue-100 text-blue-700' }
    ];

    return (
        <>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    Push-уведомления для ретаргетинга
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Настройте автоматические уведомления для возврата пользователей
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Enable Push Notifications */}
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div>
                        <Label className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Включить push-уведомления
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">
                            Автоматические уведомления для повышения конверсии
                        </p>
                    </div>
                    <Switch
                        checked={data.pushNotifications.enabled}
                        onCheckedChange={(checked) => updatePushNotifications({ enabled: checked })}
                    />
                </div>

                {data.pushNotifications.enabled && (
                    <>
                        {/* Welcome Message */}
                        <div className="space-y-2">
                            <Label htmlFor="welcome-message" className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Приветственное сообщение
                            </Label>
                            <Input
                                id="welcome-message"
                                value={data.pushNotifications.welcomeMessage}
                                onChange={(e) => updatePushNotifications({ welcomeMessage: e.target.value })}
                                placeholder="Добро пожаловать! Не упустите свой бонус!"
                            />
                            <p className="text-xs text-slate-500">
                                Показывается сразу после установки PWA
                            </p>
                        </div>

                        {/* Existing Scenarios */}
                        <div className="space-y-4">
                            <Label className="flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Сценарии ретаргетинга ({data.pushNotifications.scenarios.length})
                            </Label>
                            
                            {data.pushNotifications.scenarios.map((scenario) => {
                                const condition = conditions.find(c => c.value === scenario.condition);
                                
                                return (
                                    <div key={scenario.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-medium">{scenario.name}</span>
                                                    <Badge className={condition?.color}>
                                                        {condition?.label}
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {scenario.triggerDelay}ч
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    "{scenario.message}"
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeScenario(scenario.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add New Scenario */}
                        <div className="space-y-4 border-t pt-6">
                            <Label className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Добавить новый сценарий
                            </Label>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="scenario-name">Название сценария</Label>
                                    <Input
                                        id="scenario-name"
                                        value={newScenario.name}
                                        onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                                        placeholder="Напоминание о бонусе"
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="trigger-delay">Задержка (часы)</Label>
                                    <Input
                                        id="trigger-delay"
                                        type="number"
                                        value={newScenario.triggerDelay}
                                        onChange={(e) => setNewScenario({...newScenario, triggerDelay: parseInt(e.target.value) || 24})}
                                        min="1"
                                        max="168"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Label>Условие срабатывания</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {conditions.map((condition) => (
                                        <Badge
                                            key={condition.value}
                                            variant={newScenario.condition === condition.value ? "default" : "outline"}
                                            className={`cursor-pointer ${
                                                newScenario.condition === condition.value 
                                                    ? 'bg-purple-600 text-white' 
                                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                            onClick={() => setNewScenario({...newScenario, condition: condition.value as any})}
                                        >
                                            {condition.label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="scenario-message">Текст уведомления</Label>
                                <Input
                                    id="scenario-message"
                                    value={newScenario.message}
                                    onChange={(e) => setNewScenario({...newScenario, message: e.target.value})}
                                    placeholder="Вы забыли забрать свой бонус! Последний шанс сегодня!"
                                />
                            </div>
                            
                            <Button 
                                onClick={addScenario}
                                disabled={!newScenario.name || !newScenario.message}
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Добавить сценарий
                            </Button>
                        </div>

                        {/* Info */}
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                                        Требования для push-уведомлений
                                    </h4>
                                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                        <li>• Пользователь должен дать согласие на уведомления</li>
                                        <li>• PWA должно быть установлено на устройство</li>
                                        <li>• Браузер должен поддерживать Web Push API</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Statistics Preview */}
                {data.pushNotifications.enabled && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    Настроено уведомлений: {data.pushNotifications.scenarios.length}
                                </h4>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    {data.pushNotifications.scenarios.length > 0 ? (
                                        <div>
                                            Сценарии помогут вернуть до 15-25% пользователей и повысить конверсию.
                                        </div>
                                    ) : (
                                        <div>
                                            Добавьте хотя бы один сценарий для эффективного ретаргетинга.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Validation Status */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Этот шаг:</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-blue-600">Опционально</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    );
}

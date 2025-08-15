import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { 
    Target, 
    Link2, 
    Clock, 
    MousePointer, 
    Timer,
    ExternalLink,
    AlertCircle,
    CheckCircle
} from "lucide-react";

interface CasinoSettingsStepProps {
    data: {
        affiliateSettings: {
            casinoUrl: string;
            trackingParams: {
                source?: string;
                campaign?: string;
                sub1?: string;
                sub2?: string;
                sub3?: string;
            };
            autoRedirect: {
                enabled: boolean;
                delay: number;
                trigger: 'immediate' | 'interaction' | 'timer';
            };
            personalizedLinks: {
                enabled: boolean;
                baseUrl: string;
                userIdParam: string;
            };
        };
    };
    onChange: (updates: Partial<CasinoSettingsStepProps['data']>) => void;
}

export default function CasinoSettingsStep({ data, onChange }: CasinoSettingsStepProps) {
    const { t } = useTranslation();
    const updateAffiliateSettings = (updates: Partial<typeof data.affiliateSettings>) => {
        onChange({
            affiliateSettings: {
                ...data.affiliateSettings,
                ...updates
            }
        });
    };

    const updateTrackingParams = (param: string, value: string) => {
        updateAffiliateSettings({
            trackingParams: {
                ...data.affiliateSettings.trackingParams,
                [param]: value
            }
        });
    };

    const updateAutoRedirect = (updates: Partial<typeof data.affiliateSettings.autoRedirect>) => {
        updateAffiliateSettings({
            autoRedirect: {
                ...data.affiliateSettings.autoRedirect,
                ...updates
            }
        });
    };

    const updatePersonalizedLinks = (updates: Partial<typeof data.affiliateSettings.personalizedLinks>) => {
        updateAffiliateSettings({
            personalizedLinks: {
                ...data.affiliateSettings.personalizedLinks,
                ...updates
            }
        });
    };

    const isValid = data.affiliateSettings.casinoUrl.trim().length > 0;

    return (
        <>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    {t('casinoSettings.title')}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('casinoSettings.description')}
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Casino URL */}
                <div className="space-y-2">
                    <Label htmlFor="casino-url" className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        {t('casinoSettings.casinoUrl')} *
                    </Label>
                    <Input
                        id="casino-url"
                        value={data.affiliateSettings.casinoUrl}
                        onChange={(e) => updateAffiliateSettings({ casinoUrl: e.target.value })}
                        placeholder={t('casinoSettings.casinoUrlPlaceholder')}
                        className="text-lg"
                    />
                    <p className="text-xs text-slate-500">
                        {t('casinoSettings.casinoUrlHelp')}
                    </p>
                </div>

                {/* Tracking Parameters */}
                <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {t('casinoSettings.trackingParams')}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="source">{t('casinoSettings.source')}</Label>
                            <Input
                                id="source"
                                value={data.affiliateSettings.trackingParams.source || ''}
                                onChange={(e) => updateTrackingParams('source', e.target.value)}
                                placeholder={t('casinoSettings.sourcePlaceholder')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="campaign">{t('casinoSettings.campaign')}</Label>
                            <Input
                                id="campaign"
                                value={data.affiliateSettings.trackingParams.campaign || ''}
                                onChange={(e) => updateTrackingParams('campaign', e.target.value)}
                                placeholder={t('casinoSettings.campaignPlaceholder')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="sub1">{t('casinoSettings.sub1')}</Label>
                            <Input
                                id="sub1"
                                value={data.affiliateSettings.trackingParams.sub1 || ''}
                                onChange={(e) => updateTrackingParams('sub1', e.target.value)}
                                placeholder={t('casinoSettings.sub1Placeholder')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="sub2">{t('casinoSettings.sub2')}</Label>
                            <Input
                                id="sub2"
                                value={data.affiliateSettings.trackingParams.sub2 || ''}
                                onChange={(e) => updateTrackingParams('sub2', e.target.value)}
                                placeholder={t('casinoSettings.sub2Placeholder')}
                            />
                        </div>
                    </div>
                </div>

                {/* Auto Redirect Settings */}
                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {t('casinoSettings.autoRedirect')}
                            </Label>
                            <p className="text-xs text-slate-500 mt-1">
                                {t('casinoSettings.autoRedirectDescription')}
                            </p>
                        </div>
                        <Switch
                            checked={data.affiliateSettings.autoRedirect.enabled}
                            onCheckedChange={(checked) => updateAutoRedirect({ enabled: checked })}
                        />
                    </div>

                    {data.affiliateSettings.autoRedirect.enabled && (
                        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <div>
                                <Label>{t('casinoSettings.redirectDelay')}</Label>
                                <Input
                                    type="number"
                                    value={data.affiliateSettings.autoRedirect.delay}
                                    onChange={(e) => updateAutoRedirect({ delay: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    max="30"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label>{t('casinoSettings.redirectTrigger')}</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {[
                                        { value: 'immediate', label: t('casinoSettings.immediate'), icon: Timer },
                                        { value: 'interaction', label: t('casinoSettings.onClick'), icon: MousePointer },
                                        { value: 'timer', label: t('casinoSettings.onTimer'), icon: Clock }
                                    ].map((trigger) => {
                                        const Icon = trigger.icon;
                                        return (
                                            <Badge
                                                key={trigger.value}
                                                variant={data.affiliateSettings.autoRedirect.trigger === trigger.value ? "default" : "outline"}
                                                className={`cursor-pointer flex items-center gap-1 ${
                                                    data.affiliateSettings.autoRedirect.trigger === trigger.value 
                                                        ? 'bg-purple-600 text-white' 
                                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                                }`}
                                                onClick={() => updateAutoRedirect({ trigger: trigger.value as any })}
                                            >
                                                <Icon className="w-3 h-3" />
                                                {trigger.label}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Personalized Links */}
                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="flex items-center gap-2">
                                <Link2 className="w-4 h-4" />
                                {t('casinoSettings.personalizedLinks')}
                            </Label>
                            <p className="text-xs text-slate-500 mt-1">
                                {t('casinoSettings.personalizedLinksDescription')}
                            </p>
                        </div>
                        <Switch
                            checked={data.affiliateSettings.personalizedLinks.enabled}
                            onCheckedChange={(checked) => updatePersonalizedLinks({ enabled: checked })}
                        />
                    </div>

                    {data.affiliateSettings.personalizedLinks.enabled && (
                        <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <div>
                                <Label>{t('casinoSettings.baseUrl')}</Label>
                                <Input
                                    value={data.affiliateSettings.personalizedLinks.baseUrl}
                                    onChange={(e) => updatePersonalizedLinks({ baseUrl: e.target.value })}
                                    placeholder={t('casinoSettings.baseUrlPlaceholder')}
                                />
                            </div>
                            <div>
                                <Label>{t('casinoSettings.userIdParam')}</Label>
                                <Input
                                    value={data.affiliateSettings.personalizedLinks.userIdParam}
                                    onChange={(e) => updatePersonalizedLinks({ userIdParam: e.target.value })}
                                    placeholder={t('casinoSettings.userIdParamPlaceholder')}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Validation Status */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('casinoSettings.readiness')}</span>
                        <div className="flex items-center gap-2">
                            {isValid ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-green-600">{t('casinoSettings.ready')}</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm text-amber-600">
                                        {t('casinoSettings.specifyCasinoUrl')}
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

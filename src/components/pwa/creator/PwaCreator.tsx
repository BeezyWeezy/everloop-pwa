import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, Eye, Settings, Target, BarChart, Bell, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLogger } from "@/lib/utils/logger";
import CasinoLivePreview from "./CasinoLivePreview";
import TestStep from "./TestStep";
import BasicInfoStep from "./BasicInfoStep";
import CasinoSettingsStep from "./CasinoSettingsStep";
import TrackingStep from "./TrackingStep";
import PushNotificationsStep from "./PushNotificationsStep";

interface PwaData {
    // Basic Info
    name: string;
    description: string;
    tags: string[];
    collaborators: string[];
    developer?: string;
    
    // Google Play Store settings
    playStoreSettings?: {
        appName?: string;
        developerName?: string;
        rating?: number;
        downloads?: string;
        descriptionTitle?: string;
        appDescription?: string;
        ageRating?: '3+' | '7+' | '12+' | '16+' | '18+';
        contentRating?: string;
        inAppPurchases?: boolean;
        containsAds?: boolean;
        comments?: Array<{
            id: string;
            userName: string;
            comment: string;
            date: string;
            rating: number;
            avatar?: string;
        }>;
    };
    
    // Design & Branding
    logo?: string;
    themeColor: string;
    backgroundColor: string;
    accentColor: string;
    template?: string;
    
    // Technical
    domain: string;
    category: string;
    
    // Affiliate & Casino Settings
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
            delay: number; // seconds
            trigger: 'immediate' | 'interaction' | 'timer';
        };
        personalizedLinks: {
            enabled: boolean;
            baseUrl: string;
            userIdParam: string;
        };
    };
    
    // Analytics & Tracking
    tracking: {
        facebookPixelId?: string;
        googleAnalyticsId?: string;
        customEvents: {
            pageView: boolean;
            appInstall: boolean;
            linkClick: boolean;
            registration: boolean;
            deposit: boolean;
        };
    };
    
    // Push Notifications for Retargeting
    pushNotifications: {
        enabled: boolean;
        welcomeMessage: string;
        scenarios: Array<{
            id: string;
            name: string;
            message: string;
            triggerDelay: number; // hours
            condition: 'no_click' | 'no_install' | 'no_registration' | 'no_deposit';
        }>;
    };
    
    // Features
    features: string[];
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
    offlineMode: false,
    analytics: true,
    seo: true,
    
    // Affiliate & Casino Settings
    affiliateSettings: {
        casinoUrl: "",
        trackingParams: {
            source: "",
            campaign: "",
            sub1: "",
            sub2: "",
            sub3: ""
        },
        autoRedirect: {
            enabled: false,
            delay: 3,
            trigger: 'immediate'
        },
        personalizedLinks: {
            enabled: true,
            baseUrl: "",
            userIdParam: "user_id"
        }
    },
    
    // Analytics & Tracking
    tracking: {
        facebookPixelId: "",
        googleAnalyticsId: "",
        customEvents: {
            pageView: true,
            appInstall: true,
            linkClick: true,
            registration: true,
            deposit: true
        }
    },
    
    // Push Notifications for Retargeting
    pushNotifications: {
        enabled: false,
        welcomeMessage: "Welcome! Don't miss your bonus!",
        scenarios: [
            {
                id: "no_click_24h",
                name: "No Click 24H",
                message: "You forgot your bonus! Last chance today!",
                triggerDelay: 24,
                condition: "no_click"
            },
            {
                id: "no_install_48h", 
                name: "No Install 48H",
                message: "Install the app and get your bonus instantly!",
                triggerDelay: 48,
                condition: "no_install"
            }
        ]
    }
};

export default function PwaCreator() {
    const { t } = useTranslation();
    const logger = useLogger('PwaCreator');
    const [pwaData, setPwaData] = useState<PwaData>(initialData);
    const [isCreating, setIsCreating] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Define steps
    const steps = [
        {
            id: 'basic',
            title: t('pwaCreator.basicInfo'),
            description: t('pwaCreator.basicInfoDesc'),
            icon: Settings,
            component: 'basic'
        },
        {
            id: 'casino',
            title: t('pwaCreator.casinoSettings'),
            description: t('pwaCreator.casinoSettingsDesc'),
            icon: Target,
            component: 'casino'
        },
        {
            id: 'tracking',
            title: t('pwaCreator.analytics'),
            description: t('pwaCreator.analyticsDesc'),
            icon: BarChart,
            component: 'tracking'
        },
        {
            id: 'notifications',
            title: t('pwaCreator.pushNotifications'),
            description: t('pwaCreator.pushNotificationsDesc'),
            icon: Bell,
            component: 'notifications'
        }
    ];

    const updatePwaData = (updates: Partial<PwaData>) => {
        setPwaData(prev => ({ ...prev, ...updates }));
    };

    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 0: // Basic Info
                return pwaData.name.trim() && pwaData.domain.trim();
            case 1: // Casino Settings
                return pwaData.affiliateSettings.casinoUrl.trim();
            case 2: // Tracking
                return true; // Optional step
            case 3: // Notifications
                return true; // Optional step
            default:
                return false;
        }
    };

    const canCreate = () => {
        return (
            pwaData.name.trim() && 
            pwaData.domain.trim() && 
            pwaData.affiliateSettings.casinoUrl.trim()
        );
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1 && canProceedToNextStep()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (stepIndex: number) => {
        // Allow going to previous steps or next step if current step is valid
        if (stepIndex <= currentStep || (stepIndex === currentStep + 1 && canProceedToNextStep())) {
            setCurrentStep(stepIndex);
        }
    };

    const handleCreatePwa = async () => {
        if (!canCreate()) {
            logger.validation.error(t('name'), t('notifications.pwa.requiredFields'));
            return;
        }

        setIsCreating(true);
        
        try {
            // Simulate PWA creation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            logger.pwa.created(pwaData.name);
            logger.info('Creating Casino PWA', `Domain: ${pwaData.domain}, Casino: ${pwaData.affiliateSettings.casinoUrl}`, pwaData);
            
            // Here you would handle the actual PWA creation
            // For example: call your API to create the PWA
            
            logger.success(t('notifications.pwa.createSuccess'), t('notifications.pwa.createSuccess'));
        } catch (error) {
            logger.pwa.error('Creation', error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setIsCreating(false);
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0: // Basic Info
                return <BasicInfoStep data={pwaData} onChange={updatePwaData} />;
            case 1: // Casino Settings
                return <CasinoSettingsStep data={pwaData} onChange={updatePwaData} />;
            case 2: // Tracking
                return <TrackingStep data={pwaData} onChange={updatePwaData} />;
            case 3: // Notifications
                return <PushNotificationsStep data={pwaData} onChange={updatePwaData} />;
            default:
                return <TestStep data={pwaData} onChange={updatePwaData} />;
        }
    };

    return (
        <div className="p-3 sm:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                        <Wand2 className="w-8 h-8 text-purple-600" />
                        Casino PWA Creator
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        {t('pwaCreator.title')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {t('pwaCreator.preview')}
                    </Button>
                    <Button 
                        onClick={handleCreatePwa}
                        disabled={!canCreate() || isCreating}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        {isCreating ? t('pwaCreator.creating') : t('pwaCreator.createButton')}
                    </Button>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {t('pwaCreator.stepCounter', { current: currentStep + 1, total: steps.length, title: steps[currentStep].title })}
                    </h2>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {steps[currentStep].description}
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                    <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                </div>

                {/* Step Tabs */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;
                        const isAccessible = index <= currentStep || (index === currentStep + 1 && canProceedToNextStep());
                        
                        return (
                            <Button
                                key={step.id}
                                variant={isActive ? "default" : isCompleted ? "ghost" : "outline"}
                                size="sm"
                                onClick={() => goToStep(index)}
                                disabled={!isAccessible}
                                className={`flex items-center gap-2 whitespace-nowrap min-w-fit ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                                        : isCompleted 
                                            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
                                            : ''
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{step.title}</span>
                                {isCompleted && <span className="text-green-600">✓</span>}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Current Step Content */}
                <div className="lg:col-span-2">
                    <Card className="h-fit">
                        {renderCurrentStep()}
                    </Card>
                    
                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('back')}
                        </Button>
                        
                        <div className="flex items-center gap-3">
                            {currentStep < steps.length - 1 ? (
                                <Button
                                    onClick={nextStep}
                                    disabled={!canProceedToNextStep()}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                                >
                                    {t('next')}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleCreatePwa}
                                    disabled={!canCreate() || isCreating}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {isCreating ? t('pwaCreator.creating') : t('pwaCreator.createButton')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Live Preview */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <CasinoLivePreview data={pwaData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

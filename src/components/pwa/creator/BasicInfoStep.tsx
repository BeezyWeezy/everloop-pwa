import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Hash, Users, FileText, X } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface BasicInfoStepProps {
    data: {
        name: string;
        description: string;
        tags: string[];
        collaborators: string[];
    };
    onChange: (updates: Partial<BasicInfoStepProps['data']>) => void;
}

export function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
    const { t } = useTranslation();
    
    const addTag = (tag: string) => {
        if (tag.trim() && !data.tags.includes(tag.trim())) {
            onChange({ tags: [...data.tags, tag.trim()] });
        }
    };

    const removeTag = (index: number) => {
        const newTags = data.tags.filter((_, i) => i !== index);
        onChange({ tags: newTags });
    };

    const addCollaborator = (email: string) => {
        if (email.trim() && !data.collaborators.includes(email.trim())) {
            onChange({ collaborators: [...data.collaborators, email.trim()] });
        }
    };

    const removeCollaborator = (index: number) => {
        const newCollaborators = data.collaborators.filter((_, i) => i !== index);
        onChange({ collaborators: newCollaborators });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {t('basicInformation')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    {t('fillBasicDetails')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* App Name */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                {t('appNameLabel')} *
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                placeholder={t('appNamePlaceholder')}
                                value={data.name}
                                onChange={(e) => onChange({ name: e.target.value })}
                                className="text-lg"
                            />
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('appDescriptionLabel')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                placeholder={t('appDescriptionPlaceholder')}
                                value={data.description}
                                onChange={(e) => onChange({ description: e.target.value })}
                                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-background text-foreground resize-none"
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="w-5 h-5" />
                                {t('tags')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t('addTagPlaceholder')}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addTag(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder*="' + t('addTagPlaceholder') + '"]') as HTMLInputElement;
                                        if (input) {
                                            addTag(input.value);
                                            input.value = '';
                                        }
                                    }}
                                    className="px-6"
                                >
                                    {t('add')}
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <button
                                            onClick={() => removeTag(index)}
                                            className="ml-1 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Collaborators */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                {t('collaborators')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder={t('addCollaboratorPlaceholder')}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addCollaborator(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder*="' + t('addCollaboratorPlaceholder') + '"]') as HTMLInputElement;
                                        if (input) {
                                            addCollaborator(input.value);
                                            input.value = '';
                                        }
                                    }}
                                    className="px-6"
                                >
                                    {t('add')}
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {data.collaborators.map((email, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                        <span className="text-sm">{email}</span>
                                        <button
                                            onClick={() => removeCollaborator(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Setup */}
                    <Card className="border-brand-yellow/20 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-brand-yellow" />
                                {t('quickSetup')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {t('quickSetupDescription')}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" onClick={() => {
                                    onChange({ 
                                        tags: ['casino', 'gambling', 'slots'],
                                        name: 'Casino Pro',
                                        description: 'Professional casino application'
                                    });
                                }}>
                                    🎰 {t('casino')}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => {
                                    onChange({ 
                                        tags: ['sports', 'betting', 'live'],
                                        name: 'Sports Bet',
                                        description: 'Sports betting platform'
                                    });
                                }}>
                                    ⚽ {t('sports')}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => {
                                    onChange({ 
                                        tags: ['crypto', 'trading', 'finance'],
                                        name: 'Crypto Trader',
                                        description: 'Cryptocurrency trading app'
                                    });
                                }}>
                                    ₿ {t('crypto')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import React from "react"
import { useTranslation } from "react-i18next"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, Globe, ChevronDown } from "lucide-react"
import { useLogger } from '@/lib/utils/logger';

const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "uk", label: "Українська", flag: "🇺🇦" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
]

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation()
    const logger = useLogger('i18n');
    const currentLanguage = i18n.language || 'en'
    
    // Обработка для старого кода "ua" -> "uk"
    const normalizedLanguage = currentLanguage === 'ua' ? 'uk' : currentLanguage

    // Автоматическая миграция старого кода языка
    React.useEffect(() => {
        if (currentLanguage === 'ua') {
            changeLanguage('uk')
        }
    }, [currentLanguage])

    const changeLanguage = async (lang: string) => {
        try {
            await i18n.changeLanguage(lang)
            // Сохраняем выбор в localStorage
            localStorage.setItem('preferredLanguage', lang)
        } catch (error) {
            logger.error('Language change error:', error)
        }
    }

    const currentLang = languages.find((lang) => lang.code === normalizedLanguage) || languages[0]

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 h-9 px-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 shadow-md hover:shadow-lg dark:shadow-dark smooth-transition active:scale-95"
                >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">{currentLang.flag}</span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content 
                    className="min-w-[180px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl dark:shadow-dark p-2 border border-slate-200 dark:border-slate-600 z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    sideOffset={8}
                    align="end"
                >
                    {languages.map((language) => (
                        <DropdownMenu.Item
                            key={language.code}
                            onSelect={() => changeLanguage(language.code)}
                            className="flex justify-between items-center px-3 py-2.5 text-sm rounded-lg cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 focus:text-slate-900 dark:focus:text-slate-100 outline-none smooth-transition group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-base">{language.flag}</span>
                                <span className="font-medium">{language.label}</span>
                            </div>
                            {normalizedLanguage === language.code && (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                        </DropdownMenu.Item>
                    ))}
                    <DropdownMenu.Arrow className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-600" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}

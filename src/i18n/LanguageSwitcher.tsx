import React from "react"
import { useTranslation } from "react-i18next"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, Globe } from "lucide-react"

const languages = [
    { code: "en", label: "English" },
    { code: "ua", label: "Українська" },
    { code: "ru", label: "Русский" },
]

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation()
    const currentLanguage = i18n.language

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {languages.find((lang) => lang.code === currentLanguage)?.label || "Language"}
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="min-w-[8rem] bg-white rounded-md shadow-lg p-2 border">
                    {languages.map((language) => (
                        <DropdownMenu.Item
                            key={language.code}
                            onSelect={() => changeLanguage(language.code)}
                            className={`flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 rounded-md cursor-pointer`}
                        >
                            <span>{language.label}</span>
                            {currentLanguage === language.code && <Check className="w-4 h-4 text-green-600" />}
                        </DropdownMenu.Item>
                    ))}
                    <DropdownMenu.Arrow className="fill-gray-200" />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}

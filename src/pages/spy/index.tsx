import { CreativeCard } from "@/components/cards/CreativeCard"
import { useState } from "react"
import { Layout } from "@/components/layout/Layout"
// TODO: Заменить на реальные данные из базы
import { useTranslation } from "react-i18next";

export default function SpyPage() {
    const { t } = useTranslation();

    return (
        <div className="p-3 sm:p-6 grid gap-4 sm:gap-6">
            <h1 className="text-xl sm:text-2xl font-bold">{t("spyCreo")}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* TODO: Заменить на реальные данные */}
                {[].map((creative: any) => (
                    <CreativeCard key={creative.id} creative={creative} />
                ))}
            </div>
        </div>
    )
}

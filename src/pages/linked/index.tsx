import { LinkedCard } from "@/components/cards/LinkedCard"
import { linkedSets } from "@/lib/mocks/linkedSets"
import { useTranslation } from "react-i18next";

export default function LinkedPage() {
    const { t } = useTranslation();

    return (
        <div className="p-3 sm:p-6 grid gap-4 sm:gap-6">
            <h1 className="text-xl sm:text-2xl font-bold">{t("bundles")}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {linkedSets.map(link => (
                    <LinkedCard key={link.id} link={link} />
                ))}
            </div>
        </div>
    )
}

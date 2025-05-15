import { PwaCard } from "@/components/cards/PwaCard";
import { pwas } from "@/lib/mocks/pwas";

export default function PwaPage() {
    return (
        <div className="p-6 grid gap-4">
            <h1 className="text-2xl font-bold">Мои PWAs</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pwas.map(pwa => (
                    <PwaCard key={pwa.id} pwa={pwa} />
                ))}
            </div>
        </div>
    )
}

import { CreativeCard } from "@/components/cards/CreativeCard"
import { creatives } from "@/lib/mocks/creatives"

export default function SpyPage() {
    return (
        <div className="p-6 grid gap-4">
            <h1 className="text-2xl font-bold">Spy Креативы</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {creatives.map(creative => (
                    <CreativeCard key={creative.id} creative={creative} />
                ))}
            </div>
        </div>
    )
}

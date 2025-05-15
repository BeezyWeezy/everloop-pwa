import { LinkedCard } from "@/components/cards/LinkedCard"
import { linkedSets } from "@/lib/mocks/linkedSets"

export default function LinkedPage() {
    return (
        <div className="p-6 grid gap-4">
            <h1 className="text-2xl font-bold">Связки</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {linkedSets.map(link => (
                    <LinkedCard key={link.id} link={link} />
                ))}
            </div>
        </div>
    )
}

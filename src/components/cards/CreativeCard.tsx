import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CreativeCard({ creative }: { creative: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Креатив #{creative.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm line-clamp-3">{creative.text}</p>
                <Button size="sm">Добавить в связку</Button>
            </CardContent>
        </Card>
    )
}

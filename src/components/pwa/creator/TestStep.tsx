import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TestStepProps {
    data: any;
    onChange: (updates: any) => void;
}

export default function TestStep({ data, onChange }: TestStepProps) {
    return (
        <>
            <CardHeader>
                <CardTitle>
                    Test Step Component
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-green-800 font-medium">✅ TestStep рендерится успешно!</h3>
                    <p className="text-green-600 text-sm mt-2">
                        Этот компонент загружается без ошибок. 
                        Данные: {data?.name || 'не указано'}
                    </p>
                </div>
            </CardContent>
        </>
    );
}

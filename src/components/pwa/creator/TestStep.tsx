import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface TestStepProps {
    data: any;
    onChange: (updates: any) => void;
}

export default function TestStep({ data, onChange }: TestStepProps) {
    const { t } = useTranslation();
    
    return (
        <>
            <CardHeader>
                <CardTitle>
                    {t('testStep.title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-green-800 font-medium">{t('testStep.success')}</h3>
                    <p className="text-green-600 text-sm mt-2">
                        {t('testStep.description')}: {data?.name || t('testStep.notSpecified')}
                    </p>
                </div>
            </CardContent>
        </>
    );
}

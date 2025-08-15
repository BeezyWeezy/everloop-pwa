import React from 'react';
import { useTranslation } from "react-i18next";

const PwaPreview = () => {
    const { t } = useTranslation();
    
    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t('preview.title')}
            </h1>
            <p className="text-gray-600">
                {t('preview.description')}
            </p>
        </div>
    );
};

export default PwaPreview;

import Head from "next/head";
import PwaCreator from "@/components/pwa/creator/PwaCreator";
import { useTranslation } from "react-i18next";

export default function CreatePwaPage() {
    const { t } = useTranslation();
    
    return (
        <>
            <Head>
                <title>{t('pwaCreator.title')} - Everloop</title>
                <meta name="description" content={t('pwaCreator.description')} />
            </Head>
            
            <PwaCreator />
        </>
    );
}

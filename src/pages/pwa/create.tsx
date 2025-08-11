import PwaCreator from "@/components/pwa/creator/PwaCreator";
import Head from "next/head";

export default function CreatePwaPage() {
    return (
        <>
            <Head>
                <title>PWA Creator Pro - Создание PWA</title>
                <meta name="description" content="Создайте профессиональное Progressive Web Application за несколько минут" />
            </Head>
            <PwaCreator />
        </>
    );
}

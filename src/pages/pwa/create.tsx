import Head from "next/head";
import PwaCreator from "@/components/pwa/creator/PwaCreator";

export default function CreatePwaPage() {
    return (
        <>
            <Head>
                <title>Создание Casino PWA - Everloop</title>
                <meta name="description" content="Создайте новое Casino PWA для аффилиат маркетинга" />
            </Head>
            
            <PwaCreator />
        </>
    );
}

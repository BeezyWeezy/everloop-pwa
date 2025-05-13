import Head from 'next/head';
import { PwaForm } from '@/components/PwaForm';

export default function Home() {
    return (
        <>
            <Head>
                <title>Everloop PWA Builder</title>
            </Head>
            <main className="min-h-screen p-6 bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Create Your PWA Prelander</h1>
                <PwaForm />
            </main>
        </>
    );
}
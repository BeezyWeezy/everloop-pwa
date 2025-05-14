import Head from 'next/head';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PwaForm } from "@/components/PwaForm";

export default function Home() {
    return (
        <>
            <Head>
                <title>Everloop PWA Builder</title>
            </Head>
            <Layout>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Create a new Prelander</h1>
                    <Button>New Prelander</Button>
                </div>
                <PwaForm />
            </Layout>
        </>
    );
}

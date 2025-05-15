import Head from 'next/head';
import { Layout } from '@/components/layout/Layout';
import DashboardPage from "@/pages/dashboard";

export default function Home() {
    return (
        <>
            <Head>
                <title>Everloop</title>
            </Head>
            <Layout>
                <DashboardPage />
            </Layout>
        </>
    );
}

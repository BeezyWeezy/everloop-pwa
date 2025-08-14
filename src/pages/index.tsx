import Head from 'next/head';
import DashboardPage from "@/pages/dashboard";
import { useUserStore } from "@/store/useUserStore";
import { useLogger } from '@/lib/utils/logger';

export default function Home() {
    const user = useUserStore((s) => s.user);
    const logger = useLogger('pages');
    logger.info('Debug', `User: ${user?.email || 'Not logged in'}`);
    return (
        <>
            <Head>
                <title>Everloop</title>
            </Head>
            <DashboardPage />
        </>
    );
}

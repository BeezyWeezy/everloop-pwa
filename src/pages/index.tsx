import Head from 'next/head';
import DashboardPage from "@/pages/dashboard";
import {useUserStore} from "@/store/useUserStore";

export default function Home() {
    const user = useUserStore((s) => s.user);
    console.log(user);
    return (
        <>
            <Head>
                <title>Everloop</title>
            </Head>
            <DashboardPage />
        </>
    );
}

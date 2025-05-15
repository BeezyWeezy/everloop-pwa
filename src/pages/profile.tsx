import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto bg-brand-light dark:bg-brand-dark rounded-xl p-4 sm:p-6 shadow space-y-6">
                <h2 className="text-xl font-semibold text-brand-black">My Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-brand-gray">Full Name</label>
                        <input
                            type="text"
                            defaultValue="Pavel"
                            className="mt-1 block w-full rounded-md border-brand-gray shadow-sm focus:ring-brand-black focus:border-brand-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-gray">Email</label>
                        <input
                            type="email"
                            defaultValue="pavel@example.com"
                            className="mt-1 block w-full rounded-md border-brand-gray shadow-sm focus:ring-brand-black focus:border-brand-black"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-brand-gray">About You</label>
                        <textarea
                            rows={4}
                            placeholder="Tell us something about yourself..."
                            className="mt-1 block w-full rounded-md border-brand-gray shadow-sm focus:ring-brand-black focus:border-brand-black"
                        />
                    </div>
                </div>

                <div className="text-right">
                    <Button variant="brand">Save Changes</Button>
                </div>
            </div>
        </Layout>
    );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PwaForm() {
    const [title, setTitle] = useState('Win ৳25,000 Now!');
    const [description, setDescription] = useState('Play now and claim your bonus instantly.');
    const [redirectUrl, setRedirectUrl] = useState('https://yourcasino.com');
    const [pushMessages, setPushMessages] = useState('You forgot your bonus!\nLast chance today!');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            title,
            description,
            redirectUrl,
            pushMessages: pushMessages.split('\n'),
        };
        console.log('Generated PWA Config:', data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-brand-light dark:bg-brand-dark text-brand-black dark:text-white p-4 sm:p-6 rounded-xl shadow">
            <div>
                <label className="block mb-2 font-medium text-sm sm:text-base">Title</label>
                <input
                    className="w-full border border-gray-300 rounded p-2 sm:p-3 h-10 sm:h-11 text-sm sm:text-base"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-2 font-medium text-sm sm:text-base">Description</label>
                <textarea
                    className="w-full border border-gray-300 rounded p-2 sm:p-3 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-2 font-medium text-sm sm:text-base">Redirect URL</label>
                <input
                    className="w-full border border-gray-300 rounded p-2 sm:p-3 h-10 sm:h-11 text-sm sm:text-base"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-2 font-medium text-sm sm:text-base">Push Messages (one per line)</label>
                <textarea
                    className="w-full border border-gray-300 rounded p-2 sm:p-3 text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                    rows={4}
                    value={pushMessages}
                    onChange={(e) => setPushMessages(e.target.value)}
                />
            </div>
            <Button type="button" variant="brand" onClick={() => console.log('Download PWA Config')} className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base">
                Download PWA Config
            </Button>
        </form>
    );
}

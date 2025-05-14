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
        <form onSubmit={handleSubmit} className="space-y-4 bg-brand-light p-6 rounded-xl shadow">
            <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                    className="w-full border border-gray-300 rounded p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Redirect URL</label>
                <input
                    className="w-full border border-gray-300 rounded p-2"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Push Messages (one per line)</label>
                <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    rows={4}
                    value={pushMessages}
                    onChange={(e) => setPushMessages(e.target.value)}
                />
            </div>
            <Button type="button" variant="brand" onClick={() => console.log('Download PWA Config')}>
                Download PWA Config
            </Button>
        </form>
    );
}

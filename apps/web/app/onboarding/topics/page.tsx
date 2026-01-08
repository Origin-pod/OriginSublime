"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import type { Topic } from '@/lib/types';

export default function TopicsSelection() {
    const router = useRouter();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        api.getTopics()
            .then(res => setTopics(res.data.topics))
            .catch(err => console.error('Failed to load topics:', err));
    }, []);

    const toggleTopic = (slug: string) => {
        setSelected(prev =>
            prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        );
    };

    const handleContinue = async () => {
        if (selected.length === 0) {
            alert('Please select at least one topic');
            return;
        }

        setIsLoading(true);
        try {
            // Set initial weights (all selected topics get 80)
            const topicWeights: Record<string, number> = {};
            selected.forEach(slug => {
                topicWeights[slug] = 80;
            });

            await api.updatePreferences({ topicWeights });
            router.push('/onboarding/preferences');
        } catch (err) {
            console.error('Failed to save topics:', err);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        What do you want to learn?
                    </h1>
                    <p className="text-lg text-gray-600">
                        Select topics you're interested in. You can adjust these later.
                    </p>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {topics.map(topic => (
                        <button
                            key={topic.slug}
                            onClick={() => toggleTopic(topic.slug)}
                            className={`
                border-2 border-black p-6 text-left transition-colors duration-0
                ${selected.includes(topic.slug)
                                    ? 'bg-black text-white'
                                    : 'bg-white hover:bg-gray-100'}
              `}
                        >
                            <div className="text-4xl mb-2">{topic.icon}</div>
                            <h3 className="font-serif text-xl mb-2">{topic.name}</h3>
                            <p className={`text-sm ${selected.includes(topic.slug) ? 'text-gray-300' : 'text-gray-600'}`}>
                                {topic.description}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t-2 border-black pt-8 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-3 font-mono text-sm hover:underline"
                    >
                        ← BACK
                    </button>

                    <div className="text-sm font-mono text-gray-600">
                        {selected.length} SELECTED
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={isLoading || selected.length === 0}
                        className="bg-black text-white px-8 py-3 font-mono text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors duration-0"
                    >
                        {isLoading ? 'SAVING...' : 'CONTINUE →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

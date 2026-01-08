"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import type { UserPreferences, Topic } from '@/lib/types';

export default function SettingsPage() {
    const router = useRouter();
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const [prefsRes, topicsRes] = await Promise.all([
                api.getPreferences(),
                api.getTopics(),
            ]);

            setPreferences(prefsRes.data.preferences);
            setTopics(topicsRes.data.topics);
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!preferences) return;

        setIsSaving(true);
        setMessage('');

        try {
            await api.updatePreferences(preferences);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            setMessage('Failed to save settings');
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const updateTopicWeight = (slug: string, weight: number) => {
        if (!preferences) return;

        setPreferences({
            ...preferences,
            topicWeights: {
                ...preferences.topicWeights,
                [slug]: weight,
            },
        });
    };

    const removeTopic = (slug: string) => {
        if (!preferences) return;

        const newWeights = { ...preferences.topicWeights };
        delete newWeights[slug];

        setPreferences({
            ...preferences,
            topicWeights: newWeights,
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="font-mono text-sm">LOADING...</div>
            </div>
        );
    }

    if (!preferences) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="font-mono text-sm">ERROR LOADING SETTINGS</div>
            </div>
        );
    }

    const selectedTopics = topics.filter(t => preferences.topicWeights[t.slug] !== undefined);
    const availableTopics = topics.filter(t => preferences.topicWeights[t.slug] === undefined);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b-2 border-black p-6">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Settings
                    </h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="font-mono text-sm hover:underline"
                    >
                        ← BACK TO DASHBOARD
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-8">
                {/* Success Message */}
                {message && (
                    <div className={`p-4 mb-6 border-2 border-black ${message.includes('success') ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        <p className="font-mono text-sm">{message}</p>
                    </div>
                )}

                {/* Topics Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-serif mb-6">Topic Preferences</h2>

                    {selectedTopics.length > 0 ? (
                        <div className="space-y-4 mb-6">
                            {selectedTopics.map(topic => (
                                <div key={topic.slug} className="border-2 border-black p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{topic.icon}</span>
                                            <div>
                                                <h3 className="font-serif text-lg">{topic.name}</h3>
                                                <p className="text-sm text-gray-700">{topic.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeTopic(topic.slug)}
                                            className="text-sm font-mono hover:underline"
                                        >
                                            REMOVE
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="font-mono text-xs">INTEREST LEVEL: {preferences.topicWeights[topic.slug]}</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={preferences.topicWeights[topic.slug] || 50}
                                            onChange={(e) => updateTopicWeight(topic.slug, parseInt(e.target.value))}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-700 mb-6">No topics selected. Add some below.</p>
                    )}

                    {availableTopics.length > 0 && (
                        <>
                            <h3 className="font-mono text-sm mb-3">ADD MORE TOPICS</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {availableTopics.map(topic => (
                                    <button
                                        key={topic.slug}
                                        onClick={() => updateTopicWeight(topic.slug, 80)}
                                        className="border-2 border-black p-4 text-left hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="text-2xl mr-2">{topic.icon}</span>
                                        <span className="font-serif">{topic.name}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                <hr className="border-t-2 border-black my-8" />

                {/* Experience Level */}
                <section className="mb-12">
                    <h2 className="text-2xl font-serif mb-6">Experience Level</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                            <button
                                key={lvl}
                                onClick={() => setPreferences({ ...preferences, level: lvl })}
                                className={`
                  border-2 border-black p-4 font-mono text-sm transition-colors
                  ${preferences.level === lvl ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}
                `}
                            >
                                {lvl.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </section>

                <hr className="border-t-2 border-black my-8" />

                {/* Daily Limit */}
                <section className="mb-12">
                    <h2 className="text-2xl font-serif mb-6">Daily Article Limit</h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="15"
                            value={preferences.dailyLimit}
                            onChange={(e) => setPreferences({ ...preferences, dailyLimit: parseInt(e.target.value) })}
                            className="flex-1"
                        />
                        <div className="border-2 border-black px-4 py-2 font-mono text-sm w-16 text-center">
                            {preferences.dailyLimit}
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                        Number of articles in your daily feed
                    </p>
                </section>

                <hr className="border-t-2 border-black my-8" />

                {/* Notifications */}
                <section className="mb-12">
                    <h2 className="text-2xl font-serif mb-6">Notifications</h2>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.emailNotif}
                                onChange={(e) => setPreferences({ ...preferences, emailNotif: e.target.checked })}
                                className="w-6 h-6 border-2 border-black"
                            />
                            <div>
                                <div className="font-medium">Email Notifications</div>
                                <div className="text-sm text-gray-700">Receive daily digest emails</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer opacity-50">
                            <input
                                type="checkbox"
                                checked={preferences.notionSync}
                                disabled
                                className="w-6 h-6 border-2 border-black"
                            />
                            <div>
                                <div className="font-medium">Notion Sync</div>
                                <div className="text-sm text-gray-700">Coming soon</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer opacity-50">
                            <input
                                type="checkbox"
                                checked={preferences.githubSync}
                                disabled
                                className="w-6 h-6 border-2 border-black"
                            />
                            <div>
                                <div className="font-medium">GitHub Sync</div>
                                <div className="text-sm text-gray-700">Coming soon</div>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Save Button */}
                <div className="border-t-2 border-black pt-8">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-black text-white px-12 py-4 font-mono text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
                    </button>
                </div>
            </main>
        </div>
    );
}

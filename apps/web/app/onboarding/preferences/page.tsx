"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

export default function PreferencesPage() {
    const router = useRouter();
    const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
    const [dailyLimit, setDailyLimit] = useState(5);
    const [emailNotif, setEmailNotif] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            await api.updatePreferences({
                level,
                dailyLimit,
                emailNotif,
            });
            router.push('/onboarding/complete');
        } catch (err) {
            console.error('Failed to save preferences:', err);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Customize your experience
                    </h1>
                    <p className="text-lg text-gray-600">
                        Set your preferences. You can change these anytime.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Experience Level */}
                    <div>
                        <h3 className="font-mono text-sm mb-4">EXPERIENCE LEVEL</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                                <button
                                    key={lvl}
                                    onClick={() => setLevel(lvl)}
                                    className={`
                    border-2 border-black p-4 font-mono text-sm transition-colors duration-0
                    ${level === lvl ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}
                  `}
                                >
                                    {lvl.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Daily Limit */}
                    <div>
                        <h3 className="font-mono text-sm mb-4">DAILY ARTICLES</h3>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="15"
                                value={dailyLimit}
                                onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <div className="border-2 border-black px-4 py-2 font-mono text-sm w-16 text-center">
                                {dailyLimit}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Number of personalized articles you'll receive each day
                        </p>
                    </div>

                    {/* Notifications */}
                    <div>
                        <h3 className="font-mono text-sm mb-4">NOTIFICATIONS</h3>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailNotif}
                                onChange={(e) => setEmailNotif(e.target.checked)}
                                className="w-6 h-6 border-2 border-black"
                            />
                            <span className="text-sm">Email notifications when new content is available</span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t-2 border-black pt-8 mt-12 flex justify-between">
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-3 font-mono text-sm hover:underline"
                    >
                        ← BACK
                    </button>

                    <button
                        onClick={handleComplete}
                        disabled={isLoading}
                        className="bg-black text-white px-8 py-3 font-mono text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors duration-0"
                    >
                        {isLoading ? 'SAVING...' : 'COMPLETE SETUP →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

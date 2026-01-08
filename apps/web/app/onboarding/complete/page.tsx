"use client"

import { useRouter } from 'next/navigation';

export default function OnboardingComplete() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl text-center">
                <div className="text-6xl mb-8">🎉</div>

                <h1 className="text-5xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                    You're all set!
                </h1>

                <p className="text-xl mb-4 text-gray-700" style={{ fontFamily: 'Source Serif 4, serif' }}>
                    Your personalized feed is ready.
                </p>

                <p className="text-lg mb-12 text-gray-600 max-w-lg mx-auto">
                    Content is curated daily based on your preferences. Start building.
                </p>

                <div className="border-t-2 border-black pt-8 mt-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-black text-white px-12 py-4 font-mono text-sm hover:bg-gray-800 transition-colors duration-0"
                    >
                        GO TO DASHBOARD →
                    </button>
                </div>

                <p className="text-sm text-gray-500 mt-8">
                    You can adjust your preferences anytime in settings
                </p>
            </div>
        </div>
    );
}

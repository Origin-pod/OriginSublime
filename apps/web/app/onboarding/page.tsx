"use client"

import { useRouter } from 'next/navigation';

export default function OnboardingWelcome() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-7xl font-serif mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Read Less.<br />Build More.
                </h1>

                <p className="text-xl mb-4 text-gray-700" style={{ fontFamily: 'Source Serif 4, serif' }}>
                    Turn reading into building.
                </p>

                <p className="text-lg mb-12 text-gray-600 max-w-lg mx-auto" style={{ fontFamily: 'Source Serif 4, serif' }}>
                    Every article becomes an exercise. Every idea becomes a project. Every day becomes proof of work.
                </p>

                <div className="border-t-2 border-black pt-8 mt-8">
                    <button
                        onClick={() => router.push('/onboarding/topics')}
                        className="bg-black text-white px-12 py-4 font-mono text-sm hover:bg-gray-800 transition-colors duration-0"
                    >
                        GET STARTED →
                    </button>
                </div>
            </div>
        </div>
    );
}

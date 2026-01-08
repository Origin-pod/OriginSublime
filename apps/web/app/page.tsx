"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-7xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Actionable<br />Newsletter
        </h1>

        <p className="text-2xl mb-4 font-serif" style={{ fontFamily: 'Source Serif 4, serif' }}>
          Read Less. Build More.
        </p>

        <p className="text-lg mb-12 text-gray-600 max-w-2xl mx-auto">
          Transform articles into exercises. Ideas into projects. Reading into building.
        </p>

        <div className="border-t-2 border-black pt-8 flex gap-4 justify-center">
          {isLoggedIn ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-black text-white px-12 py-4 font-mono text-sm hover:bg-gray-800 transition-colors duration-0"
            >
              GO TO DASHBOARD →
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/signup')}
                className="bg-black text-white px-12 py-4 font-mono text-sm hover:bg-gray-800 transition-colors duration-0"
              >
                GET STARTED →
              </button>
              <button
                onClick={() => router.push('/login')}
                className="border-2 border-black px-12 py-4 font-mono text-sm hover:bg-gray-100 transition-colors duration-0"
              >
                LOGIN
              </button>
            </>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            AI-powered content curation • Daily exercises • Project templates • 100 Days of Building
          </p>
          <a href="/marketing/index.html" className="text-sm underline hover:no-underline">
            Learn more about the system
          </a>
        </div>
      </div>
    </div>
  );
}

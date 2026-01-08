"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.signup(formData);
            const { token, user } = response.data;

            // Store token
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to onboarding
            router.push('/onboarding/topics');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Actionable Newsletter
                    </h1>
                    <p className="text-lg text-gray-800">Read Less. Build More.</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="border-2 border-black p-8">
                    <h2 className="text-2xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Create Account
                    </h2>

                    {error && (
                        <div className="bg-black text-white p-3 mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-mono mb-2" htmlFor="name">
                                NAME
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border-2 border-black p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-2" htmlFor="email">
                                EMAIL *
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border-2 border-black p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-2" htmlFor="password">
                                PASSWORD *
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full border-2 border-black p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                                placeholder="Min. 8 characters"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white p-4 font-mono text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors duration-0"
                    >
                        {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>

                    <p className="text-center mt-6 text-sm">
                        Already have an account?{' '}
                        <a href="/login" className="underline hover:no-underline">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

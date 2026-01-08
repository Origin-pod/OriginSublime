"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
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
            const response = await api.login(formData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Actionable Newsletter
                    </h1>
                    <p className="text-lg text-gray-600">Read Less. Build More.</p>
                </div>

                <form onSubmit={handleSubmit} className="border-2 border-black p-8">
                    <h2 className="text-2xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Login
                    </h2>

                    {error && (
                        <div className="bg-black text-white p-3 mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-mono mb-2" htmlFor="email">
                                EMAIL
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 focus:border-black"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-2" htmlFor="password">
                                PASSWORD
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full border-2 border-black p-3 focus:outline-none focus:ring-0 focus:border-black"
                                placeholder="Your password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white p-4 font-mono text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors duration-0"
                    >
                        {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>

                    <p className="text-center mt-6 text-sm">
                        Don't have an account?{' '}
                        <a href="/signup" className="underline hover:no-underline">
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

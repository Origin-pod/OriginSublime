"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import type { UserStats, Article, Exercise, Challenge } from '@/lib/types';

export default function Dashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [feed, setFeed] = useState<Article[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [statsRes, feedRes, exercisesRes, challengeRes] = await Promise.all([
                api.getStats(),
                api.getTodayFeed(),
                api.getExercises(),
                api.getChallenge(),
            ]);

            setStats(statsRes.data.stats);
            setFeed(feedRes.data.articles || []);
            setExercises(exercisesRes.data.exercises || []);
            setChallenge(challengeRes.data.challenge);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="font-mono text-sm">LOADING...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b-2 border-black p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Actionable Newsletter
                    </h1>
                    <div className="flex gap-4 items-center">
                        <a href="/settings" className="font-mono text-sm hover:underline">
                            SETTINGS
                        </a>
                        <button onClick={handleLogout} className="font-mono text-sm hover:underline">
                            LOGOUT
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <div className="border-2 border-black p-6">
                        <div className="text-4xl mb-2">📖</div>
                        <div className="text-3xl font-serif mb-1">{stats?.articlesRead || 0}</div>
                        <div className="font-mono text-sm text-gray-600">ARTICLES READ</div>
                    </div>

                    <div className="border-2 border-black p-6">
                        <div className="text-4xl mb-2">💻</div>
                        <div className="text-3xl font-serif mb-1">{stats?.exercisesCompleted || 0}</div>
                        <div className="font-mono text-sm text-gray-600">EXERCISES DONE</div>
                    </div>

                    <div className="border-2 border-black p-6">
                        <div className="text-4xl mb-2">🚀</div>
                        <div className="text-3xl font-serif mb-1">{stats?.challengesCompleted || 0}</div>
                        <div className="font-mono text-sm text-gray-600">CHALLENGES</div>
                    </div>

                    <div className="border-2 border-black p-6">
                        <div className="text-4xl mb-2">🔥</div>
                        <div className="text-3xl font-serif mb-1">{stats?.currentStreak || 0}</div>
                        <div className="font-mono text-sm text-gray-600">DAY STREAK</div>
                    </div>
                </div>

                {/* Today's Challenge */}
                {challenge && (
                    <div className="bg-black text-white p-8 mb-12">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="font-mono text-sm text-gray-400 mb-2">
                                    DAY {challenge.dayNumber || 0}/100
                                </div>
                                <h2 className="text-3xl font-serif mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    {challenge.name}
                                </h2>
                            </div>
                            <div className="text-sm font-mono px-3 py-1 border border-white">
                                {challenge.category}
                            </div>
                        </div>
                        <p className="text-lg mb-6 text-gray-300">
                            {challenge.description}
                        </p>
                        {challenge.projectIdea && (
                            <p className="text-sm mb-4 text-gray-400">{challenge.projectIdea}</p>
                        )}
                        <button className="bg-white text-black px-6 py-3 font-mono text-sm hover:bg-gray-200 transition-colors duration-0">
                            START CHALLENGE →
                        </button>
                    </div>
                )}

                {/* Today's Feed */}
                <div className="mb-12">
                    <h2 className="text-3xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Today's Feed
                    </h2>

                    {feed.length === 0 ? (
                        <div className="border-2 border-black p-8 text-center text-gray-600">
                            <p>No articles in your feed yet. Check back tomorrow!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {feed.map(article => (
                                <article key={article.id} className="border-2 border-black p-6 hover:bg-gray-50 transition-colors duration-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="font-mono text-xs text-gray-500 mb-2">
                                                {article.category} • {article.timeToRead} MIN READ
                                            </div>
                                            <h3 className="text-2xl font-serif mb-2">
                                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                    {article.title}
                                                </a>
                                            </h3>
                                        </div>
                                        <div className="text-sm font-mono px-3 py-1 border-2 border-black">
                                            SCORE: {article.relevanceScore}
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-4">{article.summary}</p>

                                    <div className="flex gap-2 flex-wrap">
                                        {article.tags.map(tag => (
                                            <span key={tag} className="text-xs font-mono px-2 py-1 bg-gray-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Exercises */}
                {exercises.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-serif mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Recommended Exercises
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {exercises.slice(0, 4).map(exercise => (
                                <div key={exercise.id} className="border-2 border-black p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="font-mono text-xs text-gray-500">
                                            {exercise.difficulty} • {exercise.timeEstimate} MIN
                                        </div>
                                        <div className="text-xs font-mono px-2 py-1 border border-black">
                                            {exercise.type}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-serif mb-2">{exercise.title}</h3>
                                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{exercise.description}</p>

                                    <button className="bg-black text-white px-4 py-2 font-mono text-xs hover:bg-gray-800 transition-colors duration-0">
                                        START EXERCISE →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

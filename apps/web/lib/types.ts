// lib/types.ts
export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
}

export interface UserPreferences {
    topicWeights: Record<string, number>;
    level: 'beginner' | 'intermediate' | 'advanced';
    dailyLimit: number;
    emailNotif: boolean;
    notionSync: boolean;
    githubSync: boolean;
}

export interface Topic {
    slug: string;
    name: string;
    icon: string;
    description: string;
    category: string;
}

export interface Article {
    id: string;
    title: string;
    url: string;
    source: string;
    category: string;
    relevanceScore: number;
    summary: string;
    whyItMatters: string;
    actionable: boolean;
    timeToRead: number;
    tags: string[];
    personalizedScore?: number;
}

export interface Exercise {
    id: string;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    type: string;
    timeEstimate: number;
    completed: boolean;
    article: Article;
}

export interface Challenge {
    id: string;
    name: string;
    description: string;
    category: string;
    dayNumber: number | null;
    status: string;
    projectIdea?: string;
}

export interface UserStats {
    articlesRead: number;
    exercisesCompleted: number;
    challengesCompleted: number;
    currentStreak: number;
}

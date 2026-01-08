// lib/api-client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests if available
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API endpoints
export const api = {
    // Auth
    signup: (data: { email: string; password: string; name?: string }) =>
        apiClient.post('/api/auth/signup', data),

    login: (data: { email: string; password: string }) =>
        apiClient.post('/api/auth/login', data),

    getMe: () =>
        apiClient.get('/api/auth/me'),

    // Preferences
    getPreferences: () =>
        apiClient.get('/api/preferences'),

    updatePreferences: (data: {
        topicWeights?: Record<string, number>;
        level?: string;
        dailyLimit?: number;
        emailNotif?: boolean;
        notionSync?: boolean;
        githubSync?: boolean;
    }) =>
        apiClient.put('/api/preferences', data),

    // Topics
    getTopics: () =>
        apiClient.get('/api/topics'),

    // Feed
    getTodayFeed: () =>
        apiClient.get('/api/feed/today'),

    getExercises: () =>
        apiClient.get('/api/feed/exercises'),

    getChallenge: () =>
        apiClient.get('/api/feed/challenge'),

    // Activity
    logActivity: (data: {
        type: string;
        entityType: string;
        entityId: string;
        metadata?: any;
    }) =>
        apiClient.post('/api/activity', data),

    getStats: () =>
        apiClient.get('/api/stats'),
};

// src/server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import authPlugin from './plugins/auth';
import databasePlugin from './plugins/database';
import { authRoutes } from './routes/auth';
import { preferencesRoutes } from './routes/preferences';
import { feedRoutes } from './routes/feed';
import { activityRoutes } from './routes/activity';
import { devRoutes } from './routes/dev';

export async function buildServer() {
    const server = Fastify({
        logger: {
            level: process.env.LOG_LEVEL || 'info',
        },
    });

    // Register CORS
    await server.register(cors, {
        origin: true, // Allow all origins in development
    });

    // Register plugins
    await server.register(databasePlugin);
    await server.register(authPlugin);

    // Health check
    server.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // API routes
    server.get('/api', async () => {
        return {
            name: 'Actionable Newsletter API',
            version: '2.0.0',
            endpoints: {
                auth: '/api/auth',
                preferences: '/api/preferences',
                topics: '/api/topics',
                feed: '/api/feed',
                activity: '/api/activity',
                stats: '/api/stats',
                articles: '/api/articles',
                exercises: '/api/exercises',
                challenges: '/api/challenges',
                ...(process.env.NODE_ENV !== 'production' && { dev: '/api/dev (testing only)' }),
            },
        };
    });

    // Register route handlers
    await authRoutes(server);
    await preferencesRoutes(server);
    await feedRoutes(server);
    await activityRoutes(server);
    await devRoutes(server); // Dev-only routes

    return server;
}

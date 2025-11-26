// src/server.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';

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

    // Health check
    server.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // API routes
    server.get('/api', async () => {
        return {
            name: 'Actionable Newsletter API',
            version: '1.0.0',
            endpoints: {
                articles: '/api/articles',
                exercises: '/api/exercises',
                challenges: '/api/challenges',
                connections: '/api/connections',
            },
        };
    });

    return server;
}

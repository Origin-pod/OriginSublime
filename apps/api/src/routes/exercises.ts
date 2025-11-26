// src/routes/exercises.ts
import { FastifyInstance } from 'fastify';
import { generateActionItems } from '@actionable-newsletter/generator';

// In-memory cache
let cachedExercises: any[] = [];

export async function exercisesRoutes(server: FastifyInstance) {
    // GET /api/exercises - Get all exercises
    server.get('/api/exercises', async (request, reply) => {
        const { language, difficulty } = request.query as any;

        let filtered = cachedExercises;

        if (language) {
            filtered = filtered.filter(ex => ex.language === language);
        }

        if (difficulty) {
            filtered = filtered.filter(ex => ex.difficulty === difficulty);
        }

        return {
            exercises: filtered,
            total: filtered.length,
        };
    });

    // GET /api/exercises/today - Get today's recommended exercise
    server.get('/api/exercises/today', async (request, reply) => {
        if (cachedExercises.length === 0) {
            reply.code(404);
            return { error: 'No exercises available. Run POST /api/exercises/generate first.' };
        }

        // Return a random exercise
        const randomIndex = Math.floor(Math.random() * cachedExercises.length);
        return {
            exercise: cachedExercises[randomIndex],
            date: new Date().toISOString().split('T')[0],
        };
    });

    // POST /api/exercises/generate - Generate exercises from curated articles
    server.post('/api/exercises/generate', async (request, reply) => {
        try {
            const { articles } = request.body as any;

            if (!articles || !Array.isArray(articles)) {
                reply.code(400);
                return { error: 'Invalid request. Provide articles array.' };
            }

            const actionItems = await generateActionItems(articles, {
                includeExercises: true,
                includeProjects: false,
                includeReflections: false,
            });

            cachedExercises = actionItems.exercises;

            return {
                success: true,
                count: cachedExercises.length,
            };
        } catch (error: any) {
            reply.code(500);
            return { error: error.message };
        }
    });
}

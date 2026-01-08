// src/routes/feed.ts
import { FastifyInstance } from 'fastify';
import { Category } from '@prisma/client';

export async function feedRoutes(server: FastifyInstance) {
    // GET /api/feed/today - Get personalized daily feed
    server.get('/api/feed/today', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            // Get user preferences
            const preferences = await server.prisma.userPreferences.findUnique({
                where: { userId: request.user.id },
            });

            if (!preferences) {
                reply.code(404);
                return { error: 'User preferences not found' };
            }

            const topicWeights = preferences.topicWeights as Record<string, number>;
            const dailyLimit = preferences.dailyLimit || 5;

            // Get today's articles (last 24 hours)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const articles = await server.prisma.article.findMany({
                where: {
                    scrapedAt: {
                        gte: yesterday,
                    },
                },
                orderBy: {
                    relevanceScore: 'desc',
                },
                take: 50, // Get more than needed for filtering
            });

            // Score articles based on user preferences
            const scoredArticles = articles.map(article => {
                const categoryKey = article.category.toLowerCase().replace('_', '-');
                const userWeight = topicWeights[categoryKey] || 0;

                // Calculate personalized score: base relevance * user weight
                const personalizedScore = article.relevanceScore * (userWeight / 100);

                return {
                    ...article,
                    personalizedScore,
                };
            });

            // Sort by personalized score and take daily limit
            const topArticles = scoredArticles
                .sort((a, b) => b.personalizedScore - a.personalizedScore)
                .slice(0, dailyLimit);

            return {
                articles: topArticles,
                date: new Date().toISOString().split('T')[0],
                count: topArticles.length,
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to generate personalized feed' };
        }
    });

    // GET /api/feed/exercises - Get personalized exercises
    server.get('/api/feed/exercises', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            const preferences = await server.prisma.userPreferences.findUnique({
                where: { userId: request.user.id },
            });

            if (!preferences) {
                reply.code(404);
                return { error: 'User preferences not found' };
            }

            const level = preferences.level || 'intermediate';

            // Map level to difficulty
            const difficultyMap: Record<string, string[]> = {
                beginner: ['EASY'],
                intermediate: ['EASY', 'MEDIUM'],
                advanced: ['MEDIUM', 'HARD'],
            };

            const difficulties = difficultyMap[level] || ['MEDIUM'];

            // Get exercises matching user level
            const exercises = await server.prisma.exercise.findMany({
                where: {
                    difficulty: {
                        in: difficulties,
                    },
                    completed: false,
                },
                include: {
                    article: true,
                },
                orderBy: {
                    article: {
                        scrapedAt: 'desc',
                    },
                },
                take: 10,
            });

            return {
                exercises,
                level,
                count: exercises.length,
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to fetch exercises' };
        }
    });

    // GET /api/feed/challenge - Get today's AI challenge
    server.get('/api/feed/challenge', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            // Get the most recent challenge or today's challenge
            const challenge = await server.prisma.aITool.findFirst({
                where: {
                    status: {
                        in: ['QUEUED', 'IN_PROGRESS'],
                    },
                },
                orderBy: {
                    dayNumber: 'asc',
                },
            });

            if (!challenge) {
                return {
                    challenge: null,
                    message: 'No active challenge available',
                };
            }

            return {
                challenge: {
                    id: challenge.id,
                    name: challenge.name,
                    description: challenge.description,
                    category: challenge.category,
                    dayNumber: challenge.dayNumber,
                    status: challenge.status,
                    projectIdea: challenge.projectIdea,
                },
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to fetch challenge' };
        }
    });
}

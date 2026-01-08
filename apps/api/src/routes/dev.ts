// src/routes/dev.ts
import { FastifyInstance } from 'fastify';
import { sendWelcomeEmail, sendDailyDigest } from '@actionable-newsletter/integrations';

// Hidden dev routes for manual testing (only in development)
export async function devRoutes(server: FastifyInstance) {
    // Only enable in development
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    // Manual trigger: Send welcome email
    server.post('/api/dev/send-welcome', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            const { email, name } = request.body as { email?: string; name?: string };

            // Use authenticated user's email if not provided
            const user = await server.prisma.user.findUnique({
                where: { id: request.user.id },
            });

            if (!user) {
                reply.code(404);
                return { error: 'User not found' };
            }

            const result = await sendWelcomeEmail(
                email || user.email,
                name || user.name || 'User'
            );

            if (!result.success) {
                reply.code(500);
                return { error: result.error, sent: false };
            }

            return {
                sent: true,
                to: email || user.email,
                messageId: result.messageId,
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: error.message, sent: false };
        }
    });

    // Manual trigger: Send daily digest
    server.post('/api/dev/send-digest', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            const user = await server.prisma.user.findUnique({
                where: { id: request.user.id },
                include: {
                    preferences: true,
                },
            });

            if (!user || !user.preferences) {
                reply.code(404);
                return { error: 'User or preferences not found' };
            }

            // Get user's personalized content
            const [feedRes, exercisesRes, challengeRes, statsRes] = await Promise.all([
                server.prisma.article.findMany({
                    where: {
                        scrapedAt: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                        },
                    },
                    orderBy: { relevanceScore: 'desc' },
                    take: user.preferences.dailyLimit || 5,
                }),
                server.prisma.exercise.findMany({
                    where: { completed: false },
                    include: { article: true },
                    take: 3,
                }),
                server.prisma.aITool.findFirst({
                    where: { status: { in: ['QUEUED', 'IN_PROGRESS'] } },
                    orderBy: { dayNumber: 'asc' },
                }),
                server.prisma.userActivity.aggregate({
                    where: { userId: user.id },
                    _count: true,
                }),
            ]);

            // Get stats
            const articlesRead = await server.prisma.userArticle.count({
                where: {
                    userId: user.id,
                    status: { in: ['READ', 'COMPLETED_EXERCISE'] },
                },
            });

            const exercisesCompleted = await server.prisma.userActivity.count({
                where: {
                    userId: user.id,
                    type: 'exercise_completed',
                },
            });

            // Send email
            const result = await sendDailyDigest({
                to: user.email,
                userName: user.name || 'User',
                articles: feedRes.map(a => ({
                    title: a.title,
                    url: a.url,
                    category: a.category,
                    summary: a.summary || '',
                    timeToRead: a.timeToRead || 5,
                })),
                exercises: exercisesRes.map(e => ({
                    title: e.title,
                    difficulty: e.difficulty,
                    timeEstimate: e.timeEstimate || 30,
                })),
                challenge: challengeRes ? {
                    name: challengeRes.name,
                    dayNumber: challengeRes.dayNumber,
                    description: challengeRes.description || '',
                } : undefined,
                stats: {
                    articlesRead,
                    exercisesCompleted,
                    currentStreak: 0, // TODO: Calculate actual streak
                },
            });

            if (!result.success) {
                reply.code(500);
                return { error: result.error, sent: false };
            }

            return {
                sent: true,
                to: user.email,
                messageId: result.messageId,
                contentIncluded: {
                    articles: feedRes.length,
                    exercises: exercisesRes.length,
                    hasChallenge: !!challengeRes,
                },
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: error.message, sent: false };
        }
    });

    // Manual trigger: Get digest preview (don't send)
    server.get('/api/dev/digest-preview', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            const user = await server.prisma.user.findUnique({
                where: { id: request.user.id },
                include: { preferences: true },
            });

            if (!user || !user.preferences) {
                reply.code(404);
                return { error: 'User or preferences not found' };
            }

            // Get user's personalized content (same logic as send-digest)
            const [articles, exercises, challenge] = await Promise.all([
                server.prisma.article.findMany({
                    where: {
                        scrapedAt: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                        },
                    },
                    orderBy: { relevanceScore: 'desc' },
                    take: user.preferences.dailyLimit || 5,
                }),
                server.prisma.exercise.findMany({
                    where: { completed: false },
                    include: { article: true },
                    take: 3,
                }),
                server.prisma.aITool.findFirst({
                    where: { status: { in: ['QUEUED', 'IN_PROGRESS'] } },
                }),
            ]);

            return {
                user: {
                    email: user.email,
                    name: user.name,
                },
                content: {
                    articles: articles.map(a => ({
                        title: a.title,
                        category: a.category,
                        timeToRead: a.timeToRead,
                    })),
                    exercises: exercises.map(e => ({
                        title: e.title,
                        difficulty: e.difficulty,
                    })),
                    challenge: challenge ? {
                        name: challenge.name,
                        dayNumber: challenge.dayNumber,
                    } : null,
                },
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: error.message };
        }
    });

    console.log('🔧 Dev routes enabled at /api/dev/*');
}

// src/routes/activity.ts
import { FastifyInstance } from 'fastify';

export async function activityRoutes(server: FastifyInstance) {
    // POST /api/activity - Log user activity
    server.post('/api/activity', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        const { type, entityType, entityId, metadata } = request.body as {
            type: string;
            entityType: string;
            entityId: string;
            metadata?: Record<string, any>;
        };

        // Validate input
        if (!type || !entityType || !entityId) {
            reply.code(400);
            return { error: 'type, entityType, and entityId are required' };
        }

        try {
            // Log activity
            const activity = await server.prisma.userActivity.create({
                data: {
                    userId: request.user.id,
                    type,
                    entityType,
                    entityId,
                    metadata: metadata || {},
                },
            });

            // Update UserArticle if it's an article-related activity
            if (entityType === 'article') {
                await server.prisma.userArticle.upsert({
                    where: {
                        userId_articleId: {
                            userId: request.user.id,
                            articleId: entityId,
                        },
                    },
                    update: {
                        status: type.includes('completed') ? 'COMPLETED_EXERCISE' : 'READ',
                        readAt: new Date(),
                    },
                    create: {
                        userId: request.user.id,
                        articleId: entityId,
                        status: type.includes('completed') ? 'COMPLETED_EXERCISE' : 'READ',
                        readAt: new Date(),
                    },
                });
            }

            return {
                success: true,
                activity: {
                    id: activity.id,
                    type: activity.type,
                    createdAt: activity.createdAt,
                },
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to log activity' };
        }
    });

    // GET /api/stats - Get user statistics
    server.get('/api/stats', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            // Get articles read count
            const articlesRead = await server.prisma.userArticle.count({
                where: {
                    userId: request.user.id,
                    status: {
                        in: ['READ', 'COMPLETED_EXERCISE'],
                    },
                },
            });

            // Get exercises completed count
            const exercisesCompleted = await server.prisma.userActivity.count({
                where: {
                    userId: request.user.id,
                    type: 'exercise_completed',
                },
            });

            // Get challenges completed count
            const challengesCompleted = await server.prisma.userActivity.count({
                where: {
                    userId: request.user.id,
                    type: 'challenge_completed',
                },
            });

            // Calculate current streak (consecutive days with activity)
            const activities = await server.prisma.userActivity.findMany({
                where: {
                    userId: request.user.id,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 100, // Last 100 activities
            });

            let currentStreak = 0;
            if (activities.length > 0) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                let checkDate = new Date(today);
                const activityDates = new Set(
                    activities.map(a => {
                        const d = new Date(a.createdAt);
                        d.setHours(0, 0, 0, 0);
                        return d.getTime();
                    })
                );

                // Check if there's activity today or yesterday
                if (!activityDates.has(checkDate.getTime())) {
                    checkDate.setDate(checkDate.getDate() - 1);
                }

                // Count consecutive days
                while (activityDates.has(checkDate.getTime())) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                }
            }

            return {
                stats: {
                    articlesRead,
                    exercisesCompleted,
                    challengesCompleted,
                    currentStreak,
                },
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to fetch statistics' };
        }
    });
}

// src/routes/preferences.ts
import { FastifyInstance } from 'fastify';

export async function preferencesRoutes(server: FastifyInstance) {
    // GET /api/preferences - Get user preferences
    server.get('/api/preferences', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            const preferences = await server.prisma.userPreferences.findUnique({
                where: { userId: request.user.id },
            });

            if (!preferences) {
                reply.code(404);
                return { error: 'Preferences not found' };
            }

            return {
                preferences: {
                    topicWeights: preferences.topicWeights,
                    level: preferences.level,
                    dailyLimit: preferences.dailyLimit,
                    emailNotif: preferences.emailNotif,
                    notionSync: preferences.notionSync,
                    githubSync: preferences.githubSync,
                },
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to fetch preferences' };
        }
    });

    // PUT /api/preferences - Update user preferences
    server.put('/api/preferences', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        const {
            topicWeights,
            level,
            dailyLimit,
            emailNotif,
            notionSync,
            githubSync,
        } = request.body as {
            topicWeights?: Record<string, number>;
            level?: string;
            dailyLimit?: number;
            emailNotif?: boolean;
            notionSync?: boolean;
            githubSync?: boolean;
        };

        try {
            // Validate level if provided
            if (level && !['beginner', 'intermediate', 'advanced'].includes(level)) {
                reply.code(400);
                return { error: 'Invalid level. Must be beginner, intermediate, or advanced' };
            }

            // Validate dailyLimit if provided
            if (dailyLimit !== undefined && (dailyLimit < 1 || dailyLimit > 50)) {
                reply.code(400);
                return { error: 'Daily limit must be between 1 and 50' };
            }

            // Validate topicWeights if provided
            if (topicWeights) {
                for (const [topic, weight] of Object.entries(topicWeights)) {
                    if (weight < 0 || weight > 100) {
                        reply.code(400);
                        return { error: `Weight for ${topic} must be between 0 and 100` };
                    }
                }
            }

            // Update preferences
            const updated = await server.prisma.userPreferences.update({
                where: { userId: request.user.id },
                data: {
                    ...(topicWeights !== undefined && { topicWeights }),
                    ...(level && { level }),
                    ...(dailyLimit !== undefined && { dailyLimit }),
                    ...(emailNotif !== undefined && { emailNotif }),
                    ...(notionSync !== undefined && { notionSync }),
                    ...(githubSync !== undefined && { githubSync }),
                },
            });

            return {
                preferences: {
                    topicWeights: updated.topicWeights,
                    level: updated.level,
                    dailyLimit: updated.dailyLimit,
                    emailNotif: updated.emailNotif,
                    notionSync: updated.notionSync,
                    githubSync: updated.githubSync,
                },
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to update preferences' };
        }
    });

    // GET /api/topics - List all available topics
    server.get('/api/topics', async (request, reply) => {
        try {
            const topics = await server.prisma.topicMapping.findMany({
                select: {
                    slug: true,
                    name: true,
                    icon: true,
                    description: true,
                    category: true,
                },
                orderBy: {
                    name: 'asc',
                },
            });

            return { topics };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to fetch topics' };
        }
    });
}

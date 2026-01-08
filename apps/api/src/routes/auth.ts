// src/routes/auth.ts
import { FastifyInstance } from 'fastify';
import { hashPassword, verifyPassword } from '../utils/password';

export async function authRoutes(server: FastifyInstance) {
    // POST /api/auth/signup - Create new user
    server.post('/api/auth/signup', async (request, reply) => {
        const { email, password, name } = request.body as {
            email: string;
            password: string;
            name?: string;
        };

        // Validate input
        if (!email || !password) {
            reply.code(400);
            return { error: 'Email and password are required' };
        }

        if (password.length < 8) {
            reply.code(400);
            return { error: 'Password must be at least 8 characters' };
        }

        try {
            // Check if user already exists
            const existing = await server.prisma.user.findUnique({
                where: { email },
            });

            if (existing) {
                reply.code(409);
                return { error: 'User already exists' };
            }

            // Hash password
            const passwordHash = await hashPassword(password);

            // Create user
            const user = await server.prisma.user.create({
                data: {
                    email,
                    name,
                    passwordHash,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            });

            // Create default preferences
            await server.prisma.userPreferences.create({
                data: {
                    userId: user.id,
                    topicWeights: {},
                    level: 'intermediate',
                    dailyLimit: 5,
                },
            });

            // Generate JWT
            const token = server.jwt.sign({
                id: user.id,
                email: user.email,
            });

            return {
                user,
                token,
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to create user' };
        }
    });

    // POST /api/auth/login - Login user
    server.post('/api/auth/login', async (request, reply) => {
        const { email, password } = request.body as {
            email: string;
            password: string;
        };

        if (!email || !password) {
            reply.code(400);
            return { error: 'Email and password are required' };
        }

        try {
            // Find user
            const user = await server.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    passwordHash: true,
                },
            });

            if (!user) {
                reply.code(401);
                return { error: 'Invalid credentials' };
            }

            // Verify password
            const valid = await verifyPassword(password, user.passwordHash);

            if (!valid) {
                reply.code(401);
                return { error: 'Invalid credentials' };
            }

            // Generate JWT
            const token = server.jwt.sign({
                id: user.id,
                email: user.email,
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                token,
            };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Login failed' };
        }
    });

    // GET /api/auth/me - Get current user
    server.get('/api/auth/me', {
        onRequest: [server.authenticate],
    }, async (request, reply) => {
        try {
            const user = await server.prisma.user.findUnique({
                where: { id: request.user.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                    preferences: {
                        select: {
                            topicWeights: true,
                            level: true,
                            dailyLimit: true,
                            emailNotif: true,
                            notionSync: true,
                            githubSync: true,
                        },
                    },
                },
            });

            if (!user) {
                reply.code(404);
                return { error: 'User not found' };
            }

            return { user };
        } catch (error: any) {
            server.log.error(error);
            reply.code(500);
            return { error: 'Failed to fetch user' };
        }
    });
}

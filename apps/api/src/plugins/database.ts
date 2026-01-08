// src/plugins/database.ts
import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

export default fp(async (server) => {
    const prisma = new PrismaClient();

    // Add Prisma to Fastify instance
    server.decorate('prisma', prisma);

    // Close connection on app shutdown
    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    });
});

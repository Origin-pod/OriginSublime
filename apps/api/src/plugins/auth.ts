// src/plugins/auth.ts
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }

    interface FastifyRequest {
        user: {
            id: string;
            email: string;
        };
    }
}

export default fp(async (server) => {
    // Register JWT plugin
    await server.register(jwt, {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });

    // Authentication decorator
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    });
});

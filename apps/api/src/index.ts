// src/index.ts
import { buildServer } from './server';
import { articlesRoutes } from './routes/articles';
import { exercisesRoutes } from './routes/exercises';
import { challengesRoutes } from './routes/challenges';

async function start() {
    const server = await buildServer();

    // Register routes
    await articlesRoutes(server);
    await exercisesRoutes(server);
    await challengesRoutes(server);

    // Start server
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    try {
        await server.listen({ port, host });
        console.log(`🚀 API server running at http://${host}:${port}`);
        console.log(`📋 Health check: http://${host}:${port}/health`);
        console.log(`📚 API docs: http://${host}:${port}/api`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

start();

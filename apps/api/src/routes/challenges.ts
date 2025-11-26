// src/routes/challenges.ts
import { FastifyInstance } from 'fastify';
import { generateAIChallengeProject, SAMPLE_AI_TOOLS } from '@actionable-newsletter/generator';

// Track current day
let currentDay = 1;
let todaysChallenge: any = null;

export async function challengesRoutes(server: FastifyInstance) {
    // GET /api/challenges/today - Get today's AI challenge
    server.get('/api/challenges/today', async (request, reply) => {
        if (!todaysChallenge) {
            // Generate today's challenge
            const toolIndex = (currentDay - 1) % SAMPLE_AI_TOOLS.length;
            const tool = SAMPLE_AI_TOOLS[toolIndex];
            todaysChallenge = await generateAIChallengeProject(tool, currentDay);
        }

        return {
            challenge: todaysChallenge,
            day: currentDay,
            totalDays: 100,
        };
    });

    // GET /api/challenges/progress - Get progress stats
    server.get('/api/challenges/progress', async (request, reply) => {
        return {
            currentDay,
            totalDays: 100,
            percentComplete: Math.round((currentDay / 100) * 100),
            daysRemaining: 100 - currentDay,
        };
    });

    // POST /api/challenges/:day/complete - Mark a challenge as complete
    server.post('/api/challenges/:day/complete', async (request, reply) => {
        const { day } = request.params as any;
        const { rating, learnings, githubUrl } = request.body as any;

        // In production, save to database
        console.log(`Challenge ${day} completed:`, { rating, learnings, githubUrl });

        // Advance to next day
        if (parseInt(day) === currentDay) {
            currentDay++;
            todaysChallenge = null; // Reset for next day
        }

        return {
            success: true,
            nextDay: currentDay,
        };
    });

    // POST /api/challenges/next - Generate next day's challenge
    server.post('/api/challenges/next', async (request, reply) => {
        currentDay++;
        todaysChallenge = null;

        const toolIndex = (currentDay - 1) % SAMPLE_AI_TOOLS.length;
        const tool = SAMPLE_AI_TOOLS[toolIndex];
        todaysChallenge = await generateAIChallengeProject(tool, currentDay);

        return {
            success: true,
            challenge: todaysChallenge,
            day: currentDay,
        };
    });
}

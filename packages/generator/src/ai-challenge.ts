// src/ai-challenge.ts
import { callClaude } from '@actionable-newsletter/curator';
import { AIChallenge } from './types';

export interface AITool {
    name: string;
    description: string;
    category: string;
    url: string;
}

/**
 * Generate a daily AI challenge project for the "100 Days of Building with AI" series.
 * Creates a specific, time-boxed project idea for testing an AI tool.
 */
export async function generateAIChallengeProject(
    tool: AITool,
    dayNumber: number
): Promise<AIChallenge> {
    const prompt = `You are creating a daily AI challenge for "100 Days of Building with AI".

Today's Tool (Day ${dayNumber}/100):
Name: ${tool.name}
Category: ${tool.category}
Description: ${tool.description}

Create a 60-90 minute project idea for testing this tool in a real-world scenario.

User interests: Rust, C++, AI/ML, building things, learning by doing

Return a JSON object:
{
  "projectIdea": "One-line project idea (specific and actionable)",
  "description": "2-3 paragraph description of what to build and why",
  "setupInstructions": ["step1", "step2", "step3"],
  "successCriteria": ["criterion1", "criterion2", "criterion3"],
  "timeEstimate": 75
}

Guidelines:
- Make it practical and fun
- Should produce a tangible outcome
- Focus on learning the tool's strengths/weaknesses
- Include specific deliverables
- Time estimate: 60-90 minutes

Examples of good projects:
- "Refactor your async Rust code using Cursor AI"
- "Generate unit tests for a C++ class with GitHub Copilot"
- "Create API documentation with Claude"

Return ONLY valid JSON, no markdown.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 1500,
            temperature: 0.8,
        });

        const cleaned = response.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(cleaned);

        return {
            toolName: tool.name,
            dayNumber,
            projectIdea: parsed.projectIdea,
            description: parsed.description,
            setupInstructions: Array.isArray(parsed.setupInstructions) ? parsed.setupInstructions : [],
            successCriteria: Array.isArray(parsed.successCriteria) ? parsed.successCriteria : [],
            timeEstimate: parsed.timeEstimate || 75,
            category: tool.category,
        };
    } catch (error) {
        console.error(`Error generating AI challenge for ${tool.name}:`, error);

        // Fallback challenge
        return {
            toolName: tool.name,
            dayNumber,
            projectIdea: `Build a small project using ${tool.name}`,
            description: `Spend 60-90 minutes exploring ${tool.name} and building something useful. Document your experience and key learnings.`,
            setupInstructions: [
                `Sign up for ${tool.name}`,
                'Choose a small project from your backlog',
                'Use the tool to help build it',
            ],
            successCriteria: [
                'Complete a working prototype',
                'Document what worked well',
                'Note any limitations or issues',
            ],
            timeEstimate: 75,
            category: tool.category,
        };
    }
}

/**
 * Generate challenges for a week of AI tools
 */
export async function generateWeeklyChallenges(
    tools: AITool[],
    startDay: number
): Promise<AIChallenge[]> {
    const challenges: AIChallenge[] = [];

    for (let i = 0; i < tools.length; i++) {
        const challenge = await generateAIChallengeProject(tools[i], startDay + i);
        challenges.push(challenge);

        // Delay between generations
        if (i < tools.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    return challenges;
}

/**
 * Sample AI tools for testing (can be replaced with database query)
 */
export const SAMPLE_AI_TOOLS: AITool[] = [
    {
        name: 'Cursor',
        description: 'AI-powered code editor with intelligent code completion and refactoring',
        category: 'CODE_GENERATION',
        url: 'https://cursor.sh',
    },
    {
        name: 'GitHub Copilot',
        description: 'AI pair programmer that suggests code and entire functions',
        category: 'CODE_GENERATION',
        url: 'https://github.com/features/copilot',
    },
    {
        name: 'Claude',
        description: 'Advanced AI assistant for coding, writing, and analysis',
        category: 'WRITING',
        url: 'https://claude.ai',
    },
    {
        name: 'v0 by Vercel',
        description: 'AI-powered UI generation from text descriptions',
        category: 'DESIGN',
        url: 'https://v0.dev',
    },
    {
        name: 'Perplexity',
        description: 'AI-powered research and answer engine',
        category: 'RESEARCH',
        url: 'https://perplexity.ai',
    },
];

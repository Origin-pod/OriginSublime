// src/client.ts
import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
    if (!anthropicClient) {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY environment variable is required');
        }
        anthropicClient = new Anthropic({ apiKey });
    }
    return anthropicClient;
}

/**
 * Helper to call Claude with a simple text prompt
 */
export async function callClaude(
    prompt: string,
    options: {
        model?: string;
        maxTokens?: number;
        temperature?: number;
    } = {}
): Promise<string> {
    const client = getAnthropicClient();

    const response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        temperature: options.temperature ?? 0.7,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
        return content.text;
    }

    throw new Error('Unexpected response type from Claude');
}

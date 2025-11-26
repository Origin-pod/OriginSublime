// src/reflection-prompt.ts
import { CuratedArticle } from '@actionable-newsletter/curator';
import { callClaude } from '@actionable-newsletter/curator';
import { ReflectionPrompt } from './types';

/**
 * Generate reflection prompts for philosophy, poetry, or self-help articles.
 * Creates thought-provoking questions for journaling or discussion.
 */
export async function generateReflectionPrompt(
    article: CuratedArticle
): Promise<ReflectionPrompt | null> {
    // Only generate for non-technical content
    const isPhilosophical = article.tags.some(tag =>
        ['philosophy', 'poetry', 'self-help', 'mindfulness', 'stoicism'].includes(tag.toLowerCase())
    );

    if (!isPhilosophical && article.actionable) {
        return null; // Skip technical actionable content
    }

    const prompt = `You are a thoughtful guide creating reflection prompts for personal growth.

Article:
Title: ${article.title}
Summary: ${article.summary}
Why it matters: ${article.whyItMatters}
Tags: ${article.tags.join(', ')}

Create 3-5 reflection prompts that help someone engage deeply with this content.

Return a JSON object:
{
  "theme": "Core theme or question",
  "prompts": [
    "Open-ended question 1",
    "Open-ended question 2",
    "Open-ended question 3"
  ],
  "suggestedFormat": "journal" | "essay" | "discussion",
  "timeEstimate": 20
}

Guidelines:
- Make prompts open-ended and thought-provoking
- Connect to personal experience
- Encourage practical application
- Avoid yes/no questions
- Time estimate: 15-30 minutes

Examples of good prompts:
- "How do the Stoic principles in this article apply to your current challenges?"
- "What patterns in your code mirror the themes in this poem?"
- "How might you restructure your daily routine based on these insights?"

Return ONLY valid JSON, no markdown.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 1000,
            temperature: 0.8,
        });

        const cleaned = response.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(cleaned);

        return {
            articleUrl: article.url,
            prompts: Array.isArray(parsed.prompts) ? parsed.prompts : [],
            theme: parsed.theme || 'Reflection',
            suggestedFormat: parsed.suggestedFormat || 'journal',
            timeEstimate: parsed.timeEstimate || 20,
        };
    } catch (error) {
        console.error(`Error generating reflection prompt for "${article.title}":`, error);
        return null;
    }
}

/**
 * Generate reflection prompts for multiple articles
 */
export async function generateReflectionPrompts(
    articles: CuratedArticle[],
    batchSize: number = 3
): Promise<ReflectionPrompt[]> {
    const prompts: ReflectionPrompt[] = [];

    for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        const batchPrompts = await Promise.all(
            batch.map(article => generateReflectionPrompt(article))
        );

        prompts.push(...batchPrompts.filter((p): p is ReflectionPrompt => p !== null));

        if (i + batchSize < articles.length) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    return prompts;
}

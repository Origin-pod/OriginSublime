// src/code-exercise.ts
import { CuratedArticle } from '@actionable-newsletter/curator';
import { callClaude } from '@actionable-newsletter/curator';
import { Exercise, ExerciseType, Difficulty } from './types';

/**
 * Generate a coding exercise from an actionable article.
 * Creates step-by-step instructions, starter code, and test cases.
 */
export async function generateExercise(
    article: CuratedArticle
): Promise<Exercise | null> {
    if (!article.actionable) {
        return null; // Only generate exercises for actionable content
    }

    // Determine language from tags or source
    const language = detectLanguage(article);
    if (!language) {
        return null; // Skip if we can't determine the language
    }

    const prompt = `You are a coding instructor creating a hands-on exercise from a technical article.

Article:
Title: ${article.title}
Summary: ${article.summary}
Tags: ${article.tags.join(', ')}
Language: ${language}

Create a coding exercise that helps someone learn the key concepts from this article.

Return a JSON object:
{
  "type": "CODE_KATA" | "REFACTORING" | "IMPLEMENTATION",
  "title": "Short, clear exercise title",
  "description": "Step-by-step instructions (3-5 steps). Be specific and actionable.",
  "starterCode": "Starter code with TODOs and comments",
  "testCases": "Test cases or assertions to verify correctness",
  "hints": ["hint1", "hint2", "hint3"],
  "timeEstimate": 30,
  "difficulty": "EASY" | "MEDIUM" | "HARD"
}

Guidelines:
- Make it practical and focused on one key concept
- Include clear TODOs in starter code
- Provide helpful hints without giving away the solution
- Time estimate should be realistic (15-90 minutes)
- Difficulty based on concept complexity

Return ONLY valid JSON, no markdown.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 2000,
            temperature: 0.7,
        });

        const cleaned = response.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const sanitized = cleaned.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        // This is a bit aggressive as it escapes ALL newlines, including those outside strings (which is fine for JSON as whitespace is ignored, but we need to be careful about structure).
        // Better approach: use a regex that only targets control characters inside strings? No, that's hard.
        // Let's try a simpler approach: ask Claude to be valid JSON, and if it fails, try to fix it.
        // Actually, the error is likely literal newlines in the "starterCode" or "description".
        // Let's use a more robust cleaning function.

        // Simple fix: replace literal newlines with \n, but we need to preserve the JSON structure.
        // If we just replace all \n with \\n, the JSON object structure (braces) will be on one line, which is valid JSON.
        // BUT, we need to make sure we don't double escape existing \\n.

        // Let's try to parse, and if it fails, try to sanitize.
        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch (e) {
            // Fallback: try to escape control characters
            const fixed = cleaned.replace(/[\u0000-\u0019]+/g, "");
            parsed = JSON.parse(fixed);
        }

        return {
            articleUrl: article.url,
            type: parsed.type as ExerciseType,
            title: parsed.title,
            description: parsed.description,
            starterCode: parsed.starterCode,
            testCases: parsed.testCases,
            hints: Array.isArray(parsed.hints) ? parsed.hints : [],
            timeEstimate: parsed.timeEstimate || 30,
            difficulty: parsed.difficulty as Difficulty,
            language,
        };
    } catch (error) {
        console.error(`Error generating exercise for "${article.title}":`, error);
        return null;
    }
}

/**
 * Detect programming language from article metadata
 */
function detectLanguage(article: CuratedArticle): string | null {
    const tags = article.tags.map(t => t.toLowerCase());
    const title = article.title.toLowerCase();
    const source = article.source.toLowerCase();

    // Check tags first
    if (tags.includes('rust') || source.includes('rust')) return 'rust';
    if (tags.includes('c++') || tags.includes('cpp') || source.includes('cpp')) return 'cpp';
    if (tags.includes('typescript') || tags.includes('ts')) return 'typescript';
    if (tags.includes('javascript') || tags.includes('js')) return 'javascript';
    if (tags.includes('python')) return 'python';
    if (tags.includes('go') || tags.includes('golang')) return 'go';

    // Check title
    if (title.includes('rust')) return 'rust';
    if (title.includes('c++') || title.includes('cpp')) return 'cpp';
    if (title.includes('typescript')) return 'typescript';
    if (title.includes('javascript')) return 'javascript';
    if (title.includes('python')) return 'python';

    return null;
}

/**
 * Generate exercises for multiple articles
 */
export async function generateExercises(
    articles: CuratedArticle[],
    batchSize: number = 3
): Promise<Exercise[]> {
    const exercises: Exercise[] = [];

    for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);
        const batchExercises = await Promise.all(
            batch.map(article => generateExercise(article))
        );

        exercises.push(...batchExercises.filter((ex): ex is Exercise => ex !== null));

        if (i + batchSize < articles.length) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    return exercises;
}

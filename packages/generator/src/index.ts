// src/index.ts
import { CuratedArticle } from '@actionable-newsletter/curator';
import { generateExercises } from './code-exercise';
import { generateRustProject, generateCppProject, generateTypeScriptProject } from './project-template';
import { generateAIChallengeProject, generateWeeklyChallenges, SAMPLE_AI_TOOLS } from './ai-challenge';
import { generateReflectionPrompts } from './reflection-prompt';
import { Exercise, ProjectTemplate, AIChallenge, ReflectionPrompt } from './types';

/**
 * Generate all action items for a set of curated articles.
 * Creates exercises, project templates, and reflection prompts.
 */
export async function generateActionItems(
    articles: CuratedArticle[],
    options: {
        includeExercises?: boolean;
        includeProjects?: boolean;
        includeReflections?: boolean;
    } = {}
): Promise<{
    exercises: Exercise[];
    projects: ProjectTemplate[];
    reflections: ReflectionPrompt[];
}> {
    const {
        includeExercises = true,
        includeProjects = false,
        includeReflections = true,
    } = options;

    console.log(`🎯 Generating action items for ${articles.length} articles...`);

    const results = {
        exercises: [] as Exercise[],
        projects: [] as ProjectTemplate[],
        reflections: [] as ReflectionPrompt[],
    };

    // Generate exercises for actionable articles
    if (includeExercises) {
        console.log('💻 Generating coding exercises...');
        const actionableArticles = articles.filter(a => a.actionable);
        if (actionableArticles.length > 0) {
            results.exercises = await generateExercises(actionableArticles);
            console.log(`✅ Generated ${results.exercises.length} exercises`);
        }
    }

    // Generate project templates (optional, more time-consuming)
    if (includeProjects) {
        console.log('📦 Generating project templates...');
        // Only generate for top 2-3 articles to save API calls
        const topArticles = articles.filter(a => a.actionable).slice(0, 3);
        for (const article of topArticles) {
            const rustTags = article.tags.some(t => t.toLowerCase().includes('rust'));
            const cppTags = article.tags.some(t => t.toLowerCase().includes('c++') || t.toLowerCase().includes('cpp'));

            if (rustTags) {
                const project = await generateRustProject(article);
                if (project) results.projects.push(project);
            } else if (cppTags) {
                const project = await generateCppProject(article);
                if (project) results.projects.push(project);
            }

            // Delay between projects
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        console.log(`✅ Generated ${results.projects.length} project templates`);
    }

    // Generate reflection prompts for philosophical content
    if (includeReflections) {
        console.log('🤔 Generating reflection prompts...');
        results.reflections = await generateReflectionPrompts(articles);
        console.log(`✅ Generated ${results.reflections.length} reflection prompts`);
    }

    console.log('✨ Action item generation complete!');
    return results;
}

// Re-export everything
export * from './types';
export * from './code-exercise';
export * from './project-template';
export * from './ai-challenge';
export * from './reflection-prompt';
export * from './rust-learning';
export { SAMPLE_AI_TOOLS };

// src/project-template.ts
import { CuratedArticle } from '@actionable-newsletter/curator';
import { callClaude } from '@actionable-newsletter/curator';
import { ProjectTemplate } from './types';

/**
 * Generate a starter project template from an article.
 * Creates a complete project structure with files, README, and setup instructions.
 */
export async function generateStarterProject(
    article: CuratedArticle,
    language: 'rust' | 'cpp' | 'typescript'
): Promise<ProjectTemplate | null> {
    const prompt = `You are a project scaffolding expert creating a starter template for a ${language} project.

Article:
Title: ${article.title}
Summary: ${article.summary}
Tags: ${article.tags.join(', ')}

Create a starter project that helps someone build something based on this article's concepts.

Return a JSON object:
{
  "repoName": "kebab-case-repo-name",
  "description": "One-line project description",
  "files": {
    "src/main.${language === 'rust' ? 'rs' : language === 'cpp' ? 'cpp' : 'ts'}": "Main file with TODOs",
    "README.md": "Project README with instructions",
    ${language === 'rust' ? '"Cargo.toml": "Cargo manifest"' : ''}
    ${language === 'cpp' ? '"CMakeLists.txt": "CMake configuration"' : ''}
    ${language === 'typescript' ? '"package.json": "Package manifest", "tsconfig.json": "TypeScript config"' : ''}
  },
  "setupInstructions": ["step1", "step2", "step3"],
  "successCriteria": ["criterion1", "criterion2"],
  "timeEstimate": 60
}

Guidelines:
- Include TODOs and comments in code files
- Make setup instructions clear and specific
- Success criteria should be testable
- Keep it focused on one key concept
- Time estimate: 30-120 minutes

Return ONLY valid JSON, no markdown.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 3000,
            temperature: 0.7,
        });

        const cleaned = response.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(cleaned);

        return {
            articleUrl: article.url,
            repoName: parsed.repoName,
            description: parsed.description,
            language,
            files: parsed.files || {},
            readme: parsed.files?.['README.md'] || generateDefaultReadme(parsed.repoName, parsed.description),
            setupInstructions: Array.isArray(parsed.setupInstructions) ? parsed.setupInstructions : [],
            successCriteria: Array.isArray(parsed.successCriteria) ? parsed.successCriteria : [],
            timeEstimate: parsed.timeEstimate || 60,
        };
    } catch (error) {
        console.error(`Error generating project template for "${article.title}":`, error);
        return null;
    }
}

/**
 * Generate a default README if none provided
 */
function generateDefaultReadme(repoName: string, description: string): string {
    return `# ${repoName}

${description}

## Setup

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/${repoName}.git
cd ${repoName}

# Follow setup instructions
\`\`\`

## Usage

TODO: Add usage instructions

## License

MIT
`;
}

/**
 * Generate Rust project template
 */
export async function generateRustProject(article: CuratedArticle): Promise<ProjectTemplate | null> {
    return generateStarterProject(article, 'rust');
}

/**
 * Generate C++ project template
 */
export async function generateCppProject(article: CuratedArticle): Promise<ProjectTemplate | null> {
    return generateStarterProject(article, 'cpp');
}

/**
 * Generate TypeScript project template
 */
export async function generateTypeScriptProject(article: CuratedArticle): Promise<ProjectTemplate | null> {
    return generateStarterProject(article, 'typescript');
}

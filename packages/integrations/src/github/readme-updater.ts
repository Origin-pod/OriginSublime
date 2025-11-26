// src/github/readme-updater.ts
import { getGitHubClient, parseRepoString } from './client';

/**
 * Update the main README with progress
 */
export async function updateMainReadme(currentDay: number, totalDays: number = 100): Promise<boolean> {
    try {
        const octokit = getGitHubClient();
        const repoString = process.env.GITHUB_REPO;

        if (!repoString) {
            console.warn('GITHUB_REPO not configured, skipping README update');
            return false;
        }

        const { owner, repo } = parseRepoString(repoString);
        const percentComplete = Math.round((currentDay / totalDays) * 100);
        const progressBar = generateProgressBar(currentDay, totalDays);

        const readmeContent = `# 100 Days of Building with AI 🚀

## Progress

**Day ${currentDay}/${totalDays}** (${percentComplete}% Complete)

${progressBar}

## About

This repository documents my journey through 100 days of building with different AI tools. Each day, I explore a new tool, build a practical project, and document my learnings.

## Structure

\`\`\`
challenges/
├── day-001-cursor/
│   └── README.md
├── day-002-github-copilot/
│   └── README.md
...
\`\`\`

## Tools Explored

<!-- Auto-generated list of tools -->

## Key Learnings

<!-- Add your key learnings here -->

## Resources

- [Original Challenge Spec](./docs/challenge-spec.md)
- [Daily Logs](./logs/)

---

**Last Updated:** ${new Date().toISOString().split('T')[0]}  
**Current Streak:** ${currentDay} days 🔥
`;

        // Get current README (if exists)
        let sha: string | undefined;
        try {
            const { data: fileData } = await octokit.repos.getContent({
                owner,
                repo,
                path: 'README.md',
            });
            if ('sha' in fileData) {
                sha = fileData.sha;
            }
        } catch (error) {
            // README doesn't exist yet
        }

        // Create or update README
        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: 'README.md',
            message: `📊 Update progress: Day ${currentDay}/${totalDays}`,
            content: Buffer.from(readmeContent).toString('base64'),
            sha,
        });

        console.log(`✅ Updated main README: Day ${currentDay}/${totalDays}`);
        return true;
    } catch (error) {
        console.error('❌ Failed to update main README:', error);
        return false;
    }
}

/**
 * Generate a visual progress bar
 */
function generateProgressBar(current: number, total: number, width: number = 50): string {
    const filled = Math.round((current / total) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
}

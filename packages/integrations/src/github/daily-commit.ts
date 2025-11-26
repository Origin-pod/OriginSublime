// src/github/daily-commit.ts
import { getGitHubClient, parseRepoString } from './client';
import { AIChallenge } from '@actionable-newsletter/generator';

/**
 * Commit today's AI challenge to GitHub
 */
export async function commitDailyChallenge(challenge: AIChallenge): Promise<string | null> {
    try {
        const octokit = getGitHubClient();
        const repoString = process.env.GITHUB_REPO;

        if (!repoString) {
            console.warn('GITHUB_REPO not configured, skipping commit');
            return null;
        }

        const { owner, repo } = parseRepoString(repoString);
        const folderPath = `challenges/day-${String(challenge.dayNumber).padStart(3, '0')}-${challenge.toolName.toLowerCase().replace(/\s+/g, '-')}`;

        // Create README for the challenge
        const readmeContent = `# Day ${challenge.dayNumber}/100: ${challenge.toolName}

## ${challenge.projectIdea}

**Category:** ${challenge.category}  
**Time Estimate:** ${challenge.timeEstimate} minutes

## Description

${challenge.description}

## Setup Instructions

${challenge.setupInstructions.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Success Criteria

${challenge.successCriteria.map(criterion => `- [ ] ${criterion}`).join('\n')}

## Notes

<!-- Add your notes, learnings, and reflections here -->

## Resources

<!-- Add links to documentation, tutorials, etc. -->

---

**Date:** ${new Date().toISOString().split('T')[0]}  
**Status:** Not Started
`;

        // Get the default branch
        const { data: repoData } = await octokit.repos.get({ owner, repo });
        const defaultBranch = repoData.default_branch;

        // Get the latest commit SHA
        const { data: refData } = await octokit.git.getRef({
            owner,
            repo,
            ref: `heads/${defaultBranch}`,
        });
        const latestCommitSha = refData.object.sha;

        // Create a blob for the README
        const { data: blobData } = await octokit.git.createBlob({
            owner,
            repo,
            content: Buffer.from(readmeContent).toString('base64'),
            encoding: 'base64',
        });

        // Get the tree
        const { data: baseTree } = await octokit.git.getTree({
            owner,
            repo,
            tree_sha: latestCommitSha,
        });

        // Create a new tree
        const { data: newTree } = await octokit.git.createTree({
            owner,
            repo,
            base_tree: baseTree.sha,
            tree: [
                {
                    path: `${folderPath}/README.md`,
                    mode: '100644',
                    type: 'blob',
                    sha: blobData.sha,
                },
            ],
        });

        // Create a commit
        const { data: newCommit } = await octokit.git.createCommit({
            owner,
            repo,
            message: `🎯 Day ${challenge.dayNumber}/100: ${challenge.toolName}\n\n${challenge.projectIdea}`,
            tree: newTree.sha,
            parents: [latestCommitSha],
        });

        // Update the reference
        await octokit.git.updateRef({
            owner,
            repo,
            ref: `heads/${defaultBranch}`,
            sha: newCommit.sha,
        });

        const commitUrl = `https://github.com/${owner}/${repo}/commit/${newCommit.sha}`;
        console.log(`✅ Committed challenge to GitHub: ${commitUrl}`);
        return commitUrl;
    } catch (error) {
        console.error(`❌ Failed to commit challenge to GitHub:`, error);
        return null;
    }
}

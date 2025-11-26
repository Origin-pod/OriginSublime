// src/github/client.ts
import { Octokit } from '@octokit/rest';

let octokitClient: Octokit | null = null;

export function getGitHubClient(): Octokit {
    if (!octokitClient) {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is required');
        }
        octokitClient = new Octokit({ auth: token });
    }
    return octokitClient;
}

export function isGitHubConfigured(): boolean {
    return !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

export function parseRepoString(repo: string): { owner: string; repo: string } {
    const [owner, repoName] = repo.split('/');
    return { owner, repo: repoName };
}

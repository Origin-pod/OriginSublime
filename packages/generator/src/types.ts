// src/types.ts
import { CuratedArticle } from '@actionable-newsletter/curator';

export enum ExerciseType {
    CODE_KATA = 'CODE_KATA',
    REFACTORING = 'REFACTORING',
    IMPLEMENTATION = 'IMPLEMENTATION',
    REFLECTION = 'REFLECTION',
    WRITING = 'WRITING',
    PROJECT = 'PROJECT',
}

export enum Difficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

export interface Exercise {
    articleUrl: string;
    type: ExerciseType;
    title: string;
    description: string;
    starterCode?: string;
    testCases?: string;
    hints?: string[];
    timeEstimate: number; // minutes
    difficulty: Difficulty;
    language?: string; // rust, cpp, typescript, etc.
}

export interface ProjectTemplate {
    articleUrl: string;
    repoName: string;
    description: string;
    language: string;
    files: Record<string, string>; // filename -> content
    readme: string;
    setupInstructions: string[];
    successCriteria: string[];
    timeEstimate: number;
}

export interface AIChallenge {
    toolName: string;
    dayNumber: number;
    projectIdea: string;
    description: string;
    setupInstructions: string[];
    successCriteria: string[];
    timeEstimate: number;
    category: string;
}

export interface ReflectionPrompt {
    articleUrl: string;
    prompts: string[];
    theme: string;
    suggestedFormat: string; // journal, essay, discussion
    timeEstimate: number;
}

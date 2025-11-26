import { callClaude } from '@actionable-newsletter/curator';
import { Exercise, ExerciseType, Difficulty } from './types';
import { RUST_CURRICULUM } from './rust-curriculum';

export async function generateRustLearningExercise(day: number): Promise<Exercise | null> {
    // Cycle through curriculum if day > length
    const lessonIndex = (day - 1) % RUST_CURRICULUM.length;
    const lesson = RUST_CURRICULUM[lessonIndex];

    console.log(`📚 Generating Rust Learning Exercise for Day ${day}: ${lesson.topic}`);

    const prompt = `Create a Rust coding exercise for a beginner learning "${lesson.topic}".
The user is following a daily learning path.
Resource to read first: ${lesson.resource}
Topic Description: ${lesson.description}

Requirements:
1. Create a "Code Kata" style exercise.
2. Provide a clear description of the task.
3. Provide starter code with // TODO comments.
4. Keep it focused on the topic.
5. Estimate time (e.g. 15-30 min).

Return a JSON object:
{
  "title": "Exercise Title",
  "description": "Task description... (mention the resource link here too)",
  "starterCode": "...",
  "timeEstimate": 20,
  "difficulty": "EASY"
}
Return ONLY valid JSON.`;

    try {
        const response = await callClaude(prompt, {
            maxTokens: 1000,
            temperature: 0.2,
        });

        const cleaned = response.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(cleaned);

        return {
            type: ExerciseType.CODE_KATA,
            title: `Day ${day}: ${parsed.title}`,
            description: `${parsed.description}\n\n**Read this first:** [${lesson.topic}](${lesson.resource})`,
            starterCode: parsed.starterCode,
            timeEstimate: parsed.timeEstimate || 20,
            difficulty: Difficulty.EASY,
            articleUrl: lesson.resource,
            language: 'rust'
        };
    } catch (error) {
        console.error('Failed to generate Rust learning exercise:', error);
        return null;
    }
}

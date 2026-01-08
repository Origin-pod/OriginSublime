import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Link, Hr } from '@react-email/components';

interface DailyDigestEmailProps {
    userName: string;
    articles: Array<{
        title: string;
        url: string;
        category: string;
        summary: string;
        timeToRead: number;
    }>;
    exercises: Array<{
        title: string;
        difficulty: string;
        timeEstimate: number;
    }>;
    challenge?: {
        name: string;
        dayNumber: number | null;
        description: string;
    };
    stats: {
        articlesRead: number;
        exercisesCompleted: number;
        currentStreak: number;
    };
}

export default function DailyDigestEmail({
    userName,
    articles,
    exercises,
    challenge,
    stats,
}: DailyDigestEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Text style={title}>Actionable Newsletter</Text>
                        <Text style={tagline}>Read Less. Build More.</Text>
                    </Section>

                    {/* Greeting */}
                    <Text style={greeting}>Hi {userName},</Text>
                    <Text style={paragraph}>
                        Here's your personalized digest for today. Let's turn reading into building.
                    </Text>

                    {/* Stats */}
                    <Section style={statsBox}>
                        <Text style={statsTitle}>Your Progress</Text>
                        <Text style={statsItem}>📖 {stats.articlesRead} articles read</Text>
                        <Text style={statsItem}>💻 {stats.exercisesCompleted} exercises completed</Text>
                        <Text style={statsItem}>🔥 {stats.currentStreak} day streak</Text>
                    </Section>

                    <Hr style={divider} />

                    {/* Today's Challenge */}
                    {challenge && (
                        <>
                            <Section style={challengeBox}>
                                <Text style={sectionTitle}>Today's Challenge</Text>
                                <Text style={challengeDay}>Day {challenge.dayNumber}/100</Text>
                                <Text style={challengeTitle}>{challenge.name}</Text>
                                <Text style={paragraph}>{challenge.description}</Text>
                            </Section>
                            <Hr style={divider} />
                        </>
                    )}

                    {/* Articles */}
                    <Section>
                        <Text style={sectionTitle}>Today's Articles ({articles.length})</Text>
                        {articles.map((article, i) => (
                            <Section key={i} style={articleBox}>
                                <Text style={articleCategory}>{article.category} • {article.timeToRead} min read</Text>
                                <Link href={article.url} style={articleTitle}>
                                    {article.title}
                                </Link>
                                <Text style={articleSummary}>{article.summary}</Text>
                            </Section>
                        ))}
                    </Section>

                    <Hr style={divider} />

                    {/* Exercises */}
                    {exercises.length > 0 && (
                        <Section>
                            <Text style={sectionTitle}>Recommended Exercises</Text>
                            {exercises.slice(0, 3).map((exercise, i) => (
                                <Section key={i} style={exerciseBox}>
                                    <Text style={exerciseTitle}>{exercise.title}</Text>
                                    <Text style={exerciseMeta}>{exercise.difficulty} • {exercise.timeEstimate} min</Text>
                                </Section>
                            ))}
                        </Section>
                    )}

                    <Hr style={divider} />

                    {/* Footer */}
                    <Text style={footer}>
                        <Link href="https://actionablenewsletter.com/dashboard" style={link}>
                            View Dashboard
                        </Link>
                        {' • '}
                        <Link href="https://action ablenewsletter.com/settings" style={link}>
                            Settings
                        </Link>
                    </Text>
                    <Text style={footerSmall}>
                        You're receiving this because you have email notifications enabled.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '600px',
};

const header = {
    textAlign: 'center' as const,
    borderBottom: '2px solid #000',
    paddingBottom: '20px',
    marginBottom: '30px',
};

const title = {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#000',
};

const tagline = {
    fontSize: '16px',
    margin: '0',
    color: '#666',
};

const greeting = {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 16px 0',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 16px 0',
    color: '#333',
};

const statsBox = {
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
    marginBottom: '24px',
};

const statsTitle = {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: '#fff',
};

const statsItem = {
    fontSize: '16px',
    margin: '8px 0',
    color: '#fff',
};

const divider = {
    borderColor: '#ddd',
    margin: '24px 0',
};

const challengeBox = {
    backgroundColor: '#000',
    color: '#fff',
    padding: '24px',
    marginBottom: '24px',
};

const challengeDay = {
    fontSize: '12px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#999',
};

const challengeTitle = {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 12px 0',
    color: '#fff',
};

const sectionTitle = {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    color: '#000',
};

const articleBox = {
    marginBottom: '20px',
    padding: '16px',
    border: '1px solid #ddd',
};

const articleCategory = {
    fontSize: '12px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#666',
    textTransform: 'uppercase' as const,
};

const articleTitle = {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#000',
    textDecoration: 'none',
    display: 'block',
};

const articleSummary = {
    fontSize: '14px',
    margin: '0',
    color: '#666',
    lineHeight: '20px',
};

const exerciseBox = {
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
};

const exerciseTitle = {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#000',
};

const exerciseMeta = {
    fontSize: '12px',
    margin: '0',
    color: '#666',
};

const footer = {
    textAlign: 'center' as const,
    fontSize: '14px',
    margin: '24px 0 8px 0',
    color: '#666',
};

const footerSmall = {
    textAlign: 'center' as const,
    fontSize: '12px',
    margin: '0',
    color: '#999',
};

const link = {
    color: '#000',
    textDecoration: 'underline',
};

import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Link, Button } from '@react-email/components';

interface WelcomeEmailProps {
    userName: string;
}

export default function WelcomeEmail({ userName }: WelcomeEmailProps) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={title}>Actionable Newsletter</Text>
                        <Text style={tagline}>Read Less. Build More.</Text>
                    </Section>

                    <Text style={greeting}>Welcome, {userName}! 👋</Text>

                    <Text style={paragraph}>
                        You've just joined a community of builders who turn reading into action.
                    </Text>

                    <Text style={paragraph}>
                        <strong>Here's what happens next:</strong>
                    </Text>

                    <Section style={stepBox}>
                        <Text style={stepNumber}>1.</Text>
                        <Text style={stepText}>
                            <strong>Daily AI curates</strong> the most actionable articles based on your interests
                        </Text>
                    </Section>

                    <Section style={stepBox}>
                        <Text style={stepNumber}>2.</Text>
                        <Text style={stepText}>
                            <strong>Every article becomes an exercise</strong> - concrete tasks you can build
                        </Text>
                    </Section>

                    <Section style={stepBox}>
                        <Text style={stepNumber}>3.</Text>
                        <Text style={stepText}>
                            <strong>Track your progress</strong> with streaks, completed exercises, and project milestones
                        </Text>
                    </Section>

                    <Section style={ctaBox}>
                        <Button style={button} href="https://actionablenewsletter.com/dashboard">
                            Go to Dashboard
                        </Button>
                    </Section>

                    <Text style={paragraph}>
                        Your first daily digest will arrive tomorrow. In the meantime, check out your dashboard to see personalized content.
                    </Text>

                    <Section style={philosophyBox}>
                        <Text style={philosophyTitle}>Our Philosophy</Text>
                        <Text style={philosophyText}>
                            "Ideas → Actions → Proof of Work"
                        </Text>
                        <Text style={paragraph}>
                            Every newsletter is a challenge. Every day is proof. Let's build.
                        </Text>
                    </Section>

                    <Text style={footer}>
                        <Link href="https://actionablenewsletter.com/settings" style={link}>
                            Manage your preferences
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

// Styles (same aesthetic as daily digest)
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
    fontSize: '24px',
    fontWeight: '600',
    margin: '30px 0 20px 0',
    textAlign: 'center' as const,
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 16px 0',
    color: '#333',
};

const stepBox = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
};

const stepNumber = {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 12px 0 0',
    color: '#000',
};

const stepText = {
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0',
    color: '#333',
    flex: '1',
};

const ctaBox = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#000',
    color: '#fff',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
};

const philosophyBox = {
    backgroundColor: '#000',
    color: '#fff',
    padding: '24px',
    margin: '32px 0',
    textAlign: 'center' as const,
};

const philosophyTitle = {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: '#999',
    textTransform: 'uppercase' as const,
};

const philosophyText = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    color: '#fff',
};

const footer = {
    textAlign: 'center' as const,
    fontSize: '14px',
    margin: '32px 0 0 0',
    color: '#666',
};

const link = {
    color: '#000',
    textDecoration: 'underline',
};

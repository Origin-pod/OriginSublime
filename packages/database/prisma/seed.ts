// prisma/seed.ts
import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Topic Mappings
  const topics = [
    {
      slug: 'rust',
      name: 'Rust Programming',
      category: Category.RUST,
      icon: '🦀',
      description: 'Systems programming language focused on safety and performance',
    },
    {
      slug: 'cpp',
      name: 'C++',
      category: Category.CPP,
      icon: '⚡',
      description: 'High-performance programming language',
    },
    {
      slug: 'ai',
      name: 'AI & Machine Learning',
      category: Category.AI_ML,
      icon: '🤖',
      description: 'Artificial intelligence, ML, and deep learning',
    },
    {
      slug: 'philosophy',
      name: 'Philosophy',
      category: Category.PHILOSOPHY,
      icon: '🧠',
      description: 'Critical thinking and philosophical concepts',
    },
    {
      slug: 'poetry',
      name: 'Poetry & Literature',
      category: Category.POETRY,
      icon: '📖',
      description: 'Creative writing and literary arts',
    },
    {
      slug: 'self-help',
      name: 'Personal Development',
      category: Category.SELF_HELP,
      icon: '🌱',
      description: 'Self-improvement and productivity',
    },
    {
      slug: 'general-tech',
      name: 'General Tech',
      category: Category.GENERAL_TECH,
      icon: '💻',
      description: 'General technology and software development',
    },
  ];

  console.log('Creating topic mappings...');
  for (const topic of topics) {
    await prisma.topicMapping.upsert({
      where: { slug: topic.slug },
      update: topic,
      create: topic,
    });
    console.log(`  ✓ ${topic.name}`);
  }

  console.log('\n✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

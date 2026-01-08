# User Onboarding & Dashboard Implementation Plan (Initial Draft - ARCHIVED)

## 🎯 **Objective**

Build a complete user-facing web application with:
1. **User Onboarding Flow** - Capture interests and preferences
2. **User Dashboard** - View newsletter dispatches and summaries
3. **Dynamic Learning Materials** - Remove hardcoded Rust/C++/AI topics
4. **User Management** - Authentication and personalization

---

## 📐 **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Marketing   │  │  Onboarding  │  │  Dashboard   │      │
│  │     Page     │─▶│     Flow     │─▶│   (Main      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                         │                    │               │
│                    Captures User         Displays           │
│                    Preferences           Personalized        │
│                                          Content             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Fastify API)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    User      │  │  Newsletter  │  │   Content    │      │
│  │     API      │  │   Dispatch   │  │  Generator   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 DATABASE (PostgreSQL + Prisma)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │   Articles   │  │  Exercises   │      │
│  │  (prefs,     │  │  (scraped,   │  │  (generated  │      │
│  │   topics)    │  │   curated)   │  │   for user)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ **Database Schema** (Prisma)

### **Core Tables**

```prisma
// User Management
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Preferences
  preferences   UserPreferences?
  subscriptions UserSubscription[]
  activities    UserActivity[]
}

model UserPreferences {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  
  // Dynamic Interests (JSON array)
  topics      Json     // ["rust", "cpp", "ai", "design", "philosophy"]
  weights     Json     // {"rust": 90, "cpp": 70, "ai": 80, "design": 60}
  
  // Experience Level
  level       String   // "beginner", "intermediate", "advanced"
  
  // Frequency
  dailyLimit  Int      @default(5)  // Number of articles per day
  
  // Notification Settings
  email       Boolean  @default(true)
  notion      Boolean  @default(true)
  github      Boolean  @default(false)
  
  updatedAt   DateTime @updatedAt
}

// Topic Categories (Dynamic)
model Topic {
  id          String   @id @default(cuid())
  slug        String   @unique  // "rust", "cpp", "ai", "design"
  name        String              // "Rust Programming"
  description String?
  category    String              // "programming", "design", "philosophy"
  icon        String?
  
  sources     TopicSource[]       // Associated RSS/scraping sources
  articles    ArticleTopic[]
}

model TopicSource {
  id          String   @id @default(cuid())
  topicId     String
  topic       Topic    @relation(fields: [topicId], references: [id])
  
  type        String   // "hackernews", "reddit", "rss", "github"
  url         String
  config      Json?    // Source-specific config
  active      Boolean  @default(true)
}

// Articles
model Article {
  id          String   @id @default(cuid())
  url         String   @unique
  title       String
  description String?
  publishedAt DateTime?
  scrapedAt   DateTime @default(now())
  
  // AI Curation
  score       Int?     // 0-100
  summary     String?
  tags        Json?
  actionable  Boolean  @default(false)
  
  topics      ArticleTopic[]
  exercises   Exercise[]
  
  @@index([scrapedAt])
  @@index([score])
}

model ArticleTopic {
  articleId   String
  topicId     String
  article     Article  @relation(fields: [articleId], references: [id])
  topic       Topic    @relation(fields: [topicId], references: [id])
  relevance   Int      // 0-100
  
  @@id([articleId, topicId])
}

// Generated Content
model Exercise {
  id          String   @id @default(cuid())
  articleId   String
  article     Article  @relation(fields: [articleId], references: [id])
  
  language    String   // "rust", "cpp", "typescript"
  difficulty  String   // "easy", "medium", "hard"
  title       String
  description String
  starterCode String?
  tests       String?
  hints       Json?
  
  createdAt   DateTime @default(now())
}

model Project {
  id          String   @id @default(cuid())
  topicId     String?
  
  title       String
  description String
  difficulty  String
  estimatedTime Int?   // minutes
  
  scaffold    Json     // Full project structure
  readme      String?
  
  createdAt   DateTime @default(now())
}

model Challenge {
  id          String   @id @default(cuid())
  day         Int      @unique
  title       String
  description String
  tool        String   // "cursor", "copilot", "claude", "v0"
  deliverable String
  
  createdAt   DateTime @default(now())
}

// User Activity
model UserActivity {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  type        String   // "article_read", "exercise_started", "exercise_completed"
  entityId    String   // Article/Exercise ID
  metadata    Json?
  
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
}

model UserSubscription {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  status      String   // "active", "paused", "cancelled"
  plan        String   @default("free")
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🎨 **Frontend Architecture** (Next.js App Router)

### **Project Structure**

```
apps/web/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Marketing landing page
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── onboarding/
│   │   ├── page.tsx              # Step 1: Welcome
│   │   ├── topics/page.tsx       # Step 2: Select Topics
│   │   ├── preferences/page.tsx  # Step 3: Preferences
│   │   └── complete/page.tsx     # Step 4: Setup Complete
│   ├── dashboard/
│   │   ├── page.tsx              # Main Dashboard
│   │   ├── articles/page.tsx     # Article List
│   │   ├── exercises/page.tsx    # Exercise List
│   │   ├── challenges/page.tsx   # AI Challenges
│   │   └── settings/page.tsx     # User Settings
│   └── api/
│       └── [...route]/route.ts   # API routes
├── components/
│   ├── onboarding/
│   │   ├── TopicSelector.tsx
│   │   ├── PreferenceForm.tsx
│   │   └── ProgressSteps.tsx
│   ├── dashboard/
│   │   ├── ArticleCard.tsx
│   │   ├── ExerciseCard.tsx
│   │   ├── StatsWidget.tsx
│   │   └── NewsletterPreview.tsx
│   └── ui/              # Shadcn/UI components
└── lib/
    ├── api.ts           # API client
    └── types.ts         # TypeScript types
```

---

## 🔧 **Backend API Extensions** (Fastify)

### **New Endpoints**

```typescript
// User Management
POST   /api/users              // Create user
GET    /api/users/:id          // Get user
PUT    /api/users/:id          // Update user
GET    /api/users/:id/preferences  // Get preferences
PUT    /api/users/:id/preferences  // Update preferences

// Topics (Dynamic)
GET    /api/topics              // List all topics
POST   /api/topics              // Create topic (admin)
GET    /api/topics/:slug        // Get topic details

// Personalized Content
GET    /api/users/:id/articles  // Get user's curated articles
GET    /api/users/:id/exercises // Get user's exercises
GET    /api/users/:id/feed      // Get daily feed

// Newsletter Dispatch
GET    /api/users/:id/newsletter/latest  // Latest newsletter
GET    /api/users/:id/newsletter/history // Past newsletters
POST   /api/users/:id/newsletter/send    // Trigger send

// Analytics
GET    /api/users/:id/stats     // User stats (articles read, exercises completed)
GET    /api/users/:id/activity  // Activity log
```

---

## 🚀 **Implementation Phases**

### **Phase 1: Database Setup** (Week 1)

- [ ] Update Prisma schema with new models
- [ ] Create migrations
- [ ] Seed database with initial topics
- [ ] Create topic management scripts

### **Phase 2: Backend API** (Week 1-2)

- [ ] Implement user CRUD endpoints
- [ ] Implement preferences endpoints
- [ ] Implement topic endpoints
- [ ] Update scraper to use dynamic topics
- [ ] Update curator to use user preferences
- [ ] Create personalized feed endpoint

### **Phase 3: Onboarding Flow** (Week 2)

- [ ] Create Next.js app
- [ ] Design onboarding UI (4 steps)
- [ ] Implement topic selector component
- [ ] Implement preference form
- [ ] Connect to API

### **Phase 4: Dashboard** (Week 3)

- [ ] Design dashboard layout
- [ ] Implement article list with filters
- [ ] Implement exercise cards
- [ ] Implement stats widgets
- [ ] Create newsletter preview

### **Phase 5: Personalization Engine** (Week 3-4)

- [ ] Update curator to score by user preferences
- [ ] Implement user activity tracking
- [ ] Create recommendation algorithm
- [ ] Auto-adjust topic weights based on usage

---

## 🎯 **Onboarding Flow (UX)**

### **Step 1: Welcome**
```
┌─────────────────────────────────────┐
│  Welcome to Actionable Newsletter   │
│                                     │
│  Turn reading into building.        │
│                                     │
│  [Get Started] →                    │
└─────────────────────────────────────┘
```

### **Step 2: Select Your Topics**
```
┌─────────────────────────────────────┐
│  What do you want to learn?         │
│                                     │
│  Programming:                       │
│  ☑ Rust    ☑ C++    ☑ TypeScript   │
│  ☐ Go      ☐ Python ☐ Zig          │
│                                     │
│  Other:                             │
│  ☑ AI/ML   ☐ Design ☐ Philosophy   │
│                                     │
│  [Back]  [Continue] →               │
└─────────────────────────────────────┘
```

### **Step 3: Set Preferences**
```
┌─────────────────────────────────────┐
│  Customize your experience          │
│                                     │
│  Experience Level:                  │
│  ○ Beginner  ● Intermediate  ○ Advanced
│                                     │
│  Daily Content:                     │
│  [5] articles per day               │
│                                     │
│  Notifications:                     │
│  ☑ Email  ☑ Notion  ☐ GitHub       │
│                                     │
│  [Back]  [Complete Setup] →         │
└─────────────────────────────────────┘
```

### **Step 4: All Set!**
```
┌─────────────────────────────────────┐
│  🎉 You're all set!                 │
│                                     │
│  Your first newsletter will arrive  │
│  tomorrow at 6 AM UTC.              │
│                                     │
│  [Go to Dashboard] →                │
└─────────────────────────────────────┘
```

---

## 📊 **Dashboard Layout**

```
┌──────────────────────────────────────────────────────┐
│  Actionable Newsletter             [Settings] [Logout]│
├──────────────────────────────────────────────────────┤
│                                                      │
│  Stats                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ 42 📖   │ │ 18 💻   │ │ 7 🚀    │ │ 5 🔥    │  │
│  │ Articles│ │Exercise │ │Projects │ │ Streak  │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│                                                      │
│  Today's  Feed (Jan 8, 2026)                        │
│  ┌────────────────────────────────────────────────┐ │
│  │ 🦀 Rust: "Zero-Copy Parsing in Rust"          │ │
│  │ Score: 92 | 5 min read | 💻 Exercise Available│ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │ 🤖 AI: "Fine-tuning LLMs with LoRA"           │ │
│  │ Score: 88 | 8 min read | 🚀  Project Available│ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Today's AI Challenge (#42/100)                     │
│  ┌────────────────────────────────────────────────┐ │
│  │ Build a CLI tool with Cursor AI                │ │
│  │ Estimated: 60 min | Tool: Cursor               │ │
│  │ [Start Challenge] →                            │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 **Dynamic Topic Management**

### **How to Add New Topics (No Code Changes)**

#### **Option 1: Admin Dashboard**
```
POST /api/topics
{
  "slug": "zig",
  "name": "Zig Programming",
  "category": "programming",
  "sources": [
    { "type": "reddit", "url": "r/zig" },
    { "type": "rss", "url": "https://ziglang.org/feed.xml" }
  ]
}
```

#### **Option 2: Database Seed Script**
```typescript
// scripts/add-topic.ts
await prisma.topic.create({
  data: {
    slug: 'philosophy',
    name: 'Philosophy',
    category: 'humanities',
    sources: {
      create: [
        { type: 'rss', url: 'https://plato.stanford.edu/rss/sep.xml' }
      ]
    }
  }
});
```

---

## 💡 **Key Features**

### **1. Personalized Scoring**
```typescript
// Curator now uses user preferences
function scoreArticle(article: Article, user: User): number {
  const userTopics = user.preferences.topics;
  const weights = user.preferences.weights;
  
  let totalScore = 0;
  for (const topic of userTopics) {
    if (article.topics.includes(topic)) {
      totalScore += weights[topic] * article.baseScore;
    }
  }
  
  return Math.min(100, totalScore / userTopics.length);
}
```

### **2. Newsletter Dispatch**
```typescript
// Generate personalized newsletter for each user
async function generateUserNewsletter(userId: string) {
  const user = await getUser(userId);
  const articles = await getPersonalizedArticles(user);
  const exercises = await getPersonalizedExercises(user);
  const challenge = await getTodayChallenge();
  
  return {
    user,
    articles: articles.slice(0, user.preferences.dailyLimit),
    exercises,
    challenge
  };
}
```

### **3. Activity Tracking**
```typescript
// Track what users engage with
await prisma.userActivity.create({
  data: {
    userId: user.id,
    type: 'article_read',
    entityId: article.id,
    metadata: {
      timeSpent: 180, // seconds
      completed: true
    }
  }
});

// Auto-adjust preferences
// If user reads 10 Rust articles, increase Rust weight
```

---

## 📦 **Tech Stack Additions**

**Frontend:**
- Next.js 14 (App Router)
- Tailwind CSS + Shadcn/UI
- React Hook Form + Zod
- TanStack Query
- Zustand (state management)

**Backend:**
- Existing Fastify API (extend)
- JWT authentication (fastify-jwt)
- Rate limiting (fastify-rate-limit)

**Database:**
- PostgreSQL (already planned)
- Prisma ORM (already setup)

---

## 🚀 **Next Steps**

1. **Review this plan** - Approve architecture
2. **Set up database** - Run Prisma migrations
3. **Create Next.js app** - Initialize in `apps/web`
4. **Build onboarding** - 4-step flow
5. **Build dashboard** - Main user interface

**Ready to start implementation?**

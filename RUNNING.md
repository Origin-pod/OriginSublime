# 🚀 How to Run the Actionable Newsletter System

This guide covers all possible ways to run the system, from a minimal test to a full production deployment.

---

## 📋 **Configuration Levels**

### **Level 1: Minimal (Scraping Only)**
*Requires: Node.js, pnpm*
*Features: Scrapes content from HN, Reddit, GitHub*
*Missing: AI summaries, exercises, integrations*

### **Level 2: Standard (Core AI Features)**
*Requires: `ANTHROPIC_API_KEY`*
*Features: Scraping + AI Curation + Exercise Generation*
*Missing: Notion/GitHub sync*

### **Level 3: Full (Integrations)**
*Requires: `ANTHROPIC_API_KEY`, `NOTION_API_KEY`, `GITHUB_TOKEN`*
*Features: Everything + Notion Sync + GitHub Portfolio*

---

## 🛠️ **1. Initial Setup**

Run this once to install dependencies and build the project.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

---

## 🧪 **2. Testing Commands**

Run these to verify specific parts of the system.

### **Scraper Test (Level 1)**
Verifies that the system can fetch articles.
```bash
pnpm scrape:test
```

### **Curator Test (Level 2)**
Verifies that Claude AI can score and summarize articles.
```bash
pnpm curate:test
```

### **Generator Test (Level 2)**
Verifies that the system can create coding exercises and projects.
```bash
pnpm generate:test
```

---

## 💻 **3. Development Mode**

Run the system locally with "watch mode" (auto-restarts on file changes).

### **Start the API Server**
Runs the REST API at `http://localhost:3000`.
```bash
pnpm api:dev
```

### **Start the Scheduler**
Runs the cron jobs (6 AM / 7 AM UTC).
```bash
pnpm scheduler:dev
```

---

## 🏭 **4. Production Mode**

Run the system in a production environment (optimized, no watch mode).

```bash
# 1. Build everything
pnpm build

# 2. Start API
pnpm api:start

# 3. Start Scheduler
pnpm scheduler:start
```

---

## 🎮 **5. Manual Triggers**

Force the system to run immediate jobs without waiting for the schedule.

### **Trigger Daily Pipeline**
Scrapes -> Curates -> Generates -> Syncs to Notion.
```bash
pnpm trigger:scrape
```

### **Trigger Daily Challenge**
Generates AI Challenge -> Syncs to Notion -> Commits to GitHub.
```bash
pnpm trigger:challenge
```

---

## ⚙️ **Configuration Reference (.env)**

Create a `.env` file in the root directory:

```bash
# --- Level 2: Standard Setup ---
ANTHROPIC_API_KEY="sk-ant-..."

# --- Level 3: Notion Integration ---
NOTION_API_KEY="secret_..."
NOTION_DAILY_DIGEST_DB="<database_id>"
NOTION_AI_CHALLENGE_DB="<database_id>"

# --- Level 3: GitHub Integration ---
GITHUB_TOKEN="ghp_..."
GITHUB_REPO="username/100-days-of-ai"

# --- System Settings ---
PORT=3000
LOG_LEVEL="info"
```

---

## 🐳 **Docker (Optional)**

If you want to containerize the app:

```bash
# Build the image
docker build -t actionable-newsletter .

# Run the container
docker run -p 3000:3000 --env-file .env actionable-newsletter
```

---

**Made with 💙 by Antigravity**

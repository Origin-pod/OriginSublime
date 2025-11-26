# Phase 2 Revision: Equal Representation

## Overview
We have shifted the curation strategy from "Weighted Relevance" to "Equal Domain Representation".
The newsletter now guarantees coverage of 6 core domains, selecting the **Top 1** article for each.

## Domains
1.  **Rust** (Systems Programming)
2.  **C++** (Systems Programming)
3.  **AI** (Artificial Intelligence / ML)
4.  **Philosophy** (Stoicism, Ethics, Thinking)
5.  **Poetry** (Art, Expression)
6.  **Self-Help** (Productivity, Habits)
7.  **Meta Skills** (Learning to Learn, Soft Skills, Mental Models)

## Changes Implemented

### 1. Scraper
- Added RSS feeds for non-tech domains:
  - **Philosophy**: Daily Philosophy
  - **Poetry**: Poetry Daily, LitHub
  - **Self-Help**: Zen Habits
  - **Meta Skills**: Farnam Street, James Clear, Scott H Young
  - **AI**: OpenAI Blog
  - **Rust**: This Week in Rust
  - **C++**: ISO C++

### 2. Curator
- **Scoring**: Now classifies articles into one of the 6 domains + scores quality (0-100).
- **Selection**: Groups articles by domain and selects the single highest-scoring article for each.
- **Output**: Returns a balanced mix of 6 articles (if candidates exist).

### 3. Database
- Articles are now saved with their specific `category` instead of generic tags.

### 4. Generator
- **Rust Learning Path**: Added a daily incremental Rust exercise generator.
  - Follows a structured curriculum (Variables -> Structs -> Ownership -> etc.).
  - Tracks progress based on the start date (Nov 25, 2025).
  - Includes a specific resource link (The Rust Book) for each exercise.

## Result
The daily newsletter will now be a diverse mix of technical and non-technical content, fostering a well-rounded "Builder/Thinker" mindset.
It also serves as a structured Rust learning course.

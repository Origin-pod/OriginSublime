# Phase 2 Revision: Equal Category Representation

## Objective
Shift from a "weighted relevance" model to a "diversity quota" model.
**Goal:** Ensure the newsletter includes **1-2 articles maximum** for EACH of the 6 core categories (Rust, C++, AI, Philosophy, Poetry, Self-Help), treating them all as equally important.

## Estimated Changes

### 1. Data Structures (`packages/curator/src/types.ts`)
- **Remove/Deprecate Weights:** `UserPreferences` no longer needs specific weights (e.g., `rustWeight`). All categories are effectively weight `100`.
- **Add Category Enum:** Ensure `Category` enum matches the database schema and is available in the curator.

### 2. Scoring & Classification (`packages/curator/src/scorer.ts`)
- **Combined Prompt:** Modify the AI prompt to perform two tasks at once to save tokens/cost:
  1.  **Classify:** Assign the article to one of the 6 buckets (or "General/Other").
  2.  **Score:** Rate the *quality* and *actionability* of the content (0-100), rather than "relevance to user profile".
- **Return Type:** Change `scoreRelevance` to return `{ score: number, category: string }` instead of just `number`.

### 3. Selection Logic (`packages/curator/src/index.ts`)
- **Refactor `curateArticles`:**
  - **Old Logic:** Sort all by score -> Take top N.
  - **New Logic:**
    1.  Group scored articles by `Category`.
    2.  For each Category:
        - Sort by Score (descending).
        - Take top **2** articles.
    3.  Flatten the list.
    4.  (Optional) Fill remaining spots with "General/Other" if specific categories are empty, or just return what we found.

### 4. Database Schema (`packages/database`)
- **Update `UserPreference`:** We can simplify the model by removing the weight columns (`rustWeight`, etc.) or just ignoring them.
- **Update `Article`:** Ensure the `category` field is populated correctly during the save step.

### 5. Scheduler (`apps/scheduler`)
- **Update Job:** Pass a simplified preference object (or none) to the curator.

### 6. Scraper (`packages/scraper`)
- **Add Missing Sources:** Currently, the scraper only targets Tech (Rust/C++/HN). To fulfill the quota for Philosophy, Poetry, and Self-Help, we **must** add sources for them.
  - Add `scrapeReddit('philosophy')`
  - Add `scrapeReddit('Poetry')`
  - Add `scrapeReddit('selfimprovement')`
  - **Better:** Add RSS feeds for these topics in `rss-feeds.ts` (e.g., Daily Stoic, Poetry Foundation) as they are more reliable than Reddit.
- **Update `scrapeAll`:** Include these new sources in the parallel execution.

## Potential Challenges
1.  **Empty Categories:** If the scraper doesn't find any "Poetry" or "Philosophy" articles on a given day, those sections will be empty.
    - *Mitigation:* Add specific sources for these niche topics to the scraper (as planned above).
2.  **Misclassification:** AI might struggle to categorize ambiguous articles (e.g., a "Philosophy of AI" article).
    - *Solution:* Allow the AI to pick the "Primary" category.
3.  **Quality vs. Diversity:** We might discard a great Rust article (3rd best) to include a mediocre Self-Help article (1st best). This is the intended trade-off for diversity.

## Implementation Steps
1.  **Modify `scorer.ts`** to return category + score.
2.  **Update `curateArticles`** to implement the "Group & Limit" logic.
3.  **Test** with the manual trigger to verify the output mix.

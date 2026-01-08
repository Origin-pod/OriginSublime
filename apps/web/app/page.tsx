import './marketing.css';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="container">
          <h1 className="hero-headline">
            Read Less.<br />
            Build More.
          </h1>
          <p className="hero-subheadline">
            Your daily feed of tech ideas, transformed into exercises, projects, and proof of work—automatically.
          </p>
          <p className="hero-positioning">
            The AI-powered execution engine that turns passive reading into active building.
          </p>
          <Link href="/signup" className="cta-button">
            → Turn Reading into Building
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem" id="problem">
        <div className="container">
          <h2>You're drowning in content, starving for execution.</h2>

          <div className="problem-content">
            <p>
              You subscribe to 5 newsletters. Bookmark 50 articles a week. Save every interesting project you find.
            </p>

            <p>
              But building? That's always "tomorrow."
            </p>

            <p className="truth-statement">
              The gap between reading and doing isn't motivation. It's translation.
            </p>

            <p className="closing-statement">
              You need a system that turns ideas into actions for you.
            </p>
          </div>
        </div>
      </section>

      {/* Insight Section */}
      <section className="insight" id="insight">
        <div className="container">
          <h2>Most curation stops at insight. That's the problem.</h2>

          <div className="insight-content">
            <p>
              Traditional newsletters curate ideas. We curate <em>execution opportunities</em>.
            </p>

            <p>
              Every article becomes a starter template. Every concept becomes a coding exercise.
              Every interesting tool becomes a project you can ship in 60 minutes.
            </p>

            <p className="final-insight">
              Reading shouldn't end at the last paragraph. It should start at <code>git init</code>.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-intro">
            From noise to action in <strong>4 automated steps</strong>
          </p>

          <div className="pipeline">
            <div className="pipeline-step">
              <h3>01 / Scrape</h3>
              <p>We pull from Hacker News, Reddit, GitHub Trending, and RSS feeds daily.</p>
              <ul>
                <li>50-100 articles/day</li>
                <li>Auto-deduplicated</li>
                <li>Domain filtering</li>
              </ul>
            </div>

            <div className="pipeline-step">
              <h3>02 / Curate</h3>
              <p>Claude 3.5 Sonnet scores based on your preferences and actionability.</p>
              <ul>
                <li>Relevance scoring (0-100)</li>
                <li>Summarized for builders</li>
                <li>Tags auto-generated</li>
              </ul>
            </div>

            <div className="pipeline-step">
              <h3>03 / Generate</h3>
              <p>Every article becomes hands-on work.</p>
              <ul>
                <li>Coding exercises</li>
                <li>Project templates</li>
                <li>Daily AI challenges</li>
              </ul>
            </div>

            <div className="pipeline-step">
              <h3>04 / Deliver</h3>
              <p>Synced to your workflow every morning.</p>
              <ul>
                <li>Email digest</li>
                <li>Notion database</li>
                <li>GitHub commits</li>
              </ul>
            </div>
          </div>

          <p className="pipeline-result">
            You wake up to a personalized learning lab, not another reading list.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="what-you-get" id="what">
        <div className="container">
          <h2>What You Get</h2>

          <div className="features-grid">
            <div className="feature">
              <h3>Daily Builder's Toolkit</h3>
              <p>5 curated articles with exercises, starter code, and test cases.</p>
            </div>

            <div className="feature">
              <h3>Project Templates</h3>
              <p>Complete scaffolding (Rust, C++, TypeScript) with build configs.</p>
            </div>

            <div className="feature">
              <h3>60-Minute Challenges</h3>
              <p>Daily AI tool challenges with specific deliverables.</p>
            </div>

            <div className="feature">
              <h3>Notion Integration</h3>
              <p>Auto-synced database of articles, exercises, and progress tracking.</p>
            </div>

            <div className="feature">
              <h3>GitHub Automation</h3>
              <p>Daily commits to your 100 Days repo with progress updates.</p>
            </div>

            <div className="feature">
              <h3>Smart Personalization</h3>
              <p>Learns from your topics, skill level, and completion patterns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* A Day With the System */}
      <section className="day-with-system" id="day">
        <div className="container">
          <h2>A Day With the System</h2>

          <div className="timeline">
            <div className="timeline-item">
              <div className="time">6:00 AM</div>
              <div className="narrative">
                <p>
                  Wake up. Check email. Your daily digest is waiting: 5 articles on Rust macros,
                  async patterns, and AI tooling—scored and summarized specifically for <em>you</em>.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="time">8:30 AM</div>
              <div className="narrative">
                <p>
                  Open Notion. Today's exercise: implement a custom derive macro. Starter code is there.
                  Test cases written. You just build.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="time">9:00 PM</div>
              <div className="narrative">
                <p>
                  Check GitHub. Your 100 Days repo updated automatically. Day 42/100.
                  Progress bar shows 42% complete. Commit streak: 42 days.
                </p>
              </div>
            </div>
          </div>

          <p className="day-conclusion">
            You didn't curate. You didn't plan. You just showed up and built.
          </p>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="who-for" id="who">
        <div className="container">
          <h2>Who This Is For</h2>

          <div className="who-for-grid">
            <div className="for-column">
              <h3>This is for you if:</h3>
              <ul>
                <li>You read to build, not just to know</li>
                <li>You want proof of work, not just vibes</li>
                <li>You're tired of tutorials without practice</li>
                <li>You ship daily, or want to</li>
              </ul>
            </div>

            <div className="not-for-column">
              <h3>This is NOT for you if:</h3>
              <ul>
                <li>You prefer passive consumption</li>
                <li>You don't code or prototype</li>
                <li>You're looking for general news</li>
                <li>You want fully polished products</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="philosophy" id="philosophy">
        <div className="container">
          <h2>Our Philosophy</h2>

          <div className="manifesto">
            <p>Ideas → Actions → Proof of Work</p>
            <hr />
            <p>Reading is the input. Building is the output. Everything else is noise.</p>
            <hr />
            <p>Every newsletter is a challenge. Every day is proof. Let's build.</p>
          </div>
        </div>
      </section>

      {/* Tech Credibility */}
      <section className="tech" id="tech">
        <div className="container">
          <h2>Built by Builders, for Builders</h2>

          <div className="tech-content">
            <p className="stack">
              Node.js • TypeScript • Claude 3.5 Sonnet • Fastify • PostgreSQL • Notion API • GitHub API
            </p>
            <p>
              This isn't theory. It's a production system processing 50-100 articles daily,
              generating executable code, and shipping updates automatically.
            </p>
            <p>
              The same system that curates your content was built with the same philosophy:
              automation over repetition, execution over curation.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta" id="cta">
        <div className="container">
          <h2>Stop reading. Start building.</h2>

          <div className="cta-content">
            <p className="time-to-execute">Now it's time to execute.</p>

            <Link href="/signup" className="cta-button primary">
              → Begin Building Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>Built by a developer, for developers. Simple. Reliable. Execution-first.</p>
        </div>
      </footer>
    </>
  );
}

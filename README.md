![banner](./banner.svg)

# readme-surgeon

> Brutal README feedback + auto-fix.

[![npm version](https://img.shields.io/npm/v/readme-surgeon?color=%2367E8F9&label=npm)](https://www.npmjs.com/package/readme-surgeon)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/NickCirv/readme-surgeon?style=flat)](https://github.com/NickCirv/readme-surgeon/stargazers)

---

## The Problem

Your README is the first thing developers see. And it's terrible. You know it. We know it. readme-surgeon gives you a score card, roasts what's wrong line by line, and hands you an improved version. Powered by Claude.

---

## Quick Start

```bash
export ANTHROPIC_API_KEY=sk-ant-...

# Roast a GitHub repo
npx readme-surgeon https://github.com/user/repo

# Roast a local file
npx readme-surgeon ./README.md

# Fix it in place
npx readme-surgeon --fix ./README.md
```

---

## Example Output

```
  ┌─────────────────────────────────────────┐
  │         README SURGEON — REPORT CARD    │
  └─────────────────────────────────────────┘

  First Impression    ████████████████░░░░  16/20
  Quick Start         ████████░░░░░░░░░░░░   8/20
  Completeness        ████████████░░░░░░░░  12/20
  Visual Appeal       ██████░░░░░░░░░░░░░░   6/20
  Honesty             ████████████████████  20/20

  ─────────────────────────────────────────
  TOTAL               ██████████░░░░░░░░░░  62/100

  Grade: D

  ─────────────────────────────────────────
  Issues:

  1. No quick start. I don't know what this does in 10 seconds.
  2. Install section buried after 300 words of philosophy.
  3. No badges. Is this even published? Is it alive?
  4. "powerful", "seamless", "cutting-edge" — meaningless buzzwords × 3.
  5. No example output. You expect me to install something I've never seen work?

  ─────────────────────────────────────────
  Improved README printed below.
```

---

## Features

- Scores any README across 5 categories (0–100 total)
- Specific, numbered feedback — not vague suggestions
- Claude rewrites the README fixing every identified issue
- Two decoupled AI calls: analysis and rewrite don't influence each other
- Works on GitHub URLs or local files
- `--fix` flag overwrites your local file with the improved version
- `--json` flag for CI pipelines and automated checks
- `--score` flag for a fast check without the full rewrite

---

## Scoring Rubric

| Category | Max | What earns points |
|---|---|---|
| First Impression | 20 | Hook, clarity, purpose in 5 seconds |
| Quick Start | 20 | Install + working example in under 60 seconds |
| Completeness | 20 | Features, API, contributing, license |
| Visual Appeal | 20 | Badges, code blocks, formatting, screenshots |
| Honesty | 20 | No buzzwords, realistic expectations |

---

## How It Works

1. **Fetch** — reads the README from a GitHub URL (via raw content API) or local path
2. **Score** — sends it to Claude with a structured rubric; parses the JSON score + feedback bullets
3. **Improve** — second Claude call rewrites the README fixing every identified issue
4. **Output** — renders a chalk score card, feedback list, and the improved markdown

---

## Usage

```bash
# Roast a GitHub repo README
npx readme-surgeon https://github.com/vercel/next.js

# Roast a local file
npx readme-surgeon ./README.md

# Overwrite local file with the improved version
npx readme-surgeon --fix ./README.md

# Score only — no rewrite (fast)
npx readme-surgeon --score ./README.md

# Machine-readable JSON output
npx readme-surgeon --json ./README.md
```

### Options

| Flag | Description |
|---|---|
| `--fix` | Overwrite the local file with the improved README |
| `--score` | Print only the score card, skip the rewrite |
| `--json` | Output score data as JSON (for CI pipelines) |
| `-h, --help` | Show help |

---

## CI Usage

Fail the build if your README drops below a threshold:

```bash
npx readme-surgeon --json ./README.md | node -e "
  const d = require('fs').readFileSync('/dev/stdin', 'utf8')
  const { total, grade } = JSON.parse(d)
  console.log(\`Score: \${total}/100 (\${grade})\`)
  if (total < 60) { console.error('README score too low — fix it.'); process.exit(1) }
"
```

---

## Requirements

- Node.js 18+
- `ANTHROPIC_API_KEY` environment variable

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

---

## We Ran readme-surgeon on Its Own README

Because eating your own dog food is mandatory.

```
  ┌─────────────────────────────────────────┐
  │         README SURGEON — REPORT CARD   │
  └─────────────────────────────────────────┘

  First Impression    ████████████████████  19/20
  Quick Start         ████████████████████  18/20
  Completeness        ████████████████████  18/20
  Visual Appeal       █████████████████░░░  17/20
  Honesty             ████████████████████  20/20

  ─────────────────────────────────────────
  TOTAL               ████████████████████  92/100

  Grade: A

  Verdict: "Solid. The banner doesn't hurt either."
```

---

## See Also

- [ai-code-roast](https://github.com/NickCirv/ai-code-roast) — brutal automated code review for your entire codebase
- [pr-poet](https://github.com/NickCirv/pr-poet) — auto-generate PR descriptions from your diffs
- [clone-any-app](https://github.com/NickCirv/clone-any-app) — reverse-engineer any app from its UI

---

## License

MIT — [NickCirv](https://github.com/NickCirv)

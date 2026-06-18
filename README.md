<div align="center">

# readme-surgeon

**Score, roast, and auto-fix any README — powered by Claude**

[![license](https://img.shields.io/badge/license-MIT-blue?labelColor=0B0A09)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-green?labelColor=0B0A09)](https://nodejs.org)

</div>

## Install

```bash
# Requires ANTHROPIC_API_KEY
export ANTHROPIC_API_KEY=sk-ant-...

npx github:NickCirv/readme-surgeon <target>
```

## Usage

```bash
# Score + roast a GitHub repo
npx github:NickCirv/readme-surgeon https://github.com/user/repo

# Score + roast a local file
npx github:NickCirv/readme-surgeon ./README.md

# Overwrite the local file with the improved version
npx github:NickCirv/readme-surgeon --fix ./README.md
```

| Flag | Description |
|---|---|
| `--fix` | Overwrite the local file with the improved README |
| `--score` | Print only the score card, skip the rewrite |
| `--json` | Output score data as JSON (for CI pipelines) |
| `-h, --help` | Show help |

## What it does

Fetches a README from a GitHub URL or local path, sends it to Claude with a structured 5-category rubric (first impression, quick start, completeness, visual appeal, honesty), and returns a scored report card with numbered feedback. A second Claude call rewrites the README fixing every identified issue. Use `--fix` to overwrite in place, or `--json` to integrate into CI pipelines.

---
<sub>Node ≥18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>

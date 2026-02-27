import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import Anthropic from '@anthropic-ai/sdk'
import { writeFile } from 'fs/promises'

import { fetchReadme } from './fetcher.js'
import { buildScoringPrompt, buildImprovementPrompt } from './prompts.js'
import { parseScoreResponse } from './scorer.js'
import {
  renderScoreCard,
  renderFeedback,
  renderImprovedReadme,
  renderScoreOnly,
  renderFixSuccess,
} from './formatter.js'

const MODEL = 'claude-opus-4-5'

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error(chalk.red('\n  Error: ANTHROPIC_API_KEY environment variable is not set.'))
    console.error(chalk.gray('  Export it: export ANTHROPIC_API_KEY=sk-ant-...'))
    process.exit(1)
  }
  return new Anthropic({ apiKey })
}

async function scoreReadme(client, content) {
  const { system, user } = buildScoringPrompt(content)

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages: [{ role: 'user', content: user }],
  })

  const rawResponse = message.content[0].text
  return parseScoreResponse(rawResponse)
}

async function improveReadme(client, content, scoreData) {
  const { system, user } = buildImprovementPrompt(
    content,
    scoreData,
    scoreData.feedback
  )

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: user }],
  })

  return message.content[0].text.trim()
}

export async function run() {
  const program = new Command()

  program
    .name('readme-surgeon')
    .description('Brutal README feedback + auto-fix. Because your README deserves the truth.')
    .version('1.0.0')
    .argument('<target>', 'GitHub URL (https://github.com/user/repo) or local file path')
    .option('--fix', 'Overwrite the local file with the improved README (local files only)')
    .option('--score', 'Print only the score card, no improved README')
    .option('--json', 'Output score data as JSON (for scripting)')
    .helpOption('-h, --help', 'Show help')

  program.parse()

  const [target] = program.args
  const opts = program.opts()

  if (!target) {
    program.help()
  }

  // Validate --fix is only for local files
  if (opts.fix && (target.startsWith('http://') || target.startsWith('https://'))) {
    console.error(chalk.red('\n  --fix only works with local files, not GitHub URLs.'))
    console.error(chalk.gray('  Use: readme-surgeon --fix ./README.md'))
    process.exit(1)
  }

  const client = getClient()

  // 1. Fetch
  const fetchSpinner = ora({ text: 'Fetching README...', color: 'cyan' }).start()
  let readmeData
  try {
    readmeData = await fetchReadme(target)
    fetchSpinner.succeed(chalk.gray(`Fetched README (${readmeData.content.length.toLocaleString()} chars)`))
  } catch (err) {
    fetchSpinner.fail(chalk.red('Failed to fetch README'))
    console.error(chalk.red(`  ${err.message}`))
    process.exit(1)
  }

  // 2. Score
  const scoreSpinner = ora({ text: 'Analysing README...', color: 'cyan' }).start()
  let scoreData
  try {
    scoreData = await scoreReadme(client, readmeData.content)
    scoreSpinner.succeed(chalk.gray(`Scored: ${scoreData.total}/100 (${scoreData.grade})`))
  } catch (err) {
    scoreSpinner.fail(chalk.red('Failed to score README'))
    console.error(chalk.red(`  ${err.message}`))
    process.exit(1)
  }

  // JSON mode — output raw data and exit
  if (opts.json) {
    console.log(JSON.stringify({ ...scoreData, source: target }, null, 2))
    process.exit(0)
  }

  // Score-only mode
  if (opts.score) {
    renderScoreOnly(scoreData)
    process.exit(0)
  }

  // Full output: score card + feedback
  const sourceLabel = readmeData.url || readmeData.path || target
  renderScoreCard(scoreData, sourceLabel)
  renderFeedback(scoreData.feedback)

  // 3. Improve
  const improveSpinner = ora({ text: 'Rewriting README...', color: 'green' }).start()
  let improved
  try {
    improved = await improveReadme(client, readmeData.content, scoreData)
    improveSpinner.succeed(chalk.gray('Rewrite complete'))
  } catch (err) {
    improveSpinner.fail(chalk.red('Failed to generate improved README'))
    console.error(chalk.red(`  ${err.message}`))
    process.exit(1)
  }

  // --fix mode: overwrite the file
  if (opts.fix) {
    try {
      await writeFile(readmeData.path, improved, 'utf-8')
      renderFixSuccess(readmeData.path, scoreData.total, scoreData.grade)
    } catch (err) {
      console.error(chalk.red(`\n  Failed to write file: ${err.message}`))
      process.exit(1)
    }
    process.exit(0)
  }

  // Default: print improved README
  renderImprovedReadme(improved)
}

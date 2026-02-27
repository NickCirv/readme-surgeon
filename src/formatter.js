import chalk from 'chalk'

const CATEGORY_LABELS = {
  first_impression: 'First Impression',
  quick_start:      'Quick Start     ',
  completeness:     'Completeness    ',
  visual_appeal:    'Visual Appeal   ',
  honesty:          'Honesty         ',
}

function gradeColor(grade) {
  if (grade.startsWith('A')) return chalk.green.bold
  if (grade.startsWith('B')) return chalk.cyan.bold
  if (grade.startsWith('C')) return chalk.yellow.bold
  if (grade.startsWith('D')) return chalk.hex('#FF8C00').bold
  return chalk.red.bold
}

function scoreBar(score, max = 20) {
  const filled = Math.round((score / max) * 12)
  const empty = 12 - filled
  const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty))
  return bar
}

function scoreColor(score, max = 20) {
  const pct = score / max
  if (pct >= 0.8) return chalk.green.bold
  if (pct >= 0.6) return chalk.yellow.bold
  if (pct >= 0.4) return chalk.hex('#FF8C00').bold
  return chalk.red.bold
}

/**
 * Print the full score card with category breakdown.
 */
export function renderScoreCard(scoreData, source) {
  const { scores, total, grade, oneLiner } = scoreData
  const gc = gradeColor(grade)

  console.log()
  console.log(chalk.bold.white('  ┌─────────────────────────────────────────┐'))
  console.log(chalk.bold.white('  │') + chalk.bold.cyan('         README SURGEON — REPORT CARD       ') + chalk.bold.white('│'))
  console.log(chalk.bold.white('  └─────────────────────────────────────────┘'))
  console.log()

  if (source) {
    const label = source.startsWith('http') ? chalk.gray('Source: ') + chalk.dim(source) : chalk.gray('File: ') + chalk.dim(source)
    console.log('  ' + label)
    console.log()
  }

  for (const [key, label] of Object.entries(CATEGORY_LABELS)) {
    const score = scores[key]
    const sc = scoreColor(score)
    const bar = scoreBar(score)
    console.log(
      `  ${chalk.white(label)}  ${bar}  ${sc(String(score).padStart(2))}/20`
    )
  }

  console.log()
  console.log(chalk.gray('  ─────────────────────────────────────────'))

  const totalColor = scoreColor(total, 100)
  console.log(
    `  ${chalk.white('TOTAL            ')}  ${scoreBar(total, 100)}  ${totalColor(String(total).padStart(3))}/100`
  )
  console.log()

  // Big grade
  const gradeDisplay = gc(`  ${grade}`)
  console.log(`  Grade: ${gradeDisplay}`)
  console.log()

  // One-liner verdict
  console.log(chalk.bold.red('  Verdict:'))
  console.log(chalk.italic.white(`  "${oneLiner}"`))
  console.log()
}

/**
 * Print the brutal feedback bullets.
 */
export function renderFeedback(feedback) {
  console.log(chalk.bold.red('  WHAT\'S WRONG (be grateful someone told you)'))
  console.log(chalk.gray('  ─────────────────────────────────────────'))
  console.log()

  for (let i = 0; i < feedback.length; i++) {
    const num = chalk.red.bold(`  ${i + 1}.`)
    console.log(`${num} ${chalk.white(feedback[i])}`)
    console.log()
  }
}

/**
 * Print the improved README.
 */
export function renderImprovedReadme(content) {
  console.log(chalk.gray('  ─────────────────────────────────────────'))
  console.log(chalk.bold.green('  IMPROVED README (copy-paste ready)'))
  console.log(chalk.gray('  ─────────────────────────────────────────'))
  console.log()
  console.log(content)
  console.log()
}

/**
 * Print just the score for --score mode (machine-readable-friendly).
 */
export function renderScoreOnly(scoreData) {
  const { scores, total, grade, oneLiner } = scoreData
  const gc = gradeColor(grade)

  console.log()
  console.log(gc(`  ${total}/100 — ${grade}`))
  console.log(chalk.italic.gray(`  "${oneLiner}"`))
  console.log()

  for (const [key, label] of Object.entries(CATEGORY_LABELS)) {
    const score = scores[key]
    const sc = scoreColor(score)
    console.log(`  ${chalk.gray(label.trim())}  ${sc(score)}/20`)
  }
  console.log()
}

/**
 * Print a success message after --fix overwrites the file.
 */
export function renderFixSuccess(filePath, total, grade) {
  const gc = gradeColor(grade)
  console.log()
  console.log(chalk.green.bold(`  File updated: ${filePath}`))
  console.log(`  Original score: ${chalk.red.bold(total + '/100 ' + grade)}  →  ${gc('rewritten')}`)
  console.log(chalk.gray('  Run readme-surgeon again to see the new score.'))
  console.log()
}

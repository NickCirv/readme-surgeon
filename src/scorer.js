/**
 * Parse the AI scoring response into a structured object.
 *
 * Expected AI format:
 *   ```json
 *   { "scores": {...}, "total": N, "grade": "B", "one_liner": "..." }
 *   ```
 *   FEEDBACK:
 *   - issue 1
 *   - issue 2
 */
export function parseScoreResponse(rawResponse) {
  // Extract JSON block
  const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)```/)
  if (!jsonMatch) {
    throw new Error(
      'Could not parse AI response — no JSON block found.\n' +
        'Raw response:\n' +
        rawResponse.slice(0, 500)
    )
  }

  let parsed
  try {
    parsed = JSON.parse(jsonMatch[1].trim())
  } catch (err) {
    throw new Error(`Invalid JSON in AI response: ${err.message}`)
  }

  // Validate shape
  const required = ['scores', 'total', 'grade', 'one_liner']
  for (const key of required) {
    if (parsed[key] === undefined) {
      throw new Error(`AI response missing field: ${key}`)
    }
  }

  const scoreFields = ['first_impression', 'quick_start', 'completeness', 'visual_appeal', 'honesty']
  for (const field of scoreFields) {
    if (typeof parsed.scores[field] !== 'number') {
      throw new Error(`AI response missing score field: scores.${field}`)
    }
  }

  // Extract feedback bullets (lines starting with "- ")
  const feedbackSection = rawResponse.slice(rawResponse.indexOf('FEEDBACK:') + 9)
  const feedback = feedbackSection
    .split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.trim().slice(2).trim())
    .filter(Boolean)

  if (feedback.length === 0) {
    throw new Error('AI response has no FEEDBACK bullets')
  }

  return {
    scores: parsed.scores,
    total: parsed.total,
    grade: parsed.grade,
    oneLiner: parsed.one_liner,
    feedback,
  }
}

/**
 * Convert numeric total to a letter grade (as a fallback if AI grade is missing).
 */
export function totalToGrade(total) {
  if (total >= 95) return 'A+'
  if (total >= 90) return 'A'
  if (total >= 85) return 'A-'
  if (total >= 80) return 'B+'
  if (total >= 75) return 'B'
  if (total >= 70) return 'B-'
  if (total >= 65) return 'C+'
  if (total >= 60) return 'C'
  if (total >= 55) return 'C-'
  if (total >= 50) return 'D'
  return 'F'
}

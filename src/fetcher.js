import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

/**
 * Resolve a GitHub repo URL to the raw README URL.
 * Handles:
 *   https://github.com/user/repo
 *   https://github.com/user/repo/tree/branch
 *   https://raw.githubusercontent.com/...
 */
function resolveGitHubRawUrl(input) {
  // Already a raw URL
  if (input.startsWith('https://raw.githubusercontent.com/')) {
    return input
  }

  const match = input.match(
    /https?:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/
  )
  if (!match) return null

  const [, owner, repo, branch = 'main'] = match
  // We'll try main first, then master as fallback inside fetchReadme
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`
}

/**
 * Fetch README from a GitHub repo URL or a local file path.
 * Returns { content: string, source: string }
 */
export async function fetchReadme(input) {
  // Local file
  if (!input.startsWith('http://') && !input.startsWith('https://')) {
    if (!existsSync(input)) {
      throw new Error(`File not found: ${input}`)
    }
    const content = await readFile(input, 'utf-8')
    if (!content.trim()) {
      throw new Error(`File is empty: ${input}`)
    }
    return { content, source: 'local', path: input }
  }

  // Already a raw URL
  if (input.startsWith('https://raw.githubusercontent.com/')) {
    const content = await fetchUrl(input)
    return { content, source: 'github-raw', url: input }
  }

  // GitHub repo URL
  const rawUrlMain = resolveGitHubRawUrl(input)
  if (!rawUrlMain) {
    throw new Error(
      `Cannot parse GitHub URL: ${input}\n` +
        'Expected format: https://github.com/user/repo'
    )
  }

  // Try main branch, fall back to master
  try {
    const content = await fetchUrl(rawUrlMain)
    return { content, source: 'github', url: rawUrlMain }
  } catch {
    const rawUrlMaster = rawUrlMain.replace('/main/README.md', '/master/README.md')
    try {
      const content = await fetchUrl(rawUrlMaster)
      return { content, source: 'github', url: rawUrlMaster }
    } catch {
      throw new Error(
        `Could not find README.md in ${input}\n` +
          'Tried branches: main, master\n' +
          'Make sure the repo is public and has a README.md in the root.'
      )
    }
  }
}

async function fetchUrl(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching ${url}`)
    }
    const text = await res.text()
    if (!text.trim()) {
      throw new Error(`Empty response from ${url}`)
    }
    return text
  } finally {
    clearTimeout(timeout)
  }
}

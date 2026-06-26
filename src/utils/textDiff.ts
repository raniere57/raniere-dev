import { DataToolError, type DataToolResult } from './dataError'

export interface DiffLine {
  type: 'same' | 'add' | 'remove'
  text: string
}

export interface DiffResult {
  lines: DiffLine[]
  adds: number
  removes: number
}

function diffLines(left: string, right: string): DiffLine[] {
  const leftLines = left.replace(/\r\n/g, '\n').split('\n')
  const rightLines = right.replace(/\r\n/g, '\n').split('\n')
  const m = leftLines.length
  const n = rightLines.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      dp[i][j] =
        leftLines[i] === rightLines[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const result: DiffLine[] = []
  let i = 0
  let j = 0

  while (i < m && j < n) {
    if (leftLines[i] === rightLines[j]) {
      result.push({ type: 'same', text: leftLines[i] })
      i += 1
      j += 1
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'remove', text: leftLines[i] })
      i += 1
    } else {
      result.push({ type: 'add', text: rightLines[j] })
      j += 1
    }
  }

  while (i < m) {
    result.push({ type: 'remove', text: leftLines[i] })
    i += 1
  }

  while (j < n) {
    result.push({ type: 'add', text: rightLines[j] })
    j += 1
  }

  return result
}

export function computeDiff(left: string, right: string, format: 'text' | 'json'): DiffResult {
  const leftTrimmed = left.trim()
  const rightTrimmed = right.trim()
  if (!leftTrimmed || !rightTrimmed) {
    throw new DataToolError('Cole os dois blocos para comparar.')
  }

  let normalizedLeft = leftTrimmed
  let normalizedRight = rightTrimmed

  if (format === 'json') {
    try {
      normalizedLeft = JSON.stringify(JSON.parse(leftTrimmed), null, 2)
      normalizedRight = JSON.stringify(JSON.parse(rightTrimmed), null, 2)
    } catch {
      throw new DataToolError('JSON inválido em um dos blocos.')
    }
  }

  const lines = diffLines(normalizedLeft, normalizedRight)
  const adds = lines.filter((line) => line.type === 'add').length
  const removes = lines.filter((line) => line.type === 'remove').length

  return { lines, adds, removes }
}

export function formatDiffLines(lines: DiffLine[]): string {
  return lines
    .map((line) => {
      if (line.type === 'add') return `+ ${line.text}`
      if (line.type === 'remove') return `- ${line.text}`
      return `  ${line.text}`
    })
    .join('\n')
}

export function diffText(left: string, right: string, format: 'text' | 'json'): DataToolResult {
  const { lines, adds, removes } = computeDiff(left, right, format)

  const output = formatDiffLines(lines)

  return {
    output,
    meta: `+${adds} / -${removes}`,
  }
}

export function diffTextLines(left: string, right: string, format: 'text' | 'json'): DiffLine[] {
  return computeDiff(left, right, format).lines
}

export const diffSample = {
  left: '{\n  "nome": "Ana",\n  "cargo": "Analista"\n}',
  right: '{\n  "nome": "Ana",\n  "cargo": "Engenheira",\n  "cidade": "Teresina"\n}',
}

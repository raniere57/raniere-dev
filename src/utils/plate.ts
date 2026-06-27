import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type PlateFormat = 'mercosul' | 'antiga' | 'unknown'

export interface PlateValidation {
  raw: string
  normalized: string
  format: PlateFormat
  valid: boolean
  formatted: string | null
  reason: string | null
}

const PLATE_LETTERS = /^[A-HJ-NPR-Z]+$/
const MERCOSUL_PATTERN = /^[A-HJ-NPR-Z]{3}[0-9][A-HJ-NPR-Z][0-9]{2}$/
const OLD_PATTERN = /^[A-HJ-NPR-Z]{3}[0-9]{4}$/

export function normalizePlate(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function formatPlateMercosul(normalized: string): string {
  return `${normalized.slice(0, 3)}-${normalized.slice(3, 4)}${normalized.slice(4, 5)}${normalized.slice(5)}`
}

export function formatPlateOld(normalized: string): string {
  return `${normalized.slice(0, 3)}-${normalized.slice(3)}`
}

function hasForbiddenLetters(normalized: string): boolean {
  return /[IOQ]/i.test(normalized)
}

export function validatePlate(raw: string): PlateValidation {
  const trimmed = raw.trim()
  const normalized = normalizePlate(trimmed)

  if (!trimmed) {
    return {
      raw: trimmed,
      normalized,
      format: 'unknown',
      valid: false,
      formatted: null,
      reason: 'Informe uma placa.',
    }
  }

  if (!normalized) {
    return {
      raw: trimmed,
      normalized,
      format: 'unknown',
      valid: false,
      formatted: null,
      reason: 'Nenhum caractere válido encontrado.',
    }
  }

  if (hasForbiddenLetters(normalized)) {
    return {
      raw: trimmed,
      normalized,
      format: 'unknown',
      valid: false,
      formatted: null,
      reason: 'Placas brasileiras não usam as letras I, O ou Q.',
    }
  }

  if (MERCOSUL_PATTERN.test(normalized)) {
    return {
      raw: trimmed,
      normalized,
      format: 'mercosul',
      valid: true,
      formatted: formatPlateMercosul(normalized),
      reason: null,
    }
  }

  if (OLD_PATTERN.test(normalized)) {
    return {
      raw: trimmed,
      normalized,
      format: 'antiga',
      valid: true,
      formatted: formatPlateOld(normalized),
      reason: null,
    }
  }

  if (normalized.length === 7 && PLATE_LETTERS.test(normalized.slice(0, 3))) {
    return {
      raw: trimmed,
      normalized,
      format: 'unknown',
      valid: false,
      formatted: null,
      reason: 'Formato inválido — use ABC1234 (antiga) ou ABC1D23 (Mercosul).',
    }
  }

  return {
    raw: trimmed,
    normalized,
    format: 'unknown',
    valid: false,
    formatted: null,
    reason: 'Placa deve ter 7 caracteres (3 letras + 4 números ou padrão Mercosul).',
  }
}

function formatLabel(format: PlateFormat): string {
  switch (format) {
    case 'mercosul':
      return 'Mercosul'
    case 'antiga':
      return 'Antiga'
    default:
      return '—'
  }
}

function formatSingleResult(result: PlateValidation): string {
  const lines = [
    result.valid ? '✓ Placa válida' : '✗ Placa inválida',
    `Formato: ${formatLabel(result.format)}`,
    `Entrada: ${result.raw || '—'}`,
    `Normalizada: ${result.normalized || '—'}`,
  ]
  if (result.formatted) lines.push(`Formatada: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  return lines.join('\n')
}

function formatBatchLine(result: PlateValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${formatLabel(result.format)} | ${label}${detail}`
}

function summarizeResults(results: PlateValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSinglePlate(raw: string): DataToolResult {
  const result = validatePlate(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? `${formatLabel(result.format)} · válida` : 'Placa inválida',
  }
}

export function validatePlateBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos uma placa (uma por linha).')

  const results = lines.map((line) => validatePlate(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validatePlateCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de placas.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validatePlate(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'placa_formato', 'placa_valida', 'placa_formatada', 'placa_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
      formatLabel(result.format),
      result.valid ? 'sim' : 'nao',
      result.formatted ?? '',
      result.reason ?? '',
    ]
  })

  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(results)}`,
  }
}

export const plateSamples = {
  single: 'ABC1D23',
  batch: ['ABC1D23', 'ABC-1234', 'IOQ1D23', 'XYZ9Z99'].join('\n'),
  csv: ['veiculo,placa', 'Carro A,ABC1D23', 'Carro B,ABC1234', 'Erro,IOQ1234'].join('\n'),
}

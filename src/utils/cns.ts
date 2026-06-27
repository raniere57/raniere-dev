import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export interface CnsValidation {
  raw: string
  digits: string
  kind: 'definitivo' | 'provisorio' | 'unknown'
  valid: boolean
  formatted: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/
const CNS_WEIGHTS_11 = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5]
const CNS_WEIGHTS_15 = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

export function stripCnsDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCns(digits: string): string {
  return digits.replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')
}

function validateCnsDefinitivo(digits: string): boolean {
  const pis = digits.slice(0, 11)
  let sum = 0
  for (let index = 0; index < 11; index += 1) {
    sum += Number(pis[index]) * CNS_WEIGHTS_11[index]!
  }

  let rest = sum % 11
  let dv = 11 - rest
  if (dv === 11) dv = 0

  let expected: string
  if (dv === 10) {
    sum = 0
    for (let index = 0; index < 11; index += 1) {
      sum += Number(pis[index]) * CNS_WEIGHTS_11[index]!
    }
    sum += 2
    rest = sum % 11
    dv = 11 - rest
    expected = `${pis}001${dv}`
  } else {
    expected = `${pis}000${dv}`
  }

  return digits === expected
}

function validateCnsProvisorio(digits: string): boolean {
  let sum = 0
  for (let index = 0; index < 15; index += 1) {
    sum += Number(digits[index]) * CNS_WEIGHTS_15[index]!
  }
  return sum % 11 === 0
}

function detectCnsKind(firstDigit: string): CnsValidation['kind'] {
  if (firstDigit === '1' || firstDigit === '2') return 'definitivo'
  if (firstDigit === '7' || firstDigit === '8' || firstDigit === '9') return 'provisorio'
  return 'unknown'
}

export function validateCns(raw: string): CnsValidation {
  const trimmed = raw.trim()
  const digits = stripCnsDigits(trimmed)

  if (!trimmed) {
    return {
      raw: trimmed,
      digits,
      kind: 'unknown',
      valid: false,
      formatted: null,
      reason: 'Informe um número de CNS.',
    }
  }

  if (!digits) {
    return {
      raw: trimmed,
      digits,
      kind: 'unknown',
      valid: false,
      formatted: null,
      reason: 'Nenhum dígito encontrado.',
    }
  }

  if (digits.length !== 15) {
    return {
      raw: trimmed,
      digits,
      kind: 'unknown',
      valid: false,
      formatted: null,
      reason: `CNS deve ter 15 dígitos (encontrados ${digits.length}).`,
    }
  }

  if (REPEATED_DIGITS.test(digits)) {
    return {
      raw: trimmed,
      digits,
      kind: detectCnsKind(digits[0]!),
      valid: false,
      formatted: null,
      reason: 'Sequência inválida (todos os dígitos iguais).',
    }
  }

  const kind = detectCnsKind(digits[0]!)
  if (kind === 'unknown') {
    return {
      raw: trimmed,
      digits,
      kind,
      valid: false,
      formatted: null,
      reason: 'CNS deve iniciar com 1, 2 (definitivo) ou 7, 8, 9 (provisório).',
    }
  }

  const valid = kind === 'definitivo' ? validateCnsDefinitivo(digits) : validateCnsProvisorio(digits)
  return {
    raw: trimmed,
    digits,
    kind,
    valid,
    formatted: valid ? formatCns(digits) : null,
    reason: valid ? null : 'Dígito verificador inválido.',
  }
}

function formatSingleResult(result: CnsValidation): string {
  const kindLabel = result.kind === 'definitivo' ? 'Definitivo' : result.kind === 'provisorio' ? 'Provisório' : '—'
  const lines = [
    result.valid ? '✓ CNS válido' : '✗ CNS inválido',
    `Tipo: ${kindLabel}`,
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]
  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  return lines.join('\n')
}

function formatBatchLine(result: CnsValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${label}${detail}`
}

function summarizeResults(results: CnsValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleCns(raw: string): DataToolResult {
  const result = validateCns(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? 'CNS válido' : 'CNS inválido',
  }
}

export function validateCnsBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos um CNS (um por linha).')

  const results = lines.map((line) => validateCns(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateCnsCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de CNS.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateCns(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'cns_valido', 'cns_formatado', 'cns_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [...row, result.valid ? 'sim' : 'nao', result.formatted ?? '', result.reason ?? '']
  })

  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(results)}`,
  }
}

export const cnsSamples = {
  single: '100000000060018',
  batch: ['100000000060018', '898001234567808', '111111111111111'].join('\n'),
  csv: ['nome,cns', 'Maria,100000000060018', 'Erro,123'].join('\n'),
}

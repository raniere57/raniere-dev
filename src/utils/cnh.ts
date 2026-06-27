import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export interface CnhValidation {
  raw: string
  digits: string
  valid: boolean
  formatted: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/

export function stripCnhDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCnh(digits: string): string {
  return digits.replace(/(\d{9})(\d{2})/, '$1-$2')
}

function validateCnhDigits(digits: string): boolean {
  if (digits.length !== 11 || REPEATED_DIGITS.test(digits)) return false

  const values = digits.split('').map(Number)
  let sum = 0
  for (let index = 0; index < 9; index += 1) {
    sum += values[index]! * (index + 1)
  }

  let dv1 = sum % 11
  let dsc = 0
  if (dv1 >= 10) {
    dv1 = 0
    dsc = 2
  }

  sum = 0
  for (let index = 0; index < 9; index += 1) {
    sum += values[index]! * (9 - index)
  }
  sum += dsc

  let dv2 = sum % 11
  if (dv2 >= 10) dv2 = 0

  return values[9] === dv1 && values[10] === dv2
}

export function validateCnh(raw: string): CnhValidation {
  const trimmed = raw.trim()
  const digits = stripCnhDigits(trimmed)

  if (!trimmed) {
    return { raw: trimmed, digits, valid: false, formatted: null, reason: 'Informe um número de CNH.' }
  }

  if (!digits) {
    return { raw: trimmed, digits, valid: false, formatted: null, reason: 'Nenhum dígito encontrado.' }
  }

  if (digits.length !== 11) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      reason: `CNH deve ter 11 dígitos (encontrados ${digits.length}).`,
    }
  }

  if (REPEATED_DIGITS.test(digits)) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      reason: 'Sequência inválida (todos os dígitos iguais).',
    }
  }

  const valid = validateCnhDigits(digits)
  return {
    raw: trimmed,
    digits,
    valid,
    formatted: valid ? formatCnh(digits) : null,
    reason: valid ? null : 'Dígitos verificadores inválidos.',
  }
}

function formatSingleResult(result: CnhValidation): string {
  const lines = [
    result.valid ? '✓ CNH válida' : '✗ CNH inválida',
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]
  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  return lines.join('\n')
}

function formatBatchLine(result: CnhValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${label}${detail}`
}

function summarizeResults(results: CnhValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleCnh(raw: string): DataToolResult {
  const result = validateCnh(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? 'CNH válida' : 'CNH inválida',
  }
}

export function validateCnhBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos uma CNH (uma por linha).')

  const results = lines.map((line) => validateCnh(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateCnhCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de CNH.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateCnh(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'cnh_valido', 'cnh_formatado', 'cnh_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [...row, result.valid ? 'sim' : 'nao', result.formatted ?? '', result.reason ?? '']
  })

  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(results)}`,
  }
}

export const cnhSamples = {
  single: '10000000101',
  batch: ['10000000101', '11111111111', '00000000000'].join('\n'),
  csv: ['nome,cnh', 'João,10000000101', 'Erro,11111111111'].join('\n'),
}

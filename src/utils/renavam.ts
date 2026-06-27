import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export interface RenavamValidation {
  raw: string
  digits: string
  valid: boolean
  formatted: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/
const RENAVAM_WEIGHTS = '3298765432'

export function stripRenavamDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatRenavam(digits: string): string {
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function validateRenavamDigits(digits: string): boolean {
  if (digits.length !== 11 || REPEATED_DIGITS.test(digits)) return false

  let sum = 0
  for (let index = 0; index < 10; index += 1) {
    sum += Number(digits[index]) * Number(RENAVAM_WEIGHTS[index])
  }

  const rest = sum % 11
  const check = rest === 0 || rest === 1 ? 0 : 11 - rest
  return check === Number(digits[10])
}

export function validateRenavam(raw: string): RenavamValidation {
  const trimmed = raw.trim()
  let digits = stripRenavamDigits(trimmed)

  if (!trimmed) {
    return { raw: trimmed, digits, valid: false, formatted: null, reason: 'Informe um RENAVAM.' }
  }

  if (!digits) {
    return { raw: trimmed, digits, valid: false, formatted: null, reason: 'Nenhum dígito encontrado.' }
  }

  if (digits.length > 11) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      reason: `RENAVAM deve ter no máximo 11 dígitos (encontrados ${digits.length}).`,
    }
  }

  digits = digits.padStart(11, '0')

  if (REPEATED_DIGITS.test(digits)) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      reason: 'Sequência inválida (todos os dígitos iguais).',
    }
  }

  const valid = validateRenavamDigits(digits)
  return {
    raw: trimmed,
    digits,
    valid,
    formatted: valid ? formatRenavam(digits) : null,
    reason: valid ? null : 'Dígito verificador inválido.',
  }
}

function formatSingleResult(result: RenavamValidation): string {
  const lines = [
    result.valid ? '✓ RENAVAM válido' : '✗ RENAVAM inválido',
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]
  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  return lines.join('\n')
}

function formatBatchLine(result: RenavamValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${label}${detail}`
}

function summarizeResults(results: RenavamValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleRenavam(raw: string): DataToolResult {
  const result = validateRenavam(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? 'RENAVAM válido' : 'RENAVAM inválido',
  }
}

export function validateRenavamBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos um RENAVAM (um por linha).')

  const results = lines.map((line) => validateRenavam(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateRenavamCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de RENAVAM.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateRenavam(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'renavam_valido', 'renavam_formatado', 'renavam_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [...row, result.valid ? 'sim' : 'nao', result.formatted ?? '', result.reason ?? '']
  })

  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(results)}`,
  }
}

export const renavamSamples = {
  single: '14283256656',
  batch: ['14283256656', '95059845976', '12345678901'].join('\n'),
  csv: ['veiculo,renavam', 'Carro A,14283256656', 'Erro,123', 'Moto B,95059845976'].join('\n'),
}

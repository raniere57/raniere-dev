import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export interface PisValidation {
  raw: string
  digits: string
  valid: boolean
  formatted: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/
const PIS_WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

export function stripPisDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatPis(digits: string): string {
  return digits.replace(/(\d{3})(\d{5})(\d{2})(\d)/, '$1.$2.$3-$4')
}

function validatePisDigits(digits: string): boolean {
  if (digits.length !== 11 || REPEATED_DIGITS.test(digits)) return false

  let sum = 0
  for (let index = 0; index < 10; index += 1) {
    sum += Number(digits[index]) * PIS_WEIGHTS[index]!
  }

  const rest = sum % 11
  const check = rest < 2 ? 0 : 11 - rest
  return check === Number(digits[10])
}

export function validatePis(raw: string): PisValidation {
  const trimmed = raw.trim()
  const digits = stripPisDigits(trimmed)

  if (!trimmed) {
    return { raw: trimmed, digits, valid: false, formatted: null, reason: 'Informe um PIS/PASEP/NIS.' }
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
      reason: `PIS/PASEP deve ter 11 dígitos (encontrados ${digits.length}).`,
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

  const valid = validatePisDigits(digits)
  return {
    raw: trimmed,
    digits,
    valid,
    formatted: valid ? formatPis(digits) : null,
    reason: valid ? null : 'Dígito verificador inválido.',
  }
}

function formatSingleResult(result: PisValidation): string {
  const lines = [
    result.valid ? '✓ PIS/PASEP válido' : '✗ PIS/PASEP inválido',
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]
  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  return lines.join('\n')
}

function formatBatchLine(result: PisValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${label}${detail}`
}

function summarizeResults(results: PisValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSinglePis(raw: string): DataToolResult {
  const result = validatePis(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? 'PIS/PASEP válido' : 'PIS/PASEP inválido',
  }
}

export function validatePisBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos um PIS/PASEP (um por linha).')

  const results = lines.map((line) => validatePis(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validatePisCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de PIS/PASEP.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validatePis(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'pis_valido', 'pis_formatado', 'pis_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [...row, result.valid ? 'sim' : 'nao', result.formatted ?? '', result.reason ?? '']
  })

  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(results)}`,
  }
}

export const pisSamples = {
  single: '170.332.595-12',
  batch: ['170.332.595-12', '111.111.111-11', '120.564.168-77'].join('\n'),
  csv: ['nome,pis', 'Maria,17033259512', 'Erro,11111111111', 'João,12056416877'].join('\n'),
}

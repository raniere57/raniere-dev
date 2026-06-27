import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export interface TituloEleitorValidation {
  raw: string
  digits: string
  valid: boolean
  formatted: string | null
  ufCode: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/
const UF_EXCEPTIONS = new Set(['01', '02'])

export function stripTituloDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatTituloEleitor(digits: string): string {
  return digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
}

function fixDigit(calculated: number, uf: string): number {
  if (calculated < 10) return calculated
  if (calculated === 10) return 0
  return UF_EXCEPTIONS.has(uf) ? 1 : 0
}

function calcDigit1(titulo: string, uf: string): number {
  const sum = titulo
    .slice(0, 8)
    .split('')
    .reduce((total, value, index) => total + Number(value) * (9 - index), 0)
  return fixDigit(11 - (sum % 11), uf)
}

function calcDigit2(titulo: string, uf: string, digit1: number): number {
  const sum =
    Number(titulo[8]) * 4 + Number(titulo[9]) * 3 + digit1 * 2
  return fixDigit(11 - (sum % 11), uf)
}

function validateTituloDigits(digits: string): boolean {
  if (digits.length !== 12 || REPEATED_DIGITS.test(digits)) return false

  const uf = digits.slice(8, 10)
  const ufNum = Number(uf)
  if (ufNum < 1 || ufNum > 28) return false

  const informed1 = Number(digits[10])
  const informed2 = Number(digits[11])
  const digit1 = calcDigit1(digits, uf)
  const digit2 = calcDigit2(digits, uf, digit1)

  return informed1 === digit1 && informed2 === digit2
}

export function validateTituloEleitor(raw: string): TituloEleitorValidation {
  const trimmed = raw.trim()
  let digits = stripTituloDigits(trimmed)

  if (!trimmed) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      ufCode: null,
      reason: 'Informe um título de eleitor.',
    }
  }

  if (!digits) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      ufCode: null,
      reason: 'Nenhum dígito encontrado.',
    }
  }

  if (digits.length > 12) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      ufCode: null,
      reason: `Título deve ter no máximo 12 dígitos (encontrados ${digits.length}).`,
    }
  }

  digits = digits.padStart(12, '0')

  if (REPEATED_DIGITS.test(digits)) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      ufCode: digits.slice(8, 10),
      reason: 'Sequência inválida (todos os dígitos iguais).',
    }
  }

  const ufCode = digits.slice(8, 10)
  const ufNum = Number(ufCode)
  if (ufNum < 1 || ufNum > 28) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      ufCode,
      reason: `Código de UF eleitoral inválido (${ufCode}). Deve ser 01–28.`,
    }
  }

  const valid = validateTituloDigits(digits)
  return {
    raw: trimmed,
    digits,
    valid,
    formatted: valid ? formatTituloEleitor(digits) : null,
    ufCode,
    reason: valid ? null : 'Dígitos verificadores inválidos.',
  }
}

function formatSingleResult(result: TituloEleitorValidation): string {
  const lines = [
    result.valid ? '✓ Título de eleitor válido' : '✗ Título de eleitor inválido',
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]
  if (result.ufCode) lines.push(`UF eleitoral: ${result.ufCode}`)
  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  return lines.join('\n')
}

function formatBatchLine(result: TituloEleitorValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${label}${detail}`
}

function summarizeResults(results: TituloEleitorValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleTituloEleitor(raw: string): DataToolResult {
  const result = validateTituloEleitor(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? `UF ${result.ufCode} · válido` : 'Título inválido',
  }
}

export function validateTituloEleitorBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos um título (um por linha).')

  const results = lines.map((line) => validateTituloEleitor(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateTituloEleitorCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de títulos.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateTituloEleitor(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'titulo_valido', 'titulo_formatado', 'titulo_uf', 'titulo_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
      result.valid ? 'sim' : 'nao',
      result.formatted ?? '',
      result.ufCode ?? '',
      result.reason ?? '',
    ]
  })

  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(results)}`,
  }
}

export const tituloEleitorSamples = {
  single: '051823250108',
  batch: ['051823250108', '870642332720', '111111111111'].join('\n'),
  csv: ['nome,titulo', 'Maria,051823250108', 'Erro,111111111111', 'João,870642332720'].join('\n'),
}

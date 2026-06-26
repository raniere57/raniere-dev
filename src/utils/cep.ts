import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export interface CepValidation {
  raw: string
  digits: string
  valid: boolean
  formatted: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/

export function stripCepDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCep(digits: string): string {
  return digits.replace(/(\d{5})(\d{3})/, '$1-$2')
}

export function validateCep(raw: string): CepValidation {
  const trimmed = raw.trim()
  const digits = stripCepDigits(trimmed)

  if (!trimmed) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      reason: 'Informe um CEP.',
    }
  }

  if (!digits) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      reason: 'Nenhum dígito encontrado.',
    }
  }

  if (digits.length !== 8) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      reason: `CEP deve ter 8 dígitos (encontrados ${digits.length}).`,
    }
  }

  if (REPEATED_DIGITS.test(digits)) {
    return {
      raw: trimmed,
      digits,
      valid: false,
      formatted: null,
      reason: 'CEP inválido (sequência repetida).',
    }
  }

  return {
    raw: trimmed,
    digits,
    valid: true,
    formatted: formatCep(digits),
    reason: null,
  }
}

function formatSingleResult(result: CepValidation): string {
  const lines = [
    result.valid ? '✓ CEP válido' : '✗ CEP inválido',
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]

  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)

  return lines.join('\n')
}

function formatBatchLine(result: CepValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${label}${detail}`
}

function summarizeResults(results: CepValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleCep(raw: string): DataToolResult {
  const result = validateCep(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? 'CEP válido' : 'CEP inválido',
  }
}

export function validateCepBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new DataToolError('Informe ao menos um CEP (um por linha).')
  }

  const results = lines.map((line) => validateCep(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateCepCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de CEP.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateCep(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'cep_valido', 'cep_formatado', 'cep_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
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

export const cepSamples = {
  single: '64000-000',
  batch: ['64000-000', '01310-100', '123', '00000-000'].join('\n'),
  csv: ['cidade,cep', 'Teresina,64000000', 'São Paulo,01310100', 'Erro,123'].join('\n'),
}

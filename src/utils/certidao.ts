import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type CertidaoKind = 'nascimento' | 'casamento' | 'obito' | 'outro' | 'unknown'

export interface CertidaoValidation {
  raw: string
  digits: string
  kind: CertidaoKind
  valid: boolean
  formatted: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/

const CERTIDAO_KIND_BY_CODE: Record<string, CertidaoKind> = {
  '1': 'nascimento',
  '2': 'casamento',
  '3': 'obito',
}

export function stripCertidaoDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCertidao(digits: string): string {
  return digits.replace(
    /(\d{6})(\d{2})(\d{2})(\d{4})(\d{1})(\d{5})(\d{3})(\d{7})(\d{2})/,
    '$1 $2 $3 $4 $5 $6 $7 $8 $9',
  )
}

function detectCertidaoKind(digits: string): CertidaoKind {
  const indicator = digits[14]
  if (!indicator) return 'unknown'
  return CERTIDAO_KIND_BY_CODE[indicator] ?? 'outro'
}

function validateCertidaoDigits(digits: string): boolean {
  if (digits.length !== 32 || REPEATED_DIGITS.test(digits)) return false

  const body = digits.slice(0, 30)
  const informed = digits.slice(30, 32)
  const remainder = BigInt(`${body}00`) % 97n
  const expected = (98n - remainder).toString().padStart(2, '0')
  return informed === expected
}

export function validateCertidao(raw: string): CertidaoValidation {
  const trimmed = raw.trim()
  const digits = stripCertidaoDigits(trimmed)

  if (!trimmed) {
    return {
      raw: trimmed,
      digits,
      kind: 'unknown',
      valid: false,
      formatted: null,
      reason: 'Informe o número da certidão (matrícula CNJ).',
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

  if (digits.length !== 32) {
    return {
      raw: trimmed,
      digits,
      kind: 'unknown',
      valid: false,
      formatted: null,
      reason: `Certidão deve ter 32 dígitos (encontrados ${digits.length}).`,
    }
  }

  const kind = detectCertidaoKind(digits)
  const valid = validateCertidaoDigits(digits)

  return {
    raw: trimmed,
    digits,
    kind,
    valid,
    formatted: valid ? formatCertidao(digits) : null,
    reason: valid ? null : 'Dígitos verificadores inválidos (módulo 97).',
  }
}

function kindLabel(kind: CertidaoKind): string {
  switch (kind) {
    case 'nascimento':
      return 'Nascimento'
    case 'casamento':
      return 'Casamento'
    case 'obito':
      return 'Óbito'
    case 'outro':
      return 'Outro'
    default:
      return '—'
  }
}

function formatSingleResult(result: CertidaoValidation): string {
  const lines = [
    result.valid ? '✓ Certidão válida' : '✗ Certidão inválida',
    `Tipo: ${kindLabel(result.kind)}`,
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]
  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  return lines.join('\n')
}

function formatBatchLine(result: CertidaoValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${kindLabel(result.kind)} | ${label}${detail}`
}

function summarizeResults(results: CertidaoValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleCertidao(raw: string): DataToolResult {
  const result = validateCertidao(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? `${kindLabel(result.kind)} · válida` : 'Certidão inválida',
  }
}

export function validateCertidaoBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos uma certidão (uma por linha).')

  const results = lines.map((line) => validateCertidao(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateCertidaoCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de certidões.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateCertidao(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'certidao_tipo', 'certidao_valida', 'certidao_formatada', 'certidao_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
      kindLabel(result.kind),
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

export const certidaoSamples = {
  single: '10683611192610011886261626561423',
  batch: ['10683611192610011886261626561423', '11111111111111111111111111111111'].join('\n'),
  csv: ['nome,certidao', 'Ana,10683611192610011886261626561423', 'Erro,123'].join('\n'),
}

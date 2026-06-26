import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type DocumentKind = 'cpf' | 'cnpj'
export type DocumentMode = 'auto' | DocumentKind

export interface DocumentValidation {
  raw: string
  digits: string
  kind: DocumentKind | 'unknown'
  valid: boolean
  formatted: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/

export function stripDocumentDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function detectDocumentKind(digits: string): DocumentKind | 'unknown' {
  if (digits.length === 11) return 'cpf'
  if (digits.length === 14) return 'cnpj'
  return 'unknown'
}

function validateCpfDigits(digits: string): boolean {
  if (digits.length !== 11 || REPEATED_DIGITS.test(digits)) return false

  const check = (length: number) => {
    let sum = 0
    for (let index = 0; index < length; index += 1) {
      sum += Number(digits[index]) * (length + 1 - index)
    }
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  return check(9) === Number(digits[9]) && check(10) === Number(digits[10])
}

function validateCnpjDigits(digits: string): boolean {
  if (digits.length !== 14 || REPEATED_DIGITS.test(digits)) return false

  const calc = (base: string, weights: number[]) => {
    let sum = 0
    for (let index = 0; index < weights.length; index += 1) {
      sum += Number(base[index]) * weights[index]!
    }
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const first = calc(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  if (first !== Number(digits[12])) return false
  return calc(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(digits[13])
}

export function formatDocument(digits: string, kind: DocumentKind): string {
  if (kind === 'cpf') {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export function validateDocument(raw: string, mode: DocumentMode = 'auto'): DocumentValidation {
  const trimmed = raw.trim()
  const digits = stripDocumentDigits(trimmed)

  if (!trimmed) {
    return {
      raw: trimmed,
      digits,
      kind: 'unknown',
      valid: false,
      formatted: null,
      reason: 'Informe um CPF ou CNPJ.',
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

  let kind: DocumentKind | 'unknown' = detectDocumentKind(digits)

  if (mode === 'cpf') kind = 'cpf'
  if (mode === 'cnpj') kind = 'cnpj'

  if (kind === 'unknown') {
    return {
      raw: trimmed,
      digits,
      kind,
      valid: false,
      formatted: null,
      reason:
        mode === 'auto'
          ? `Quantidade de dígitos inválida (${digits.length}). CPF tem 11; CNPJ tem 14.`
          : mode === 'cpf'
            ? `CPF deve ter 11 dígitos (encontrados ${digits.length}).`
            : `CNPJ deve ter 14 dígitos (encontrados ${digits.length}).`,
    }
  }

  if (mode === 'cpf' && digits.length !== 11) {
    return {
      raw: trimmed,
      digits,
      kind: 'cpf',
      valid: false,
      formatted: null,
      reason: `CPF deve ter 11 dígitos (encontrados ${digits.length}).`,
    }
  }

  if (mode === 'cnpj' && digits.length !== 14) {
    return {
      raw: trimmed,
      digits,
      kind: 'cnpj',
      valid: false,
      formatted: null,
      reason: `CNPJ deve ter 14 dígitos (encontrados ${digits.length}).`,
    }
  }

  if (REPEATED_DIGITS.test(digits)) {
    return {
      raw: trimmed,
      digits,
      kind,
      valid: false,
      formatted: null,
      reason: 'Sequência inválida (todos os dígitos iguais).',
    }
  }

  const valid = kind === 'cpf' ? validateCpfDigits(digits) : validateCnpjDigits(digits)

  return {
    raw: trimmed,
    digits,
    kind,
    valid,
    formatted: valid ? formatDocument(digits, kind) : null,
    reason: valid ? null : 'Dígitos verificadores inválidos.',
  }
}

function formatSingleResult(result: DocumentValidation): string {
  const lines = [
    result.valid ? '✓ Documento válido' : '✗ Documento inválido',
    `Tipo: ${result.kind === 'unknown' ? '—' : result.kind.toUpperCase()}`,
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]

  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)

  return lines.join('\n')
}

function formatBatchLine(result: DocumentValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  const kind = result.kind === 'unknown' ? '?' : result.kind.toUpperCase()
  return `${formatted} | ${kind} | ${label}${detail}`
}

function summarizeResults(results: DocumentValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleDocument(raw: string, mode: DocumentMode): DataToolResult {
  const result = validateDocument(raw, mode)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? 'Documento válido' : 'Documento inválido',
  }
}

export function validateDocumentBatch(raw: string, mode: DocumentMode): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new DataToolError('Informe ao menos um documento (um por linha).')
  }

  const results = lines.map((line) => validateDocument(line, mode))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateDocumentCsv(input: string, column: string, mode: DocumentMode): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de documentos.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateDocument(row[columnIndex] ?? '', mode))
  const headers = [...table.headers, 'doc_tipo', 'doc_valido', 'doc_formatado', 'doc_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
      result.kind === 'unknown' ? '' : result.kind.toUpperCase(),
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

export const cpfCnpjSamples = {
  singleCpf: '529.982.247-25',
  singleCnpj: '11.222.333/0001-81',
  batch: ['529.982.247-25', '111.111.111-11', '11.222.333/0001-81', '123'].join('\n'),
  csv: ['nome,documento', 'Ana Silva,52998224725', 'Empresa LTDA,11222333000181', 'Teste,11111111111', 'Erro,123'].join(
    '\n',
  ),
}

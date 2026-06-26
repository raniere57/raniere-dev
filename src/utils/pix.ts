import { serializeDelimited } from './csv'
import { validateDocument } from './cpfCnpj'
import { validateEmail, validatePhone, stripPhoneDigits } from './brContact'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type PixKeyKind = 'cpf' | 'cnpj' | 'email' | 'phone' | 'random' | 'unknown'

export interface PixValidation {
  raw: string
  kind: PixKeyKind
  valid: boolean
  formatted: string | null
  reason: string | null
}

const RANDOM_KEY_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const PIX_KIND_LABEL: Record<PixKeyKind, string> = {
  cpf: 'CPF',
  cnpj: 'CNPJ',
  email: 'E-mail',
  phone: 'Telefone (+55)',
  random: 'Chave aleatória',
  unknown: 'Desconhecido',
}

export function detectPixKeyKind(raw: string): PixKeyKind {
  const trimmed = raw.trim()
  if (!trimmed) return 'unknown'
  if (RANDOM_KEY_PATTERN.test(trimmed)) return 'random'
  if (trimmed.includes('@')) return 'email'

  const digits = trimmed.replace(/\D/g, '')
  if (/^\+/.test(trimmed) || (digits.length >= 10 && digits.length <= 13 && !trimmed.includes('.'))) {
    return 'phone'
  }
  if (digits.length === 11) return 'cpf'
  if (digits.length === 14) return 'cnpj'
  return 'unknown'
}

function normalizePixPhone(raw: string): string {
  let digits = stripPhoneDigits(raw)
  if (digits.startsWith('55') && digits.length >= 12) digits = digits.slice(2)
  return `+55${digits}`
}

function validatePixPhone(raw: string): PixValidation {
  const trimmed = raw.trim()
  const normalized = normalizePixPhone(trimmed)
  const digits = stripPhoneDigits(normalized)

  if (!/^\+55/.test(normalized) && stripPhoneDigits(trimmed).length >= 10) {
    // tentativa com +55 implícito
  }

  if (digits.length < 12 || digits.length > 13) {
    return {
      raw: trimmed,
      kind: 'phone',
      valid: false,
      formatted: null,
      reason: 'Telefone PIX deve ter DDD + número (10 ou 11 dígitos após +55).',
    }
  }

  const national = digits.slice(2)
  const phone = validatePhone(national)
  if (!phone.valid) {
    return {
      raw: trimmed,
      kind: 'phone',
      valid: false,
      formatted: null,
      reason: phone.reason ?? 'Telefone inválido para PIX.',
    }
  }

  return {
    raw: trimmed,
    kind: 'phone',
    valid: true,
    formatted: normalized,
    reason: null,
  }
}

export function validatePixKey(raw: string): PixValidation {
  const trimmed = raw.trim()
  if (!trimmed) {
    return { raw: trimmed, kind: 'unknown', valid: false, formatted: null, reason: 'Informe uma chave PIX.' }
  }

  const kind = detectPixKeyKind(trimmed)

  if (kind === 'random') {
    const formatted = trimmed.toLowerCase()
    return {
      raw: trimmed,
      kind,
      valid: true,
      formatted,
      reason: null,
    }
  }

  if (kind === 'email') {
    const email = validateEmail(trimmed)
    return {
      raw: trimmed,
      kind: 'email',
      valid: email.valid,
      formatted: email.valid ? email.formatted : null,
      reason: email.reason,
    }
  }

  if (kind === 'phone') {
    return validatePixPhone(trimmed)
  }

  if (kind === 'cpf') {
    const doc = validateDocument(trimmed, 'cpf')
    return {
      raw: trimmed,
      kind: 'cpf',
      valid: doc.valid,
      formatted: doc.valid ? doc.formatted : null,
      reason: doc.valid ? null : doc.reason,
    }
  }

  if (kind === 'cnpj') {
    const doc = validateDocument(trimmed, 'cnpj')
    return {
      raw: trimmed,
      kind: 'cnpj',
      valid: doc.valid,
      formatted: doc.valid ? doc.formatted : null,
      reason: doc.valid ? null : doc.reason,
    }
  }

  return {
    raw: trimmed,
    kind: 'unknown',
    valid: false,
    formatted: null,
    reason: 'Formato de chave PIX não reconhecido (CPF, CNPJ, e-mail, telefone +55 ou UUID).',
  }
}

function formatSingleResult(result: PixValidation): string {
  const lines = [
    result.valid ? '✓ Chave PIX válida' : '✗ Chave PIX inválida',
    `Tipo: ${PIX_KIND_LABEL[result.kind]}`,
    `Entrada: ${result.raw || '—'}`,
  ]
  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  return lines.join('\n')
}

function formatBatchLine(result: PixValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${PIX_KIND_LABEL[result.kind]} | ${label}${detail}`
}

function summarizeResults(results: PixValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSinglePix(raw: string): DataToolResult {
  const result = validatePixKey(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? `${PIX_KIND_LABEL[result.kind]} · válido` : 'Chave inválida',
  }
}

export function validatePixBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos uma chave PIX (uma por linha).')

  const results = lines.map((line) => validatePixKey(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validatePixCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de chaves PIX.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validatePixKey(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'pix_tipo', 'pix_valido', 'pix_formatado', 'pix_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
      PIX_KIND_LABEL[result.kind],
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

export const pixSamples = {
  single: '+5511987654321',
  batch: ['529.982.247-25', 'ana@example.com', '+5511987654321', '123e4567-e89b-12d3-a456-426614174000', 'invalido'].join(
    '\n',
  ),
  csv: [
    'nome,chave_pix',
    'Ana,52998224725',
    'Loja,11222333000181',
    'Contato,contato@empresa.com.br',
    'Cel,+5511987654321',
    'Erro,xyz',
  ].join('\n'),
}

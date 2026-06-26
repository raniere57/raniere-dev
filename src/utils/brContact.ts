import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

const VALID_DDD = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
])

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type ContactKind = 'email' | 'phone'

export interface ContactValidation {
  raw: string
  normalized: string
  kind: ContactKind
  valid: boolean
  formatted: string | null
  reason: string | null
}

export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function normalizePhoneDigits(value: string): string {
  let digits = stripPhoneDigits(value)
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2)
  }
  return digits
}

export function formatPhone(digits: string): string {
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return digits
}

export function validateEmail(raw: string): ContactValidation {
  const trimmed = raw.trim()

  if (!trimmed) {
    return {
      raw: trimmed,
      normalized: '',
      kind: 'email',
      valid: false,
      formatted: null,
      reason: 'Informe um e-mail.',
    }
  }

  if (trimmed.includes(' ')) {
    return {
      raw: trimmed,
      normalized: trimmed.toLowerCase(),
      kind: 'email',
      valid: false,
      formatted: null,
      reason: 'E-mail não pode conter espaços.',
    }
  }

  const normalized = trimmed.toLowerCase()

  if (!EMAIL_PATTERN.test(normalized)) {
    return {
      raw: trimmed,
      normalized,
      kind: 'email',
      valid: false,
      formatted: null,
      reason: 'Formato de e-mail inválido.',
    }
  }

  if (normalized.length > 254) {
    return {
      raw: trimmed,
      normalized,
      kind: 'email',
      valid: false,
      formatted: null,
      reason: 'E-mail longo demais.',
    }
  }

  return {
    raw: trimmed,
    normalized,
    kind: 'email',
    valid: true,
    formatted: normalized,
    reason: null,
  }
}

export function validatePhone(raw: string): ContactValidation {
  const trimmed = raw.trim()
  const digits = normalizePhoneDigits(trimmed)

  if (!trimmed) {
    return {
      raw: trimmed,
      normalized: '',
      kind: 'phone',
      valid: false,
      formatted: null,
      reason: 'Informe um telefone.',
    }
  }

  if (!digits) {
    return {
      raw: trimmed,
      normalized: '',
      kind: 'phone',
      valid: false,
      formatted: null,
      reason: 'Nenhum dígito encontrado.',
    }
  }

  if (digits.length !== 10 && digits.length !== 11) {
    return {
      raw: trimmed,
      normalized: digits,
      kind: 'phone',
      valid: false,
      formatted: null,
      reason: `Telefone BR deve ter 10 (fixo) ou 11 (celular) dígitos (encontrados ${digits.length}).`,
    }
  }

  const ddd = digits.slice(0, 2)
  if (!VALID_DDD.has(ddd)) {
    return {
      raw: trimmed,
      normalized: digits,
      kind: 'phone',
      valid: false,
      formatted: null,
      reason: `DDD ${ddd} inválido.`,
    }
  }

  if (digits.length === 11 && digits[2] !== '9') {
    return {
      raw: trimmed,
      normalized: digits,
      kind: 'phone',
      valid: false,
      formatted: null,
      reason: 'Celular deve começar com 9 após o DDD.',
    }
  }

  if (digits.length === 10 && !/[2-5]/.test(digits[2]!)) {
    return {
      raw: trimmed,
      normalized: digits,
      kind: 'phone',
      valid: false,
      formatted: null,
      reason: 'Fixo deve começar com 2, 3, 4 ou 5 após o DDD.',
    }
  }

  return {
    raw: trimmed,
    normalized: digits,
    kind: 'phone',
    valid: true,
    formatted: formatPhone(digits),
    reason: null,
  }
}

export function validateContact(raw: string, kind: ContactKind): ContactValidation {
  return kind === 'email' ? validateEmail(raw) : validatePhone(raw)
}

function formatSingleResult(result: ContactValidation): string {
  const lines = [
    result.valid ? '✓ Válido' : '✗ Inválido',
    `Tipo: ${result.kind === 'email' ? 'E-mail' : 'Telefone'}`,
    `Entrada: ${result.raw || '—'}`,
  ]

  if (result.kind === 'phone') lines.push(`Somente dígitos: ${result.normalized || '—'}`)
  else lines.push(`Normalizado: ${result.normalized || '—'}`)

  if (result.formatted) {
    lines.push(result.kind === 'email' ? `E-mail: ${result.formatted}` : `Formatado: ${result.formatted}`)
  }
  if (result.reason) lines.push(`Motivo: ${result.reason}`)

  return lines.join('\n')
}

function formatBatchLine(result: ContactValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${label}${detail}`
}

function summarizeResults(results: ContactValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleContact(raw: string, kind: ContactKind): DataToolResult {
  const result = validateContact(raw, kind)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? 'Válido' : 'Inválido',
  }
}

export function validateContactBatch(raw: string, kind: ContactKind): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new DataToolError('Informe ao menos um item (um por linha).')
  }

  const results = lines.map((line) => validateContact(line, kind))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateContactCsv(input: string, column: string, kind: ContactKind): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateContact(row[columnIndex] ?? '', kind))
  const headers = [...table.headers, 'contato_valido', 'contato_formatado', 'contato_motivo']
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

export const brContactSamples = {
  email: 'ana.silva@example.com',
  phone: '(86) 99999-1234',
  batchEmail: ['ana@example.com', 'invalido', 'contato@empresa.com.br'].join('\n'),
  batchPhone: ['86999991234', '(11) 3456-7890', '123', '(86) 88888-1111'].join('\n'),
  csvEmail: ['nome,email', 'Ana,ana@example.com', 'Ruim,nao-email', 'Beto,beto@empresa.com'].join('\n'),
  csvPhone: ['nome,telefone', 'Ana,(86) 99999-1234', 'Loja,(86) 3211-4455', 'Erro,123'].join('\n'),
}

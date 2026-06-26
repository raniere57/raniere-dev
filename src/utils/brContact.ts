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

export interface ContactCorrection extends ContactValidation {
  warnings: string[]
  changed: boolean
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

function pushWarning(warnings: string[], message: string) {
  if (!warnings.includes(message)) warnings.push(message)
}

/** Tenta extrair e limpar um e-mail malformado (modo correção). */
function sanitizeEmailCandidate(value: string, warnings: string[]): string {
  let v = value.toLowerCase()

  const embedded = v.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)
  if (embedded && embedded[0].toLowerCase() !== v) {
    v = embedded[0].toLowerCase()
    pushWarning(warnings, 'Extraído o trecho reconhecido como e-mail.')
  }

  const trimmedEdges = v.replace(/^[^a-z0-9._%+-]+/i, '').replace(/[^a-z0-9._%+-]+$/gi, '')
  if (trimmedEdges !== v) {
    v = trimmedEdges
    pushWarning(warnings, 'Caracteres inválidos nas extremidades removidos.')
  }

  let previous = ''
  while (previous !== v) {
    previous = v
    const stripped = v.replace(/[@.,;\s:<>]+$/g, '')
    if (stripped !== v) {
      v = stripped
      pushWarning(warnings, 'Sufixo inválido removido.')
    }
  }

  const atCount = (v.match(/@/g) ?? []).length
  if (atCount > 1) {
    const [local, ...rest] = v.split('@')
    const domain =
      rest.find((part) => /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(part)) ??
      rest.join('').replace(/@+/g, '')
    if (local && domain) {
      v = `${local}@${domain}`
      pushWarning(warnings, 'Múltiplos @ — reconstruído como local@domínio.')
    }
  }

  if (v.includes('..')) {
    v = v.replace(/\.{2,}/g, '.')
    pushWarning(warnings, 'Pontos duplicados removidos.')
  }

  return v
}

export function correctEmail(raw: string): ContactCorrection {
  const warnings: string[] = []
  const originalRaw = raw.trim()
  let value = originalRaw

  if (!value) {
    return { ...validateEmail(''), warnings: [], changed: false }
  }

  if (/^mailto:/i.test(value)) {
    value = value.replace(/^mailto:/i, '')
    pushWarning(warnings, 'Prefixo mailto: removido.')
  }

  const bracketMatch = value.match(/<([^>]+@[^>]+)>/)
  if (bracketMatch) {
    value = bracketMatch[1]!.trim()
    pushWarning(warnings, 'Mantido apenas o e-mail entre <>.')
  }

  if (/[,;|]/.test(value)) {
    const first = value.split(/[,;|]/)[0]?.trim() ?? value
    if (first !== value) {
      value = first
      pushWarning(warnings, 'Separadores detectados — mantido só o primeiro e-mail.')
    }
  }

  const withoutSpaces = value.replace(/\s+/g, '')
  if (withoutSpaces !== value) {
    value = withoutSpaces
    pushWarning(warnings, 'Espaços removidos.')
  }

  value = sanitizeEmailCandidate(value, warnings)
  let normalized = value.toLowerCase()
  if (normalized !== raw.trim().replace(/\s+/g, '')) {
    pushWarning(warnings, 'E-mail normalizado.')
  }

  let validation = validateEmail(normalized)

  if (!validation.valid && normalized.length > 3) {
    let attempt = normalized
    for (let i = 0; i < 8 && !validation.valid; i += 1) {
      const next = sanitizeEmailCandidate(attempt, warnings)
      if (next !== attempt) {
        attempt = next
      } else {
        const trimmed = attempt.replace(/[^a-z0-9._%+-@]+$/i, '')
        if (trimmed === attempt) break
        attempt = trimmed
        pushWarning(warnings, 'Caracteres finais inválidos removidos.')
      }
      validation = validateEmail(attempt)
      normalized = attempt
    }
  }

  return {
    ...validation,
    raw: originalRaw,
    warnings,
    changed: warnings.length > 0 || validation.formatted !== originalRaw,
  }
}

function insertMobileNineIfNeeded(digits: string, warnings: string[]): string {
  if (digits.length !== 10) return digits

  const localStart = digits[2]
  if (!localStart) return digits

  // Fixo: 8 dígitos após DDD começando em 2–5 — não inserir 9
  if (/[2-5]/.test(localStart)) return digits

  // Celular sem o 9: 8 dígitos após DDD começando em 6–9 (ou qualquer coisa ≠ fixo)
  if (/[6-9]/.test(localStart)) {
    pushWarning(warnings, 'Nono dígito (9) inserido após o DDD (celular BR).')
    return `${digits.slice(0, 2)}9${digits.slice(2)}`
  }

  return digits
}

export function correctPhone(raw: string): ContactCorrection {
  const warnings: string[] = []
  const originalRaw = raw.trim()
  let digits = stripPhoneDigits(originalRaw)

  if (!digits) {
    return { ...validatePhone(''), warnings: [], changed: false }
  }

  if (digits.startsWith('55') && digits.length >= 12) {
    digits = digits.slice(2)
    pushWarning(warnings, 'Código do país (+55) removido.')
  }

  while (digits.startsWith('0') && digits.length > 11) {
    digits = digits.slice(1)
    pushWarning(warnings, 'Zero(s) à esquerda removido(s).')
  }

  if (digits.length > 11) {
    const extra = digits.length - 11
    digits = digits.slice(-11)
    pushWarning(warnings, `${extra} dígito(s) extra(s) removido(s) — confira se o número ficou correto.`)
  }

  digits = insertMobileNineIfNeeded(digits, warnings)

  if (digits.length === 9 && VALID_DDD.has(digits.slice(0, 2))) {
    digits = `${digits.slice(0, 2)}9${digits.slice(2)}`
    pushWarning(warnings, 'Nono dígito (9) inserido após o DDD (celular BR).')
  }

  let validation = validatePhone(digits)

  // Fallback: 10 dígitos com 9 na 3ª posição = celular sem nono dígito
  if (!validation.valid && digits.length === 10 && digits[2] === '9') {
    digits = `${digits.slice(0, 2)}9${digits.slice(2)}`
    pushWarning(warnings, 'Nono dígito (9) inserido após o DDD (celular BR).')
    validation = validatePhone(digits)
  }

  if (digits.length === 9) {
    pushWarning(warnings, 'Nove dígitos — não foi possível completar o número.')
  } else if (digits.length === 8) {
    pushWarning(warnings, 'Oito dígitos — informe o DDD.')
  }

  const changed =
    warnings.length > 0 ||
    digits !== normalizePhoneDigits(originalRaw) ||
    validation.formatted !== originalRaw

  return {
    ...validation,
    raw: originalRaw,
    warnings,
    changed,
  }
}

export function correctContact(raw: string, kind: ContactKind): ContactCorrection {
  return kind === 'email' ? correctEmail(raw) : correctPhone(raw)
}

function formatSingleResult(result: ContactValidation, warnings?: string[], corrected = false): string {
  const status = result.valid
    ? corrected
      ? '✓ Corrigido e válido'
      : '✓ Válido'
    : corrected
      ? '✗ Ainda inválido após correção'
      : '✗ Inválido'
  const lines = [status, `Tipo: ${result.kind === 'email' ? 'E-mail' : 'Telefone'}`, `Entrada: ${result.raw || '—'}`]

  if (result.kind === 'phone') lines.push(`Somente dígitos: ${result.normalized || '—'}`)
  else lines.push(`Normalizado: ${result.normalized || '—'}`)

  if (result.formatted) {
    lines.push(result.kind === 'email' ? `E-mail: ${result.formatted}` : `Formatado: ${result.formatted}`)
  }
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  if (warnings?.length) {
    lines.push('', '⚠ Ajustes aplicados (possível perda de dados):')
    warnings.forEach((warning) => lines.push(`  · ${warning}`))
  }

  return lines.join('\n')
}

function formatBatchLine(result: ContactValidation, warnings?: string[]): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  const warn = warnings?.length ? ` ⚠ ${warnings.join('; ')}` : ''
  return `${formatted} | ${label}${detail}${warn}`
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

export function correctSingleContact(raw: string, kind: ContactKind): DataToolResult {
  const result = correctContact(raw, kind)
  return {
    output: formatSingleResult(result, result.warnings, true),
    meta: result.valid
      ? result.warnings.length
        ? 'Corrigido · válido'
        : 'Válido · sem alterações'
      : result.warnings.length
        ? 'Corrigido · ainda inválido'
        : 'Inválido',
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
    output: results.map((item) => formatBatchLine(item)).join('\n'),
    meta: summarizeResults(results),
  }
}

export function correctContactBatch(raw: string, kind: ContactKind): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new DataToolError('Informe ao menos um item (um por linha).')
  }

  const results = lines.map((line) => correctContact(line, kind))
  const adjusted = results.filter((item) => item.warnings.length > 0).length
  return {
    output: results.map((item) => formatBatchLine(item, item.warnings)).join('\n'),
    meta: `${summarizeResults(results)} · ${adjusted} com ajustes`,
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

export function correctContactCsv(input: string, column: string, kind: ContactKind): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => correctContact(row[columnIndex] ?? '', kind))
  const headers = [
    ...table.headers,
    'contato_valido',
    'contato_formatado',
    'contato_motivo',
    'contato_ajustes',
  ]
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
      result.valid ? 'sim' : 'nao',
      result.formatted ?? '',
      result.reason ?? '',
      result.warnings.join(' | '),
    ]
  })

  const adjusted = results.filter((item) => item.warnings.length > 0).length
  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(results)} · ${adjusted} com ajustes`,
  }
}

export const brContactSamples = {
  email: 'ana.silva@example.com',
  emailMessy: 'ana.silva@example.com@',
  phone: '(86) 99999-1234',
  phoneMessy: '+55 (86) 9999-1234',
  batchEmail: ['ana@example.com', 'invalido', 'contato@empresa.com.br'].join('\n'),
  batchPhone: ['86999991234', '(11) 3456-7890', '123', '(86) 88888-1111'].join('\n'),
  csvEmail: ['nome,email', 'Ana,ana@example.com', 'Ruim,nao-email', 'Beto,beto@empresa.com'].join('\n'),
  csvPhone: ['nome,telefone', 'Ana,(86) 99999-1234', 'Loja,(86) 3211-4455', 'Erro,123'].join('\n'),
}

export const CONTACT_CORRECTION_HINT =
  'Correção pode remover prefixos, sufixos, espaços ou dígitos extras. Confira o resultado antes de usar em produção.'

import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export interface CreditCardValidation {
  raw: string
  digits: string
  brand: string
  valid: boolean
  formatted: string | null
  reason: string | null
}

const REPEATED_DIGITS = /^(\d)\1+$/

export function stripCardDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function detectCardBrand(digits: string): string {
  if (/^4/.test(digits)) return 'Visa'
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'American Express'
  if (/^3(0[0-5]|[68])/.test(digits)) return 'Diners Club'
  if (/^6(?:011|5)/.test(digits)) return 'Discover'
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(digits)) return 'Elo'
  if (/^(606282|3841)/.test(digits)) return 'Hipercard'
  if (/^35/.test(digits)) return 'JCB'
  return 'Desconhecida'
}

function expectedLengthForBrand(brand: string): number[] {
  switch (brand) {
    case 'American Express':
      return [15]
    case 'Diners Club':
      return [14, 16, 19]
    default:
      return [13, 14, 15, 16, 17, 18, 19]
  }
}

export function luhnCheck(digits: string): boolean {
  let sum = 0
  let alternate = false

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (alternate) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    alternate = !alternate
  }

  return sum % 10 === 0
}

export function formatCreditCard(digits: string, brand: string): string {
  if (brand === 'American Express') {
    return digits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3')
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function validateCreditCard(raw: string): CreditCardValidation {
  const trimmed = raw.trim()
  const digits = stripCardDigits(trimmed)

  if (!trimmed) {
    return {
      raw: trimmed,
      digits,
      brand: '—',
      valid: false,
      formatted: null,
      reason: 'Informe um número de cartão.',
    }
  }

  if (!digits) {
    return {
      raw: trimmed,
      digits,
      brand: '—',
      valid: false,
      formatted: null,
      reason: 'Nenhum dígito encontrado.',
    }
  }

  if (digits.length < 13 || digits.length > 19) {
    return {
      raw: trimmed,
      digits,
      brand: detectCardBrand(digits),
      valid: false,
      formatted: null,
      reason: `Cartão deve ter entre 13 e 19 dígitos (encontrados ${digits.length}).`,
    }
  }

  if (REPEATED_DIGITS.test(digits)) {
    return {
      raw: trimmed,
      digits,
      brand: detectCardBrand(digits),
      valid: false,
      formatted: null,
      reason: 'Sequência inválida (todos os dígitos iguais).',
    }
  }

  const brand = detectCardBrand(digits)
  const allowedLengths = expectedLengthForBrand(brand)
  if (brand !== 'Desconhecida' && !allowedLengths.includes(digits.length)) {
    return {
      raw: trimmed,
      digits,
      brand,
      valid: false,
      formatted: null,
      reason: `${brand} normalmente usa ${allowedLengths.join(' ou ')} dígitos.`,
    }
  }

  const valid = luhnCheck(digits)
  return {
    raw: trimmed,
    digits,
    brand,
    valid,
    formatted: valid ? formatCreditCard(digits, brand) : null,
    reason: valid ? null : 'Não passou no algoritmo de Luhn.',
  }
}

function formatSingleResult(result: CreditCardValidation): string {
  const lines = [
    result.valid ? '✓ Cartão válido (Luhn)' : '✗ Cartão inválido',
    `Bandeira: ${result.brand}`,
    `Entrada: ${result.raw || '—'}`,
    `Somente dígitos: ${result.digits || '—'}`,
  ]
  if (result.formatted) lines.push(`Formatado: ${result.formatted}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  lines.push('', 'Nota: validação estrutural apenas — não confirma cartão real ou saldo.')
  return lines.join('\n')
}

function formatBatchLine(result: CreditCardValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const formatted = result.formatted ?? result.raw
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${formatted} | ${result.brand} | ${label}${detail}`
}

function summarizeResults(results: CreditCardValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleCreditCard(raw: string): DataToolResult {
  const result = validateCreditCard(raw)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? `${result.brand} · válido` : 'Cartão inválido',
  }
}

export function validateCreditCardBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos um cartão (um por linha).')

  const results = lines.map((line) => validateCreditCard(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateCreditCardCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de cartões.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateCreditCard(row[columnIndex] ?? ''))
  const headers = [...table.headers, 'cartao_bandeira', 'cartao_valido', 'cartao_formatado', 'cartao_motivo']
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
      result.brand,
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

export const creditCardSamples = {
  single: '4111 1111 1111 1111',
  batch: ['4111 1111 1111 1111', '3782 822463 10005', '4111 1111 1111 1112'].join('\n'),
  csv: ['cliente,cartao', 'Ana,4111111111111111', 'Erro,4111111111111112', 'Teste,0000000000000000'].join('\n'),
}

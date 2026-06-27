import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export interface BankAccountInput {
  bankCode: string
  agency: string
  operation?: string
  accountBody: string
  accountDigit: string
}

export interface BankAccountValidation {
  raw: string
  bankCode: string
  bankName: string
  agency: string
  operation: string | null
  account: string
  digit: string
  valid: boolean
  expectedDigit: string | null
  reason: string | null
}

export const BANK_NAMES: Record<string, string> = {
  '001': 'Banco do Brasil',
  '033': 'Santander',
  '104': 'Caixa Econômica',
  '237': 'Bradesco',
  '341': 'Itaú',
  '756': 'Sicoob',
  '748': 'Sicredi',
  '260': 'Nubank',
  '077': 'Inter',
}

const SUPPORTED_BANKS = new Set(['001', '033', '104', '237', '341'])

export function getBankName(code: string): string {
  return BANK_NAMES[code] ?? `Banco ${code}`
}

export function parseAccountWithDigit(raw: string): { body: string; digit: string } {
  const trimmed = raw.trim()
  const match = trimmed.match(/^(\d+)[\s-]?([0-9XP])$/i)
  if (match) return { body: match[1]!, digit: match[2]!.toUpperCase() }

  const alnum = trimmed.replace(/[^0-9XP]/gi, '')
  if (alnum.length >= 2) {
    return { body: alnum.slice(0, -1).replace(/\D/g, ''), digit: alnum.slice(-1).toUpperCase() }
  }

  return { body: trimmed.replace(/\D/g, ''), digit: '' }
}

export function parseBankAccountLine(raw: string): BankAccountInput | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const parts = trimmed.split(/[|;/]+/).map((part) => part.trim()).filter(Boolean)
  if (parts.length < 3) {
    const spaced = trimmed.split(/\s+/).filter(Boolean)
    if (spaced.length < 3) return null
    return parseBankAccountLine(spaced.join(';'))
  }

  const bankCode = parts[0]!.replace(/\D/g, '').padStart(3, '0').slice(-3)

  if (bankCode === '104' && parts.length >= 4) {
    const { body, digit } = parseAccountWithDigit(parts[3]!)
    return {
      bankCode,
      agency: parts[1]!.replace(/\D/g, ''),
      operation: parts[2]!.replace(/\D/g, ''),
      accountBody: body,
      accountDigit: digit,
    }
  }

  const { body, digit } = parseAccountWithDigit(parts[2]!)
  return {
    bankCode,
    agency: parts[1]!.replace(/\D/g, ''),
    accountBody: body,
    accountDigit: digit,
  }
}

function mod11Digit(sum: number, restRules: { zero: string; one: string }): string {
  const rest = sum % 11
  if (rest === 0) return restRules.zero
  if (rest === 1) return restRules.one
  return String(11 - rest)
}

function validateBB(input: BankAccountInput): string {
  const account = input.accountBody.replace(/\D/g, '').padStart(8, '0')
  const weights = [9, 8, 7, 6, 5, 4, 3, 2]
  const sum = account.split('').reduce((total, digit, index) => total + Number(digit) * weights[index]!, 0)
  return mod11Digit(sum, { zero: '0', one: 'X' })
}

function validateBradesco(input: BankAccountInput): string {
  const account = input.accountBody.replace(/\D/g, '').padStart(7, '0')
  const weights = [2, 3, 4, 5, 6, 7]
  let sum = 0
  for (let index = account.length - 1, weightIndex = 0; index >= 0; index -= 1, weightIndex += 1) {
    sum += Number(account[index]) * weights[weightIndex % weights.length]!
  }
  return mod11Digit(sum, { zero: '0', one: 'P' })
}

function validateItau(input: BankAccountInput): string {
  const agency = input.agency.replace(/\D/g, '').padStart(4, '0')
  const account = input.accountBody.replace(/\D/g, '').padStart(5, '0')
  const sequence = `${agency}${account}`
  let sum = 0
  for (let index = 0; index < sequence.length; index += 1) {
    let product = Number(sequence[index]) * (index % 2 === 0 ? 2 : 1)
    if (product > 9) product = Math.floor(product / 10) + (product % 10)
    sum += product
  }
  return String((10 - (sum % 10)) % 10)
}

function validateCaixa(input: BankAccountInput): string {
  const operation = (input.operation ?? '001').replace(/\D/g, '').padStart(3, '0')
  const account = input.accountBody.replace(/\D/g, '').padStart(8, '0')
  const sequence = `${operation}${account}`
  const weights = [8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6]
  let sum = 0
  for (let index = sequence.length - 1, weightIndex = 0; index >= 0; index -= 1, weightIndex += 1) {
    sum += Number(sequence[index]) * weights[weightIndex % weights.length]!
  }
  const rest = sum % 11
  if (rest === 0 || rest === 1) return '0'
  return String(11 - rest)
}

function validateSantander(input: BankAccountInput): string {
  const agency = input.agency.replace(/\D/g, '').padStart(4, '0')
  const account = input.accountBody.replace(/\D/g, '').padStart(8, '0')
  const sequence = `${agency}${account}`
  const weights = [9, 7, 3, 1, 9, 7, 1, 3, 1, 9, 7, 3]
  let sum = 0
  for (let index = sequence.length - 1, weightIndex = 0; index >= 0; index -= 1, weightIndex += 1) {
    sum += Number(sequence[index]) * weights[weightIndex % weights.length]!
  }
  const rest = sum % 10
  return String((10 - rest) % 10)
}

function calculateExpectedDigit(input: BankAccountInput): string | null {
  switch (input.bankCode) {
    case '001':
      return validateBB(input)
    case '237':
      return validateBradesco(input)
    case '341':
      return validateItau(input)
    case '104':
      return validateCaixa(input)
    case '033':
      return validateSantander(input)
    default:
      return null
  }
}

export function validateBankAccountFields(
  bankCode: string,
  agency: string,
  accountWithDigit: string,
  operation?: string,
): BankAccountValidation {
  const code = bankCode.replace(/\D/g, '').padStart(3, '0').slice(-3)
  const { body, digit } = parseAccountWithDigit(accountWithDigit)
  const raw = [code, agency, operation, accountWithDigit].filter(Boolean).join(' ')

  const input: BankAccountInput = {
    bankCode: code,
    agency: agency.replace(/\D/g, ''),
    operation: operation?.replace(/\D/g, ''),
    accountBody: body,
    accountDigit: digit.toUpperCase(),
  }

  if (!code || !input.agency || !body || !digit) {
    return {
      raw,
      bankCode: code,
      bankName: getBankName(code),
      agency: input.agency,
      operation: input.operation ?? null,
      account: body,
      digit: digit.toUpperCase(),
      valid: false,
      expectedDigit: null,
      reason: 'Informe banco, agência e conta com dígito.',
    }
  }

  if (!SUPPORTED_BANKS.has(code)) {
    return {
      raw,
      bankCode: code,
      bankName: getBankName(code),
      agency: input.agency,
      operation: input.operation ?? null,
      account: body,
      digit: digit.toUpperCase(),
      valid: false,
      expectedDigit: null,
      reason: `Banco ${code} ainda não suportado. Use: ${[...SUPPORTED_BANKS].join(', ')}.`,
    }
  }

  if (code === '104' && !input.operation) {
    return {
      raw,
      bankCode: code,
      bankName: getBankName(code),
      agency: input.agency,
      operation: null,
      account: body,
      digit: digit.toUpperCase(),
      valid: false,
      expectedDigit: null,
      reason: 'Caixa exige código de operação (ex.: 001, 013, 023).',
    }
  }

  const expectedDigit = calculateExpectedDigit(input)
  const valid = expectedDigit?.toUpperCase() === digit.toUpperCase()

  return {
    raw,
    bankCode: code,
    bankName: getBankName(code),
    agency: input.agency,
    operation: input.operation ?? null,
    account: body,
    digit: digit.toUpperCase(),
    valid,
    expectedDigit,
    reason: valid
      ? null
      : expectedDigit
        ? `Dígito esperado: ${expectedDigit} (informado: ${digit.toUpperCase()}).`
        : 'Não foi possível calcular o dígito.',
  }
}

export function validateBankAccountLine(raw: string): BankAccountValidation {
  const parsed = parseBankAccountLine(raw)
  if (!parsed) {
    return {
      raw,
      bankCode: '',
      bankName: '—',
      agency: '',
      operation: null,
      account: '',
      digit: '',
      valid: false,
      expectedDigit: null,
      reason: 'Formato: banco;agência;conta-dv (Caixa: banco;agência;operação;conta-dv).',
    }
  }

  return validateBankAccountFields(
    parsed.bankCode,
    parsed.agency,
    `${parsed.accountBody}-${parsed.accountDigit}`,
    parsed.operation,
  )
}

function formatSingleResult(result: BankAccountValidation): string {
  const lines = [
    result.valid ? '✓ Conta válida (DV)' : '✗ Conta inválida',
    `Banco: ${result.bankCode} — ${result.bankName}`,
    `Agência: ${result.agency || '—'}`,
  ]
  if (result.operation) lines.push(`Operação: ${result.operation}`)
  lines.push(`Conta: ${result.account}-${result.digit}`)
  if (result.expectedDigit && !result.valid) lines.push(`Dígito esperado: ${result.expectedDigit}`)
  if (result.reason) lines.push(`Motivo: ${result.reason}`)
  lines.push('', 'Nota: valida apenas o dígito verificador — não confirma se a conta existe.')
  return lines.join('\n')
}

function formatBatchLine(result: BankAccountValidation): string {
  const label = result.valid ? '✓ válido' : '✗ inválido'
  const account = `${result.bankCode} | ${result.agency} | ${result.account}-${result.digit}`
  const detail = result.reason ? ` — ${result.reason}` : ''
  return `${account} | ${label}${detail}`
}

function summarizeResults(results: BankAccountValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export function validateSingleBankAccount(
  bankCode: string,
  agency: string,
  accountWithDigit: string,
  operation?: string,
): DataToolResult {
  const result = validateBankAccountFields(bankCode, agency, accountWithDigit, operation)
  return {
    output: formatSingleResult(result),
    meta: result.valid ? `${result.bankName} · DV ok` : 'Conta inválida',
  }
}

export function validateBankAccountBatch(raw: string): DataToolResult {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) throw new DataToolError('Informe ao menos uma conta (uma por linha).')

  const results = lines.map((line) => validateBankAccountLine(line))
  return {
    output: results.map(formatBatchLine).join('\n'),
    meta: summarizeResults(results),
  }
}

export function validateBankAccountCsv(input: string, column: string): DataToolResult {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de contas.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  const columnIndex = table.headers.indexOf(column)
  const results = table.rows.map((row) => validateBankAccountLine(row[columnIndex] ?? ''))
  const headers = [
    ...table.headers,
    'conta_banco',
    'conta_valida',
    'conta_digito_esperado',
    'conta_motivo',
  ]
  const rows = table.rows.map((row, index) => {
    const result = results[index]!
    return [
      ...row,
      result.bankCode,
      result.valid ? 'sim' : 'nao',
      result.expectedDigit ?? '',
      result.reason ?? '',
    ]
  })

  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(results)}`,
  }
}

export const bankAccountSamples = {
  single: { bank: '001', agency: '1234', account: '56793-0', operation: '' },
  batch: ['001;1234;56793-0', '341;1234;12345-6', '104;1234;001;12345678-9', '237;1234;1234567-0'].join('\n'),
  csv: [
    'nome,conta',
    'Ana,001;1234;56793-0',
    'Erro,341;1234;00000-0',
    'Caixa,104;1234;001;12345678-9',
  ].join('\n'),
}

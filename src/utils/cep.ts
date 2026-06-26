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

export interface CepAddress {
  cep: string
  street: string
  complement: string
  district: string
  city: string
  state: string
  ibge: string
  found: boolean
}

export interface CepLocation {
  lat: number
  lon: number
  label: string
}

interface ViaCepResponse {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  ibge?: string
  erro?: boolean
}

const REPEATED_DIGITS = /^(\d)\1+$/
const VIACEP_TIMEOUT_MS = 12_000
const VIACEP_BATCH_DELAY_MS = 300
const NOMINATIM_TIMEOUT_MS = 10_000
const NOMINATIM_USER_AGENT = 'raniere.dev/1.0 (CEP validator; https://raniere.dev)'

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

function mapViaCep(data: ViaCepResponse, digits: string): CepAddress {
  if (data.erro) {
    return {
      cep: formatCep(digits),
      street: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      ibge: '',
      found: false,
    }
  }

  return {
    cep: data.cep ?? formatCep(digits),
    street: data.logradouro ?? '',
    complement: data.complemento ?? '',
    district: data.bairro ?? '',
    city: data.localidade ?? '',
    state: data.uf ?? '',
    ibge: data.ibge ?? '',
    found: true,
  }
}

export async function fetchCepAddress(digits: string): Promise<CepAddress> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), VIACEP_TIMEOUT_MS)

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      throw new DataToolError('ViaCEP indisponível no momento. Tente novamente.')
    }

    const data = (await response.json()) as ViaCepResponse
    return mapViaCep(data, digits)
  } catch (cause) {
    if (cause instanceof DataToolError) throw cause
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw new DataToolError('Consulta ao ViaCEP expirou. Tente novamente.')
    }
    throw new DataToolError('Não foi possível consultar o ViaCEP. Verifique sua conexão.')
  } finally {
    window.clearTimeout(timeout)
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function formatAddressLine(address: CepAddress): string {
  return [address.street, address.district, `${address.city} — ${address.state}`]
    .filter(Boolean)
    .join(', ')
}

function buildGeocodeQueries(address: CepAddress): string[] {
  const queries: string[] = []

  if (address.street) {
    queries.push(formatAddressLine(address))
  }

  queries.push(`${address.cep}, ${address.city}, ${address.state}, Brasil`)
  queries.push(`${address.city}, ${address.state}, Brasil`)

  return [...new Set(queries.filter(Boolean))]
}

interface NominatimResult {
  lat?: string
  lon?: string
  display_name?: string
}

async function searchNominatim(query: string): Promise<CepLocation | null> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), NOMINATIM_TIMEOUT_MS)

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '1')
    url.searchParams.set('countrycodes', 'br')

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': NOMINATIM_USER_AGENT,
      },
    })

    if (!response.ok) return null

    const results = (await response.json()) as NominatimResult[]
    const hit = results[0]
    if (!hit?.lat || !hit.lon) return null

    const lat = Number.parseFloat(hit.lat)
    const lon = Number.parseFloat(hit.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null

    return {
      lat,
      lon,
      label: hit.display_name ?? query,
    }
  } catch {
    return null
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function geocodeCepAddress(address: CepAddress): Promise<CepLocation | null> {
  if (!address.found) return null

  for (const query of buildGeocodeQueries(address)) {
    const location = await searchNominatim(query)
    if (location) return location
  }

  return null
}

export function buildOsmEmbedUrl(location: CepLocation): string {
  const delta = 0.012
  const bbox = `${location.lon - delta},${location.lat - delta},${location.lon + delta},${location.lat + delta}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat},${location.lon}`
}

export function buildGoogleMapsUrl(location: CepLocation): string {
  const url = new URL('https://www.google.com/maps/search/')
  url.searchParams.set('api', '1')
  url.searchParams.set('query', `${location.lat},${location.lon}`)
  return url.toString()
}

export function buildOpenStreetMapUrl(location: CepLocation): string {
  return `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lon}#map=16/${location.lat}/${location.lon}`
}

export function formatAddressBlock(address: CepAddress): string {
  if (!address.found) {
    return 'CEP não encontrado na base dos Correios.'
  }

  const parts = [
    address.street,
    address.district,
    `${address.city}${address.state ? ` — ${address.state}` : ''}`,
    address.complement ? `Complemento: ${address.complement}` : '',
    address.ibge ? `IBGE: ${address.ibge}` : '',
  ].filter(Boolean)

  return parts.join('\n')
}

function formatSingleResult(validation: CepValidation, address?: CepAddress): string {
  const lines = [
    validation.valid ? '✓ CEP válido' : '✗ CEP inválido',
    `Entrada: ${validation.raw || '—'}`,
    `Somente dígitos: ${validation.digits || '—'}`,
  ]

  if (validation.formatted) lines.push(`Formatado: ${validation.formatted}`)
  if (validation.reason) lines.push(`Motivo: ${validation.reason}`)

  if (address) {
    lines.push('', 'Endereço (ViaCEP):', formatAddressBlock(address))
  }

  return lines.join('\n')
}

function formatBatchLine(validation: CepValidation, address?: CepAddress): string {
  const label = validation.valid ? '✓ válido' : '✗ inválido'
  const formatted = validation.formatted ?? validation.raw
  const detail = validation.reason ? ` — ${validation.reason}` : ''
  if (!address || !validation.valid) {
    return `${formatted} | ${label}${detail}`
  }
  if (!address.found) {
    return `${formatted} | ${label} — CEP não encontrado`
  }
  const location = [address.street, address.district, `${address.city}/${address.state}`]
    .filter(Boolean)
    .join(', ')
  return `${formatted} | ${label} | ${location}`
}

function summarizeResults(results: CepValidation[]): string {
  const valid = results.filter((item) => item.valid).length
  const invalid = results.length - valid
  return `${valid} válido${valid === 1 ? '' : 's'} · ${invalid} inválido${invalid === 1 ? '' : 's'}`
}

export async function validateSingleCep(
  raw: string,
): Promise<DataToolResult & { address?: CepAddress; location?: CepLocation | null }> {
  const validation = validateCep(raw)
  if (!validation.valid) {
    return {
      output: formatSingleResult(validation),
      meta: 'CEP inválido',
    }
  }

  const address = await fetchCepAddress(validation.digits)
  const location = address.found ? await geocodeCepAddress(address) : null
  return {
    output: formatSingleResult(validation, address),
    meta: address.found ? `${address.city} — ${address.state}` : 'CEP não encontrado',
    address,
    location,
  }
}

export async function validateCepBatch(raw: string): Promise<DataToolResult> {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new DataToolError('Informe ao menos um CEP (um por linha).')
  }

  if (lines.length > 20) {
    throw new DataToolError('Máximo de 20 CEPs por consulta em lote (ViaCEP).')
  }

  const validations = lines.map((line) => validateCep(line))
  const outputLines: string[] = []
  let found = 0

  for (let index = 0; index < validations.length; index += 1) {
    const validation = validations[index]!
    if (!validation.valid) {
      outputLines.push(formatBatchLine(validation))
      continue
    }

    if (index > 0) await sleep(VIACEP_BATCH_DELAY_MS)
    const address = await fetchCepAddress(validation.digits)
    if (address.found) found += 1
    outputLines.push(formatBatchLine(validation, address))
  }

  return {
    output: outputLines.join('\n'),
    meta: `${summarizeResults(validations)} · ${found} endereço${found === 1 ? '' : 's'} encontrado${found === 1 ? '' : 's'}`,
  }
}

export async function validateCepCsv(input: string, column: string): Promise<DataToolResult> {
  const table = parseInputTable(input, 'auto')
  if (!column) throw new DataToolError('Selecione a coluna de CEP.')
  if (!table.headers.includes(column)) throw new DataToolError(`Coluna "${column}" não encontrada.`)

  if (table.rows.length > 30) {
    throw new DataToolError('Máximo de 30 linhas por consulta CSV (ViaCEP).')
  }

  const columnIndex = table.headers.indexOf(column)
  const validations = table.rows.map((row) => validateCep(row[columnIndex] ?? ''))
  const headers = [
    ...table.headers,
    'cep_valido',
    'cep_formatado',
    'cep_motivo',
    'cep_logradouro',
    'cep_bairro',
    'cep_cidade',
    'cep_uf',
  ]

  const rows: string[][] = []
  let found = 0

  for (let index = 0; index < table.rows.length; index += 1) {
    const row = table.rows[index]!
    const validation = validations[index]!
    let address: CepAddress | undefined

    if (validation.valid) {
      if (index > 0) await sleep(VIACEP_BATCH_DELAY_MS)
      address = await fetchCepAddress(validation.digits)
      if (address.found) found += 1
    }

    rows.push([
      ...row,
      validation.valid ? 'sim' : 'nao',
      validation.formatted ?? '',
      validation.reason ?? '',
      address?.street ?? '',
      address?.district ?? '',
      address?.city ?? '',
      address?.state ?? '',
    ])
  }

  return {
    output: serializeDelimited([headers, ...rows]),
    meta: `${table.rows.length} linha${table.rows.length === 1 ? '' : 's'} · ${summarizeResults(validations)} · ${found} endereço${found === 1 ? '' : 's'}`,
  }
}

export const cepSamples = {
  single: '64010-010',
  batch: ['64010-010', '01310-100', '123', '00000-000'].join('\n'),
  csv: ['cidade,cep', 'Teresina,64010010', 'São Paulo,01310100', 'Erro,123'].join('\n'),
}

export const CEP_LOOKUP_HINT =
  'Consulta de endereço via ViaCEP — o CEP é enviado à API pública dos Correios. Mapa via OpenStreetMap (geocodificação aproximada).'

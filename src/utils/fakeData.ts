import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'

const FIRST_NAMES = ['Ana', 'Lucas', 'Maria', 'João', 'Julia', 'Pedro', 'Carla', 'Rafael', 'Beatriz', 'Felipe']
const LAST_NAMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Pereira', 'Rodrigues', 'Almeida', 'Gomes']
const CITIES = ['Teresina', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Recife', 'Curitiba', 'Salvador', 'Fortaleza']

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function slug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
}

function fakeCpf(): string {
  const part = () => String(randomInt(100, 999))
  return `${part()}.${part()}.${part()}-${String(randomInt(10, 99))}`
}

function fakeDate(): string {
  const year = randomInt(2020, 2026)
  const month = String(randomInt(1, 12)).padStart(2, '0')
  const day = String(randomInt(1, 28)).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export type FakeOutputFormat = 'json' | 'csv'

export function generateFakeData(
  count: number,
  format: FakeOutputFormat,
): DataToolResult {
  if (!Number.isFinite(count) || count < 1 || count > 10_000) {
    throw new DataToolError('Informe entre 1 e 10.000 linhas.')
  }

  const rows = Array.from({ length: count }, (_, index) => {
    const first = randomItem(FIRST_NAMES)
    const last = randomItem(LAST_NAMES)
    const fullName = `${first} ${last}`
    const email = `${slug(first)}.${slug(last)}${randomInt(1, 99)}@exemplo.com`

    return {
      id: index + 1,
      nome: fullName,
      email,
      cpf: fakeCpf(),
      cidade: randomItem(CITIES),
      ativo: Math.random() > 0.3,
      valor: Number((Math.random() * 5000 + 50).toFixed(2)),
      criado_em: fakeDate(),
    }
  })

  if (format === 'json') {
    return {
      output: JSON.stringify(rows, null, 2),
      meta: `${count} registro${count === 1 ? '' : 's'} · JSON`,
    }
  }

  const headers = ['id', 'nome', 'email', 'cpf', 'cidade', 'ativo', 'valor', 'criado_em']
  const matrix = [
    headers,
    ...rows.map((row) =>
      headers.map((header) => {
        const value = row[header as keyof typeof row]
        return typeof value === 'boolean' ? String(value) : String(value)
      }),
    ),
  ]

  return {
    output: serializeDelimited(matrix, ','),
    meta: `${count} registro${count === 1 ? '' : 's'} · CSV`,
  }
}

import { serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export type ForecastMethod = 'linear' | 'moving_average' | 'exponential'

export interface ForecastPoint {
  label: string
  value: number
  kind: 'actual' | 'forecast'
}

export interface ForecastSeriesResult {
  points: ForecastPoint[]
  output: string
  meta: string
}

function parseNumber(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  let normalized = trimmed
  if (trimmed.includes(',') && trimmed.includes('.')) {
    normalized = trimmed.replace(/\./g, '').replace(',', '.')
  } else {
    normalized = trimmed.replace(',', '.')
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function parseDateLabel(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  if (/^\d{4}-\d{2}(-\d{2})?$/.test(trimmed)) {
    const date = new Date(trimmed.length === 7 ? `${trimmed}-01` : trimmed)
    return Number.isNaN(date.getTime()) ? null : date.getTime()
  }

  const br = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (br) {
    const date = new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]))
    return Number.isNaN(date.getTime()) ? null : date.getTime()
  }

  const numeric = Number(trimmed)
  if (Number.isFinite(numeric) && trimmed.length >= 4) return numeric

  return null
}

function formatDateLabel(timestamp: number, template: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return String(timestamp)

  if (/^\d{4}-\d{2}$/.test(template)) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(template)) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  return date.toISOString().slice(0, 10)
}

function linearRegression(xs: number[], ys: number[]) {
  const n = xs.length
  const sumX = xs.reduce((total, value) => total + value, 0)
  const sumY = ys.reduce((total, value) => total + value, 0)
  const sumXY = xs.reduce((total, value, index) => total + value * ys[index], 0)
  const sumXX = xs.reduce((total, value) => total + value * value, 0)
  const denominator = n * sumXX - sumX * sumX

  if (denominator === 0) {
    return { slope: 0, intercept: sumY / n }
  }

  const slope = (n * sumXY - sumX * sumY) / denominator
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

function nextLabels(
  lastLabel: string,
  lastX: number,
  step: number,
  count: number,
  useDates: boolean,
): string[] {
  return Array.from({ length: count }, (_, index) => {
    if (useDates) {
      return formatDateLabel(lastX + step * (index + 1), lastLabel)
    }
    return `${lastLabel}+${index + 1}`
  })
}

function buildOutputCsv(
  dateColumn: string,
  valueColumn: string,
  points: ForecastPoint[],
): string {
  return serializeDelimited([
    [dateColumn, valueColumn, 'tipo'],
    ...points.map((point) => [point.label, String(point.value), point.kind === 'actual' ? 'real' : 'previsto']),
  ])
}

export function buildForecastSeries(
  input: string,
  dateColumn: string,
  valueColumn: string,
  method: ForecastMethod,
  periods: number,
  windowSize: number,
  alpha: number,
): ForecastSeriesResult {
  const table = parseInputTable(input, 'auto')
  if (table.headers.length === 0) throw new DataToolError('Nenhuma coluna encontrada.')
  if (!dateColumn || !valueColumn) throw new DataToolError('Selecione as colunas de data e valor.')
  if (!Number.isFinite(periods) || periods < 1 || periods > 120) {
    throw new DataToolError('Informe entre 1 e 120 períodos de previsão.')
  }

  const dateIndex = table.headers.indexOf(dateColumn)
  const valueIndex = table.headers.indexOf(valueColumn)
  if (dateIndex === -1) throw new DataToolError(`Coluna "${dateColumn}" não encontrada.`)
  if (valueIndex === -1) throw new DataToolError(`Coluna "${valueColumn}" não encontrada.`)

  const rows = table.rows
    .map((row, index) => {
      const label = row[dateIndex]?.trim() || String(index + 1)
      const value = parseNumber(row[valueIndex] ?? '')
      const x = parseDateLabel(label) ?? index
      return value === null ? null : { label, value, x }
    })
    .filter((row): row is { label: string; value: number; x: number } => row !== null)

  if (rows.length < 2) {
    throw new DataToolError('São necessárias ao menos 2 linhas numéricas para projetar.')
  }

  const actualPoints: ForecastPoint[] = rows.map((row) => ({
    label: row.label,
    value: row.value,
    kind: 'actual',
  }))

  const xs = rows.map((row) => row.x)
  const ys = rows.map((row) => row.value)
  const parsedDateCount = rows.filter((row) => parseDateLabel(row.label) !== null).length
  const useDates = parsedDateCount >= 2
  const step =
    xs.length > 1
      ? xs.slice(1).reduce((total, value, index) => total + (value - xs[index]), 0) / (xs.length - 1)
      : 1

  let forecastValues: number[] = []

  if (method === 'linear') {
    const { slope, intercept } = linearRegression(xs, ys)
    forecastValues = Array.from({ length: periods }, (_, index) => {
      const x = xs[xs.length - 1] + step * (index + 1)
      return Number((slope * x + intercept).toFixed(4))
    })
  } else if (method === 'moving_average') {
    const window = Math.max(2, Math.min(windowSize, rows.length))
    const average =
      ys.slice(-window).reduce((total, value) => total + value, 0) / window
    forecastValues = Array.from({ length: periods }, () => Number(average.toFixed(4)))
  } else {
    const smoothAlpha = Math.max(0.05, Math.min(alpha, 0.95))
    let smoothed = ys[0]
    for (let index = 1; index < ys.length; index += 1) {
      smoothed = smoothAlpha * ys[index] + (1 - smoothAlpha) * smoothed
    }
    forecastValues = Array.from({ length: periods }, () => Number(smoothed.toFixed(4)))
  }

  const forecastLabels = nextLabels(rows[rows.length - 1].label, xs[xs.length - 1], step, periods, useDates)
  const forecastPoints: ForecastPoint[] = forecastLabels.map((label, index) => ({
    label,
    value: forecastValues[index] ?? forecastValues[forecastValues.length - 1] ?? 0,
    kind: 'forecast',
  }))

  const points = [...actualPoints, ...forecastPoints]
  const methodLabel =
    method === 'linear' ? 'tendência linear' : method === 'moving_average' ? 'média móvel' : 'suavização exponencial'

  return {
    points,
    output: buildOutputCsv(dateColumn, valueColumn, points),
    meta: `${periods} período${periods === 1 ? '' : 's'} · ${methodLabel}`,
  }
}

export function runForecast(
  input: string,
  dateColumn: string,
  valueColumn: string,
  method: ForecastMethod,
  periods: number,
  windowSize: number,
  alpha: number,
): DataToolResult {
  const result = buildForecastSeries(input, dateColumn, valueColumn, method, periods, windowSize, alpha)
  return {
    output: result.output,
    meta: result.meta,
  }
}

export const forecastSample = `mes,vendas
2024-01,120
2024-02,135
2024-03,128
2024-04,142
2024-05,151
2024-06,158
2024-07,166
2024-08,172
2024-09,181
2024-10,189
2024-11,196
2024-12,205`

export const forecastMethodLabels: Record<ForecastMethod, string> = {
  linear: 'Tendência linear',
  moving_average: 'Média móvel',
  exponential: 'Suavização exponencial',
}

import type { ForecastPoint } from '../../../utils/forecast'

interface ForecastChartProps {
  points: ForecastPoint[]
}

const WIDTH = 720
const HEIGHT = 280
const PAD = { top: 18, right: 18, bottom: 42, left: 52 }

interface PlottedPoint extends ForecastPoint {
  x: number
  y: number
}

function buildPath(points: PlottedPoint[]): string {
  if (points.length === 0) return ''
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
}

export function ForecastChart({ points }: ForecastChartProps) {
  if (points.length === 0) {
    return <p className="tool-table__empty">O gráfico aparece aqui.</p>
  }

  const values = points.map((point) => point.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const valueRange = maxValue - minValue || 1

  const chartWidth = WIDTH - PAD.left - PAD.right
  const chartHeight = HEIGHT - PAD.top - PAD.bottom

  const plotted = points.map((point, index) => {
    const x = PAD.left + (index / Math.max(points.length - 1, 1)) * chartWidth
    const y = PAD.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight
    return { ...point, x, y }
  })

  let lastActualIndex = -1
  for (let index = plotted.length - 1; index >= 0; index -= 1) {
    if (plotted[index]?.kind === 'actual') {
      lastActualIndex = index
      break
    }
  }
  const actualPath = buildPath(plotted.filter((point) => point.kind === 'actual'))
  const bridgePath =
    lastActualIndex >= 0
      ? buildPath([plotted[lastActualIndex], ...plotted.filter((point) => point.kind === 'forecast')])
      : buildPath(plotted.filter((point) => point.kind === 'forecast'))

  const yTicks = Array.from({ length: 4 }, (_, index) => {
    const ratio = index / 3
    const value = minValue + valueRange * (1 - ratio)
    const y = PAD.top + chartHeight * ratio
    return { value, y }
  })

  const xLabelIndexes = [0, Math.floor((points.length - 1) / 2), points.length - 1]
    .filter((value, index, array) => array.indexOf(value) === index)
    .filter((index) => index >= 0 && index < points.length)

  return (
    <div className="tool-forecast-chart__wrap">
      <svg
        className="tool-forecast-chart"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Gráfico de série histórica e projeção"
      >
        {yTicks.map((tick) => (
          <g key={tick.y}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={tick.y}
              y2={tick.y}
              className="tool-forecast-chart__grid"
            />
            <text x={PAD.left - 8} y={tick.y + 4} textAnchor="end" className="tool-forecast-chart__tick">
              {tick.value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
            </text>
          </g>
        ))}

        {actualPath && <path d={actualPath} className="tool-forecast-chart__line tool-forecast-chart__line--actual" />}
        {bridgePath && (
          <path d={bridgePath} className="tool-forecast-chart__line tool-forecast-chart__line--forecast" />
        )}

        {plotted.map((point) => (
          <circle
            key={`${point.kind}-${point.label}`}
            cx={point.x}
            cy={point.y}
            r={point.kind === 'forecast' ? 4 : 3}
            className={`tool-forecast-chart__dot tool-forecast-chart__dot--${point.kind}`}
          />
        ))}

        {xLabelIndexes.map((index) => {
          const point = plotted[index]
          return (
            <text
              key={`label-${point.label}`}
              x={point.x}
              y={HEIGHT - 14}
              textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
              className="tool-forecast-chart__tick tool-forecast-chart__tick--x"
            >
              {point.label}
            </text>
          )
        })}
      </svg>

      <div className="tool-forecast-chart__legend" aria-hidden="true">
        <span className="tool-forecast-chart__legend-item">
          <span className="tool-forecast-chart__swatch tool-forecast-chart__swatch--actual" />
          Real
        </span>
        <span className="tool-forecast-chart__legend-item">
          <span className="tool-forecast-chart__swatch tool-forecast-chart__swatch--forecast" />
          Previsto
        </span>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import {
  buildForecastSeries,
  forecastMethodLabels,
  forecastSample,
  type ForecastMethod,
  type ForecastPoint,
} from '../../utils/forecast'
import { parseInputTable } from '../../utils/inputTable'
import { DataToolError } from '../../utils/dataError'
import { ForecastChart } from './shared/ForecastChart'
import { ImportFileButton } from './shared/ImportFileButton'

export function ForecastTool() {
  const [input, setInput] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [dateColumn, setDateColumn] = useState('')
  const [valueColumn, setValueColumn] = useState('')
  const [method, setMethod] = useState<ForecastMethod>('linear')
  const [periods, setPeriods] = useState(6)
  const [windowSize, setWindowSize] = useState(3)
  const [alpha, setAlpha] = useState(0.35)
  const [points, setPoints] = useState<ForecastPoint[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const table = parseInputTable(input, 'auto')
      setColumns(table.headers)
      setDateColumn((current) => (table.headers.includes(current) ? current : table.headers[0] ?? ''))
      setValueColumn((current) => {
        if (table.headers.includes(current)) return current
        return table.headers.find((header) => header !== table.headers[0]) ?? table.headers[0] ?? ''
      })
    } catch {
      setColumns([])
    }
  }, [input])

  const run = useCallback(() => {
    try {
      const result = buildForecastSeries(input, dateColumn, valueColumn, method, periods, windowSize, alpha)
      setPoints(result.points)
      setOutput(result.output)
      setMeta(result.meta)
      setError(null)
    } catch (cause) {
      setPoints([])
      setOutput('')
      setMeta(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível projetar.')
    }
  }, [alpha, dateColumn, input, method, periods, valueColumn, windowSize])

  return (
    <div className="tool-convert tool-forecast">
      <div className="tool-convert__modes" role="tablist">
        {(Object.entries(forecastMethodLabels) as [ForecastMethod, string][]).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={method === id}
            className={`tool-convert__mode${method === id ? ' is-active' : ''}`}
            onClick={() => setMethod(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tool-convert__toolbar">
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput(forecastSample)
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.json,.txt" onLoad={(text) => setInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setPoints([])
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Projetar
        </button>
      </div>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting">
          <span>Coluna de data</span>
          <select value={dateColumn} onChange={(event) => setDateColumn(event.target.value)}>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Coluna de valor</span>
          <select value={valueColumn} onChange={(event) => setValueColumn(event.target.value)}>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Períodos</span>
          <input type="number" min={1} max={120} value={periods} onChange={(event) => setPeriods(Number(event.target.value))} />
        </label>
        {method === 'moving_average' && (
          <label className="tool-convert__setting">
            <span>Janela</span>
            <input type="number" min={2} max={24} value={windowSize} onChange={(event) => setWindowSize(Number(event.target.value))} />
          </label>
        )}
        {method === 'exponential' && (
          <label className="tool-convert__setting">
            <span>Alpha (0–1)</span>
            <input
              type="number"
              min={0.05}
              max={0.95}
              step={0.05}
              value={alpha}
              onChange={(event) => setAlpha(Number(event.target.value))}
            />
          </label>
        )}
      </div>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="forecast-input">
            Série histórica (CSV)
          </label>
          <textarea
            id="forecast-input"
            className="tool-convert__textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={8}
            spellCheck={false}
          />
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Gráfico</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          <ForecastChart points={points} />
        </div>
      </div>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Série com projeção</span>
        </div>
        <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={10} spellCheck={false} />
      </div>

      <p className="tool-convert__hint">
        Projeção exploratória no navegador — não substitui modelagem estatística avançada.
      </p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

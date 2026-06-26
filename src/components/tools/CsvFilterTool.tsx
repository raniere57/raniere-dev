import { useCallback, useEffect, useState } from 'react'
import {
  csvFilterSample,
  filterCsvRows,
  filterOperatorLabels,
  type FilterOperator,
  type RowFilter,
} from '../../utils/csvFilter'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolActionBar, ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

const DEFAULT_FILTER = (): RowFilter => ({
  column: '',
  operator: 'eq',
  value: '',
})

export function CsvFilterTool() {
  const [input, setInput] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [filters, setFilters] = useState<RowFilter[]>([DEFAULT_FILTER()])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const table = parseInputTable(input, 'auto')
      setColumns(table.headers)
      setFilters((current) =>
        current.map((filter, index) => ({
          ...filter,
          column: table.headers.includes(filter.column)
            ? filter.column
            : table.headers[index] ?? table.headers[0] ?? '',
        })),
      )
    } catch {
      setColumns([])
    }
  }, [input])

  const updateFilter = (index: number, patch: Partial<RowFilter>) => {
    setFilters((current) => current.map((filter, i) => (i === index ? { ...filter, ...patch } : filter)))
  }

  const run = useCallback(() => {
    runDataTool(() => filterCsvRows(input, filters), setOutput, setMeta, setError)
  }, [filters, input])

  return (
    <div className="tool-convert">
      <ToolToolbar>
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(csvFilterSample)}>
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.json,.txt" onLoad={(text) => setInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setOutput('')
            setMeta(null)
            setError(null)
            setFilters([DEFAULT_FILTER()])
          }}
        >
          Limpar
        </button>
      </ToolToolbar>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="filter-input">
            Entrada
          </label>
          <textarea id="filter-input" className="tool-convert__textarea" value={input} onChange={(event) => setInput(event.target.value)} rows={8} spellCheck={false} />
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Filtros (AND)</span>
            <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setFilters((current) => [...current, { ...DEFAULT_FILTER(), column: columns[0] ?? '' }])}>
              + Filtro
            </button>
          </div>
          <div className="tool-rules">
            {filters.map((filter, index) => (
              <div key={`filter-${index}`} className="tool-rules__row">
                <select value={filter.column} onChange={(event) => updateFilter(index, { column: event.target.value })}>
                  {columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
                <select value={filter.operator} onChange={(event) => updateFilter(index, { operator: event.target.value as FilterOperator })}>
                  {Object.entries(filterOperatorLabels).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={filter.value}
                  onChange={(event) => updateFilter(index, { value: event.target.value })}
                  disabled={filter.operator === 'empty' || filter.operator === 'not_empty'}
                  placeholder="valor"
                  spellCheck={false}
                />
                {filters.length > 1 && (
                  <button type="button" className="tools-btn tools-btn--ghost tool-rules__remove" onClick={() => setFilters((current) => current.filter((_, i) => i !== index))}>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToolActionBar>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Filtrar
        </button>
      </ToolActionBar>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Resultado</span>
          {meta && <span className="tool-convert__meta">{meta}</span>}
        </div>
        <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={8} spellCheck={false} />
        <OutputActions output={output} downloadFilename="resultado.csv" />
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

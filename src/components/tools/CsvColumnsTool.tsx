import { useCallback, useEffect, useState } from 'react'
import { csvColumnsSample, filterCsvColumns, listCsvColumns } from '../../utils/csvColumns'
import { runDataTool } from './shared/ConvertToolLayout'
import { ImportFileButton } from './shared/ImportFileButton'

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function CsvColumnsTool() {
  const [input, setInput] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const next = listCsvColumns(input)
    setColumns(next)
    setSelected((current) => current.filter((column) => next.includes(column)))
  }, [input])

  const toggleColumn = (column: string) => {
    setSelected((current) =>
      current.includes(column) ? current.filter((item) => item !== column) : [...current, column],
    )
  }

  const moveColumn = (index: number, direction: -1 | 1) => {
    setSelected((current) => moveItem(current, index, index + direction))
  }

  const run = useCallback(() => {
    runDataTool(() => filterCsvColumns(input, selected, selected), setOutput, setMeta, setError)
  }, [input, selected])

  return (
    <div className="tool-convert">
      <div className="tool-convert__toolbar">
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(csvColumnsSample)}>
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.txt" onLoad={(text) => setInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setOutput('')
            setMeta(null)
            setError(null)
            setSelected([])
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Aplicar ordem
        </button>
      </div>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="csv-columns-input">
            CSV
          </label>
          <textarea
            id="csv-columns-input"
            className="tool-convert__textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={8}
            spellCheck={false}
          />
        </div>

        <div className="tool-convert__pane">
          <p className="tool-convert__label">Colunas disponíveis</p>
          <div className="tool-columns">
            {columns.length === 0 ? (
              <p className="tool-table__empty">Cole um CSV para listar colunas.</p>
            ) : (
              columns.map((column) => (
                <label key={column} className="tool-columns__item">
                  <input
                    type="checkbox"
                    checked={selected.includes(column)}
                    onChange={() => toggleColumn(column)}
                  />
                  {column}
                </label>
              ))
            )}
          </div>

          {selected.length > 0 && (
            <>
              <p className="tool-convert__label tool-columns__order-label">Ordem de saída</p>
              <ol className="tool-columns__order">
                {selected.map((column, index) => (
                  <li key={column} className="tool-columns__order-item">
                    <span className="tool-columns__order-name">{column}</span>
                    <span className="tool-columns__order-actions">
                      <button
                        type="button"
                        className="tools-btn tools-btn--ghost tool-columns__move"
                        disabled={index === 0}
                        onClick={() => moveColumn(index, -1)}
                        aria-label={`Mover ${column} para cima`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="tools-btn tools-btn--ghost tool-columns__move"
                        disabled={index === selected.length - 1}
                        onClick={() => moveColumn(index, 1)}
                        aria-label={`Mover ${column} para baixo`}
                      >
                        ↓
                      </button>
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">CSV reordenado</span>
          {meta && <span className="tool-convert__meta">{meta}</span>}
        </div>
        <textarea
          className="tool-convert__textarea tool-convert__textarea--output"
          value={output}
          readOnly
          rows={8}
          spellCheck={false}
        />
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

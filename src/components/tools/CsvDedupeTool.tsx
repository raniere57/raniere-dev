import { useCallback, useEffect, useState } from 'react'
import { csvDedupeSample, dedupeTable } from '../../utils/csvDedupe'
import { parseInputTable, type InputTableFormat } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ImportFileButton } from './shared/ImportFileButton'

export function CsvDedupeTool() {
  const [format, setFormat] = useState<InputTableFormat>('auto')
  const [input, setInput] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const table = parseInputTable(input, format)
      setColumns(table.headers)
      setSelected((current) => current.filter((column) => table.headers.includes(column)))
    } catch {
      setColumns([])
      setSelected([])
    }
  }, [input, format])

  const toggleColumn = (column: string) => {
    setSelected((current) =>
      current.includes(column) ? current.filter((item) => item !== column) : [...current, column],
    )
  }

  const run = useCallback(() => {
    runDataTool(() => dedupeTable(input, selected, format), setOutput, setMeta, setError)
  }, [format, input, selected])

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['auto', 'Detectar'],
            ['csv', 'CSV'],
            ['json', 'JSON'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={format === id}
            className={`tool-convert__mode${format === id ? ' is-active' : ''}`}
            onClick={() => setFormat(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tool-convert__toolbar">
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(csvDedupeSample)}>
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
            setSelected([])
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Remover duplicatas
        </button>
      </div>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="dedupe-input">
            Entrada
          </label>
          <textarea
            id="dedupe-input"
            className="tool-convert__textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={8}
            spellCheck={false}
          />
        </div>

        <div className="tool-convert__pane">
          <p className="tool-convert__label">Chave de deduplicação (vazio = todas as colunas)</p>
          <div className="tool-columns">
            {columns.length === 0 ? (
              <p className="tool-table__empty">Cole dados para listar colunas.</p>
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
        </div>
      </div>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Saída</span>
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

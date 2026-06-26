import { useCallback, useEffect, useState } from 'react'
import { csvSplitSample, splitCsv, type SplitMode } from '../../utils/csvSplit'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { ImportFileButton } from './shared/ImportFileButton'

export function CsvSplitTool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<SplitMode>('rows')
  const [rowsPerFile, setRowsPerFile] = useState(2)
  const [splitColumn, setSplitColumn] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const table = parseInputTable(input, 'auto')
      setColumns(table.headers)
      setSplitColumn((current) => (table.headers.includes(current) ? current : table.headers[0] ?? ''))
    } catch {
      setColumns([])
      setSplitColumn('')
    }
  }, [input])

  const run = useCallback(() => {
    runDataTool(() => splitCsv(input, mode, rowsPerFile, splitColumn), setOutput, setMeta, setError)
  }, [input, mode, rowsPerFile, splitColumn])

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['rows', 'Por linhas'],
            ['column', 'Por coluna'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={`tool-convert__mode${mode === id ? ' is-active' : ''}`}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tool-convert__toolbar">
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(csvSplitSample)}>
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
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Dividir
        </button>
      </div>

      <div className="tool-convert__settings">
        {mode === 'rows' ? (
          <label className="tool-convert__setting">
            <span>Linhas por parte</span>
            <input type="number" min={1} value={rowsPerFile} onChange={(event) => setRowsPerFile(Number(event.target.value))} />
          </label>
        ) : (
          <label className="tool-convert__setting">
            <span>Coluna</span>
            <select value={splitColumn} onChange={(event) => setSplitColumn(event.target.value)}>
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="split-input">
            CSV
          </label>
          <textarea id="split-input" className="tool-convert__textarea" value={input} onChange={(event) => setInput(event.target.value)} rows={8} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Partes geradas</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={12} spellCheck={false} />
        </div>
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

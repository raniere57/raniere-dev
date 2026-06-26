import { useCallback, useEffect, useState } from 'react'
import { csvSplitColumnSample, splitCsvColumn } from '../../utils/csvSplitColumn'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ImportFileButton } from './shared/ImportFileButton'

export function CsvSplitColumnTool() {
  const [input, setInput] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [column, setColumn] = useState('')
  const [delimiter, setDelimiter] = useState(';')
  const [maxParts, setMaxParts] = useState(0)
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const table = parseInputTable(input, 'auto')
      setColumns(table.headers)
      setColumn((current) => (table.headers.includes(current) ? current : table.headers[0] ?? ''))
    } catch {
      setColumns([])
    }
  }, [input])

  const run = useCallback(() => {
    runDataTool(() => splitCsvColumn(input, column, delimiter, maxParts), setOutput, setMeta, setError)
  }, [column, delimiter, input, maxParts])

  return (
    <div className="tool-convert">
      <div className="tool-convert__toolbar">
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(csvSplitColumnSample)}>
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
          Separar coluna
        </button>
      </div>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting">
          <span>Coluna</span>
          <select value={column} onChange={(event) => setColumn(event.target.value)}>
            {columns.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Delimitador</span>
          <input type="text" className="tool-convert__setting-input" value={delimiter} onChange={(event) => setDelimiter(event.target.value)} maxLength={2} spellCheck={false} />
        </label>
        <label className="tool-convert__setting">
          <span>Máx. partes (0 = todas)</span>
          <input type="number" min={0} value={maxParts} onChange={(event) => setMaxParts(Number(event.target.value))} />
        </label>
      </div>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="splitcol-input">
            Entrada
          </label>
          <textarea id="splitcol-input" className="tool-convert__textarea" value={input} onChange={(event) => setInput(event.target.value)} rows={8} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Resultado</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={8} spellCheck={false} />
        <OutputActions output={output} downloadFilename="resultado.csv" />
        </div>
      </div>

      <p className="tool-convert__hint">Equivalente a “Texto para colunas” do Excel.</p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import {
  aggregateLabels,
  csvGroupSample,
  groupCsvRows,
  type AggregateOp,
} from '../../utils/csvGroup'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ImportFileButton } from './shared/ImportFileButton'

export function CsvGroupTool() {
  const [input, setInput] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [groupColumn, setGroupColumn] = useState('')
  const [valueColumn, setValueColumn] = useState('')
  const [operation, setOperation] = useState<AggregateOp>('sum')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const table = parseInputTable(input, 'auto')
      setColumns(table.headers)
      setGroupColumn((current) => (table.headers.includes(current) ? current : table.headers[0] ?? ''))
      setValueColumn((current) => {
        if (table.headers.includes(current)) return current
        return table.headers.find((header) => header !== table.headers[0]) ?? table.headers[0] ?? ''
      })
    } catch {
      setColumns([])
    }
  }, [input])

  const run = useCallback(() => {
    runDataTool(
      () => groupCsvRows(input, groupColumn, valueColumn, operation),
      setOutput,
      setMeta,
      setError,
    )
  }, [groupColumn, input, operation, valueColumn])

  return (
    <div className="tool-convert">
      <div className="tool-convert__toolbar">
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(csvGroupSample)}>
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
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Agrupar
        </button>
      </div>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting">
          <span>Agrupar por</span>
          <select value={groupColumn} onChange={(event) => setGroupColumn(event.target.value)}>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Operação</span>
          <select value={operation} onChange={(event) => setOperation(event.target.value as AggregateOp)}>
            {Object.entries(aggregateLabels).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Coluna de valor</span>
          <select value={valueColumn} onChange={(event) => setValueColumn(event.target.value)} disabled={operation === 'count'}>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="group-input">
            Entrada
          </label>
          <textarea id="group-input" className="tool-convert__textarea" value={input} onChange={(event) => setInput(event.target.value)} rows={10} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Resultado</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={10} spellCheck={false} />
        <OutputActions output={output} downloadFilename="resultado.csv" />
        </div>
      </div>

      <p className="tool-convert__hint">Equivalente a SOMASE, CONT.SE ou tabela dinâmica simples.</p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

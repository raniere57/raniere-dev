import { useCallback, useEffect, useState } from 'react'
import { csvSortSample, sortCsvRows, type SortDirection, type SortRule } from '../../utils/csvSort'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

export function CsvSortTool() {
  const [input, setInput] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [rules, setRules] = useState<SortRule[]>([{ column: '', direction: 'asc' }])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const table = parseInputTable(input, 'auto')
      setColumns(table.headers)
      setRules((current) =>
        current.map((rule, index) => ({
          ...rule,
          column: table.headers.includes(rule.column) ? rule.column : table.headers[index] ?? table.headers[0] ?? '',
        })),
      )
    } catch {
      setColumns([])
    }
  }, [input])

  const updateRule = (index: number, patch: Partial<SortRule>) => {
    setRules((current) => current.map((rule, i) => (i === index ? { ...rule, ...patch } : rule)))
  }

  const run = useCallback(() => {
    runDataTool(() => sortCsvRows(input, rules), setOutput, setMeta, setError)
  }, [input, rules])

  return (
    <div className="tool-convert">
      <ToolToolbar
        action={
          <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
            Ordenar
          </button>
        }
      >
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(csvSortSample)}>
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
            setRules([{ column: '', direction: 'asc' }])
          }}
        >
          Limpar
        </button>
      </ToolToolbar>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="sort-input">
            Entrada
          </label>
          <textarea id="sort-input" className="tool-convert__textarea" value={input} onChange={(event) => setInput(event.target.value)} rows={8} spellCheck={false} />
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Ordem das colunas</span>
            <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setRules((current) => [...current, { column: columns[0] ?? '', direction: 'asc' }])}>
              + Coluna
            </button>
          </div>
          <div className="tool-rules">
            {rules.map((rule, index) => (
              <div key={`sort-${index}`} className="tool-rules__row">
                <select value={rule.column} onChange={(event) => updateRule(index, { column: event.target.value })}>
                  {columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
                <select value={rule.direction} onChange={(event) => updateRule(index, { direction: event.target.value as SortDirection })}>
                  <option value="asc">Crescente</option>
                  <option value="desc">Decrescente</option>
                </select>
                {rules.length > 1 && (
                  <button type="button" className="tools-btn tools-btn--ghost tool-rules__remove" onClick={() => setRules((current) => current.filter((_, i) => i !== index))}>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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

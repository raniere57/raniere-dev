import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DataToolError, type DataToolResult } from '../../../utils/dataError'
import { parseInputTable } from '../../../utils/inputTable'
import { runDataTool } from './ConvertToolLayout'
import { OutputActions } from './OutputActions'
import { ToolToolbar } from './ToolToolbar'
import { ImportFileButton } from './ImportFileButton'

export type ValidatorView = 'single' | 'batch' | 'csv'

export interface ValidatorPreview {
  valid: boolean
  summary: string
}

function detectImportView(text: string): ValidatorView {
  const trimmed = text.trim()
  if (!trimmed) return 'single'

  try {
    const table = parseInputTable(text, 'auto')
    if (table.headers.length >= 1 && table.rows.length >= 1) return 'csv'
  } catch {
    /* not tabular */
  }

  const lines = trimmed.split(/\r?\n/).filter(Boolean)
  return lines.length > 1 ? 'batch' : 'single'
}

export interface ValidatorToolShellProps {
  inputId: string
  inputLabels: { single: string; batch: string; csv: string }
  columnLabel?: string
  placeholder: string
  batchPlaceholder?: string
  hint: string
  downloadBaseName: string
  samples: { single: string; batch: string; csv: string }
  headerExtra?: ReactNode
  preview?: (input: string) => ValidatorPreview | null
  onRun: (view: ValidatorView, input: string, column: string) => DataToolResult
}

export function ValidatorToolShell({
  inputId,
  inputLabels,
  columnLabel = 'Coluna',
  placeholder,
  batchPlaceholder,
  hint,
  downloadBaseName,
  samples,
  headerExtra,
  preview,
  onRun,
}: ValidatorToolShellProps) {
  const [view, setView] = useState<ValidatorView>('single')
  const [input, setInput] = useState('')
  const [column, setColumn] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (view !== 'csv') return
    try {
      const table = parseInputTable(input, 'auto')
      setColumns(table.headers)
      setColumn((current) => (table.headers.includes(current) ? current : table.headers[0] ?? ''))
    } catch {
      setColumns([])
      setColumn('')
    }
  }, [input, view])

  const singlePreview = useMemo(() => {
    if (view !== 'single' || !input.trim() || !preview) return null
    return preview(input)
  }, [input, preview, view])

  const run = useCallback(() => {
    runDataTool(
      () => onRun(view, input, column),
      setOutput,
      setMeta,
      setError,
    )
  }, [column, input, onRun, view])

  const loadSample = () => {
    if (view === 'single') setInput(samples.single)
    else if (view === 'batch') setInput(samples.batch)
    else setInput(samples.csv)
    setOutput('')
    setMeta(null)
    setError(null)
  }

  const handleImport = (text: string) => {
    setInput(text)
    setOutput('')
    setMeta(null)
    setError(null)
    setView(detectImportView(text))
  }

  const outputClassName =
    view === 'single' && output
      ? `tool-schema__output${output.startsWith('✓') ? ' is-valid' : ' is-invalid'}`
      : 'tool-convert__textarea tool-convert__textarea--output'

  return (
    <div className="tool-convert tool-validator">
      <div className="tool-validator__mode-row">
        <div className="tool-convert__modes" role="tablist" aria-label="Modo de validação">
          {(
            [
              ['single', 'Um item'],
              ['batch', 'Lista'],
              ['csv', 'Coluna CSV'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              className={`tool-convert__mode${view === id ? ' is-active' : ''}`}
              onClick={() => {
                setView(id)
                setOutput('')
                setMeta(null)
                setError(null)
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {headerExtra}
      </div>

      {view === 'csv' && (
        <div className="tool-convert__settings">
          <label className="tool-convert__setting">
            <span>{columnLabel}</span>
            <select value={column} onChange={(event) => setColumn(event.target.value)}>
              {columns.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <ToolToolbar
        action={
          <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
            Validar
          </button>
        }
      >
        <button type="button" className="tools-btn tools-btn--ghost" onClick={loadSample}>
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.txt" onLoad={handleImport} />
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
      </ToolToolbar>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor={inputId}>
            {view === 'single' ? inputLabels.single : view === 'batch' ? inputLabels.batch : inputLabels.csv}
          </label>
          {view === 'single' ? (
            <input
              id={inputId}
              type="text"
              className="tool-convert__setting-input tool-cpfcnpj__input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  run()
                }
              }}
              placeholder={placeholder}
              spellCheck={false}
              autoComplete="off"
            />
          ) : (
            <textarea
              id={inputId}
              className="tool-convert__textarea"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={view === 'csv' ? 10 : 8}
              spellCheck={false}
              placeholder={view === 'batch' ? batchPlaceholder : undefined}
            />
          )}
          {view === 'single' && singlePreview && !output && (
            <p
              className={`tool-cpfcnpj__preview${singlePreview.valid ? ' is-valid' : ' is-invalid'}`}
              aria-live="polite"
            >
              {singlePreview.summary}
            </p>
          )}
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Resultado</span>
            {meta && (
              <span
                className={`tool-convert__meta${output.startsWith('✓') ? '' : ' tool-convert__meta--bad'}`}
              >
                {meta}
              </span>
            )}
          </div>
          {view === 'single' && output ? (
            <pre className={outputClassName}>{output}</pre>
          ) : (
            <textarea className={outputClassName} value={output} readOnly rows={view === 'csv' ? 10 : 8} spellCheck={false} />
          )}
          <OutputActions
            output={output}
            downloadFilename={view === 'csv' ? `${downloadBaseName}.csv` : `${downloadBaseName}.txt`}
            downloadBom={view === 'csv'}
          />
        </div>
      </div>

      <p className="tool-convert__hint">{hint}</p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

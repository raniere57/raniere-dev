import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  cpfCnpjSamples,
  validateDocument,
  validateDocumentBatch,
  validateDocumentCsv,
  validateSingleDocument,
  type DocumentMode,
} from '../../utils/cpfCnpj'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolActionBar, ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

type ValidatorView = 'single' | 'batch' | 'csv'

export function CpfCnpjTool() {
  const [view, setView] = useState<ValidatorView>('single')
  const [mode, setMode] = useState<DocumentMode>('auto')
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
    if (view !== 'single' || !input.trim()) return null
    return validateDocument(input, mode)
  }, [input, mode, view])

  const run = useCallback(() => {
    runDataTool(
      () => {
        if (view === 'single') return validateSingleDocument(input, mode)
        if (view === 'batch') return validateDocumentBatch(input, mode)
        return validateDocumentCsv(input, column, mode)
      },
      setOutput,
      setMeta,
      setError,
    )
  }, [column, input, mode, view])

  const loadSample = () => {
    if (view === 'single') {
      setInput(mode === 'cnpj' ? cpfCnpjSamples.singleCnpj : cpfCnpjSamples.singleCpf)
    } else if (view === 'batch') {
      setInput(cpfCnpjSamples.batch)
    } else {
      setInput(cpfCnpjSamples.csv)
    }
    setOutput('')
    setMeta(null)
    setError(null)
  }

  const outputClassName =
    view === 'single' && output
      ? `tool-schema__output${output.startsWith('✓') ? ' is-valid' : ' is-invalid'}`
      : 'tool-convert__textarea tool-convert__textarea--output'

  return (
    <div className="tool-convert tool-cpfcnpj">
      <div className="tool-convert__modes" role="tablist" aria-label="Modo de validação">
        {(
          [
            ['single', 'Um documento'],
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

      <div className="tool-convert__modes tool-convert__modes--secondary" role="tablist" aria-label="Tipo de documento">
        {(
          [
            ['auto', 'Detectar'],
            ['cpf', 'CPF'],
            ['cnpj', 'CNPJ'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={`tool-convert__mode tool-convert__mode--compact${mode === id ? ' is-active' : ''}`}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <ToolToolbar>
        <button type="button" className="tools-btn tools-btn--ghost" onClick={loadSample}>
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
      </ToolToolbar>

      {view === 'csv' && (
        <div className="tool-convert__settings">
          <label className="tool-convert__setting">
            <span>Coluna de documentos</span>
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

      <ToolActionBar>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Validar
        </button>
      </ToolActionBar>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="cpfcnpj-input">
            {view === 'single' ? 'Documento' : view === 'batch' ? 'Documentos (um por linha)' : 'CSV'}
          </label>
          {view === 'single' ? (
            <input
              id="cpfcnpj-input"
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
              placeholder="529.982.247-25 ou 11.222.333/0001-81"
              spellCheck={false}
              autoComplete="off"
            />
          ) : (
            <textarea
              id="cpfcnpj-input"
              className="tool-convert__textarea"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={view === 'csv' ? 10 : 8}
              spellCheck={false}
              placeholder={view === 'batch' ? 'Cole vários documentos, um por linha…' : 'Cole CSV com coluna de CPF/CNPJ…'}
            />
          )}
          {view === 'single' && singlePreview && !output && (
            <p
              className={`tool-cpfcnpj__preview${singlePreview.valid ? ' is-valid' : ' is-invalid'}`}
              aria-live="polite"
            >
              {singlePreview.valid
                ? `✓ ${singlePreview.kind?.toUpperCase()} válido${singlePreview.formatted ? ` · ${singlePreview.formatted}` : ''}`
                : `✗ Inválido${singlePreview.reason ? ` — ${singlePreview.reason}` : ''}`}
            </p>
          )}
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Resultado</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          {view === 'single' && output ? (
            <pre className={outputClassName}>{output}</pre>
          ) : (
            <textarea className={outputClassName} value={output} readOnly rows={view === 'csv' ? 10 : 8} spellCheck={false} />
          )}
          <OutputActions
            output={output}
            downloadFilename={view === 'csv' ? 'documentos-validados.csv' : 'validacao.txt'}
            downloadBom={view === 'csv'}
          />
        </div>
      </div>

      <p className="tool-convert__hint">Processado no seu navegador — nenhum documento é enviado ao servidor.</p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

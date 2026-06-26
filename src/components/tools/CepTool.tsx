import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  cepSamples,
  validateCep,
  validateCepBatch,
  validateCepCsv,
  validateSingleCep,
} from '../../utils/cep'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

type ValidatorView = 'single' | 'batch' | 'csv'

export function CepTool() {
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
    if (view !== 'single' || !input.trim()) return null
    return validateCep(input)
  }, [input, view])

  const run = useCallback(() => {
    runDataTool(
      () => {
        if (view === 'single') return validateSingleCep(input)
        if (view === 'batch') return validateCepBatch(input)
        return validateCepCsv(input, column)
      },
      setOutput,
      setMeta,
      setError,
    )
  }, [column, input, view])

  const loadSample = () => {
    if (view === 'single') setInput(cepSamples.single)
    else if (view === 'batch') setInput(cepSamples.batch)
    else setInput(cepSamples.csv)
    setOutput('')
    setMeta(null)
    setError(null)
  }

  const outputClassName =
    view === 'single' && output
      ? `tool-schema__output${output.startsWith('✓') ? ' is-valid' : ' is-invalid'}`
      : 'tool-convert__textarea tool-convert__textarea--output'

  return (
    <div className="tool-convert tool-validator">
      <div className="tool-convert__modes" role="tablist" aria-label="Modo de validação">
        {(
          [
            ['single', 'Um CEP'],
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

      {view === 'csv' && (
        <div className="tool-convert__settings">
          <label className="tool-convert__setting">
            <span>Coluna de CEP</span>
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

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="cep-input">
            {view === 'single' ? 'CEP' : view === 'batch' ? 'CEPs (um por linha)' : 'CSV'}
          </label>
          {view === 'single' ? (
            <input
              id="cep-input"
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
              placeholder="64000-000"
              spellCheck={false}
              autoComplete="off"
            />
          ) : (
            <textarea
              id="cep-input"
              className="tool-convert__textarea"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={view === 'csv' ? 10 : 8}
              spellCheck={false}
            />
          )}
          {view === 'single' && singlePreview && !output && (
            <p
              className={`tool-cpfcnpj__preview${singlePreview.valid ? ' is-valid' : ' is-invalid'}`}
              aria-live="polite"
            >
              {singlePreview.valid
                ? `✓ CEP válido${singlePreview.formatted ? ` · ${singlePreview.formatted}` : ''}`
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
            downloadFilename={view === 'csv' ? 'ceps-validados.csv' : 'validacao.txt'}
            downloadBom={view === 'csv'}
          />
        </div>
      </div>

      <p className="tool-convert__hint">
        Validação de formato no navegador — consulta de endereço via ViaCEP pode ser adicionada depois.
      </p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

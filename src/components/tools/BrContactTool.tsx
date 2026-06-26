import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  brContactSamples,
  CONTACT_CORRECTION_HINT,
  correctContact,
  correctContactBatch,
  correctContactCsv,
  correctSingleContact,
  validateContact,
  validateContactBatch,
  validateContactCsv,
  validateSingleContact,
  type ContactKind,
} from '../../utils/brContact'
import { DataToolError } from '../../utils/dataError'
import { parseInputTable } from '../../utils/inputTable'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

type ValidatorView = 'single' | 'batch' | 'csv'
type ContactAction = 'validate' | 'correct'

export function BrContactTool() {
  const [view, setView] = useState<ValidatorView>('single')
  const [kind, setKind] = useState<ContactKind>('email')
  const [action, setAction] = useState<ContactAction>('validate')
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
    return action === 'correct' ? correctContact(input, kind) : validateContact(input, kind)
  }, [action, input, kind, view])

  const run = useCallback(() => {
    try {
      let result
      if (action === 'correct') {
        if (view === 'single') result = correctSingleContact(input, kind)
        else if (view === 'batch') result = correctContactBatch(input, kind)
        else result = correctContactCsv(input, column, kind)
      } else if (view === 'single') {
        result = validateSingleContact(input, kind)
      } else if (view === 'batch') {
        result = validateContactBatch(input, kind)
      } else {
        result = validateContactCsv(input, column, kind)
      }
      setOutput(result.output)
      setMeta(result.meta ?? null)
      setError(null)
    } catch (cause) {
      setOutput('')
      setMeta(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível processar.')
    }
  }, [action, column, input, kind, view])

  const loadSample = () => {
    if (view === 'single') {
      if (action === 'correct') {
        setInput(kind === 'email' ? brContactSamples.emailMessy : brContactSamples.phoneMessy)
      } else {
        setInput(kind === 'email' ? brContactSamples.email : brContactSamples.phone)
      }
    } else if (view === 'batch') {
      setInput(kind === 'email' ? brContactSamples.batchEmail : brContactSamples.batchPhone)
    } else {
      setInput(kind === 'email' ? brContactSamples.csvEmail : brContactSamples.csvPhone)
    }
    setOutput('')
    setMeta(null)
    setError(null)
  }

  const outputClassName =
    view === 'single' && output
      ? `tool-schema__output${output.startsWith('✓') ? ' is-valid' : ' is-invalid'}`
      : 'tool-convert__textarea tool-convert__textarea--output'

  const singlePlaceholder = kind === 'email' ? 'nome@empresa.com.br' : '(86) 99999-1234'
  const primaryLabel = action === 'correct' ? 'Corrigir' : 'Validar'

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

        <div className="tool-convert__modes tool-convert__modes--secondary" role="tablist" aria-label="Tipo de contato">
          {(
            [
              ['email', 'E-mail'],
              ['phone', 'Telefone'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={kind === id}
              className={`tool-convert__mode tool-convert__mode--compact${kind === id ? ' is-active' : ''}`}
              onClick={() => setKind(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="tool-convert__modes tool-convert__modes--secondary" role="tablist" aria-label="Ação">
          {(
            [
              ['validate', 'Validar'],
              ['correct', 'Corrigir'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={action === id}
              className={`tool-convert__mode tool-convert__mode--compact${action === id ? ' is-active' : ''}`}
              onClick={() => {
                setAction(id)
                setOutput('')
                setMeta(null)
                setError(null)
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {action === 'correct' && (
        <p className="tool-convert__warn" role="note">
          {CONTACT_CORRECTION_HINT}
        </p>
      )}

      {view === 'csv' && (
        <div className="tool-convert__settings">
          <label className="tool-convert__setting">
            <span>Coluna</span>
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
            {primaryLabel}
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
          <label className="tool-convert__label" htmlFor="brcontact-input">
            {view === 'single'
              ? kind === 'email'
                ? 'E-mail'
                : 'Telefone'
              : view === 'batch'
                ? 'Itens (um por linha)'
                : 'CSV'}
          </label>
          {view === 'single' ? (
            <input
              id="brcontact-input"
              type={kind === 'email' ? 'email' : 'tel'}
              className="tool-convert__setting-input tool-cpfcnpj__input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  run()
                }
              }}
              placeholder={singlePlaceholder}
              spellCheck={false}
              autoComplete="off"
            />
          ) : (
            <textarea
              id="brcontact-input"
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
                ? `✓ Válido${singlePreview.formatted ? ` · ${singlePreview.formatted}` : ''}`
                : `✗ Inválido${singlePreview.reason ? ` — ${singlePreview.reason}` : ''}`}
              {'warnings' in singlePreview &&
                Array.isArray(singlePreview.warnings) &&
                singlePreview.warnings.length > 0 && (
                <span className="tool-cpfcnpj__preview-warn"> · {singlePreview.warnings[0]}</span>
              )}
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
            downloadFilename={view === 'csv' ? 'contatos-validados.csv' : 'validacao.txt'}
            downloadBom={view === 'csv'}
          />
        </div>
      </div>

      <p className="tool-convert__hint">
        {action === 'correct'
          ? 'Correção local no navegador — nada é enviado ao servidor.'
          : 'Validação local no navegador — nada é enviado ao servidor.'}
      </p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

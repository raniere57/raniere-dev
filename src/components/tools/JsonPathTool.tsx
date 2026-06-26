import { useCallback, useMemo, useState } from 'react'
import { jsonPathSample, parseJsonInput, queryJsonPath } from '../../utils/jsonPath'
import { copyText } from '../../utils/toolIO'
import { JsonPathExplorer } from './shared/JsonPathExplorer'
import { runDataTool } from './shared/ConvertToolLayout'
import { ImportFileButton } from './shared/ImportFileButton'

type JsonPathMode = 'query' | 'explore'

export function JsonPathTool() {
  const [mode, setMode] = useState<JsonPathMode>('query')
  const [input, setInput] = useState('')
  const [path, setPath] = useState('$.items[*].nome')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [selectedPreview, setSelectedPreview] = useState<string>('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  const parsedJson = useMemo(() => {
    try {
      return parseJsonInput(input)
    } catch {
      return null
    }
  }, [input])

  const run = useCallback(() => {
    runDataTool(() => queryJsonPath(input, path), setOutput, setMeta, setError)
  }, [input, path])

  const handleExploreSelect = (nextPath: string, value: unknown) => {
    setSelectedPath(nextPath)
    setPath(nextPath)
    setSelectedPreview(
      value !== null && typeof value === 'object'
        ? Array.isArray(value)
          ? `[${value.length} itens]`
          : `{${Object.keys(value as object).length} chaves}`
        : JSON.stringify(value),
    )
  }

  const handleCopyPath = async () => {
    if (!path.trim()) return
    try {
      await copyText(path)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('idle')
    }
  }

  const loadSample = () => {
    setInput(jsonPathSample.input)
    setPath(jsonPathSample.path)
    setSelectedPath('$.items[0].nome')
    setSelectedPreview('"Ana"')
    setOutput('')
    setMeta(null)
    setError(null)
  }

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['query', 'Consultar'],
            ['explore', 'Explorar / descobrir'],
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
        <button type="button" className="tools-btn tools-btn--ghost" onClick={loadSample}>
          Carregar exemplo
        </button>
        <ImportFileButton accept=".json,.txt" onLoad={(text) => setInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setPath('$.')
            setSelectedPath(null)
            setSelectedPreview('')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        {mode === 'query' ? (
          <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
            Extrair
          </button>
        ) : (
          <button type="button" className="tools-btn tools-btn--primary" onClick={handleCopyPath} disabled={!path.trim()}>
            {copyState === 'copied' ? 'Path copiado ✓' : 'Copiar path'}
          </button>
        )}
      </div>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting tool-convert__setting--wide">
          <span>JSONPath {mode === 'explore' ? '(clique no JSON ou edite)' : ''}</span>
          <input
            type="text"
            className="tool-convert__setting-input"
            value={path}
            onChange={(event) => setPath(event.target.value)}
            placeholder="$.items[0].nome"
            spellCheck={false}
          />
        </label>
      </div>

      {mode === 'query' ? (
        <div className="tool-convert__panes">
          <div className="tool-convert__pane">
            <label className="tool-convert__label" htmlFor="jsonpath-input">
              JSON
            </label>
            <textarea
              id="jsonpath-input"
              className="tool-convert__textarea"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={12}
              spellCheck={false}
            />
          </div>
          <div className="tool-convert__pane">
            <div className="tool-convert__pane-head">
              <span className="tool-convert__label">Resultado</span>
              {meta && <span className="tool-convert__meta">{meta}</span>}
            </div>
            <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={12} spellCheck={false} />
          </div>
        </div>
      ) : (
        <div className="tool-convert__panes tool-convert__panes--stack">
          <div className="tool-convert__pane">
            <label className="tool-convert__label" htmlFor="jsonpath-explore-input">
              JSON
            </label>
            <textarea
              id="jsonpath-explore-input"
              className="tool-convert__textarea"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={6}
              spellCheck={false}
            />
          </div>

          <div className="tool-convert__pane">
            <div className="tool-convert__pane-head">
              <span className="tool-convert__label">Árvore — clique para descobrir o path</span>
              {selectedPath && <span className="tool-convert__meta">{selectedPreview}</span>}
            </div>
            {!input.trim() ? (
              <p className="tool-table__empty">Cole um JSON para explorar.</p>
            ) : parsedJson === null ? (
              <p className="tool-convert__error" role="alert">
                JSON inválido — corrija o texto acima.
              </p>
            ) : (
              <JsonPathExplorer
                data={parsedJson}
                selectedPath={selectedPath}
                onSelectPath={handleExploreSelect}
              />
            )}
          </div>
        </div>
      )}

      {mode === 'explore' && selectedPath && (
        <p className="tool-convert__hint">
          Path selecionado: <code>{selectedPath}</code> — use a aba Consultar para extrair o valor.
        </p>
      )}

      {error && mode === 'query' && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

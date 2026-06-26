import { useCallback, useMemo, useState } from 'react'
import { jsonPathSample, parseJsonInput, queryJsonPath } from '../../utils/jsonPath'
import { copyText } from '../../utils/toolIO'
import { JsonPathExplorer } from './shared/JsonPathExplorer'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

export function JsonPathTool() {
  const [input, setInput] = useState('')
  const [path, setPath] = useState('$.items[*].nome')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
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

  const handleTreeSelect = (nextPath: string) => {
    setSelectedPath(nextPath)
    setPath(nextPath)
    runDataTool(() => queryJsonPath(input, nextPath), setOutput, setMeta, setError)
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
    setPath('$.items[0].nome')
    setSelectedPath('$.items[0].nome')
    runDataTool(() => queryJsonPath(jsonPathSample.input, '$.items[0].nome'), setOutput, setMeta, setError)
  }

  return (
    <div className="tool-convert tool-jsonpath">
      <ToolToolbar>
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
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
      </ToolToolbar>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="jsonpath-input">
            JSON
          </label>
          <textarea
            id="jsonpath-input"
            className="tool-convert__textarea tool-jsonpath__input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="tool-convert__pane tool-jsonpath__tree-pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Árvore</span>
            <span className="tool-convert__meta">clique para descobrir o path</span>
          </div>
          {!input.trim() ? (
            <p className="tool-table__empty tool-jsonpath__tree-empty">Cole um JSON para explorar.</p>
          ) : parsedJson === null ? (
            <p className="tool-convert__error tool-jsonpath__tree-empty" role="alert">
              JSON inválido — corrija o texto à esquerda.
            </p>
          ) : (
            <JsonPathExplorer data={parsedJson} selectedPath={selectedPath} onSelectPath={handleTreeSelect} />
          )}
        </div>
      </div>

      <div className="tool-jsonpath__query">
        <label className="tool-convert__setting tool-convert__setting--wide" htmlFor="jsonpath-expression">
          <span>JSONPath</span>
          <input
            id="jsonpath-expression"
            type="text"
            className="tool-convert__setting-input"
            value={path}
            onChange={(event) => setPath(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                run()
              }
            }}
            placeholder="$.items[0].nome"
            spellCheck={false}
          />
        </label>
        <div className="tool-jsonpath__query-actions">
          <button type="button" className="tools-btn tools-btn--ghost" onClick={handleCopyPath} disabled={!path.trim()}>
            {copyState === 'copied' ? 'Path copiado ✓' : 'Copiar path'}
          </button>
          <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
            Extrair
          </button>
        </div>
      </div>

      <div className="tool-convert__pane tool-jsonpath__result">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Resultado</span>
          {meta && <span className="tool-convert__meta">{meta}</span>}
        </div>
        <textarea
          className="tool-convert__textarea tool-convert__textarea--output tool-jsonpath__output"
          value={output}
          readOnly
          spellCheck={false}
        />
        <OutputActions output={output} downloadFilename="resultado.json" />
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

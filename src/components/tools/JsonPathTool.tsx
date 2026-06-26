import { useCallback, useState } from 'react'
import { jsonPathSample, queryJsonPath } from '../../utils/jsonPath'
import { runDataTool } from './shared/ConvertToolLayout'
import { ImportFileButton } from './shared/ImportFileButton'

export function JsonPathTool() {
  const [input, setInput] = useState('')
  const [path, setPath] = useState('$.items[*].nome')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => queryJsonPath(input, path), setOutput, setMeta, setError)
  }, [input, path])

  return (
    <div className="tool-convert">
      <div className="tool-convert__toolbar">
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput(jsonPathSample.input)
            setPath(jsonPathSample.path)
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton accept=".json,.txt" onLoad={(text) => setInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setPath('$.')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Extrair
        </button>
      </div>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting tool-convert__setting--wide">
          <span>JSONPath</span>
          <input
            type="text"
            className="tool-convert__setting-input"
            value={path}
            onChange={(event) => setPath(event.target.value)}
            placeholder="$.items[*].nome"
            spellCheck={false}
          />
        </label>
      </div>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="jsonpath-input">
            JSON
          </label>
          <textarea id="jsonpath-input" className="tool-convert__textarea" value={input} onChange={(event) => setInput(event.target.value)} rows={12} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Resultado</span>
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

import { useCallback, useState } from 'react'
import { diffText, diffSample } from '../../utils/textDiff'
import { runDataTool } from './shared/ConvertToolLayout'
import { ImportFileButton } from './shared/ImportFileButton'

export function DiffTool() {
  const [format, setFormat] = useState<'json' | 'text'>('json')
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => diffText(left, right, format), setOutput, setMeta, setError)
  }, [format, left, right])

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['json', 'JSON'],
            ['text', 'Texto'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={format === id}
            className={`tool-convert__mode${format === id ? ' is-active' : ''}`}
            onClick={() => setFormat(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tool-convert__toolbar">
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setLeft(diffSample.left)
            setRight(diffSample.right)
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton accept=".json,.txt,.csv,.yaml,.yml" label="Importar original" onLoad={(text) => setLeft(text)} />
        <ImportFileButton accept=".json,.txt,.csv,.yaml,.yml" label="Importar novo" onLoad={(text) => setRight(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setLeft('')
            setRight('')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Comparar
        </button>
      </div>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="diff-left">
            Original
          </label>
          <textarea
            id="diff-left"
            className="tool-convert__textarea"
            value={left}
            onChange={(event) => setLeft(event.target.value)}
            rows={10}
            spellCheck={false}
          />
        </div>
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="diff-right">
            Novo
          </label>
          <textarea
            id="diff-right"
            className="tool-convert__textarea"
            value={right}
            onChange={(event) => setRight(event.target.value)}
            rows={10}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Diff</span>
          {meta && <span className="tool-convert__meta">{meta}</span>}
        </div>
        <pre className="tool-diff__output">{output || 'O diff aparece aqui.'}</pre>
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

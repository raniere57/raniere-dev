import { useCallback, useState } from 'react'
import { generateFakeData, type FakeOutputFormat } from '../../utils/fakeData'
import { runDataTool } from './shared/ConvertToolLayout'

export function FakeDataTool() {
  const [format, setFormat] = useState<FakeOutputFormat>('csv')
  const [count, setCount] = useState(10)
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => generateFakeData(count, format), setOutput, setMeta, setError)
  }, [count, format])

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['csv', 'CSV'],
            ['json', 'JSON'],
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
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Gerar dados
        </button>
      </div>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting">
          <span>Linhas</span>
          <input
            type="number"
            min={1}
            max={10000}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Saída</span>
          {meta && <span className="tool-convert__meta">{meta}</span>}
        </div>
        <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={14} spellCheck={false} />
      </div>

      <p className="tool-convert__hint">CPFs gerados são fictícios, apenas para testes locais.</p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

import { useCallback, useState } from 'react'
import { DataToolError } from '../../utils/dataError'
import { computeDiff, diffSample, formatDiffLines, type DiffLine } from '../../utils/textDiff'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

function DiffMeta({ adds, removes }: { adds: number; removes: number }) {
  return (
    <span className="tool-diff__meta">
      <span className="tool-diff__meta-add">+{adds}</span>
      <span className="tool-diff__meta-sep"> / </span>
      <span className="tool-diff__meta-remove">−{removes}</span>
    </span>
  )
}

function DiffOutput({ lines }: { lines: DiffLine[] }) {
  return (
    <div className="tool-diff__output" role="region" aria-label="Resultado da comparação">
      {lines.map((line, index) => (
        <div key={`${line.type}-${index}`} className={`tool-diff__line tool-diff__line--${line.type}`}>
          <span className="tool-diff__sign" aria-hidden="true">
            {line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}
          </span>
          <span className="tool-diff__text">{line.text || '\u00A0'}</span>
        </div>
      ))}
    </div>
  )
}

export function DiffTool() {
  const [format, setFormat] = useState<'json' | 'text'>('json')
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [diffLines, setDiffLines] = useState<DiffLine[] | null>(null)
  const [stats, setStats] = useState<{ adds: number; removes: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    try {
      const result = computeDiff(left, right, format)
      setDiffLines(result.lines)
      setStats({ adds: result.adds, removes: result.removes })
      setError(null)
    } catch (cause) {
      setDiffLines(null)
      setStats(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível processar.')
    }
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

      <ToolToolbar
        action={
          <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
            Comparar
          </button>
        }
      >
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
            setDiffLines(null)
            setStats(null)
            setError(null)
          }}
        >
          Limpar
        </button>
      </ToolToolbar>

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
          {stats && <DiffMeta adds={stats.adds} removes={stats.removes} />}
        </div>
        {diffLines ? (
          <DiffOutput lines={diffLines} />
        ) : (
          <div className="tool-diff__output tool-diff__output--empty">O diff aparece aqui.</div>
        )}
        <OutputActions
          output={diffLines ? formatDiffLines(diffLines) : ''}
          downloadFilename="diff.txt"
        />
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

import { useCallback, useState } from 'react'
import { buildTablePreview, type PreviewFormat } from '../../utils/tablePreview'
import { DataToolError } from '../../utils/dataError'
import { jsonCsvSamples } from '../../utils/jsonCsv'
import { TableView } from './shared/TableView'

export function TablePreviewTool() {
  const [format, setFormat] = useState<PreviewFormat>('auto')
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<ReturnType<typeof buildTablePreview> | null>(null)

  const run = useCallback(() => {
    try {
      setPreview(buildTablePreview(input, format))
      setError(null)
    } catch (cause) {
      setPreview(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível visualizar.')
    }
  }, [format, input])

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['auto', 'Detectar'],
            ['json', 'JSON'],
            ['csv', 'CSV'],
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
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(jsonCsvSamples.csv)}>
          Carregar exemplo
        </button>
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setPreview(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Visualizar
        </button>
      </div>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="table-preview-input">
            Entrada
          </label>
          <textarea
            id="table-preview-input"
            className="tool-convert__textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                event.preventDefault()
                run()
              }
            }}
            placeholder="Cole JSON ou CSV…"
            spellCheck={false}
            rows={12}
          />
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Tabela</span>
            {preview && <span className="tool-convert__meta">{preview.meta}</span>}
          </div>
          {preview ? <TableView data={preview} /> : <p className="tool-table__empty">A tabela aparece aqui.</p>}
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

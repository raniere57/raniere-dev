import { useCallback, useState } from 'react'
import { buildDataProfile, dataProfileSample, profileToText } from '../../utils/dataProfile'
import { DataToolError } from '../../utils/dataError'
import type { InputTableFormat } from '../../utils/inputTable'
import { parseInputTable } from '../../utils/inputTable'
import { ImportFileButton } from './shared/ImportFileButton'

export function DataProfileTool() {
  const [format, setFormat] = useState<InputTableFormat>('auto')
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<ReturnType<typeof buildDataProfile> | null>(null)
  const [meta, setMeta] = useState<string | null>(null)

  const run = useCallback(() => {
    try {
      const table = parseInputTable(input, format)
      const next = buildDataProfile(input, format)
      setProfiles(next)
      setMeta(profileToText(next, table.rows.length).meta ?? null)
      setError(null)
    } catch (cause) {
      setProfiles(null)
      setMeta(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível analisar.')
    }
  }, [format, input])

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['auto', 'Detectar'],
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
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => setInput(dataProfileSample)}>
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.json,.txt" onLoad={(text) => setInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setProfiles(null)
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Analisar
        </button>
      </div>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="profile-input">
            Entrada
          </label>
          <textarea
            id="profile-input"
            className="tool-convert__textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={10}
            spellCheck={false}
          />
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Perfil</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          {profiles ? (
            <div className="tool-profile__wrap">
              <table className="tool-profile">
                <thead>
                  <tr>
                    <th>Coluna</th>
                    <th>Tipo</th>
                    <th>Nulos</th>
                    <th>Únicos</th>
                    <th>Amostras</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((column) => (
                    <tr key={column.name}>
                      <td>{column.name}</td>
                      <td>
                        <span className={`tool-profile__type tool-profile__type--${column.inferredType}`}>
                          {column.inferredType}
                        </span>
                      </td>
                      <td>{column.nullCount}</td>
                      <td>{column.unique}</td>
                      <td>{column.samples.join(', ') || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="tool-table__empty">O perfil aparece aqui.</p>
          )}
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

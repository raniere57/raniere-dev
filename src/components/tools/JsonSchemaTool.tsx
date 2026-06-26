import { useCallback, useState } from 'react'
import { jsonSchemaSamples, validateJsonSchema } from '../../utils/jsonSchema'
import { runDataTool } from './shared/ConvertToolLayout'
import { ImportFileButton } from './shared/ImportFileButton'

export function JsonSchemaTool() {
  const [jsonInput, setJsonInput] = useState('')
  const [schemaInput, setSchemaInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => validateJsonSchema(jsonInput, schemaInput), setOutput, setMeta, setError)
  }, [jsonInput, schemaInput])

  const isValid = output.startsWith('✓')

  return (
    <div className="tool-convert">
      <div className="tool-convert__toolbar">
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setJsonInput(jsonSchemaSamples.json)
            setSchemaInput(jsonSchemaSamples.schema)
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton accept=".json,.txt" label="Importar JSON" onLoad={(text) => setJsonInput(text)} />
        <ImportFileButton accept=".json,.txt" label="Importar schema" onLoad={(text) => setSchemaInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setJsonInput('')
            setSchemaInput('')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Validar
        </button>
      </div>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="schema-json">
            JSON
          </label>
          <textarea id="schema-json" className="tool-convert__textarea" value={jsonInput} onChange={(event) => setJsonInput(event.target.value)} rows={12} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="schema-input">
            JSON Schema
          </label>
          <textarea id="schema-input" className="tool-convert__textarea" value={schemaInput} onChange={(event) => setSchemaInput(event.target.value)} rows={12} spellCheck={false} />
        </div>
      </div>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Resultado</span>
          {meta && <span className="tool-convert__meta">{meta}</span>}
        </div>
        <pre className={`tool-schema__output${output ? (isValid ? ' is-valid' : ' is-invalid') : ''}`}>
          {output || 'O resultado da validação aparece aqui.'}
        </pre>
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

import { useCallback, useState } from 'react'
import { base64Sample, convertBase64, fileToBase64, type Base64Direction } from '../../utils/base64Tool'
import { DataToolError } from '../../utils/dataError'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

export function Base64Tool() {
  const [direction, setDirection] = useState<Base64Direction>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => convertBase64(input, direction), setOutput, setMeta, setError)
  }, [direction, input])

  const importFile = async (file: File) => {
    try {
      const result = await fileToBase64(file)
      setInput(result.output)
      setOutput('')
      setMeta(result.meta ?? null)
      setError(null)
      setDirection('encode')
    } catch (cause) {
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível ler o arquivo.')
    }
  }

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['encode', 'Codificar'],
            ['decode', 'Decodificar'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={direction === id}
            className={`tool-convert__mode${direction === id ? ' is-active' : ''}`}
            onClick={() => setDirection(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <ToolToolbar
        action={
          <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
            Converter
          </button>
        }
      >
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            if (direction === 'encode') {
              setInput(base64Sample.text)
            } else {
              setInput(base64Sample.encoded)
            }
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton
          accept="*/*"
          label="Importar arquivo"
          onLoad={() => {}}
          onBinaryLoad={importFile}
        />
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

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="base64-input">
            {direction === 'encode' ? 'Texto' : 'Base64'}
          </label>
          <textarea id="base64-input" className="tool-convert__textarea" value={input} onChange={(event) => setInput(event.target.value)} rows={12} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">{direction === 'encode' ? 'Base64' : 'Texto'}</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={12} spellCheck={false} />
          <OutputActions output={output} downloadFilename={direction === 'encode' ? 'resultado.base64.txt' : 'resultado.txt'} />
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

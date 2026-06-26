import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  ConvertError,
  convertJsonCsv,
  jsonCsvSamples,
  type JsonCsvDirection,
} from '../../utils/jsonCsv'

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const succeeded = document.execCommand('copy')
  textarea.remove()
  if (!succeeded) throw new Error('copy failed')
}

export function JsonCsvTool() {
  const inputId = useId()
  const outputId = useId()
  const [direction, setDirection] = useState<JsonCsvDirection>('json-to-csv')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const copyTimeoutRef = useRef<number>()

  const runConvert = useCallback(() => {
    try {
      const result = convertJsonCsv(direction, input)
      setOutput(result.output)
      setMeta(result.meta ?? null)
      setError(null)
    } catch (cause) {
      setOutput('')
      setMeta(null)
      setError(cause instanceof ConvertError ? cause.message : 'Não foi possível converter.')
    }
  }, [direction, input])

  useEffect(() => () => window.clearTimeout(copyTimeoutRef.current), [])

  useEffect(() => {
    setOutput('')
    setMeta(null)
    setError(null)
  }, [direction])

  function handleSwapDirection() {
    if (!output.trim()) {
      setDirection((current) => (current === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv'))
      return
    }

    setInput(output)
    setOutput('')
    setMeta(null)
    setError(null)
    setDirection((current) => (current === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv'))
  }

  function handleLoadSample() {
    setInput(direction === 'json-to-csv' ? jsonCsvSamples.json : jsonCsvSamples.csv)
    setOutput('')
    setMeta(null)
    setError(null)
  }

  function handleClear() {
    setInput('')
    setOutput('')
    setMeta(null)
    setError(null)
  }

  async function handleCopy() {
    if (!output.trim()) return

    try {
      await copyText(output)
      setCopyState('copied')
      window.clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('error')
      window.clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => setCopyState('idle'), 2000)
    }
  }

  function handleDownload() {
    if (!output.trim()) return
    const extension = direction === 'json-to-csv' ? 'csv' : 'json'
    downloadText(`conversao.${extension}`, output)
  }

  const inputLabel = direction === 'json-to-csv' ? 'JSON de entrada' : 'CSV de entrada'
  const outputLabel = direction === 'json-to-csv' ? 'CSV gerado' : 'JSON gerado'
  const inputPlaceholder =
    direction === 'json-to-csv'
      ? '[\n  { "nome": "Ana", "cargo": "Analista" }\n]'
      : 'nome,cargo\nAna,Analista'

  return (
    <div className="tool-json-csv">
      <div className="tool-json-csv__modes" role="tablist" aria-label="Direção da conversão">
        <button
          type="button"
          role="tab"
          aria-selected={direction === 'json-to-csv'}
          className={`tool-json-csv__mode${direction === 'json-to-csv' ? ' is-active' : ''}`}
          onClick={() => setDirection('json-to-csv')}
        >
          JSON → CSV
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={direction === 'csv-to-json'}
          className={`tool-json-csv__mode${direction === 'csv-to-json' ? ' is-active' : ''}`}
          onClick={() => setDirection('csv-to-json')}
        >
          CSV → JSON
        </button>
      </div>

      <div className="tool-json-csv__toolbar">
        <button type="button" className="tools-btn tools-btn--ghost" onClick={handleLoadSample}>
          Carregar exemplo
        </button>
        <button type="button" className="tools-btn tools-btn--ghost" onClick={handleSwapDirection}>
          Inverter direção
        </button>
        <button type="button" className="tools-btn tools-btn--ghost" onClick={handleClear}>
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={runConvert}>
          Converter
        </button>
      </div>

      <div className="tool-json-csv__panes">
        <div className="tool-json-csv__pane">
          <label className="tool-json-csv__label" htmlFor={inputId}>
            {inputLabel}
          </label>
          <textarea
            id={inputId}
            className="tool-json-csv__textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                event.preventDefault()
                runConvert()
              }
            }}
            placeholder={inputPlaceholder}
            spellCheck={false}
            rows={14}
          />
        </div>

        <div className="tool-json-csv__pane">
          <div className="tool-json-csv__pane-head">
            <label className="tool-json-csv__label" htmlFor={outputId}>
              {outputLabel}
            </label>
            {meta && <span className="tool-json-csv__meta">{meta}</span>}
          </div>
          <textarea
            id={outputId}
            className="tool-json-csv__textarea tool-json-csv__textarea--output"
            value={output}
            readOnly
            placeholder="O resultado aparece aqui após converter."
            spellCheck={false}
            rows={14}
          />
        </div>
      </div>

      {error && (
        <p className="tool-json-csv__error" role="alert">
          {error}
        </p>
      )}

      <div className="tool-json-csv__footer">
        <p className="tool-json-csv__hint">
          Atalho: <kbd>Ctrl</kbd> + <kbd>Enter</kbd> para converter
        </p>
        <div className="tool-json-csv__footer-actions">
          <button
            type="button"
            className="tools-btn tools-btn--ghost"
            onClick={handleCopy}
            disabled={!output.trim()}
          >
            {copyState === 'copied'
              ? 'Copiado ✓'
              : copyState === 'error'
                ? 'Falha ao copiar'
                : 'Copiar resultado'}
          </button>
          <button
            type="button"
            className="tools-btn tools-btn--ghost"
            onClick={handleDownload}
            disabled={!output.trim()}
          >
            Baixar arquivo
          </button>
        </div>
      </div>
    </div>
  )
}

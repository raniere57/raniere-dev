import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { DataToolError } from '../../../utils/dataError'
import { copyText, DEFAULT_TEXT_IMPORT, downloadText } from '../../../utils/toolIO'
import { ImportFileButton } from './ImportFileButton'

export function useCopyFeedback() {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const copyTimeoutRef = useRef<number>()

  useEffect(() => () => window.clearTimeout(copyTimeoutRef.current), [])

  const copy = useCallback(async (text: string) => {
    if (!text.trim()) return
    try {
      await copyText(text)
      setCopyState('copied')
      window.clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('error')
      window.clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => setCopyState('idle'), 2000)
    }
  }, [])

  const copyLabel =
    copyState === 'copied' ? 'Copiado ✓' : copyState === 'error' ? 'Falha ao copiar' : 'Copiar resultado'

  return { copy, copyLabel }
}

interface ConvertToolLayoutProps {
  modes?: { id: string; label: string }[]
  activeMode?: string
  onModeChange?: (modeId: string) => void
  settings?: React.ReactNode
  toolbarExtra?: React.ReactNode
  inputLabel: string
  outputLabel: string
  input: string
  onInputChange: (value: string) => void
  output: string
  meta?: string | null
  error?: string | null
  onRun: () => void
  onSample?: () => void
  onClear?: () => void
  inputPlaceholder?: string
  downloadFilename?: string
  downloadBom?: boolean
  showBomToggle?: boolean
  bomEnabled?: boolean
  onBomChange?: (enabled: boolean) => void
  importAccept?: string
  onImport?: (text: string, filename: string) => void
  outputReadOnly?: boolean
  children?: React.ReactNode
}

export function ConvertToolLayout({
  modes,
  activeMode,
  onModeChange,
  settings,
  toolbarExtra,
  inputLabel,
  outputLabel,
  input,
  onInputChange,
  output,
  meta,
  error,
  onRun,
  onSample,
  onClear,
  inputPlaceholder,
  downloadFilename = 'resultado.txt',
  downloadBom = false,
  showBomToggle = false,
  bomEnabled = false,
  onBomChange,
  importAccept = DEFAULT_TEXT_IMPORT,
  onImport,
  outputReadOnly = true,
  children,
}: ConvertToolLayoutProps) {
  const inputId = useId()
  const outputId = useId()
  const { copy, copyLabel } = useCopyFeedback()

  function handleImport(text: string, filename: string) {
    if (onImport) {
      onImport(text, filename)
      return
    }
    onInputChange(text)
  }

  return (
    <div className="tool-convert">
      {modes && modes.length > 0 && onModeChange && (
        <div className="tool-convert__modes" role="tablist">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={activeMode === mode.id}
              className={`tool-convert__mode${activeMode === mode.id ? ' is-active' : ''}`}
              onClick={() => onModeChange(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      )}

      {settings && <div className="tool-convert__settings">{settings}</div>}

      <div className="tool-convert__toolbar">
        {onSample && (
          <button type="button" className="tools-btn tools-btn--ghost" onClick={onSample}>
            Carregar exemplo
          </button>
        )}
        <ImportFileButton accept={importAccept} onLoad={handleImport} />
        {onClear && (
          <button type="button" className="tools-btn tools-btn--ghost" onClick={onClear}>
            Limpar
          </button>
        )}
        {toolbarExtra}
        <button type="button" className="tools-btn tools-btn--primary" onClick={onRun}>
          Processar
        </button>
      </div>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor={inputId}>
            {inputLabel}
          </label>
          <textarea
            id={inputId}
            className="tool-convert__textarea"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                event.preventDefault()
                onRun()
              }
            }}
            placeholder={inputPlaceholder}
            spellCheck={false}
            rows={12}
          />
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <label className="tool-convert__label" htmlFor={outputId}>
              {outputLabel}
            </label>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          {children ?? (
            <textarea
              id={outputId}
              className="tool-convert__textarea tool-convert__textarea--output"
              value={output}
              readOnly={outputReadOnly}
              placeholder="O resultado aparece aqui após processar."
              spellCheck={false}
              rows={12}
            />
          )}
        </div>
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}

      <div className="tool-convert__footer">
        <p className="tool-convert__hint">
          Atalho: <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
        </p>
        <div className="tool-convert__footer-actions">
          {showBomToggle && onBomChange && (
            <label className="tool-convert__bom">
              <input
                type="checkbox"
                checked={bomEnabled}
                onChange={(event) => onBomChange(event.target.checked)}
              />
              UTF-8 BOM (Excel BR)
            </label>
          )}
          <button
            type="button"
            className="tools-btn tools-btn--ghost"
            onClick={() => copy(output)}
            disabled={!output.trim()}
          >
            {copyLabel}
          </button>
          <button
            type="button"
            className="tools-btn tools-btn--ghost"
            onClick={() => downloadText(downloadFilename, output, downloadBom)}
            disabled={!output.trim()}
          >
            Baixar arquivo
          </button>
        </div>
      </div>
    </div>
  )
}

export function runDataTool<T extends { output: string; meta?: string }>(
  runner: () => T,
  setOutput: (value: string) => void,
  setMeta: (value: string | null) => void,
  setError: (value: string | null) => void,
) {
  try {
    const result = runner()
    setOutput(result.output)
    setMeta(result.meta ?? null)
    setError(null)
  } catch (cause) {
    setOutput('')
    setMeta(null)
    setError(cause instanceof DataToolError ? cause.message : 'Não foi possível processar.')
  }
}

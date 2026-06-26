import { useCallback, useEffect, useRef, useState } from 'react'
import { copyText, downloadText } from '../../../utils/toolIO'

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

interface OutputActionsProps {
  output: string
  downloadFilename?: string
  downloadBom?: boolean
  showBomToggle?: boolean
  bomEnabled?: boolean
  onBomChange?: (enabled: boolean) => void
  compact?: boolean
}

export function OutputActions({
  output,
  downloadFilename = 'resultado.txt',
  downloadBom = false,
  showBomToggle = false,
  bomEnabled = false,
  onBomChange,
  compact = true,
}: OutputActionsProps) {
  const { copy, copyLabel } = useCopyFeedback()
  const disabled = !output.trim()

  return (
    <div className={`tool-convert__footer${compact ? ' tool-convert__footer--compact' : ''}`}>
      {!compact && (
        <p className="tool-convert__hint">
          Atalho: <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
        </p>
      )}
      <div className="tool-convert__footer-actions">
        {showBomToggle && onBomChange && (
          <label className="tool-convert__bom">
            <input type="checkbox" checked={bomEnabled} onChange={(event) => onBomChange(event.target.checked)} />
            UTF-8 BOM (Excel BR)
          </label>
        )}
        <button type="button" className="tools-btn tools-btn--ghost" onClick={() => copy(output)} disabled={disabled}>
          {copyLabel}
        </button>
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => downloadText(downloadFilename, output, downloadBom)}
          disabled={disabled}
        >
          Baixar arquivo
        </button>
      </div>
    </div>
  )
}

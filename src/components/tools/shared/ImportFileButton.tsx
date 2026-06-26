import { useId, useRef } from 'react'
import { DEFAULT_TEXT_IMPORT, readTextFile } from '../../../utils/toolIO'

interface ImportFileButtonProps {
  accept?: string
  label?: string
  onLoad: (text: string, filename: string) => void
  onError?: (message: string) => void
}

export function ImportFileButton({
  accept = DEFAULT_TEXT_IMPORT,
  label = 'Importar arquivo',
  onLoad,
  onError,
}: ImportFileButtonProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const text = await readTextFile(file)
      onLoad(text, file.name)
    } catch {
      onError?.('Não foi possível ler o arquivo.')
    }
  }

  return (
    <span className="tool-convert__import">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="tool-convert__file-input"
        tabIndex={-1}
        onChange={handleChange}
      />
      <button
        type="button"
        className="tools-btn tools-btn--ghost"
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </button>
    </span>
  )
}

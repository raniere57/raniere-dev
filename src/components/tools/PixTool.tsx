import { useCallback } from 'react'
import {
  pixSamples,
  validatePixBatch,
  validatePixCsv,
  validatePixKey,
  validateSinglePix,
} from '../../utils/pix'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function PixTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSinglePix(input)
    if (view === 'batch') return validatePixBatch(input)
    return validatePixCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="pix-input"
      inputLabels={{
        single: 'Chave PIX',
        batch: 'Chaves PIX (uma por linha)',
        csv: 'CSV',
      }}
      columnLabel="Coluna de chaves PIX"
      placeholder="CPF, CNPJ, e-mail, +5511987654321 ou UUID"
      batchPlaceholder="Cole várias chaves PIX, uma por linha…"
      hint="Aceita CPF, CNPJ, e-mail, telefone (+55) e chave aleatória (UUID). Processado no navegador."
      downloadBaseName="pix-validados"
      samples={pixSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validatePixKey(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ Chave válida · ${result.formatted ?? value}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

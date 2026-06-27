import { useCallback } from 'react'
import {
  cnhSamples,
  validateCnh,
  validateCnhBatch,
  validateCnhCsv,
  validateSingleCnh,
} from '../../utils/cnh'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function CnhTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSingleCnh(input)
    if (view === 'batch') return validateCnhBatch(input)
    return validateCnhCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="cnh-input"
      inputLabels={{ single: 'CNH (registro)', batch: 'CNHs (um por linha)', csv: 'CSV' }}
      columnLabel="Coluna de CNH"
      placeholder="10000000101"
      batchPlaceholder="Cole várias CNHs, uma por linha…"
      hint="Valida registro de CNH (11 dígitos). Processado no navegador."
      downloadBaseName="cnh-validadas"
      samples={cnhSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validateCnh(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ CNH válida${result.formatted ? ` · ${result.formatted}` : ''}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

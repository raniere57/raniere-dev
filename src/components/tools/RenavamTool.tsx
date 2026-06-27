import { useCallback } from 'react'
import {
  renavamSamples,
  validateRenavam,
  validateRenavamBatch,
  validateRenavamCsv,
  validateSingleRenavam,
} from '../../utils/renavam'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function RenavamTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSingleRenavam(input)
    if (view === 'batch') return validateRenavamBatch(input)
    return validateRenavamCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="renavam-input"
      inputLabels={{ single: 'RENAVAM', batch: 'RENAVAMs (um por linha)', csv: 'CSV' }}
      columnLabel="Coluna de RENAVAM"
      placeholder="14283256656"
      batchPlaceholder="Cole vários RENAVAMs, um por linha…"
      hint="Processado no seu navegador — nenhum dado é enviado ao servidor."
      downloadBaseName="renavam-validados"
      samples={renavamSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validateRenavam(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ RENAVAM válido${result.formatted ? ` · ${result.formatted}` : ''}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

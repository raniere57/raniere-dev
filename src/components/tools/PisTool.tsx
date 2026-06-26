import { useCallback } from 'react'
import {
  pisSamples,
  validatePis,
  validatePisBatch,
  validatePisCsv,
  validateSinglePis,
} from '../../utils/pis'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function PisTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSinglePis(input)
    if (view === 'batch') return validatePisBatch(input)
    return validatePisCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="pis-input"
      inputLabels={{
        single: 'PIS / PASEP / NIS',
        batch: 'PIS/PASEP (um por linha)',
        csv: 'CSV',
      }}
      columnLabel="Coluna de PIS/PASEP"
      placeholder="170.332.595-12"
      batchPlaceholder="Cole vários PIS/PASEP, um por linha…"
      hint="Processado no seu navegador — nenhum dado é enviado ao servidor."
      downloadBaseName="pis-validados"
      samples={pisSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validatePis(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ PIS/PASEP válido${result.formatted ? ` · ${result.formatted}` : ''}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

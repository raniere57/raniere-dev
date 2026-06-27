import { useCallback } from 'react'
import {
  cnsSamples,
  validateCns,
  validateCnsBatch,
  validateCnsCsv,
  validateSingleCns,
} from '../../utils/cns'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function CnsTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSingleCns(input)
    if (view === 'batch') return validateCnsBatch(input)
    return validateCnsCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="cns-input"
      inputLabels={{ single: 'CNS', batch: 'CNS (um por linha)', csv: 'CSV' }}
      columnLabel="Coluna de CNS"
      placeholder="100000000060018"
      batchPlaceholder="Cole vários CNS, um por linha…"
      hint="Cartão Nacional de Saúde (15 dígitos). Algoritmo e-SUS. Processado no navegador."
      downloadBaseName="cns-validados"
      samples={cnsSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validateCns(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ CNS válido · ${result.kind === 'provisorio' ? 'provisório' : 'definitivo'}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

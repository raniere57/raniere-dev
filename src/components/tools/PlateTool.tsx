import { useCallback } from 'react'
import {
  plateSamples,
  validatePlate,
  validatePlateBatch,
  validatePlateCsv,
  validateSinglePlate,
} from '../../utils/plate'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function PlateTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSinglePlate(input)
    if (view === 'batch') return validatePlateBatch(input)
    return validatePlateCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="plate-input"
      inputLabels={{ single: 'Placa', batch: 'Placas (uma por linha)', csv: 'CSV' }}
      columnLabel="Coluna de placas"
      placeholder="ABC1D23 ou ABC1234"
      batchPlaceholder="Cole várias placas, uma por linha…"
      hint="Aceita padrão Mercosul (ABC1D23) e antigo (ABC1234). Sem letras I, O ou Q."
      downloadBaseName="placas-validadas"
      samples={plateSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validatePlate(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ Placa válida · ${result.format}${result.formatted ? ` · ${result.formatted}` : ''}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

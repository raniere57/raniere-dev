import { useCallback } from 'react'
import {
  tituloEleitorSamples,
  validateSingleTituloEleitor,
  validateTituloEleitor,
  validateTituloEleitorBatch,
  validateTituloEleitorCsv,
} from '../../utils/tituloEleitor'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function TituloEleitorTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSingleTituloEleitor(input)
    if (view === 'batch') return validateTituloEleitorBatch(input)
    return validateTituloEleitorCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="titulo-input"
      inputLabels={{
        single: 'Título de eleitor',
        batch: 'Títulos (um por linha)',
        csv: 'CSV',
      }}
      columnLabel="Coluna de títulos"
      placeholder="051823250108"
      batchPlaceholder="Cole vários títulos, um por linha…"
      hint="Algoritmo TSE (12 dígitos). Processado no navegador."
      downloadBaseName="titulos-validados"
      samples={tituloEleitorSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validateTituloEleitor(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ Título válido${result.formatted ? ` · ${result.formatted}` : ''}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

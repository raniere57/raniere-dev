import { useCallback } from 'react'
import {
  certidaoSamples,
  validateCertidao,
  validateCertidaoBatch,
  validateCertidaoCsv,
  validateSingleCertidao,
} from '../../utils/certidao'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function CertidaoTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSingleCertidao(input)
    if (view === 'batch') return validateCertidaoBatch(input)
    return validateCertidaoCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="certidao-input"
      inputLabels={{
        single: 'Matrícula CNJ (32 dígitos)',
        batch: 'Certidões (um por linha)',
        csv: 'CSV',
      }}
      columnLabel="Coluna de certidões"
      placeholder="10683611192610011886261626561423"
      batchPlaceholder="Cole várias matrículas, uma por linha…"
      hint="Certidão civil — padrão CNJ, módulo 97. Não confirma existência no cartório."
      downloadBaseName="certidoes-validadas"
      samples={certidaoSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validateCertidao(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ Certidão válida · ${result.kind}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

import { useCallback } from 'react'
import {
  creditCardSamples,
  validateCreditCard,
  validateCreditCardBatch,
  validateCreditCardCsv,
  validateSingleCreditCard,
} from '../../utils/creditCard'
import { ValidatorToolShell, type ValidatorView } from './shared/ValidatorToolShell'

export function CreditCardTool() {
  const onRun = useCallback((view: ValidatorView, input: string, column: string) => {
    if (view === 'single') return validateSingleCreditCard(input)
    if (view === 'batch') return validateCreditCardBatch(input)
    return validateCreditCardCsv(input, column)
  }, [])

  return (
    <ValidatorToolShell
      inputId="card-input"
      inputLabels={{
        single: 'Número do cartão',
        batch: 'Cartões (um por linha)',
        csv: 'CSV',
      }}
      columnLabel="Coluna de cartões"
      placeholder="4111 1111 1111 1111"
      batchPlaceholder="Cole vários números de cartão, um por linha…"
      hint="Validação Luhn + detecção de bandeira. Não confirma cartão real — apenas formato."
      downloadBaseName="cartoes-validados"
      samples={creditCardSamples}
      onRun={onRun}
      preview={(value) => {
        const result = validateCreditCard(value)
        return {
          valid: result.valid,
          summary: result.valid
            ? `✓ ${result.brand} válido${result.formatted ? ` · ${result.formatted}` : ''}`
            : `✗ Inválido${result.reason ? ` — ${result.reason}` : ''}`,
        }
      }}
    />
  )
}

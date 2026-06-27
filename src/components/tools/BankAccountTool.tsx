import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BANK_NAMES,
  bankAccountSamples,
  validateBankAccountBatch,
  validateBankAccountCsv,
  validateBankAccountFields,
  validateSingleBankAccount,
} from '../../utils/bankAccount'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

type ValidatorView = 'single' | 'batch' | 'csv'

const BANK_OPTIONS = ['001', '033', '104', '237', '341'] as const

export function BankAccountTool() {
  const [view, setView] = useState<ValidatorView>('single')
  const [bankCode, setBankCode] = useState('001')
  const [agency, setAgency] = useState('')
  const [operation, setOperation] = useState('001')
  const [account, setAccount] = useState('')
  const [input, setInput] = useState('')
  const [column, setColumn] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (view !== 'csv') return
    try {
      const table = parseInputTable(input, 'auto')
      setColumns(table.headers)
      setColumn((current) => (table.headers.includes(current) ? current : table.headers[0] ?? ''))
    } catch {
      setColumns([])
      setColumn('')
    }
  }, [input, view])

  const singlePreview = useMemo(() => {
    if (view !== 'single' || !agency.trim() || !account.trim()) return null
    return validateBankAccountFields(bankCode, agency, account, bankCode === '104' ? operation : undefined)
  }, [account, agency, bankCode, operation, view])

  const run = useCallback(() => {
    runDataTool(
      () => {
        if (view === 'single') {
          return validateSingleBankAccount(
            bankCode,
            agency,
            account,
            bankCode === '104' ? operation : undefined,
          )
        }
        if (view === 'batch') return validateBankAccountBatch(input)
        return validateBankAccountCsv(input, column)
      },
      setOutput,
      setMeta,
      setError,
    )
  }, [account, agency, bankCode, column, input, operation, view])

  const loadSample = () => {
    if (view === 'single') {
      const sample = bankAccountSamples.single
      setBankCode(sample.bank)
      setAgency(sample.agency)
      setAccount(sample.account)
      setOperation(sample.operation || '001')
    } else if (view === 'batch') {
      setInput(bankAccountSamples.batch)
    } else {
      setInput(bankAccountSamples.csv)
    }
    setOutput('')
    setMeta(null)
    setError(null)
  }

  const outputClassName =
    view === 'single' && output
      ? `tool-schema__output${output.startsWith('✓') ? ' is-valid' : ' is-invalid'}`
      : 'tool-convert__textarea tool-convert__textarea--output'

  return (
    <div className="tool-convert tool-validator">
      <div className="tool-convert__modes" role="tablist" aria-label="Modo de validação">
        {(
          [
            ['single', 'Uma conta'],
            ['batch', 'Lista'],
            ['csv', 'Coluna CSV'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={view === id}
            className={`tool-convert__mode${view === id ? ' is-active' : ''}`}
            onClick={() => {
              setView(id)
              setOutput('')
              setMeta(null)
              setError(null)
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="tool-convert__warn tool-convert__warn--info" role="note">
        Valida dígito verificador (BB, Bradesco, Itaú, Caixa, Santander). Não confirma se a conta existe.
        {view !== 'single' && ' Formato: banco;agência;conta-dv — Caixa: banco;agência;operação;conta-dv.'}
      </p>

      {view === 'single' ? (
        <div className="tool-convert__settings">
          <label className="tool-convert__setting">
            <span>Banco</span>
            <select value={bankCode} onChange={(event) => setBankCode(event.target.value)}>
              {BANK_OPTIONS.map((code) => (
                <option key={code} value={code}>
                  {code} — {BANK_NAMES[code]}
                </option>
              ))}
            </select>
          </label>
          <label className="tool-convert__setting">
            <span>Agência</span>
            <input
              type="text"
              className="tool-convert__setting-input"
              value={agency}
              onChange={(event) => setAgency(event.target.value)}
              placeholder="1234"
              spellCheck={false}
              autoComplete="off"
            />
          </label>
          {bankCode === '104' && (
            <label className="tool-convert__setting">
              <span>Operação</span>
              <input
                type="text"
                className="tool-convert__setting-input"
                value={operation}
                onChange={(event) => setOperation(event.target.value)}
                placeholder="001"
                spellCheck={false}
                autoComplete="off"
              />
            </label>
          )}
          <label className="tool-convert__setting">
            <span>Conta com dígito</span>
            <input
              type="text"
              className="tool-convert__setting-input"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  run()
                }
              }}
              placeholder="56793-0"
              spellCheck={false}
              autoComplete="off"
            />
          </label>
        </div>
      ) : (
        <>
          {view === 'csv' && (
            <div className="tool-convert__settings">
              <label className="tool-convert__setting">
                <span>Coluna de contas</span>
                <select value={column} onChange={(event) => setColumn(event.target.value)}>
                  {columns.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </>
      )}

      <ToolToolbar
        action={
          <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
            Validar
          </button>
        }
      >
        <button type="button" className="tools-btn tools-btn--ghost" onClick={loadSample}>
          Carregar exemplo
        </button>
        {view !== 'single' && (
          <ImportFileButton accept=".csv,.tsv,.txt" onLoad={(text) => setInput(text)} />
        )}
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setAgency('')
            setAccount('')
            setInput('')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
      </ToolToolbar>

      <div className="tool-convert__panes tool-convert__panes--stack">
        {view !== 'single' && (
          <div className="tool-convert__pane">
            <label className="tool-convert__label" htmlFor="bank-input">
              {view === 'batch' ? 'Contas (uma por linha)' : 'CSV'}
            </label>
            <textarea
              id="bank-input"
              className="tool-convert__textarea"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={view === 'csv' ? 10 : 8}
              spellCheck={false}
              placeholder="001;1234;56793-0"
            />
          </div>
        )}

        {view === 'single' && singlePreview && !output && (
          <p
            className={`tool-cpfcnpj__preview${singlePreview.valid ? ' is-valid' : ' is-invalid'}`}
            aria-live="polite"
          >
            {singlePreview.valid
              ? `✓ DV válido · ${singlePreview.bankName}`
              : `✗ Inválido${singlePreview.reason ? ` — ${singlePreview.reason}` : ''}`}
          </p>
        )}

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Resultado</span>
            {meta && (
              <span
                className={`tool-convert__meta${output.startsWith('✓') ? '' : ' tool-convert__meta--bad'}`}
              >
                {meta}
              </span>
            )}
          </div>
          {view === 'single' && output ? (
            <pre className={outputClassName}>{output}</pre>
          ) : (
            <textarea className={outputClassName} value={output} readOnly rows={view === 'csv' ? 10 : 8} spellCheck={false} />
          )}
          <OutputActions
            output={output}
            downloadFilename={view === 'csv' ? 'contas-validadas.csv' : 'contas-validadas.txt'}
            downloadBom={view === 'csv'}
          />
        </div>
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

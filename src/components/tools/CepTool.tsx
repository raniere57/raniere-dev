import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CEP_LOOKUP_HINT,
  type CepAddress,
  type CepLocation,
  buildGoogleMapsUrl,
  buildOpenStreetMapUrl,
  buildOsmEmbedUrl,
  cepSamples,
  validateCep,
  validateCepBatch,
  validateCepCsv,
  validateSingleCep,
} from '../../utils/cep'
import { DataToolError } from '../../utils/dataError'
import { parseInputTable } from '../../utils/inputTable'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

type ValidatorView = 'single' | 'batch' | 'csv'

export function CepTool() {
  const [view, setView] = useState<ValidatorView>('single')
  const [input, setInput] = useState('')
  const [column, setColumn] = useState('')
  const [columns, setColumns] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [address, setAddress] = useState<CepAddress | null>(null)
  const [location, setLocation] = useState<CepLocation | null>(null)
  const [loading, setLoading] = useState(false)

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
    if (view !== 'single' || !input.trim()) return null
    return validateCep(input)
  }, [input, view])

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    setAddress(null)
    setLocation(null)
    try {
      if (view === 'single') {
        const result = await validateSingleCep(input)
        setOutput(result.output)
        setMeta(result.meta ?? null)
        setAddress(result.address ?? null)
        setLocation(result.location ?? null)
      } else if (view === 'batch') {
        const result = await validateCepBatch(input)
        setOutput(result.output)
        setMeta(result.meta ?? null)
      } else {
        const result = await validateCepCsv(input, column)
        setOutput(result.output)
        setMeta(result.meta ?? null)
      }
    } catch (cause) {
      setOutput('')
      setMeta(null)
      setAddress(null)
      setLocation(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível consultar.')
    } finally {
      setLoading(false)
    }
  }, [column, input, view])

  const loadSample = () => {
    if (view === 'single') setInput(cepSamples.single)
    else if (view === 'batch') setInput(cepSamples.batch)
    else setInput(cepSamples.csv)
    setOutput('')
    setMeta(null)
    setAddress(null)
    setLocation(null)
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
            ['single', 'Um CEP'],
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
              setAddress(null)
              setLocation(null)
              setError(null)
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="tool-convert__warn tool-convert__warn--info" role="note">
        {CEP_LOOKUP_HINT}
        {view !== 'single' && ' Limite: 20 CEPs (lista) ou 30 linhas (CSV) por consulta.'}
      </p>

      {view === 'csv' && (
        <div className="tool-convert__settings">
          <label className="tool-convert__setting">
            <span>Coluna de CEP</span>
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

      <ToolToolbar
        action={
          <button type="button" className="tools-btn tools-btn--primary" onClick={() => void run()} disabled={loading}>
            {loading ? 'Consultando…' : 'Validar e buscar'}
          </button>
        }
      >
        <button type="button" className="tools-btn tools-btn--ghost" onClick={loadSample} disabled={loading}>
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.txt" onLoad={(text) => setInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setOutput('')
            setMeta(null)
            setAddress(null)
            setLocation(null)
            setError(null)
          }}
          disabled={loading}
        >
          Limpar
        </button>
      </ToolToolbar>

      <div className="tool-convert__panes tool-convert__panes--stack">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="cep-input">
            {view === 'single' ? 'CEP' : view === 'batch' ? 'CEPs (um por linha)' : 'CSV'}
          </label>
          {view === 'single' ? (
            <input
              id="cep-input"
              type="text"
              className="tool-convert__setting-input tool-cpfcnpj__input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void run()
                }
              }}
              placeholder="64010-010"
              spellCheck={false}
              autoComplete="off"
            />
          ) : (
            <textarea
              id="cep-input"
              className="tool-convert__textarea"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={view === 'csv' ? 10 : 8}
              spellCheck={false}
            />
          )}
          {view === 'single' && singlePreview && !output && (
            <p
              className={`tool-cpfcnpj__preview${singlePreview.valid ? ' is-valid' : ' is-invalid'}`}
              aria-live="polite"
            >
              {singlePreview.valid
                ? `✓ Formato válido${singlePreview.formatted ? ` · ${singlePreview.formatted}` : ''}`
                : `✗ Inválido${singlePreview.reason ? ` — ${singlePreview.reason}` : ''}`}
            </p>
          )}
        </div>

        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Resultado</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>

          {view === 'single' && address?.found && (
            <>
              <div className="tool-cep__address">
                <p className="tool-cep__address-line">{address.street || 'Logradouro não informado'}</p>
                <p className="tool-cep__address-line">
                  {[address.district, `${address.city} — ${address.state}`].filter(Boolean).join(' · ')}
                </p>
                {address.complement && <p className="tool-cep__address-meta">{address.complement}</p>}
                <p className="tool-cep__address-meta">CEP {address.cep}</p>
              </div>

              {location ? (
                <div className="tool-cep__map">
                  <iframe
                    title={`Mapa — ${address.street || address.cep}`}
                    className="tool-cep__map-frame"
                    src={buildOsmEmbedUrl(location)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="tool-cep__map-links">
                    <a href={buildGoogleMapsUrl(location)} target="_blank" rel="noopener noreferrer">
                      Abrir no Google Maps
                    </a>
                    <a href={buildOpenStreetMapUrl(location)} target="_blank" rel="noopener noreferrer">
                      Abrir no OpenStreetMap
                    </a>
                  </div>
                  <p className="tool-cep__map-note">Localização aproximada com base no endereço retornado pelo ViaCEP.</p>
                </div>
              ) : (
                output && (
                  <p className="tool-cep__map-unavailable">
                    Mapa indisponível — não foi possível geocodificar este endereço.
                  </p>
                )
              )}
            </>
          )}

          {view === 'single' && address && !address.found && output && (
            <p className="tool-cep__address tool-cep__address--missing">CEP não encontrado na base dos Correios.</p>
          )}

          {view === 'single' && output ? (
            <pre className={outputClassName}>{output}</pre>
          ) : (
            <textarea className={outputClassName} value={output} readOnly rows={view === 'csv' ? 10 : 8} spellCheck={false} />
          )}
          <OutputActions
            output={output}
            downloadFilename={view === 'csv' ? 'ceps-validados.csv' : 'validacao.txt'}
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

import { useCallback, useEffect, useState } from 'react'
import { csvProcvSamples, procvCsv } from '../../utils/csvProcv'
import { parseInputTable } from '../../utils/inputTable'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ImportFileButton } from './shared/ImportFileButton'

export function CsvProcvTool() {
  const [main, setMain] = useState('')
  const [lookup, setLookup] = useState('')
  const [mainKey, setMainKey] = useState('')
  const [lookupKey, setLookupKey] = useState('')
  const [returnColumn, setReturnColumn] = useState('')
  const [outputColumn, setOutputColumn] = useState('')
  const [notFoundValue, setNotFoundValue] = useState('#N/A')
  const [mainColumns, setMainColumns] = useState<string[]>([])
  const [lookupColumns, setLookupColumns] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const table = parseInputTable(main, 'auto')
      setMainColumns(table.headers)
      setMainKey((current) => (table.headers.includes(current) ? current : table.headers[0] ?? ''))
    } catch {
      setMainColumns([])
      setMainKey('')
    }
  }, [main])

  useEffect(() => {
    try {
      const table = parseInputTable(lookup, 'auto')
      setLookupColumns(table.headers)
      setLookupKey((current) => (table.headers.includes(current) ? current : table.headers[0] ?? ''))
      setReturnColumn((current) => {
        if (table.headers.includes(current)) return current
        const fallback = table.headers.find((header) => header !== table.headers[0])
        return fallback ?? table.headers[0] ?? ''
      })
    } catch {
      setLookupColumns([])
      setLookupKey('')
      setReturnColumn('')
    }
  }, [lookup])

  const run = useCallback(() => {
    runDataTool(
      () =>
        procvCsv(main, lookup, mainKey, lookupKey, returnColumn, outputColumn, notFoundValue),
      setOutput,
      setMeta,
      setError,
    )
  }, [lookup, lookupKey, main, mainKey, notFoundValue, outputColumn, returnColumn])

  return (
    <div className="tool-convert">
      <div className="tool-convert__toolbar">
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setMain(csvProcvSamples.main)
            setLookup(csvProcvSamples.lookup)
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.txt" label="Importar principal" onLoad={(text) => setMain(text)} />
        <ImportFileButton accept=".csv,.tsv,.txt" label="Importar consulta" onLoad={(text) => setLookup(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setMain('')
            setLookup('')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Aplicar PROCV
        </button>
      </div>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting">
          <span>Chave (principal)</span>
          <select value={mainKey} onChange={(event) => setMainKey(event.target.value)}>
            {mainColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Chave (consulta)</span>
          <select value={lookupKey} onChange={(event) => setLookupKey(event.target.value)}>
            {lookupColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Coluna a retornar</span>
          <select value={returnColumn} onChange={(event) => setReturnColumn(event.target.value)}>
            {lookupColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Nome da coluna nova</span>
          <input
            type="text"
            className="tool-convert__setting-input"
            value={outputColumn}
            onChange={(event) => setOutputColumn(event.target.value)}
            placeholder={returnColumn || 'preco'}
            spellCheck={false}
          />
        </label>
        <label className="tool-convert__setting">
          <span>Se não encontrar</span>
          <input
            type="text"
            className="tool-convert__setting-input"
            value={notFoundValue}
            onChange={(event) => setNotFoundValue(event.target.value)}
            spellCheck={false}
          />
        </label>
      </div>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="procv-main">
            Tabela principal
          </label>
          <textarea
            id="procv-main"
            className="tool-convert__textarea"
            value={main}
            onChange={(event) => setMain(event.target.value)}
            rows={9}
            spellCheck={false}
          />
        </div>
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="procv-lookup">
            Tabela de consulta
          </label>
          <textarea
            id="procv-lookup"
            className="tool-convert__textarea"
            value={lookup}
            onChange={(event) => setLookup(event.target.value)}
            rows={9}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Resultado</span>
          {meta && <span className="tool-convert__meta">{meta}</span>}
        </div>
        <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={10} spellCheck={false} />
        <OutputActions output={output} downloadFilename="resultado.csv" />
      </div>

      <p className="tool-convert__hint">
        Equivalente ao PROCV/VLOOKUP: busca a chave na tabela de consulta e adiciona uma coluna na principal.
      </p>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

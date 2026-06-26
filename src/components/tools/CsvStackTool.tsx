import { useCallback, useState } from 'react'
import { csvStackSamples, stackCsvTables } from '../../utils/csvStack'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

export function CsvStackTool() {
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [third, setThird] = useState('')
  const [alignColumns, setAlignColumns] = useState(true)
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => stackCsvTables([first, second, third], alignColumns), setOutput, setMeta, setError)
  }, [alignColumns, first, second, third])

  return (
    <div className="tool-convert">
      <ToolToolbar
        action={
          <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
            Empilhar
          </button>
        }
      >
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setFirst(csvStackSamples.first)
            setSecond(csvStackSamples.second)
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.txt" label="Importar 1ª" onLoad={(text) => setFirst(text)} />
        <ImportFileButton accept=".csv,.tsv,.txt" label="Importar 2ª" onLoad={(text) => setSecond(text)} />
        <ImportFileButton accept=".csv,.tsv,.txt" label="Importar 3ª" onLoad={(text) => setThird(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setFirst('')
            setSecond('')
            setThird('')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
      </ToolToolbar>

      <label className="tool-convert__checkbox">
        <input type="checkbox" checked={alignColumns} onChange={(event) => setAlignColumns(event.target.checked)} />
        Alinhar colunas diferentes (preenche vazio onde faltar)
      </label>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="stack-first">
            Tabela 1
          </label>
          <textarea id="stack-first" className="tool-convert__textarea" value={first} onChange={(event) => setFirst(event.target.value)} rows={8} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="stack-second">
            Tabela 2
          </label>
          <textarea id="stack-second" className="tool-convert__textarea" value={second} onChange={(event) => setSecond(event.target.value)} rows={8} spellCheck={false} />
        </div>
      </div>

      <div className="tool-convert__pane">
        <label className="tool-convert__label" htmlFor="stack-third">
          Tabela 3 (opcional)
        </label>
        <textarea id="stack-third" className="tool-convert__textarea" value={third} onChange={(event) => setThird(event.target.value)} rows={5} spellCheck={false} />
      </div>

      <div className="tool-convert__pane">
        <div className="tool-convert__pane-head">
          <span className="tool-convert__label">Resultado</span>
          {meta && <span className="tool-convert__meta">{meta}</span>}
        </div>
        <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={10} spellCheck={false} />
        <OutputActions output={output} downloadFilename="resultado.csv" />
      </div>

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

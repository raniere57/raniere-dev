import { useCallback, useState } from 'react'
import { findAndReplace, findReplaceSample, type ReplaceMode } from '../../utils/findReplace'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ToolActionBar, ToolToolbar } from './shared/ToolToolbar'
import { ImportFileButton } from './shared/ImportFileButton'

export function FindReplaceTool() {
  const [mode, setMode] = useState<ReplaceMode>('literal')
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [replacement, setReplacement] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => findAndReplace(input, search, replacement, mode), setOutput, setMeta, setError)
  }, [input, mode, replacement, search])

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['literal', 'Literal'],
            ['regex', 'Regex'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={`tool-convert__mode${mode === id ? ' is-active' : ''}`}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <ToolToolbar>
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput(findReplaceSample.input)
            setSearch(findReplaceSample.search)
            setReplacement(findReplaceSample.replacement)
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.json,.txt,.yaml,.yml" onLoad={(text) => setInput(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setInput('')
            setSearch('')
            setReplacement('')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        </ToolToolbar>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting tool-convert__setting--wide">
          <span>Buscar</span>
          <input type="text" className="tool-convert__setting-input" value={search} onChange={(event) => setSearch(event.target.value)} spellCheck={false} />
        </label>
        <label className="tool-convert__setting tool-convert__setting--wide">
          <span>Substituir por</span>
          <input type="text" className="tool-convert__setting-input" value={replacement} onChange={(event) => setReplacement(event.target.value)} spellCheck={false} />
        </label>
      </div>

      <ToolActionBar>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Substituir
        </button>
      </ToolActionBar>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="findreplace-input">
            Entrada
          </label>
          <textarea id="findreplace-input" className="tool-convert__textarea" value={input} onChange={(event) => setInput(event.target.value)} rows={12} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">Saída</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={12} spellCheck={false} />
        <OutputActions output={output} downloadFilename="resultado.txt" />
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

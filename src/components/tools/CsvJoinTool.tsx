import { useCallback, useEffect, useState } from 'react'
import { csvJoinSamples, joinCsvTables, type JoinType } from '../../utils/csvJoin'
import { listCsvColumns } from '../../utils/csvColumns'
import { runDataTool } from './shared/ConvertToolLayout'
import { OutputActions } from './shared/OutputActions'
import { ImportFileButton } from './shared/ImportFileButton'

export function CsvJoinTool() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [leftKey, setLeftKey] = useState('')
  const [rightKey, setRightKey] = useState('')
  const [joinType, setJoinType] = useState<JoinType>('inner')
  const [leftColumns, setLeftColumns] = useState<string[]>([])
  const [rightColumns, setRightColumns] = useState<string[]>([])
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const nextLeft = listCsvColumns(left)
    setLeftColumns(nextLeft)
    setLeftKey((current) => (nextLeft.includes(current) ? current : nextLeft[0] ?? ''))
  }, [left])

  useEffect(() => {
    const nextRight = listCsvColumns(right)
    setRightColumns(nextRight)
    setRightKey((current) => (nextRight.includes(current) ? current : nextRight[0] ?? ''))
  }, [right])

  const run = useCallback(() => {
    runDataTool(
      () => joinCsvTables(left, right, leftKey, rightKey, joinType),
      setOutput,
      setMeta,
      setError,
    )
  }, [joinType, left, leftKey, right, rightKey])

  return (
    <div className="tool-convert">
      <div className="tool-convert__toolbar">
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setLeft(csvJoinSamples.left)
            setRight(csvJoinSamples.right)
          }}
        >
          Carregar exemplo
        </button>
        <ImportFileButton accept=".csv,.tsv,.txt" label="Importar esquerda" onLoad={(text) => setLeft(text)} />
        <ImportFileButton accept=".csv,.tsv,.txt" label="Importar direita" onLoad={(text) => setRight(text)} />
        <button
          type="button"
          className="tools-btn tools-btn--ghost"
          onClick={() => {
            setLeft('')
            setRight('')
            setOutput('')
            setMeta(null)
            setError(null)
          }}
        >
          Limpar
        </button>
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Fazer join
        </button>
      </div>

      <div className="tool-convert__settings">
        <label className="tool-convert__setting">
          <span>Tipo</span>
          <select value={joinType} onChange={(event) => setJoinType(event.target.value as JoinType)}>
            <option value="inner">Inner</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="full">Full</option>
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Chave esquerda</span>
          <select value={leftKey} onChange={(event) => setLeftKey(event.target.value)}>
            {leftColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-convert__setting">
          <span>Chave direita</span>
          <select value={rightKey} onChange={(event) => setRightKey(event.target.value)}>
            {rightColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tool-convert__panes">
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="join-left">
            Tabela esquerda
          </label>
          <textarea id="join-left" className="tool-convert__textarea" value={left} onChange={(event) => setLeft(event.target.value)} rows={10} spellCheck={false} />
        </div>
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="join-right">
            Tabela direita
          </label>
          <textarea id="join-right" className="tool-convert__textarea" value={right} onChange={(event) => setRight(event.target.value)} rows={10} spellCheck={false} />
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

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

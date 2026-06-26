import { useCallback, useState } from 'react'
import { convertMarkdownCsv, markdownSamples, type MarkdownDirection } from '../../utils/markdownTable'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function MarkdownCsvTool() {
  const [direction, setDirection] = useState<MarkdownDirection>('markdown-to-csv')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => convertMarkdownCsv(direction, input), setOutput, setMeta, setError)
  }, [direction, input])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'markdown-to-csv', label: 'Markdown → CSV' },
        { id: 'csv-to-markdown', label: 'CSV → Markdown' },
      ]}
      activeMode={direction}
      onModeChange={(mode) => setDirection(mode as MarkdownDirection)}
      inputLabel={direction === 'markdown-to-csv' ? 'Tabela Markdown' : 'CSV'}
      outputLabel={direction === 'markdown-to-csv' ? 'CSV' : 'Tabela Markdown'}
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() =>
        setInput(direction === 'markdown-to-csv' ? markdownSamples.markdown : markdownSamples.csv)
      }
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename={direction === 'markdown-to-csv' ? 'dados.csv' : 'tabela.md'}
    />
  )
}

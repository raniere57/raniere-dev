import { useCallback, useState } from 'react'
import { csvTransposeSample, transposeCsv } from '../../utils/csvTranspose'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function CsvTransposeTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => transposeCsv(input), setOutput, setMeta, setError)
  }, [input])

  return (
    <ConvertToolLayout
      inputLabel="CSV"
      outputLabel="CSV transposto"
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(csvTransposeSample)}
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename="transposto.csv"
      importAccept=".csv,.tsv,.txt"
      onImport={(text) => setInput(text)}
    />
  )
}

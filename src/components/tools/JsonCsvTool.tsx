import { useCallback, useState } from 'react'
import { convertJsonCsv, jsonCsvSamples, type JsonCsvDirection } from '../../utils/jsonCsv'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function JsonCsvTool() {
  const [direction, setDirection] = useState<JsonCsvDirection>('json-to-csv')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => convertJsonCsv(direction, input), setOutput, setMeta, setError)
  }, [direction, input])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'json-to-csv', label: 'JSON → CSV' },
        { id: 'csv-to-json', label: 'CSV → JSON' },
      ]}
      activeMode={direction}
      onModeChange={(mode) => {
        setDirection(mode as JsonCsvDirection)
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      inputLabel={direction === 'json-to-csv' ? 'JSON' : 'CSV'}
      outputLabel={direction === 'json-to-csv' ? 'CSV' : 'JSON'}
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(direction === 'json-to-csv' ? jsonCsvSamples.json : jsonCsvSamples.csv)}
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename={direction === 'json-to-csv' ? 'dados.csv' : 'dados.json'}
    />
  )
}

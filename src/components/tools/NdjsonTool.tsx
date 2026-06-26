import { useCallback, useState } from 'react'
import { convertNdjson, ndjsonSamples, type NdjsonDirection } from '../../utils/ndjson'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function NdjsonTool() {
  const [direction, setDirection] = useState<NdjsonDirection>('ndjson-to-json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => convertNdjson(direction, input), setOutput, setMeta, setError)
  }, [direction, input])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'ndjson-to-json', label: 'NDJSON → JSON' },
        { id: 'json-to-ndjson', label: 'JSON → NDJSON' },
      ]}
      activeMode={direction}
      onModeChange={(mode) => setDirection(mode as NdjsonDirection)}
      inputLabel={direction === 'ndjson-to-json' ? 'NDJSON' : 'JSON array'}
      outputLabel={direction === 'ndjson-to-json' ? 'JSON array' : 'NDJSON'}
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() =>
        setInput(direction === 'ndjson-to-json' ? ndjsonSamples.ndjson : ndjsonSamples.json)
      }
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename={direction === 'ndjson-to-json' ? 'dados.json' : 'dados.ndjson'}
    />
  )
}

import { useCallback, useState } from 'react'
import { flattenJson, flattenSample, type FlattenDirection } from '../../utils/jsonFlatten'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function JsonFlattenTool() {
  const [direction, setDirection] = useState<FlattenDirection>('flatten')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => flattenJson(input, direction), setOutput, setMeta, setError)
  }, [direction, input])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'flatten', label: 'Achatar' },
        { id: 'unflatten', label: 'Expandir' },
      ]}
      activeMode={direction}
      onModeChange={(mode) => setDirection(mode as FlattenDirection)}
      inputLabel="JSON"
      outputLabel={direction === 'flatten' ? 'JSON achatado' : 'JSON expandido'}
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(flattenSample)}
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename="dados.json"
    />
  )
}

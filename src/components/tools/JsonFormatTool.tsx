import { useCallback, useState } from 'react'
import { formatJson, jsonFormatSample, type JsonFormatMode } from '../../utils/jsonFormat'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function JsonFormatTool() {
  const [mode, setMode] = useState<JsonFormatMode>('pretty')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => formatJson(input, mode), setOutput, setMeta, setError)
  }, [input, mode])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'pretty', label: 'Formatar' },
        { id: 'minify', label: 'Minificar' },
      ]}
      activeMode={mode}
      onModeChange={(next) => setMode(next as JsonFormatMode)}
      inputLabel="JSON"
      outputLabel={mode === 'pretty' ? 'JSON formatado' : 'JSON minificado'}
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(jsonFormatSample)}
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

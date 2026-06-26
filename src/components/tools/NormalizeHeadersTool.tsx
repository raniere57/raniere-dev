import { useCallback, useState } from 'react'
import { normalizeHeadersSample, normalizeTableHeaders, type HeaderCase } from '../../utils/normalizeHeaders'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function NormalizeHeadersTool() {
  const [mode, setMode] = useState<HeaderCase>('snake')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => normalizeTableHeaders(input, mode), setOutput, setMeta, setError)
  }, [input, mode])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'snake', label: 'snake_case' },
        { id: 'camel', label: 'camelCase' },
        { id: 'kebab', label: 'kebab-case' },
        { id: 'upper', label: 'MAIÚSCULO' },
        { id: 'lower', label: 'minúsculo' },
      ]}
      activeMode={mode}
      onModeChange={(next) => setMode(next as HeaderCase)}
      inputLabel="CSV / JSON"
      outputLabel="Com headers normalizados"
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(normalizeHeadersSample)}
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename="headers-normalizados.csv"
      importAccept=".csv,.tsv,.json,.txt"
      onImport={(text) => setInput(text)}
    />
  )
}

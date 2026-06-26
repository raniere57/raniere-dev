import { useCallback, useState } from 'react'
import { convertJsonYaml, yamlSamples, type YamlDirection } from '../../utils/jsonYaml'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function JsonYamlTool() {
  const [direction, setDirection] = useState<YamlDirection>('json-to-yaml')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => convertJsonYaml(direction, input), setOutput, setMeta, setError)
  }, [direction, input])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'json-to-yaml', label: 'JSON → YAML' },
        { id: 'yaml-to-json', label: 'YAML → JSON' },
      ]}
      activeMode={direction}
      onModeChange={(mode) => setDirection(mode as YamlDirection)}
      inputLabel={direction === 'json-to-yaml' ? 'JSON' : 'YAML'}
      outputLabel={direction === 'json-to-yaml' ? 'YAML' : 'JSON'}
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(direction === 'json-to-yaml' ? yamlSamples.json : yamlSamples.yaml)}
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename={direction === 'json-to-yaml' ? 'dados.yaml' : 'dados.json'}
    />
  )
}

import { useCallback, useState } from 'react'
import { convertXmlJson, xmlJsonSamples, type XmlJsonDirection } from '../../utils/xmlJson'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function XmlJsonTool() {
  const [direction, setDirection] = useState<XmlJsonDirection>('xml-to-json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => convertXmlJson(input, direction), setOutput, setMeta, setError)
  }, [direction, input])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'xml-to-json', label: 'XML → JSON' },
        { id: 'json-to-xml', label: 'JSON → XML' },
      ]}
      activeMode={direction}
      onModeChange={(mode) => {
        setDirection(mode as XmlJsonDirection)
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      inputLabel={direction === 'xml-to-json' ? 'XML' : 'JSON'}
      outputLabel={direction === 'xml-to-json' ? 'JSON' : 'XML'}
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(direction === 'xml-to-json' ? xmlJsonSamples.xml : xmlJsonSamples.json)}
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename={direction === 'xml-to-json' ? 'dados.json' : 'dados.xml'}
      importAccept={direction === 'xml-to-json' ? '.xml,.txt' : '.json,.txt'}
      onImport={(text) => setInput(text)}
    />
  )
}

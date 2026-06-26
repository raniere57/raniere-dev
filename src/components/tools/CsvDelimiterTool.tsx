import { useCallback, useState } from 'react'
import { convertDelimiter, CSV_DELIMITER_LABELS, type CsvDelimiter } from '../../utils/csv'
import { DataToolError } from '../../utils/dataError'
import { jsonCsvSamples } from '../../utils/jsonCsv'
import { ConvertToolLayout } from './shared/ConvertToolLayout'

type DelimiterMode = 'comma-to-semicolon' | 'semicolon-to-comma' | 'csv-to-tsv' | 'tsv-to-csv'

const MODE_MAP: Record<DelimiterMode, { from: CsvDelimiter; to: CsvDelimiter }> = {
  'comma-to-semicolon': { from: ',', to: ';' },
  'semicolon-to-comma': { from: ';', to: ',' },
  'csv-to-tsv': { from: ',', to: '\t' },
  'tsv-to-csv': { from: '\t', to: ',' },
}

export function CsvDelimiterTool() {
  const [mode, setMode] = useState<DelimiterMode>('semicolon-to-comma')
  const [useBom, setUseBom] = useState(true)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    try {
      const { from, to } = MODE_MAP[mode]
      const result = convertDelimiter(input, to, from)
      setOutput(result.output)
      setMeta(`${result.meta}${useBom ? ' · BOM no download' : ''}`)
      setError(null)
    } catch (cause) {
      setOutput('')
      setMeta(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível converter.')
    }
  }, [input, mode, useBom])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'semicolon-to-comma', label: '; → ,' },
        { id: 'comma-to-semicolon', label: ', → ;' },
        { id: 'tsv-to-csv', label: 'TSV → CSV' },
        { id: 'csv-to-tsv', label: 'CSV → TSV' },
      ]}
      activeMode={mode}
      onModeChange={(next) => setMode(next as DelimiterMode)}
      toolbarExtra={
        <label className="tool-convert__check">
          <input type="checkbox" checked={useBom} onChange={(event) => setUseBom(event.target.checked)} />
          UTF-8 BOM no download (Excel BR)
        </label>
      }
      inputLabel="Entrada"
      outputLabel="Saída"
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(jsonCsvSamples.csv.replace(/,/g, ';'))}
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename="dados.csv"
      downloadBom={useBom}
      inputPlaceholder={`Delimitador atual: ${CSV_DELIMITER_LABELS[MODE_MAP[mode].from]}`}
    />
  )
}

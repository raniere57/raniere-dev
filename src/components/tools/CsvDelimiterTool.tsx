import { useCallback, useMemo, useState } from 'react'
import {
  convertDelimiter,
  detectDelimiter,
  formatDelimiterLabel,
  normalizeDelimiter,
} from '../../utils/csv'
import { DataToolError } from '../../utils/dataError'
import { jsonCsvSamples } from '../../utils/jsonCsv'
import { ConvertToolLayout } from './shared/ConvertToolLayout'

type SourceOption = 'auto' | ',' | ';' | '\t' | '|' | 'custom'
type TargetOption = ',' | ';' | '\t' | '|' | 'custom'

const SOURCE_OPTIONS: { id: SourceOption; label: string }[] = [
  { id: 'auto', label: 'Detectar' },
  { id: ';', label: ';' },
  { id: ',', label: ',' },
  { id: '\t', label: 'Tab' },
  { id: '|', label: '|' },
  { id: 'custom', label: 'Outro…' },
]

const TARGET_OPTIONS: { id: TargetOption; label: string }[] = [
  { id: ',', label: ',' },
  { id: ';', label: ';' },
  { id: '\t', label: 'Tab' },
  { id: '|', label: '|' },
  { id: 'custom', label: 'Outro…' },
]

const PRESETS = [
  { label: '; → ,', source: ';' as const, target: ',' as const },
  { label: ', → ;', source: ',' as const, target: ';' as const },
  { label: 'TSV → CSV', source: '\t' as const, target: ',' as const },
  { label: '| → ,', source: '|' as const, target: ',' as const },
  { label: 'Auto → ;', source: 'auto' as const, target: ';' as const },
]

function resolveSource(option: SourceOption, custom: string): string | 'auto' {
  if (option === 'auto') return 'auto'
  if (option === 'custom') return normalizeDelimiter(custom)
  return option
}

function resolveTarget(option: TargetOption, custom: string): string {
  if (option === 'custom') return normalizeDelimiter(custom)
  return option
}

export function CsvDelimiterTool() {
  const [sourceOption, setSourceOption] = useState<SourceOption>('auto')
  const [targetOption, setTargetOption] = useState<TargetOption>(',')
  const [sourceCustom, setSourceCustom] = useState('|')
  const [targetCustom, setTargetCustom] = useState('|')
  const [useBom, setUseBom] = useState(true)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sourceHint = useMemo(() => {
    if (!input.trim()) return 'Cole ou importe um arquivo delimitado.'
    if (sourceOption === 'auto') {
      return `Detectado: ${formatDelimiterLabel(detectDelimiter(input))}`
    }
    return `Entrada: ${formatDelimiterLabel(resolveSource(sourceOption, sourceCustom))}`
  }, [input, sourceCustom, sourceOption])

  const run = useCallback(() => {
    try {
      const source = resolveSource(sourceOption, sourceCustom)
      const target = resolveTarget(targetOption, targetCustom)
      const result = convertDelimiter(input, target, source)
      setOutput(result.output)
      setMeta(result.meta)
      setError(null)
    } catch (cause) {
      setOutput('')
      setMeta(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível converter.')
    }
  }, [input, sourceCustom, sourceOption, targetCustom, targetOption])

  function applyPreset(source: SourceOption | ';' | ',' | '\t' | '|', target: TargetOption | ',' | ';' | '\t' | '|') {
    if (source === 'auto') {
      setSourceOption('auto')
    } else if (source === '|') {
      setSourceOption('custom')
      setSourceCustom('|')
    } else {
      setSourceOption(source)
    }

    if (target === '|') {
      setTargetOption('custom')
      setTargetCustom('|')
    } else {
      setTargetOption(target)
    }
  }

  return (
    <ConvertToolLayout
      settings={
        <>
          <div className="tool-convert__presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="tools-btn tools-btn--ghost tool-convert__preset"
                onClick={() => applyPreset(preset.source, preset.target)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="tool-convert__settings-grid">
            <label className="tool-convert__field">
              Delimitador de entrada
              <select
                value={sourceOption}
                onChange={(event) => setSourceOption(event.target.value as SourceOption)}
              >
                {SOURCE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {sourceOption === 'custom' && (
              <label className="tool-convert__field">
                Caractere de entrada
                <input
                  type="text"
                  maxLength={1}
                  value={sourceCustom}
                  onChange={(event) => setSourceCustom(event.target.value)}
                  placeholder="|"
                />
              </label>
            )}

            <label className="tool-convert__field">
              Delimitador de saída
              <select
                value={targetOption}
                onChange={(event) => setTargetOption(event.target.value as TargetOption)}
              >
                {TARGET_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {targetOption === 'custom' && (
              <label className="tool-convert__field">
                Caractere de saída
                <input
                  type="text"
                  maxLength={1}
                  value={targetCustom}
                  onChange={(event) => setTargetCustom(event.target.value)}
                  placeholder="|"
                />
              </label>
            )}
          </div>
        </>
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
      showBomToggle
      bomEnabled={useBom}
      onBomChange={setUseBom}
      importAccept=".csv,.tsv,.txt"
      inputPlaceholder={sourceHint}
    />
  )
}

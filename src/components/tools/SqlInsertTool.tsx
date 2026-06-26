import { useCallback, useState } from 'react'
import { generateSqlInsert, sqlInsertSample } from '../../utils/sqlInsert'
import { ConvertToolLayout, runDataTool } from './shared/ConvertToolLayout'

export function SqlInsertTool() {
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [tableName, setTableName] = useState('minha_tabela')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(() => {
    runDataTool(() => generateSqlInsert(input, tableName, format), setOutput, setMeta, setError)
  }, [format, input, tableName])

  return (
    <ConvertToolLayout
      modes={[
        { id: 'csv', label: 'De CSV' },
        { id: 'json', label: 'De JSON' },
      ]}
      activeMode={format}
      onModeChange={(mode) => setFormat(mode as 'csv' | 'json')}
      toolbarExtra={
        <label className="tool-convert__inline-field">
          Tabela
          <input
            type="text"
            value={tableName}
            onChange={(event) => setTableName(event.target.value)}
            placeholder="nome_da_tabela"
          />
        </label>
      }
      inputLabel={format === 'csv' ? 'CSV' : 'JSON array'}
      outputLabel="SQL INSERT"
      input={input}
      onInputChange={setInput}
      output={output}
      meta={meta}
      error={error}
      onRun={run}
      onSample={() => setInput(sqlInsertSample)}
      onClear={() => {
        setInput('')
        setOutput('')
        setMeta(null)
        setError(null)
      }}
      downloadFilename="inserts.sql"
    />
  )
}

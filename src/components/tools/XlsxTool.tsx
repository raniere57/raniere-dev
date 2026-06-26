import { useCallback, useRef, useState } from 'react'
import { DataToolError } from '../../utils/dataError'
import { downloadBlob } from '../../utils/toolIO'
import {
  convertXlsxSheet,
  listXlsxSheets,
  textToXlsx,
  type XlsxSheetInfo,
} from '../../utils/xlsxConvert'
import { jsonCsvSamples } from '../../utils/jsonCsv'
import { useCopyFeedback } from './shared/ConvertToolLayout'

type XlsxMode = 'xlsx-to-csv' | 'xlsx-to-json' | 'csv-to-xlsx' | 'json-to-xlsx'

export function XlsxTool() {
  const [mode, setMode] = useState<XlsxMode>('xlsx-to-csv')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meta, setMeta] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null)
  const [sheets, setSheets] = useState<XlsxSheetInfo[]>([])
  const [sheetName, setSheetName] = useState('')
  const xlsxBufferRef = useRef<ArrayBuffer | null>(null)
  const { copy, copyLabel } = useCopyFeedback()

  const isImport = mode === 'xlsx-to-csv' || mode === 'xlsx-to-json'

  const handleFile = useCallback(async (file: File) => {
    const buffer = await file.arrayBuffer()
    const info = listXlsxSheets(buffer)
    setFileData(buffer)
    setFileName(file.name)
    setSheets(info)
    setSheetName(info[0]?.name ?? '')
    setError(null)
  }, [])

  const run = useCallback(() => {
    try {
      if (isImport) {
        if (!fileData || !sheetName) throw new DataToolError('Selecione um arquivo .xlsx e uma aba.')
        const direction = mode === 'xlsx-to-csv' ? 'xlsx-to-csv' : 'xlsx-to-json'
        const result = convertXlsxSheet(fileData, sheetName, direction)
        setOutput(result.output)
        setMeta(result.meta ?? null)
        setError(null)
        return
      }

      const buffer = textToXlsx(input, mode)
      xlsxBufferRef.current = buffer
      setOutput('')
      setMeta(`${mode === 'csv-to-xlsx' ? 'CSV' : 'JSON'} convertido · pronto para download`)
      setError(null)
    } catch (cause) {
      setOutput('')
      setMeta(null)
      setError(cause instanceof DataToolError ? cause.message : 'Não foi possível converter.')
    }
  }, [fileData, input, isImport, mode, sheetName])

  function downloadXlsx() {
    const buffer = xlsxBufferRef.current
    if (!buffer) return
    downloadBlob('dados.xlsx', new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }))
  }

  return (
    <div className="tool-convert">
      <div className="tool-convert__modes" role="tablist">
        {(
          [
            ['xlsx-to-csv', 'XLSX → CSV'],
            ['xlsx-to-json', 'XLSX → JSON'],
            ['csv-to-xlsx', 'CSV → XLSX'],
            ['json-to-xlsx', 'JSON → XLSX'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={`tool-convert__mode${mode === id ? ' is-active' : ''}`}
            onClick={() => {
              setMode(id)
              setOutput('')
              setMeta(null)
              setError(null)
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tool-convert__toolbar">
        {!isImport && (
          <button
            type="button"
            className="tools-btn tools-btn--ghost"
            onClick={() => setInput(mode === 'csv-to-xlsx' ? jsonCsvSamples.csv : jsonCsvSamples.json)}
          >
            Carregar exemplo
          </button>
        )}
        <button type="button" className="tools-btn tools-btn--primary" onClick={run}>
          Converter
        </button>
      </div>

      {isImport ? (
        <div className="tool-xlsx__import">
          <label className="tool-xlsx__upload">
            <span>Arquivo .xlsx</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void handleFile(file)
              }}
            />
          </label>
          {fileName && <p className="tool-convert__meta">{fileName}</p>}
          {sheets.length > 0 && (
            <label className="tool-convert__inline-field">
              Aba
              <select value={sheetName} onChange={(event) => setSheetName(event.target.value)}>
                {sheets.map((sheet) => (
                  <option key={sheet.name} value={sheet.name}>
                    {sheet.name} ({sheet.rows} linhas)
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      ) : (
        <div className="tool-convert__pane">
          <label className="tool-convert__label" htmlFor="xlsx-text-input">
            {mode === 'csv-to-xlsx' ? 'CSV' : 'JSON'}
          </label>
          <textarea
            id="xlsx-text-input"
            className="tool-convert__textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={12}
            spellCheck={false}
          />
        </div>
      )}

      {(output || meta) && (
        <div className="tool-convert__pane">
          <div className="tool-convert__pane-head">
            <span className="tool-convert__label">{isImport ? 'Saída' : 'Download'}</span>
            {meta && <span className="tool-convert__meta">{meta}</span>}
          </div>
          {isImport ? (
            <textarea className="tool-convert__textarea tool-convert__textarea--output" value={output} readOnly rows={12} />
          ) : (
            <button type="button" className="tools-btn tools-btn--primary" onClick={downloadXlsx}>
              Baixar dados.xlsx
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="tool-convert__error" role="alert">
          {error}
        </p>
      )}

      {isImport && output && (
        <div className="tool-convert__footer">
          <div className="tool-convert__footer-actions">
            <button type="button" className="tools-btn tools-btn--ghost" onClick={() => copy(output)}>
              {copyLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

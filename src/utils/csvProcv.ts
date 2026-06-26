import { detectDelimiter, serializeDelimited } from './csv'
import { DataToolError, type DataToolResult } from './dataError'
import { parseInputTable } from './inputTable'

export function procvCsv(
  mainInput: string,
  lookupInput: string,
  mainKey: string,
  lookupKey: string,
  returnColumn: string,
  outputColumn: string,
  notFoundValue: string,
): DataToolResult {
  const main = parseInputTable(mainInput, 'auto')
  const lookup = parseInputTable(lookupInput, 'auto')

  if (!mainKey) throw new DataToolError('Informe a coluna-chave da tabela principal.')
  if (!lookupKey) throw new DataToolError('Informe a coluna-chave da tabela de consulta.')
  if (!returnColumn) throw new DataToolError('Informe a coluna a retornar.')

  const mainKeyIndex = main.headers.indexOf(mainKey)
  const lookupKeyIndex = lookup.headers.indexOf(lookupKey)
  const returnIndex = lookup.headers.indexOf(returnColumn)

  if (mainKeyIndex === -1) throw new DataToolError(`Coluna "${mainKey}" não existe na tabela principal.`)
  if (lookupKeyIndex === -1) throw new DataToolError(`Coluna "${lookupKey}" não existe na tabela de consulta.`)
  if (returnIndex === -1) throw new DataToolError(`Coluna "${returnColumn}" não existe na tabela de consulta.`)

  const resultHeader = outputColumn.trim() || returnColumn
  if (main.headers.includes(resultHeader)) {
    throw new DataToolError(`A coluna de saída "${resultHeader}" já existe na tabela principal.`)
  }

  const lookupMap = new Map<string, string>()
  for (const row of lookup.rows) {
    const key = row[lookupKeyIndex] ?? ''
    if (!lookupMap.has(key)) {
      lookupMap.set(key, row[returnIndex] ?? '')
    }
  }

  let found = 0
  let missing = 0

  const outputRows = main.rows.map((row) => {
    const key = row[mainKeyIndex] ?? ''
    const match = lookupMap.get(key)
    if (match === undefined) {
      missing += 1
      return [...row, notFoundValue]
    }
    found += 1
    return [...row, match]
  })

  const delimiter = detectDelimiter(mainInput.trim())
  const output = serializeDelimited([[...main.headers, resultHeader], ...outputRows], delimiter)

  return {
    output,
    meta: `${found} encontrada${found === 1 ? '' : 's'} · ${missing} não encontrada${missing === 1 ? '' : 's'}`,
  }
}

export const csvProcvSamples = {
  main: `id,produto
101,Notebook
102,Mouse
999,Teclado`,
  lookup: `id,preco,estoque
101,4500,12
102,89,150
101,4500,12`,
}

import { DataToolError, type DataToolResult } from './dataError'

export type ReplaceMode = 'literal' | 'regex'

export function findAndReplace(
  input: string,
  search: string,
  replacement: string,
  mode: ReplaceMode,
): DataToolResult {
  if (!input) throw new DataToolError('Cole texto para buscar e substituir.')
  if (!search) throw new DataToolError('Informe o termo de busca.')

  let output = input
  let count = 0

  if (mode === 'literal') {
    let index = input.indexOf(search)
    if (index === -1) {
      return { output: input, meta: '0 substituições' }
    }

    const parts: string[] = []
    let cursor = 0
    while (index !== -1) {
      count += 1
      parts.push(input.slice(cursor, index), replacement)
      cursor = index + search.length
      index = input.indexOf(search, cursor)
    }
    parts.push(input.slice(cursor))
    output = parts.join('')
  } else {
    let regex: RegExp
    try {
      regex = new RegExp(search, 'g')
    } catch {
      throw new DataToolError('Expressão regular inválida.')
    }

    output = input.replace(regex, (match) => {
      count += 1
      return replacement.replace(/\$&/g, match)
    })
  }

  return {
    output,
    meta: `${count} substituição${count === 1 ? '' : 'ões'}`,
  }
}

export const findReplaceSample = {
  input: 'id,nome\n1,Ana\n2,Lucas',
  search: 'Lucas',
  replacement: 'Maria',
}

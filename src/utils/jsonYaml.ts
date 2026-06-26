import { dump, load } from 'js-yaml'
import { DataToolError, type DataToolResult } from './dataError'

export type YamlDirection = 'json-to-yaml' | 'yaml-to-json'

export function convertJsonYaml(direction: YamlDirection, input: string): DataToolResult {
  const trimmed = input.trim()
  if (!trimmed) throw new DataToolError('Cole JSON ou YAML para converter.')

  try {
    if (direction === 'json-to-yaml') {
      const parsed = JSON.parse(trimmed)
      const output = dump(parsed, { lineWidth: 120, noRefs: true })
      return { output: output.trimEnd(), meta: 'JSON → YAML' }
    }

    const parsed = load(trimmed)
    return {
      output: JSON.stringify(parsed, null, 2),
      meta: 'YAML → JSON',
    }
  } catch (error) {
    throw new DataToolError(
      direction === 'json-to-yaml'
        ? 'JSON inválido.'
        : `YAML inválido: ${error instanceof Error ? error.message : 'erro de parse'}`,
    )
  }
}

export const yamlSamples = {
  json: '{"nome":"Ana","cargo":"Analista","ativo":true}',
  yaml: 'nome: Ana\ncargo: Analista\nativo: true',
}

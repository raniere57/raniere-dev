import Ajv, { type ErrorObject } from 'ajv'
import { DataToolError, type DataToolResult } from './dataError'

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors?.length) return 'JSON inválido em relação ao schema.'

  return errors
    .map((error) => {
      const path = error.instancePath || '(raiz)'
      const message = error.message ?? 'erro de validação'
      return `${path}: ${message}`
    })
    .join('\n')
}

export function validateJsonSchema(jsonInput: string, schemaInput: string): DataToolResult {
  const jsonTrimmed = jsonInput.trim()
  const schemaTrimmed = schemaInput.trim()

  if (!jsonTrimmed) throw new DataToolError('Cole o JSON para validar.')
  if (!schemaTrimmed) throw new DataToolError('Cole o JSON Schema.')

  let data: unknown
  let schema: unknown

  try {
    data = JSON.parse(jsonTrimmed)
  } catch {
    throw new DataToolError('JSON de entrada inválido.')
  }

  try {
    schema = JSON.parse(schemaTrimmed)
  } catch {
    throw new DataToolError('JSON Schema inválido.')
  }

  const ajv = new Ajv({ allErrors: true, strict: false })
  let validate: ReturnType<Ajv['compile']>
  try {
    validate = ajv.compile(schema as Record<string, unknown>)
  } catch {
    throw new DataToolError('JSON Schema inválido ou não suportado.')
  }

  if (validate(data)) {
    return {
      output: '✓ JSON válido conforme o schema.',
      meta: '0 erros',
    }
  }

  const details = formatAjvErrors(validate.errors)
  return {
    output: `✗ JSON inválido:\n\n${details}`,
    meta: `${validate.errors?.length ?? 0} erro${validate.errors?.length === 1 ? '' : 's'}`,
  }
}

export const jsonSchemaSamples = {
  json: `{
  "nome": "Ana",
  "idade": 28,
  "ativo": true
}`,
  schema: `{
  "type": "object",
  "required": ["nome", "idade"],
  "properties": {
    "nome": { "type": "string", "minLength": 1 },
    "idade": { "type": "integer", "minimum": 0 },
    "ativo": { "type": "boolean" }
  },
  "additionalProperties": false
}`,
}

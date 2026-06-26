import type { ComponentType } from 'react'
import { lazyWithRetry } from '../../utils/lazyWithRetry'
import { CsvColumnsTool } from './CsvColumnsTool'
import { CsvDelimiterTool } from './CsvDelimiterTool'
import { DiffTool } from './DiffTool'
import { JsonCsvTool } from './JsonCsvTool'
import { JsonFlattenTool } from './JsonFlattenTool'
import { JsonFormatTool } from './JsonFormatTool'
import { MarkdownCsvTool } from './MarkdownCsvTool'
import { NdjsonTool } from './NdjsonTool'
import { SqlInsertTool } from './SqlInsertTool'
import { TablePreviewTool } from './TablePreviewTool'

/** Ferramentas leves — importadas no bundle principal (evita 404 de chunk após deploy). */
export const EAGER_TOOLS: Record<string, ComponentType> = {
  'json-csv': JsonCsvTool,
  'json-format': JsonFormatTool,
  'table-preview': TablePreviewTool,
  'csv-delimiter': CsvDelimiterTool,
  'ndjson-json': NdjsonTool,
  'json-flatten': JsonFlattenTool,
  'sql-insert': SqlInsertTool,
  'markdown-csv': MarkdownCsvTool,
  'csv-columns': CsvColumnsTool,
  'json-diff': DiffTool,
}

/** Ferramentas pesadas — lazy load com retry automático se o chunk estiver desatualizado. */
export const LAZY_TOOLS = {
  'json-yaml': lazyWithRetry(() =>
    import('./JsonYamlTool').then((module) => ({ default: module.JsonYamlTool })),
  ),
  'xlsx-convert': lazyWithRetry(() =>
    import('./XlsxTool').then((module) => ({ default: module.XlsxTool })),
  ),
} as const

export function isImplementedTool(toolId: string): boolean {
  return toolId in EAGER_TOOLS || toolId in LAZY_TOOLS
}

export function getEagerTool(toolId: string): ComponentType | undefined {
  return EAGER_TOOLS[toolId]
}

export function getLazyTool(toolId: string) {
  return LAZY_TOOLS[toolId as keyof typeof LAZY_TOOLS]
}

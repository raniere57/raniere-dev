import type { ComponentType } from 'react'
import { CsvColumnsTool } from './CsvColumnsTool'
import { CsvDelimiterTool } from './CsvDelimiterTool'
import { DiffTool } from './DiffTool'
import { JsonCsvTool } from './JsonCsvTool'
import { JsonFlattenTool } from './JsonFlattenTool'
import { JsonFormatTool } from './JsonFormatTool'
import { JsonYamlTool } from './JsonYamlTool'
import { MarkdownCsvTool } from './MarkdownCsvTool'
import { NdjsonTool } from './NdjsonTool'
import { SqlInsertTool } from './SqlInsertTool'
import { TablePreviewTool } from './TablePreviewTool'
import { XlsxTool } from './XlsxTool'

/** Todas as ferramentas no bundle principal — evita 404 de chunks após deploy. */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
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
  'json-yaml': JsonYamlTool,
  'xlsx-convert': XlsxTool,
}

export function isImplementedTool(toolId: string): boolean {
  return toolId in TOOL_COMPONENTS
}

export function getToolComponent(toolId: string): ComponentType | undefined {
  return TOOL_COMPONENTS[toolId]
}

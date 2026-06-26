import type { ComponentType } from 'react'
import { Base64Tool } from './Base64Tool'
import { CsvColumnsTool } from './CsvColumnsTool'
import { CsvDedupeTool } from './CsvDedupeTool'
import { CsvDelimiterTool } from './CsvDelimiterTool'
import { CsvJoinTool } from './CsvJoinTool'
import { CsvProcvTool } from './CsvProcvTool'
import { CsvSplitTool } from './CsvSplitTool'
import { CsvTransposeTool } from './CsvTransposeTool'
import { DataProfileTool } from './DataProfileTool'
import { DiffTool } from './DiffTool'
import { FakeDataTool } from './FakeDataTool'
import { FindReplaceTool } from './FindReplaceTool'
import { JsonCsvTool } from './JsonCsvTool'
import { JsonFlattenTool } from './JsonFlattenTool'
import { JsonFormatTool } from './JsonFormatTool'
import { JsonPathTool } from './JsonPathTool'
import { JsonYamlTool } from './JsonYamlTool'
import { MarkdownCsvTool } from './MarkdownCsvTool'
import { NdjsonTool } from './NdjsonTool'
import { NormalizeHeadersTool } from './NormalizeHeadersTool'
import { SqlInsertTool } from './SqlInsertTool'
import { TablePreviewTool } from './TablePreviewTool'
import { XmlJsonTool } from './XmlJsonTool'
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
  'data-profile': DataProfileTool,
  'csv-dedupe': CsvDedupeTool,
  'csv-join': CsvJoinTool,
  'csv-procv': CsvProcvTool,
  'json-path': JsonPathTool,
  'fake-data': FakeDataTool,
  'base64': Base64Tool,
  'normalize-headers': NormalizeHeadersTool,
  'csv-transpose': CsvTransposeTool,
  'find-replace': FindReplaceTool,
  'xml-json': XmlJsonTool,
  'csv-split': CsvSplitTool,
}

export function isImplementedTool(toolId: string): boolean {
  return toolId in TOOL_COMPONENTS
}

export function getToolComponent(toolId: string): ComponentType | undefined {
  return TOOL_COMPONENTS[toolId]
}

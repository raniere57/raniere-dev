import type { ComponentType } from 'react'
import { Base64Tool } from './Base64Tool'
import { CpfCnpjTool } from './CpfCnpjTool'
import { CsvColumnsTool } from './CsvColumnsTool'
import { CsvDedupeTool } from './CsvDedupeTool'
import { CsvDelimiterTool } from './CsvDelimiterTool'
import { CsvFilterTool } from './CsvFilterTool'
import { CsvGroupTool } from './CsvGroupTool'
import { CsvJoinTool } from './CsvJoinTool'
import { CsvProcvTool } from './CsvProcvTool'
import { CsvSortTool } from './CsvSortTool'
import { CsvSplitColumnTool } from './CsvSplitColumnTool'
import { CsvSplitTool } from './CsvSplitTool'
import { CsvStackTool } from './CsvStackTool'
import { CsvTransposeTool } from './CsvTransposeTool'
import { DataProfileTool } from './DataProfileTool'
import { DiffTool } from './DiffTool'
import { FakeDataTool } from './FakeDataTool'
import { FindReplaceTool } from './FindReplaceTool'
import { ForecastTool } from './ForecastTool'
import { JsonCsvTool } from './JsonCsvTool'
import { JsonFlattenTool } from './JsonFlattenTool'
import { JsonFormatTool } from './JsonFormatTool'
import { JsonPathTool } from './JsonPathTool'
import { JsonSchemaTool } from './JsonSchemaTool'
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
  'csv-filter': CsvFilterTool,
  'csv-sort': CsvSortTool,
  'csv-group': CsvGroupTool,
  'csv-stack': CsvStackTool,
  'csv-split-column': CsvSplitColumnTool,
  'json-schema': JsonSchemaTool,
  'series-forecast': ForecastTool,
  'cpf-cnpj': CpfCnpjTool,
}

export function isImplementedTool(toolId: string): boolean {
  return toolId in TOOL_COMPONENTS
}

export function getToolComponent(toolId: string): ComponentType | undefined {
  return TOOL_COMPONENTS[toolId]
}

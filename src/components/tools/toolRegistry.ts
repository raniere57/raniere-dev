import type { ComponentType } from 'react'

type ToolModule = { default: ComponentType }

export const TOOL_LOADERS: Record<string, () => Promise<ToolModule>> = {
  'json-csv': () => import('./JsonCsvTool').then((module) => ({ default: module.JsonCsvTool })),
  'json-format': () => import('./JsonFormatTool').then((module) => ({ default: module.JsonFormatTool })),
  'table-preview': () =>
    import('./TablePreviewTool').then((module) => ({ default: module.TablePreviewTool })),
  'csv-delimiter': () =>
    import('./CsvDelimiterTool').then((module) => ({ default: module.CsvDelimiterTool })),
  'ndjson-json': () => import('./NdjsonTool').then((module) => ({ default: module.NdjsonTool })),
  'xlsx-convert': () => import('./XlsxTool').then((module) => ({ default: module.XlsxTool })),
  'json-yaml': () => import('./JsonYamlTool').then((module) => ({ default: module.JsonYamlTool })),
  'json-flatten': () =>
    import('./JsonFlattenTool').then((module) => ({ default: module.JsonFlattenTool })),
  'sql-insert': () => import('./SqlInsertTool').then((module) => ({ default: module.SqlInsertTool })),
  'markdown-csv': () =>
    import('./MarkdownCsvTool').then((module) => ({ default: module.MarkdownCsvTool })),
  'csv-columns': () =>
    import('./CsvColumnsTool').then((module) => ({ default: module.CsvColumnsTool })),
  'json-diff': () => import('./DiffTool').then((module) => ({ default: module.DiffTool })),
}

export function isImplementedTool(toolId: string): boolean {
  return toolId in TOOL_LOADERS
}

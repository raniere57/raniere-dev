export type ToolCategoryId = 'dados' | 'validadores' | 'texto' | 'tempo'

export type ToolStatus = 'available' | 'soon'

export interface ToolCategory {
  id: ToolCategoryId
  label: string
  description: string
}

export interface ToolDefinition {
  id: string
  category: ToolCategoryId
  name: string
  description: string
  keywords: string[]
  status: ToolStatus
  /** Glifo curto exibido na sidebar e no painel. */
  mark: string
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'dados',
    label: 'Dados & arquivos',
    description: 'Converter, comparar e inspecionar estruturas de dados.',
  },
  {
    id: 'validadores',
    label: 'Validadores',
    description: 'Documentos, identificadores e formatos comuns no Brasil.',
  },
  {
    id: 'texto',
    label: 'Texto & padrões',
    description: 'Regex, diff e manipulação de strings.',
  },
  {
    id: 'tempo',
    label: 'Tempo & agendamento',
    description: 'Cron, fusos e próximas execuções.',
  },
]

export const tools: ToolDefinition[] = [
  {
    id: 'json-csv',
    category: 'dados',
    name: 'JSON ↔ CSV',
    description: 'Converta arrays JSON em planilha CSV e vice-versa, com download do resultado.',
    keywords: ['json', 'csv', 'planilha', 'exportar', 'importar', 'tabela'],
    status: 'available',
    mark: '{ }',
  },
  {
    id: 'json-format',
    category: 'dados',
    name: 'Formatar JSON',
    description: 'Embeleze ou minifique JSON e veja onde está o erro de sintaxe.',
    keywords: ['json', 'formatar', 'minificar', 'validar', 'pretty'],
    status: 'available',
    mark: '⌗',
  },
  {
    id: 'table-preview',
    category: 'dados',
    name: 'Preview em tabela',
    description: 'Cole JSON ou CSV e visualize os dados em formato de planilha.',
    keywords: ['tabela', 'preview', 'csv', 'json', 'grid'],
    status: 'available',
    mark: '▦',
  },
  {
    id: 'csv-delimiter',
    category: 'dados',
    name: 'Delimitador CSV / TSV',
    description: 'Converta entre vírgula, ponto e vírgula, tab, pipe ou caractere custom. Download com BOM para Excel BR.',
    keywords: ['csv', 'tsv', 'delimitador', 'bom', 'excel', 'ponto e vírgula'],
    status: 'available',
    mark: ';;',
  },
  {
    id: 'ndjson-json',
    category: 'dados',
    name: 'NDJSON ↔ JSON',
    description: 'Converta JSON Lines (uma linha por objeto) em array JSON e vice-versa.',
    keywords: ['ndjson', 'jsonl', 'json lines', 'streaming', 'logs'],
    status: 'available',
    mark: '≡',
  },
  {
    id: 'xlsx-convert',
    category: 'dados',
    name: 'XLSX ↔ CSV / JSON',
    description: 'Importe planilhas Excel ou exporte CSV/JSON para .xlsx, com seleção de aba.',
    keywords: ['xlsx', 'excel', 'planilha', 'csv', 'json'],
    status: 'available',
    mark: 'X',
  },
  {
    id: 'json-yaml',
    category: 'dados',
    name: 'JSON ↔ YAML',
    description: 'Converta configs e payloads entre JSON e YAML.',
    keywords: ['yaml', 'json', 'config', 'kubernetes'],
    status: 'available',
    mark: 'Y',
  },
  {
    id: 'json-flatten',
    category: 'dados',
    name: 'Achatar / expandir JSON',
    description: 'Transforme objetos aninhados em chaves planas com ponto e reverta.',
    keywords: ['flatten', 'json', 'aninhado', 'dot notation'],
    status: 'available',
    mark: '↕',
  },
  {
    id: 'sql-insert',
    category: 'dados',
    name: 'Gerar SQL INSERT',
    description: 'Gere INSERTs a partir de CSV ou JSON array com nome de tabela.',
    keywords: ['sql', 'insert', 'csv', 'json', 'banco'],
    status: 'available',
    mark: 'SQL',
  },
  {
    id: 'markdown-csv',
    category: 'dados',
    name: 'Markdown ↔ CSV',
    description: 'Converta tabelas Markdown em CSV e vice-versa.',
    keywords: ['markdown', 'csv', 'tabela', 'github'],
    status: 'available',
    mark: 'MD',
  },
  {
    id: 'csv-columns',
    category: 'dados',
    name: 'Reordenar colunas CSV',
    description: 'Escolha quais colunas manter e defina a ordem de saída.',
    keywords: ['csv', 'colunas', 'reordenar', 'ordenar', 'filtrar'],
    status: 'available',
    mark: '☰',
  },
  {
    id: 'json-diff',
    category: 'dados',
    name: 'Diff JSON / texto',
    description: 'Compare dois blocos e veja linhas adicionadas, removidas e alteradas.',
    keywords: ['diff', 'comparar', 'json', 'texto'],
    status: 'available',
    mark: '±',
  },
  {
    id: 'cpf-cnpj',
    category: 'validadores',
    name: 'Validador CPF / CNPJ',
    description: 'Valida dígitos verificadores e formata documentos brasileiros.',
    keywords: ['cpf', 'cnpj', 'documento', 'brasil'],
    status: 'soon',
    mark: '✓',
  },
  {
    id: 'regex',
    category: 'texto',
    name: 'Testador de regex',
    description: 'Teste expressões regulares com destaque de matches em tempo real.',
    keywords: ['regex', 'regexp', 'pattern', 'expressão'],
    status: 'soon',
    mark: '.*',
  },
  {
    id: 'cron',
    category: 'tempo',
    name: 'Próximas execuções cron',
    description: 'Interpreta expressões cron e lista as próximas datas de execução.',
    keywords: ['cron', 'agendamento', 'scheduler', 'crontab'],
    status: 'soon',
    mark: '⏱',
  },
]

export const toolCategoryShortLabels: Record<ToolCategoryId, string> = {
  dados: 'Dados',
  validadores: 'Validadores',
  texto: 'Texto',
  tempo: 'Tempo',
}

export function getToolCategory(id: ToolCategoryId): ToolCategory | undefined {
  return toolCategories.find((category) => category.id === id)
}

export function getToolCategoryShortLabel(id: ToolCategoryId): string {
  return toolCategoryShortLabels[id]
}

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.id === id)
}

export const defaultToolId = 'json-csv'

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
  },
  {
    id: 'cpf-cnpj',
    category: 'validadores',
    name: 'Validador CPF / CNPJ',
    description: 'Valida dígitos verificadores e formata documentos brasileiros.',
    keywords: ['cpf', 'cnpj', 'documento', 'brasil'],
    status: 'soon',
  },
  {
    id: 'regex',
    category: 'texto',
    name: 'Testador de regex',
    description: 'Teste expressões regulares com destaque de matches em tempo real.',
    keywords: ['regex', 'regexp', 'pattern', 'expressão'],
    status: 'soon',
  },
  {
    id: 'cron',
    category: 'tempo',
    name: 'Próximas execuções cron',
    description: 'Interpreta expressões cron e lista as próximas datas de execução.',
    keywords: ['cron', 'agendamento', 'scheduler', 'crontab'],
    status: 'soon',
  },
  {
    id: 'diff',
    category: 'texto',
    name: 'Diff JSON / texto',
    description: 'Compare dois blocos e veja linhas adicionadas, removidas e alteradas.',
    keywords: ['diff', 'comparar', 'json', 'texto'],
    status: 'soon',
  },
]

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.id === id)
}

export const defaultToolId = 'json-csv'

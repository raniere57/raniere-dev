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
    category: 'texto',
    name: 'Diff JSON / texto',
    description: 'Compare dois blocos e veja linhas adicionadas, removidas e alteradas.',
    keywords: ['diff', 'comparar', 'json', 'texto'],
    status: 'available',
    mark: '±',
  },
  {
    id: 'data-profile',
    category: 'dados',
    name: 'Perfil de dados',
    description: 'Tipos inferidos, nulos, valores únicos e amostras por coluna.',
    keywords: ['profile', 'schema', 'tipos', 'nulos', 'csv', 'json'],
    status: 'available',
    mark: '◉',
  },
  {
    id: 'csv-dedupe',
    category: 'dados',
    name: 'Remover duplicatas',
    description: 'Elimine linhas repetidas por coluna-chave em CSV ou JSON.',
    keywords: ['dedupe', 'duplicata', 'csv', 'json', 'unique'],
    status: 'available',
    mark: '≠',
  },
  {
    id: 'csv-join',
    category: 'dados',
    name: 'Join de CSVs',
    description: 'Una duas tabelas por coluna-chave (inner, left, right, full).',
    keywords: ['join', 'merge', 'csv', 'inner', 'left'],
    status: 'available',
    mark: '⋈',
  },
  {
    id: 'csv-procv',
    category: 'dados',
    name: 'PROCV / VLOOKUP',
    description: 'Busque valores em outra tabela e adicione uma coluna na planilha principal.',
    keywords: ['procv', 'vlookup', 'lookup', 'csv', 'excel', 'buscar'],
    status: 'available',
    mark: '⇲',
  },
  {
    id: 'json-path',
    category: 'dados',
    name: 'JSONPath',
    description: 'Extraia campos ou clique no JSON para descobrir o JSONPath automaticamente.',
    keywords: ['jsonpath', 'json', 'query', 'extrair'],
    status: 'available',
    mark: '→',
  },
  {
    id: 'fake-data',
    category: 'dados',
    name: 'Gerador de dados fake',
    description: 'Crie linhas de teste com nome, e-mail, CPF fictício, cidade e datas.',
    keywords: ['fake', 'mock', 'dados', 'teste', 'csv', 'json'],
    status: 'available',
    mark: '⚄',
  },
  {
    id: 'base64',
    category: 'dados',
    name: 'Base64 encode/decode',
    description: 'Codifique ou decodifique texto e arquivos em Base64.',
    keywords: ['base64', 'encode', 'decode', 'arquivo'],
    status: 'available',
    mark: '64',
  },
  {
    id: 'normalize-headers',
    category: 'dados',
    name: 'Normalizar colunas',
    description: 'Converta headers para snake_case, camelCase, kebab-case e remova acentos.',
    keywords: ['headers', 'colunas', 'snake_case', 'camelCase', 'normalizar'],
    status: 'available',
    mark: 'Aa',
  },
  {
    id: 'csv-transpose',
    category: 'dados',
    name: 'Transpor CSV',
    description: 'Inverta linhas e colunas de uma tabela CSV.',
    keywords: ['transpor', 'transpose', 'csv', 'pivot'],
    status: 'available',
    mark: '↔',
  },
  {
    id: 'find-replace',
    category: 'dados',
    name: 'Buscar e substituir',
    description: 'Substitua texto literal ou regex em CSV, JSON ou blocos de texto.',
    keywords: ['buscar', 'substituir', 'regex', 'find', 'replace'],
    status: 'available',
    mark: '↺',
  },
  {
    id: 'xml-json',
    category: 'dados',
    name: 'XML ↔ JSON',
    description: 'Converta payloads entre XML e JSON no navegador.',
    keywords: ['xml', 'json', 'converter', 'integração'],
    status: 'available',
    mark: '<>',
  },
  {
    id: 'csv-split',
    category: 'dados',
    name: 'Dividir CSV',
    description: 'Separe em partes por quantidade de linhas ou por valor de coluna.',
    keywords: ['split', 'dividir', 'csv', 'particionar'],
    status: 'available',
    mark: '⊞',
  },
  {
    id: 'csv-filter',
    category: 'dados',
    name: 'Filtrar linhas',
    description: 'Mantenha só linhas que atendem condições (igual, contém, maior que, vazio…).',
    keywords: ['filtrar', 'filter', 'csv', 'where', 'condição'],
    status: 'available',
    mark: '⛁',
  },
  {
    id: 'csv-sort',
    category: 'dados',
    name: 'Ordenar CSV',
    description: 'Ordene por uma ou mais colunas, crescente ou decrescente.',
    keywords: ['ordenar', 'sort', 'csv', 'classificar'],
    status: 'available',
    mark: '⇅',
  },
  {
    id: 'csv-group',
    category: 'dados',
    name: 'Agrupar / pivot',
    description: 'Soma, contagem, média, mínimo ou máximo por grupo — estilo SOMASE.',
    keywords: ['agrupar', 'group by', 'pivot', 'somase', 'cont.se'],
    status: 'available',
    mark: 'Σ',
  },
  {
    id: 'csv-stack',
    category: 'dados',
    name: 'Empilhar CSVs',
    description: 'Una várias tabelas verticalmente (append / union de linhas).',
    keywords: ['empilhar', 'stack', 'append', 'union', 'csv'],
    status: 'available',
    mark: '⧉',
  },
  {
    id: 'csv-split-column',
    category: 'dados',
    name: 'Separar coluna',
    description: 'Divida uma coluna em várias — texto para colunas do Excel.',
    keywords: ['separar', 'split', 'texto para colunas', 'csv'],
    status: 'available',
    mark: '⊟',
  },
  {
    id: 'json-schema',
    category: 'dados',
    name: 'Validar JSON Schema',
    description: 'Verifique se um JSON obedece a um schema com erros detalhados.',
    keywords: ['json schema', 'validar', 'schema', 'ajv'],
    status: 'available',
    mark: '✓',
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

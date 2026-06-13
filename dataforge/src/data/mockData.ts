// ============================================================
// DataForge – Mock Data
// ============================================================

export const mockSources = [
  {
    id: "src-1",
    name: "PostgreSQL ERP",
    type: "postgresql",
    status: "connected",
    lastSync: "2025-01-15 08:42",
    tables: 24,
    volume: "1.2 GB",
    responsible: "Raniere",
    host: "erp.internal.corp",
    port: 5432,
    database: "erp_prod",
    tags: ["erp", "clientes", "financeiro"],
  },
  {
    id: "src-2",
    name: "MariaDB Atendimento",
    type: "mariadb",
    status: "connected",
    lastSync: "2025-01-15 07:15",
    tables: 11,
    volume: "340 MB",
    responsible: "Raniere",
    host: "atend.internal.corp",
    port: 3306,
    database: "atendimento",
    tags: ["atendimento", "suporte"],
  },
  {
    id: "src-3",
    name: "Planilha Comercial",
    type: "xlsx",
    status: "connected",
    lastSync: "2025-01-14 17:00",
    tables: 3,
    volume: "18 MB",
    responsible: "Equipe Comercial",
    host: null,
    port: null,
    database: null,
    tags: ["metas", "comercial"],
  },
  {
    id: "src-4",
    name: "CSV Financeiro",
    type: "csv",
    status: "error",
    lastSync: "2025-01-03 09:00",
    tables: 1,
    volume: "5.2 MB",
    responsible: "Financeiro",
    host: null,
    port: null,
    database: null,
    tags: ["financeiro", "recebíveis"],
  },
  {
    id: "src-5",
    name: "API CRM",
    type: "api",
    status: "syncing",
    lastSync: "2025-01-15 09:01",
    tables: 6,
    volume: "210 MB",
    responsible: "Raniere",
    host: "https://api.crm.io/v2",
    port: null,
    database: null,
    tags: ["crm", "leads", "oportunidades"],
  },
  {
    id: "src-6",
    name: "Parquet Histórico",
    type: "parquet",
    status: "connected",
    lastSync: "2025-01-12 22:00",
    tables: 8,
    volume: "4.7 GB",
    responsible: "Raniere",
    host: null,
    port: null,
    database: null,
    tags: ["histórico", "archival"],
  },
  {
    id: "src-7",
    name: "Upload XLSX Manual",
    type: "upload",
    status: "pending",
    lastSync: "—",
    tables: 0,
    volume: "—",
    responsible: "—",
    host: null,
    port: null,
    database: null,
    tags: [],
  },
];

export const mockPipelines = [
  {
    id: "pipe-1",
    name: "Consolidado Comercial",
    status: "active",
    sources: ["PostgreSQL ERP", "Planilha Comercial", "CSV Financeiro"],
    lastRun: "2025-01-15 08:45",
    nextRun: "2025-01-16 08:00",
    avgDuration: "2m 14s",
    outputs: ["Parquet", "DuckDB"],
    rows: 142800,
    schedule: "Diário 08:00",
  },
  {
    id: "pipe-2",
    name: "Base Clientes 360",
    status: "active",
    sources: ["PostgreSQL ERP", "MariaDB Atendimento", "API CRM"],
    lastRun: "2025-01-15 07:30",
    nextRun: "2025-01-15 19:30",
    avgDuration: "4m 52s",
    outputs: ["DuckDB", "CSV"],
    rows: 87240,
    schedule: "12h/12h",
  },
  {
    id: "pipe-3",
    name: "Score de Churn",
    status: "paused",
    sources: ["PostgreSQL ERP", "MariaDB Atendimento"],
    lastRun: "2025-01-14 23:00",
    nextRun: "—",
    avgDuration: "6m 08s",
    outputs: ["Parquet"],
    rows: 34100,
    schedule: "Manual",
  },
  {
    id: "pipe-4",
    name: "Recebíveis e Inadimplência",
    status: "active",
    sources: ["CSV Financeiro", "PostgreSQL ERP"],
    lastRun: "2025-01-15 06:00",
    nextRun: "2025-01-16 06:00",
    avgDuration: "1m 47s",
    outputs: ["XLSX", "CSV"],
    rows: 22400,
    schedule: "Diário 06:00",
  },
  {
    id: "pipe-5",
    name: "Performance Atendimento",
    status: "error",
    sources: ["MariaDB Atendimento", "API CRM"],
    lastRun: "2025-01-15 05:00",
    nextRun: "—",
    avgDuration: "—",
    outputs: ["CSV"],
    rows: 0,
    schedule: "Diário 05:00",
  },
];

export const mockJobs = [
  {
    id: "job-1",
    name: "Consolidado Comercial #88",
    pipeline: "Consolidado Comercial",
    status: "success",
    startedAt: "2025-01-15 08:45",
    duration: "2m 14s",
    rows: 142800,
    memory: "420 MB",
    user: "Raniere",
    nextRun: "2025-01-16 08:00",
  },
  {
    id: "job-2",
    name: "Base Clientes 360 #44",
    pipeline: "Base Clientes 360",
    status: "success",
    startedAt: "2025-01-15 07:30",
    duration: "4m 52s",
    rows: 87240,
    memory: "680 MB",
    user: "Raniere",
    nextRun: "2025-01-15 19:30",
  },
  {
    id: "job-3",
    name: "Performance Atendimento #31",
    pipeline: "Performance Atendimento",
    status: "error",
    startedAt: "2025-01-15 05:00",
    duration: "0m 43s",
    rows: 0,
    memory: "—",
    user: "Raniere",
    nextRun: "—",
  },
  {
    id: "job-4",
    name: "Recebíveis #67",
    pipeline: "Recebíveis e Inadimplência",
    status: "success",
    startedAt: "2025-01-15 06:00",
    duration: "1m 47s",
    rows: 22400,
    memory: "210 MB",
    user: "Raniere",
    nextRun: "2025-01-16 06:00",
  },
  {
    id: "job-5",
    name: "Score de Churn #15",
    pipeline: "Score de Churn",
    status: "success",
    startedAt: "2025-01-14 23:00",
    duration: "6m 08s",
    rows: 34100,
    memory: "540 MB",
    user: "Raniere",
    nextRun: "—",
  },
  {
    id: "job-6",
    name: "Consolidado Comercial #87",
    pipeline: "Consolidado Comercial",
    status: "success",
    startedAt: "2025-01-14 08:45",
    duration: "2m 08s",
    rows: 141200,
    memory: "415 MB",
    user: "Raniere",
    nextRun: "—",
  },
  {
    id: "job-7",
    name: "Base Clientes 360 #43",
    pipeline: "Base Clientes 360",
    status: "running",
    startedAt: "2025-01-15 09:30",
    duration: "—",
    rows: 0,
    memory: "—",
    user: "Raniere",
    nextRun: "—",
  },
];

export const mockPublications = [
  {
    id: "pub-1",
    name: "clientes_360.duckdb",
    format: "duckdb",
    size: "84 MB",
    generatedAt: "2025-01-15 07:38",
    pipeline: "Base Clientes 360",
    status: "available",
    destination: "Local / Download",
    downloads: 14,
  },
  {
    id: "pub-2",
    name: "recebiveis.parquet",
    format: "parquet",
    size: "12 MB",
    generatedAt: "2025-01-15 06:04",
    pipeline: "Recebíveis e Inadimplência",
    status: "available",
    destination: "S3 (simulado)",
    downloads: 8,
  },
  {
    id: "pub-3",
    name: "atendimento_qualidade.csv",
    format: "csv",
    size: "4.2 MB",
    generatedAt: "2025-01-14 23:05",
    pipeline: "Performance Atendimento",
    status: "outdated",
    destination: "Pasta compartilhada",
    downloads: 3,
  },
  {
    id: "pub-4",
    name: "comercial_metas.xlsx",
    format: "xlsx",
    size: "2.8 MB",
    generatedAt: "2025-01-15 08:50",
    pipeline: "Consolidado Comercial",
    status: "available",
    destination: "Download manual",
    downloads: 22,
  },
  {
    id: "pub-5",
    name: "churn_score.parquet",
    format: "parquet",
    size: "6.1 MB",
    generatedAt: "2025-01-14 23:08",
    pipeline: "Score de Churn",
    status: "available",
    destination: "S3 (simulado)",
    downloads: 7,
  },
];

export const mockCatalog = [
  {
    id: "cat-1",
    name: "clientes_360",
    description: "Visão unificada dos clientes com dados de ERP, CRM e atendimento",
    source: "Base Clientes 360",
    domain: "comercial",
    columns: 34,
    rows: 87240,
    updatedAt: "2025-01-15 07:38",
    responsible: "Raniere",
    quality: 94,
    tags: ["clientes", "360", "crm", "erp"],
    format: "duckdb",
  },
  {
    id: "cat-2",
    name: "recebiveis",
    description: "Recebíveis com status de inadimplência, vencimentos e aging",
    source: "Recebíveis e Inadimplência",
    domain: "financeiro",
    columns: 18,
    rows: 22400,
    updatedAt: "2025-01-15 06:04",
    responsible: "Raniere",
    quality: 88,
    tags: ["financeiro", "recebíveis", "inadimplência"],
    format: "parquet",
  },
  {
    id: "cat-3",
    name: "vw_performance_comercial",
    description: "View analítica de performance por vendedor, região e produto",
    source: "Consolidado Comercial",
    domain: "comercial",
    columns: 22,
    rows: 142800,
    updatedAt: "2025-01-15 08:50",
    responsible: "Raniere",
    quality: 97,
    tags: ["comercial", "metas", "performance"],
    format: "view",
  },
  {
    id: "cat-4",
    name: "churn_score",
    description: "Score de propensão ao churn por cliente com variáveis explicativas",
    source: "Score de Churn",
    domain: "comercial",
    columns: 14,
    rows: 34100,
    updatedAt: "2025-01-14 23:08",
    responsible: "Raniere",
    quality: 91,
    tags: ["churn", "risco", "ml"],
    format: "parquet",
  },
  {
    id: "cat-5",
    name: "atendimentos",
    description: "Histórico completo de atendimentos com SLA e categorização",
    source: "MariaDB Atendimento",
    domain: "atendimento",
    columns: 28,
    rows: 215000,
    updatedAt: "2025-01-15 07:15",
    responsible: "Raniere",
    quality: 82,
    tags: ["atendimento", "sla", "suporte"],
    format: "table",
  },
  {
    id: "cat-6",
    name: "vw_recebiveis",
    description: "View de recebíveis com aging e projeções",
    source: "Recebíveis e Inadimplência",
    domain: "financeiro",
    columns: 12,
    rows: 22400,
    updatedAt: "2025-01-15 06:04",
    responsible: "Raniere",
    quality: 89,
    tags: ["financeiro", "aging"],
    format: "view",
  },
];

export const mockQualityRules = [
  {
    id: "qr-1",
    name: "CPF/CNPJ válido",
    dataset: "clientes_360",
    column: "documento",
    type: "formato",
    severity: "critical",
    affected: 42,
    lastRun: "2025-01-15 07:38",
    status: "warning",
  },
  {
    id: "qr-2",
    name: "Data de vencimento não nula",
    dataset: "recebiveis",
    column: "dt_vencimento",
    type: "nulidade",
    severity: "critical",
    affected: 0,
    lastRun: "2025-01-15 06:04",
    status: "pass",
  },
  {
    id: "qr-3",
    name: "Valor maior que zero",
    dataset: "recebiveis",
    column: "valor",
    type: "intervalo",
    severity: "high",
    affected: 3,
    lastRun: "2025-01-15 06:04",
    status: "warning",
  },
  {
    id: "qr-4",
    name: "Código de cliente único",
    dataset: "clientes_360",
    column: "id_cliente",
    type: "unicidade",
    severity: "critical",
    affected: 0,
    lastRun: "2025-01-15 07:38",
    status: "pass",
  },
  {
    id: "qr-5",
    name: "Status dentro da lista permitida",
    dataset: "atendimentos",
    column: "status",
    type: "domínio",
    severity: "medium",
    affected: 18,
    lastRun: "2025-01-15 07:15",
    status: "fail",
  },
  {
    id: "qr-6",
    name: "Email válido",
    dataset: "clientes_360",
    column: "email",
    type: "formato",
    severity: "low",
    affected: 127,
    lastRun: "2025-01-15 07:38",
    status: "warning",
  },
];

export const mockTransformTemplates = [
  {
    id: "tpl-1",
    name: "Base de Clientes 360",
    category: "comercial",
    description: "Unifica dados de clientes de ERP, CRM e atendimento em uma visão consolidada.",
    objective: "Criar visão única do cliente para análise de comportamento, risco e oportunidades.",
    sources: ["PostgreSQL ERP", "MariaDB Atendimento", "API CRM"],
    tables: ["clientes", "contratos", "atendimentos", "oportunidades"],
    transformations: ["JOIN triplo por id_cliente", "Cálculo de NPS médio", "Score de saúde do cliente"],
    outputs: ["clientes_360.duckdb", "clientes_360.parquet"],
    usageCount: 5,
  },
  {
    id: "tpl-2",
    name: "Receita e Recebíveis",
    category: "financeiro",
    description: "Consolida cobranças, recebimentos e inadimplência com aging detalhado.",
    objective: "Mapeamento completo da receita, recebíveis e projeções de inadimplência.",
    sources: ["PostgreSQL ERP", "CSV Financeiro"],
    tables: ["cobranças", "contratos", "recebimentos"],
    transformations: ["Cálculo de aging", "Projeção de fluxo", "Classificação de risco"],
    outputs: ["recebiveis.parquet", "recebiveis.xlsx"],
    usageCount: 3,
  },
  {
    id: "tpl-3",
    name: "Funil Comercial",
    category: "comercial",
    description: "Pipeline de leads, oportunidades e fechamentos com KPIs de vendas.",
    objective: "Analisar o funil de vendas e identificar gargalos no processo comercial.",
    sources: ["API CRM", "Planilha Comercial"],
    tables: ["leads", "oportunidades", "metas", "agentes"],
    transformations: ["Taxa de conversão por etapa", "Ciclo médio de venda", "Performance por vendedor"],
    outputs: ["funil_comercial.duckdb", "funil_comercial.csv"],
    usageCount: 8,
  },
  {
    id: "tpl-4",
    name: "Churn e Retenção",
    category: "comercial",
    description: "Calcula score de churn com base em comportamento, inadimplência e atendimentos.",
    objective: "Identificar clientes com alta propensão ao churn para ações preventivas.",
    sources: ["PostgreSQL ERP", "MariaDB Atendimento", "CSV Financeiro"],
    tables: ["clientes", "cobranças", "atendimentos", "contratos"],
    transformations: ["Score de risco", "Cluster de comportamento", "Histórico de inadimplência"],
    outputs: ["churn_score.parquet"],
    usageCount: 2,
  },
  {
    id: "tpl-5",
    name: "Qualidade de Atendimento",
    category: "atendimento",
    description: "KPIs de SLA, TMA, CSAT e resolução no primeiro contato.",
    objective: "Monitorar qualidade do atendimento por canal, agente e categoria.",
    sources: ["MariaDB Atendimento"],
    tables: ["atendimentos", "agentes", "categorias"],
    transformations: ["SLA por prioridade", "TMA por agente", "CSAT médio"],
    outputs: ["atendimento_qualidade.csv"],
    usageCount: 4,
  },
  {
    id: "tpl-6",
    name: "Data Mart Financeiro",
    category: "financeiro",
    description: "Data mart completo para análise financeira com DRE, balancete e fluxo.",
    objective: "Centralizar dados financeiros para consumo em BI e relatórios executivos.",
    sources: ["PostgreSQL ERP", "CSV Financeiro"],
    tables: ["lançamentos", "contratos", "centros_custo", "produtos"],
    transformations: ["DRE por período", "Análise horizontal/vertical", "Fluxo de caixa projetado"],
    outputs: ["financeiro_mart.duckdb", "dre.xlsx"],
    usageCount: 1,
  },
  {
    id: "tpl-7",
    name: "Metas e Performance",
    category: "comercial",
    description: "Consolida metas vs. realizado por vendedor, produto e região.",
    objective: "Acompanhar atingimento de metas com granularidade individual.",
    sources: ["Planilha Comercial", "PostgreSQL ERP"],
    tables: ["metas", "pedidos", "agentes", "cidades"],
    transformations: ["Gap vs. meta", "Performance acumulada", "Ranking de vendedores"],
    outputs: ["performance_metas.xlsx"],
    usageCount: 6,
  },
  {
    id: "tpl-8",
    name: "Estoque e Logística",
    category: "operacional",
    description: "Visão de estoque atual, giro de produtos e status de entregas.",
    objective: "Monitorar estoque, ruptura e performance logística em tempo quase real.",
    sources: ["PostgreSQL ERP"],
    tables: ["produtos", "estoques", "pedidos", "entregas"],
    transformations: ["Giro de estoque", "Cobertura por SKU", "Status de entrega"],
    outputs: ["estoque_logistica.parquet"],
    usageCount: 0,
  },
];

export const chartData = {
  executionsByDay: [
    { day: "09/Jan", executions: 12, errors: 1 },
    { day: "10/Jan", executions: 18, errors: 0 },
    { day: "11/Jan", executions: 14, errors: 2 },
    { day: "12/Jan", executions: 22, errors: 1 },
    { day: "13/Jan", executions: 9, errors: 0 },
    { day: "14/Jan", executions: 19, errors: 3 },
    { day: "15/Jan", executions: 24, errors: 1 },
  ],
  volumeBySource: [
    { source: "PG ERP", volume: 1200, color: "#3b82f6" },
    { source: "MariaDB", volume: 340, color: "#8b5cf6" },
    { source: "Parquet", volume: 4700, color: "#06b6d4" },
    { source: "API CRM", volume: 210, color: "#10b981" },
    { source: "CSV", volume: 52, color: "#f59e0b" },
    { source: "XLSX", volume: 18, color: "#ec4899" },
  ],
  qualityByDay: [
    { day: "09/Jan", score: 87 },
    { day: "10/Jan", score: 89 },
    { day: "11/Jan", score: 86 },
    { day: "12/Jan", score: 92 },
    { day: "13/Jan", score: 91 },
    { day: "14/Jan", score: 88 },
    { day: "15/Jan", score: 94 },
  ],
};

export const mockSqlQuery = `-- DataForge Workspace SQL
-- Base Analítica: Clientes 360 com Score de Risco
-- Fonte: PostgreSQL ERP + MariaDB Atendimento + CSV Financeiro

WITH clientes_base AS (
  SELECT
    c.id_cliente,
    c.nome,
    c.documento,
    c.email,
    c.segmento,
    c.cidade_id,
    c.dt_cadastro,
    c.status
  FROM read_parquet('erp_clientes.parquet') AS c
  WHERE c.status = 'ativo'
),

cobranças_agg AS (
  SELECT
    cb.id_cliente,
    COUNT(*)                          AS total_cobranças,
    SUM(cb.valor)                     AS valor_total,
    SUM(CASE WHEN cb.status = 'vencida' THEN 1 ELSE 0 END)
                                      AS cobranças_vencidas,
    AVG(CASE WHEN cb.atraso_dias > 0 THEN cb.atraso_dias END)
                                      AS atraso_medio_dias,
    MAX(cb.dt_vencimento)             AS ultima_cobrança
  FROM read_csv_auto('financeiro.csv') AS cb
  GROUP BY cb.id_cliente
),

atendimentos_agg AS (
  SELECT
    at.id_cliente,
    COUNT(*)                          AS total_atendimentos,
    AVG(at.tempo_resolucao_horas)     AS tma_horas,
    SUM(CASE WHEN at.tipo = 'reclamação' THEN 1 ELSE 0 END)
                                      AS reclamações,
    MAX(at.dt_abertura)               AS ultimo_atendimento
  FROM read_parquet('atendimentos.parquet') AS at
  WHERE at.dt_abertura >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY at.id_cliente
),

score_churn AS (
  SELECT
    id_cliente,
    -- Score simples baseado em atraso + reclamações
    LEAST(100, ROUND(
      (COALESCE(atraso_medio_dias, 0) * 2) +
      (COALESCE(reclamações, 0) * 5) +
      (CASE WHEN total_cobranças > 0
            THEN (cobranças_vencidas::FLOAT / total_cobranças) * 30
            ELSE 0 END)
    )) AS churn_score,
    CASE
      WHEN atraso_medio_dias > 30 OR reclamações > 5 THEN 'alto'
      WHEN atraso_medio_dias > 15 OR reclamações > 2 THEN 'médio'
      ELSE 'baixo'
    END AS risco_churn
  FROM cobranças_agg
  LEFT JOIN atendimentos_agg USING (id_cliente)
)

SELECT
  cb.id_cliente,
  cb.nome,
  cb.segmento,
  cb.status,
  COALESCE(cob.total_cobranças, 0)     AS total_cobranças,
  COALESCE(cob.valor_total, 0)         AS valor_total,
  COALESCE(cob.cobranças_vencidas, 0)  AS cobranças_vencidas,
  COALESCE(cob.atraso_medio_dias, 0)   AS atraso_medio_dias,
  COALESCE(at.total_atendimentos, 0)   AS total_atendimentos,
  COALESCE(at.reclamações, 0)          AS reclamações,
  COALESCE(sc.churn_score, 0)          AS churn_score,
  COALESCE(sc.risco_churn, 'baixo')    AS risco_churn,
  cb.dt_cadastro,
  cob.ultima_cobrança,
  at.ultimo_atendimento
FROM clientes_base AS cb
LEFT JOIN cobranças_agg  AS cob ON cb.id_cliente = cob.id_cliente
LEFT JOIN atendimentos_agg AS at ON cb.id_cliente = at.id_cliente
LEFT JOIN score_churn    AS sc  ON cb.id_cliente = sc.id_cliente
ORDER BY sc.churn_score DESC NULLS LAST
LIMIT 1000;`;

export const mockQueryResults = [
  { id_cliente: "C-1042", nome: "Empresa Alpha Ltda", segmento: "Enterprise", status: "ativo", total_cobranças: 18, valor_total: "R$ 284.500", cobranças_vencidas: 3, atraso_medio_dias: 22, total_atendimentos: 7, reclamações: 2, churn_score: 62, risco_churn: "médio" },
  { id_cliente: "C-0887", nome: "Beta Serviços SA", segmento: "SMB", status: "ativo", total_cobranças: 12, valor_total: "R$ 48.200", cobranças_vencidas: 5, atraso_medio_dias: 38, total_atendimentos: 14, reclamações: 6, churn_score: 87, risco_churn: "alto" },
  { id_cliente: "C-2310", nome: "Gama Tech ME", segmento: "Startup", status: "ativo", total_cobranças: 6, valor_total: "R$ 12.800", cobranças_vencidas: 0, atraso_medio_dias: 0, total_atendimentos: 2, reclamações: 0, churn_score: 8, risco_churn: "baixo" },
  { id_cliente: "C-1789", nome: "Delta Comércio Ltda", segmento: "SMB", status: "ativo", total_cobranças: 24, valor_total: "R$ 72.400", cobranças_vencidas: 2, atraso_medio_dias: 14, total_atendimentos: 5, reclamações: 1, churn_score: 34, risco_churn: "baixo" },
  { id_cliente: "C-3301", nome: "Épsilon Indústria SA", segmento: "Enterprise", status: "ativo", total_cobranças: 36, valor_total: "R$ 1.240.000", cobranças_vencidas: 8, atraso_medio_dias: 45, total_atendimentos: 22, reclamações: 9, churn_score: 94, risco_churn: "alto" },
  { id_cliente: "C-0412", nome: "Zeta Consultoria ME", segmento: "Startup", status: "ativo", total_cobranças: 9, valor_total: "R$ 28.900", cobranças_vencidas: 1, atraso_medio_dias: 8, total_atendimentos: 3, reclamações: 0, churn_score: 21, risco_churn: "baixo" },
  { id_cliente: "C-2891", nome: "Eta Saúde Ltda", segmento: "SMB", status: "ativo", total_cobranças: 15, valor_total: "R$ 94.300", cobranças_vencidas: 4, atraso_medio_dias: 28, total_atendimentos: 11, reclamações: 4, churn_score: 73, risco_churn: "alto" },
];

export const mockChatHistory = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Olá, Raniere! Sou o agente de IA do DataForge. Tenho acesso ao schema completo das suas fontes — **PostgreSQL ERP**, **MariaDB Atendimento**, **CSV Financeiro**, **Planilha Comercial** e **API CRM**. Como posso ajudar com seus pipelines e transformações SQL hoje?",
    timestamp: "09:00",
    sql: null,
  },
  {
    id: "msg-2",
    role: "user",
    content: "Quero juntar clientes, cobranças e atendimentos para criar uma base de risco de churn.",
    timestamp: "09:01",
    sql: null,
  },
  {
    id: "msg-3",
    role: "assistant",
    content: "Ótima ideia! Mapeei as tabelas relevantes:\n\n**clientes** (PostgreSQL ERP) — 87.240 registros, chave: `id_cliente`\n**cobranças** (CSV Financeiro) — 22.400 registros, chave: `id_cliente`\n**atendimentos** (MariaDB) — 215.000 registros, chave: `id_cliente`\n\nSugiro usar `id_cliente` como chave principal e calcular:\n- Atraso médio em dias (cobranças)\n- Quantidade de reclamações nos últimos 90 dias\n- Score de churn composto\n\nPosso gerar a query completa agora?",
    timestamp: "09:01",
    sql: null,
  },
  {
    id: "msg-4",
    role: "user",
    content: "Sim, gera a query por favor.",
    timestamp: "09:02",
    sql: null,
  },
  {
    id: "msg-5",
    role: "assistant",
    content: "Query gerada com sucesso. Ela usa CTEs para organizar cada fonte separadamente antes do JOIN final, garantindo performance no DuckDB:",
    timestamp: "09:02",
    sql: `WITH cobranças_agg AS (
  SELECT
    id_cliente,
    COUNT(*) AS total_cobranças,
    SUM(CASE WHEN status = 'vencida' THEN 1 ELSE 0 END) AS vencidas,
    AVG(CASE WHEN atraso_dias > 0 THEN atraso_dias END) AS atraso_medio
  FROM read_csv_auto('financeiro.csv')
  GROUP BY id_cliente
),
atend_agg AS (
  SELECT
    id_cliente,
    COUNT(*) AS total_atend,
    SUM(CASE WHEN tipo = 'reclamação' THEN 1 ELSE 0 END) AS reclamações
  FROM atendimentos
  WHERE dt_abertura >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY id_cliente
)
SELECT
  c.id_cliente, c.nome, c.segmento,
  COALESCE(cob.atraso_medio, 0) AS atraso_medio_dias,
  COALESCE(at.reclamações, 0)   AS reclamações_90d,
  LEAST(100, ROUND(
    COALESCE(cob.atraso_medio, 0) * 2 +
    COALESCE(at.reclamações, 0) * 5
  )) AS churn_score
FROM clientes c
LEFT JOIN cobranças_agg cob USING (id_cliente)
LEFT JOIN atend_agg      at  USING (id_cliente)
ORDER BY churn_score DESC;`,
    sqlExplanation: "Usamos 3 CTEs: uma para agregar cobranças por cliente, outra para atendimentos dos últimos 90 dias, e o SELECT final une tudo com JOINs LEFT para não perder clientes sem histórico. O score é calculado como: atraso_médio × 2 + reclamações × 5, limitado a 100.",
    sqlRisks: ["Verifique se o campo `atraso_dias` é numérico no CSV — pode ter vírgulas como separador decimal", "O INTERVAL '90 days' usa sintaxe DuckDB; confirme compatibilidade se migrar para outro engine"],
  },
];

export const mockSchemas = {
  clientes: [
    { name: "id_cliente", type: "VARCHAR", nullable: false },
    { name: "nome", type: "VARCHAR", nullable: false },
    { name: "documento", type: "VARCHAR", nullable: true },
    { name: "email", type: "VARCHAR", nullable: true },
    { name: "segmento", type: "VARCHAR", nullable: true },
    { name: "cidade_id", type: "INT", nullable: true },
    { name: "dt_cadastro", type: "DATE", nullable: false },
    { name: "status", type: "VARCHAR", nullable: false },
  ],
  contratos: [
    { name: "id_contrato", type: "VARCHAR", nullable: false },
    { name: "id_cliente", type: "VARCHAR", nullable: false },
    { name: "dt_inicio", type: "DATE", nullable: false },
    { name: "dt_fim", type: "DATE", nullable: true },
    { name: "valor_mensal", type: "DECIMAL", nullable: false },
    { name: "plano", type: "VARCHAR", nullable: false },
    { name: "status", type: "VARCHAR", nullable: false },
  ],
  cobranças: [
    { name: "id_cobrança", type: "VARCHAR", nullable: false },
    { name: "id_cliente", type: "VARCHAR", nullable: false },
    { name: "valor", type: "DECIMAL", nullable: false },
    { name: "dt_vencimento", type: "DATE", nullable: false },
    { name: "dt_pagamento", type: "DATE", nullable: true },
    { name: "status", type: "VARCHAR", nullable: false },
    { name: "atraso_dias", type: "INT", nullable: true },
  ],
  atendimentos: [
    { name: "id_atendimento", type: "VARCHAR", nullable: false },
    { name: "id_cliente", type: "VARCHAR", nullable: false },
    { name: "tipo", type: "VARCHAR", nullable: false },
    { name: "canal", type: "VARCHAR", nullable: true },
    { name: "status", type: "VARCHAR", nullable: false },
    { name: "dt_abertura", type: "TIMESTAMP", nullable: false },
    { name: "dt_fechamento", type: "TIMESTAMP", nullable: true },
    { name: "tempo_resolucao_horas", type: "FLOAT", nullable: true },
    { name: "agente_id", type: "VARCHAR", nullable: true },
  ],
  metas: [
    { name: "id_meta", type: "VARCHAR", nullable: false },
    { name: "agente_id", type: "VARCHAR", nullable: false },
    { name: "periodo", type: "VARCHAR", nullable: false },
    { name: "meta_valor", type: "DECIMAL", nullable: false },
    { name: "realizado_valor", type: "DECIMAL", nullable: true },
    { name: "produto", type: "VARCHAR", nullable: true },
  ],
};

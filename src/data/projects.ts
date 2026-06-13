export interface ProjectBrand {
  /** Glifo curto da marca do projeto (ex.: 'Σ'). */
  mark: string
  /** Cor de acento da identidade do projeto. */
  accent: string
  /** Cor do texto sobre o acento. */
  accentInk: string
  /** Superfície do card no tema do projeto. */
  surface: string
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  tech: string[]
  links: {
    case?: string
    demo?: string
    code?: string
  }
  /** Quando presente, o card adota a identidade visual do próprio projeto. */
  brand?: ProjectBrand
}

// Cases genéricos, sem nomes de empresas ou clientes reais.
// Trocar os links pelos subdomínios/repos reais quando publicar cada case.
export const projects: Project[] = [
  {
    id: 'sigma',
    title: 'Sigma — atendimento com IA',
    category: 'Desenvolvimento de software · IA',
    description:
      'Sistema de atendimento com IA para empresas que precisam responder clientes com contexto, regras e histórico. Por trás, organiza agentes por área, conecta ferramentas como ERP e bancos de dados, usa base de conhecimento e registra cada execução. Demo navegável com dados fictícios.',
    tech: ['Atendimento com IA', 'Fluxos por área', 'Base de conhecimento', 'Integrações'],
    links: {
      demo: '/sigma/',
      code: 'https://github.com/raniere57/raniere-dev/tree/main/sigma',
    },
    brand: {
      mark: 'Σ',
      accent: 'oklch(89% 0.19 124)',
      accentInk: 'oklch(22% 0.05 140)',
      surface: 'oklch(17% 0.012 160)',
    },
  },
  {
    id: 'sentinel',
    title: 'Sentinel QA — monitoria de atendimentos',
    category: 'Desenvolvimento de software · IA',
    description:
      'Plataforma de monitoria de qualidade que avalia atendimentos com IA: define modelos e critérios, pontua cada conversa, acompanha agentes e gera relatórios. Painel completo com dashboards e gráficos. Demo navegável com dados fictícios.',
    tech: ['React', 'Dashboards', 'Avaliação por IA', 'Relatórios'],
    links: {
      demo: '/sentinel/',
      code: 'https://github.com/raniere57/raniere-dev/tree/main/sentinel',
    },
    brand: {
      mark: '◈',
      accent: 'oklch(72% 0.135 220)',
      accentInk: 'oklch(20% 0.04 240)',
      surface: 'oklch(16% 0.02 250)',
    },
  },
  {
    id: 'insightgate',
    title: 'InsightGate — portal de relatórios Power BI',
    category: 'Business Intelligence · Governança',
    description:
      'Portal central para publicar, controlar e auditar relatórios Power BI públicos: catálogo organizado, controle de acesso, histórico de quem viu o quê, alertas de falha e entregas agendadas. Governança sem licença cara de Embedded. Demo navegável com dados fictícios.',
    tech: ['React', 'Power BI', 'Governança & auditoria', 'Dashboards'],
    links: {
      demo: '/insightgate/',
      code: 'https://github.com/raniere57/raniere-dev/tree/main/insightgate',
    },
    brand: {
      mark: '◫',
      accent: 'oklch(62% 0.19 264)',
      accentInk: 'oklch(98% 0.01 264)',
      surface: 'oklch(15% 0.025 264)',
    },
  },
  {
    id: 'hub-integracoes',
    title: 'Hub de integrações ERP ↔ CRM',
    category: 'Integrações',
    description:
      'Serviço central que sincroniza cadastros, pedidos e status entre ERP e CRM em tempo quase real, com fila de reprocessamento e trilha de auditoria de cada evento.',
    tech: ['APIs', 'Integração ERP/CRM', 'Mensageria', 'Containers'],
    links: {
      case: '#projetos',
      demo: 'https://demo.raniere.dev',
      code: 'https://github.com/raniere',
    },
  },
  {
    id: 'pipeline-dados',
    title: 'Pipeline de dados operacionais',
    category: 'Engenharia de dados',
    description:
      'Pipeline diário que consolida dados de produção, valida qualidade em cada etapa e alimenta relatórios regulatórios — com alertas automáticos quando algo foge do padrão.',
    tech: ['Pipeline de dados', 'Orquestração', 'Banco de dados', 'Alertas'],
    links: {
      case: '#projetos',
      code: 'https://github.com/raniere',
    },
  },
  {
    id: 'automacao-rotinas',
    title: 'Automação de rotinas administrativas',
    category: 'Automação',
    description:
      'Conjunto de automações que eliminou horas de trabalho manual por semana: conciliação de planilhas, geração de documentos e notificações por e-mail e chat.',
    tech: ['Automação', 'APIs', 'Agendamento', 'Notificações'],
    links: {
      case: '#projetos',
      demo: 'https://demo.raniere.dev',
    },
  },
]

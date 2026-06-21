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
    id: 'signal',
    title: 'Signal — plataforma omnichannel',
    category: 'Desenvolvimento de software · Atendimento',
    description:
      'Plataforma omnichannel que centraliza atendimento de WhatsApp, Instagram, Facebook, site e telefone (PABX) em um só lugar. Inclui agente de IA, inbox unificada e módulo de disparos massivos. Demo navegável com dados fictícios.',
    tech: ['Omnichannel', 'PABX', 'Agente de IA', 'Disparos'],
    links: {
      demo: '/signal/',
      code: 'https://github.com/raniere57/raniere-dev/tree/main/signal',
    },
    brand: {
      mark: '◉',
      accent: 'oklch(75% 0.17 75)',
      accentInk: 'oklch(18% 0.04 55)',
      surface: 'oklch(16% 0.02 55)',
    },
  },
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
    title: 'InsightGate — portal de relatórios e dashboards',
    category: 'Business Intelligence · Governança',
    description:
      'Portal central para publicar, controlar e auditar relatórios e dashboards públicos — Power BI, Tableau, Looker Studio, Metabase, Redash, Streamlit e outras plataformas. Catálogo organizado, controle de acesso, histórico de acessos, alertas de falha e entregas agendadas. Governança sem licença cara de Embedded. Demo navegável com dados fictícios.',
    tech: ['React', 'Multi-plataforma', 'Governança & auditoria', 'Dashboards'],
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
    id: 'dataforge',
    title: 'DataForge — pipelines de dados',
    category: 'Engenharia de dados',
    description:
      'Plataforma leve de pipelines sobre DuckDB: conecta fontes, unifica e transforma dados com SQL assistido por IA, valida qualidade e publica bases otimizadas para consumo. Editor SQL, catálogo e jobs em um só lugar. Demo navegável com dados fictícios.',
    tech: ['React', 'DuckDB', 'SQL + IA', 'ETL & qualidade'],
    links: {
      demo: '/dataforge/',
      code: 'https://github.com/raniere57/raniere-dev/tree/main/dataforge',
    },
    brand: {
      mark: '⚡',
      accent: 'oklch(70% 0.16 200)',
      accentInk: 'oklch(18% 0.04 230)',
      surface: 'oklch(15% 0.03 240)',
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

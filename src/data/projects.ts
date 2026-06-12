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
    id: 'plataforma-bi',
    title: 'Plataforma de BI self-service',
    category: 'Business Intelligence',
    description:
      'Camada completa de indicadores para operação comercial: extração de dados de múltiplas fontes, modelagem em warehouse e dashboards self-service para os times de gestão.',
    tech: ['Pipeline de dados', 'Data warehouse', 'Dashboards'],
    links: {
      case: '#projetos',
      demo: 'https://demo.raniere.dev',
      code: 'https://github.com/raniere',
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

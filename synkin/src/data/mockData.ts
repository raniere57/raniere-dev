// ============================================================
// SYNKIN — Dados mockados (pt-BR)
// ============================================================

export type AccountType = "pessoal" | "empresa";
export type AccountStatus = "conectada" | "expirada" | "pendente";
export type PostStatus = "rascunho" | "agendado" | "aguardando_aprovacao" | "publicado";
export type LeadTemp = "quente" | "morno" | "frio";
export type ProspectStatus = "nao_contactado" | "convite_enviado" | "respondeu" | "aceitou" | "ignorado";
export type ActionType =
  | "publicar_post"
  | "comentar"
  | "curtir"
  | "enviar_mensagem"
  | "enviar_convite"
  | "seguir";
export type ActionStatus = "pendente_aprovacao" | "aprovado" | "rejeitado" | "publicado_simulado";

// ============================================================
// USUÁRIO & CONTAS
// ============================================================
export const currentUser = {
  name: "Raniere Rodrigues Gomes",
  email: "usuario@demo.synkin",
  initials: "RR",
  role: "Engenheiro de Software · Dados & Automação",
  city: "Goiânia, GO",
};

export interface LinkedInAccount {
  id: string;
  name: string;
  type: AccountType;
  status: AccountStatus;
  avatarColor: string;
  initials: string;
  followers: number;
  connections: number;
  ssi: number; // Social Selling Index simulado
  postsThisMonth: number;
  industry: string;
  headline: string;
  url: string;
}

export const linkedinAccounts: LinkedInAccount[] = [
  {
    id: "acc-1",
    name: "Raniere Rodrigues Gomes",
    type: "pessoal",
    status: "conectada",
    avatarColor: "from-blue-500 to-indigo-600",
    initials: "RR",
    followers: 4823,
    connections: 1284,
    ssi: 72,
    postsThisMonth: 14,
    industry: "Tecnologia da Informação",
    headline: "Engenheiro de Software | Dados, Automação & IA aplicada a produtos",
    url: "linkedin.com/in/raniere-rodrigues",
  },
  {
    id: "acc-2",
    name: "Synkin Labs",
    type: "empresa",
    status: "conectada",
    avatarColor: "from-violet-500 to-fuchsia-500",
    initials: "SL",
    followers: 12840,
    connections: 0,
    ssi: 81,
    postsThisMonth: 22,
    industry: "SaaS · Martech & Sales Tech",
    headline: "Synkin Labs — Ajudamos empresas a crescer no LinkedIn com estratégia e IA",
    url: "linkedin.com/company/synkin-labs",
  },
  {
    id: "acc-3",
    name: "Raniere · Consultoria",
    type: "pessoal",
    status: "pendente",
    avatarColor: "from-emerald-500 to-cyan-600",
    initials: "RC",
    followers: 0,
    connections: 0,
    ssi: 0,
    postsThisMonth: 0,
    industry: "Consultoria técnica",
    headline: "Consultor em engenharia de software e dados",
    url: "—",
  },
];

// ============================================================
// DASHBOARD
// ============================================================
export const dashboardKPIs = {
  profileScore: 78,
  postsThisWeek: 4,
  avgEngagement: 5.4,
  hotLeads: 7,
  pendingConversations: 12,
  weeklyDelta: {
    profileScore: 4,
    postsThisWeek: 1,
    avgEngagement: 0.8,
    hotLeads: 2,
    pendingConversations: -3,
  },
};

export const impressionsChartData = [
  { day: "Seg", impressoes: 1840, engajamento: 92 },
  { day: "Ter", impressoes: 2340, engajamento: 124 },
  { day: "Qua", impressoes: 1980, engajamento: 102 },
  { day: "Qui", impressoes: 3120, engajamento: 186 },
  { day: "Sex", impressoes: 2840, engajamento: 165 },
  { day: "Sáb", impressoes: 1320, engajamento: 58 },
  { day: "Dom", impressoes: 1620, engajamento: 74 },
];

// ============================================================
// AÇÕES PENDENTES (DASHBOARD + APROVAÇÕES)
// ============================================================
export interface PendingAction {
  id: string;
  type: ActionType;
  title: string;
  preview: string;
  context: string;
  accountId: string;
  reason: string;
  priority: "alta" | "media" | "baixa";
  scheduledFor?: string;
  targetName?: string;
  status: ActionStatus;
  createdAt: string;
}

export const pendingActions: PendingAction[] = [
  {
    id: "act-1",
    type: "publicar_post",
    title: "Publicar post agendado — 09:00",
    preview:
      "5 lições que aprendi migrando um monolito para microsserviços sem quebrar a produção. 👇\n\nA thread abaixo resume o que funcionou (e o que não funcionou) em 3 meses de refatoração...",
    context: "Pilar de conteúdo: engenharia de software. Melhor horário p/ audiência: ter-sex 09:00.",
    accountId: "acc-1",
    reason: "Engajamento previsto 3.2x acima da média",
    priority: "alta",
    scheduledFor: "Hoje · 09:00",
    status: "pendente_aprovacao",
    createdAt: "há 12 min",
  },
  {
    id: "act-2",
    type: "comentar",
    title: "Comentar no post de Carla Menezes",
    preview:
      "Excelente ponto, Carla. Na nossa experiência com data contracts, o ponto mais subestimado costuma ser a governança dos schemas antes mesmo da parte técnica...",
    context: "Post com 4.2k reações sobre engenharia de dados. Carla M. tem 38k seguidores.",
    accountId: "acc-1",
    reason: "Oportunidade de visibilidade: alto tráfego + tom aberto a debate",
    priority: "alta",
    targetName: "Carla Menezes",
    status: "pendente_aprovacao",
    createdAt: "há 34 min",
  },
  {
    id: "act-3",
    type: "enviar_mensagem",
    title: "Responder mensagem de Bruno Tavares",
    preview:
      "Oi Bruno! Que bom receber seu contato. Sobre sua dúvida de automação de prospecção, mando um case curto que se aplica ao seu cenário...",
    context: "Lead quente — pediu retorno sobre Synkin. 3ª interação na thread.",
    accountId: "acc-1",
    reason: "Janela ideal: lead engajado, score 87/100",
    priority: "alta",
    targetName: "Bruno Tavares",
    status: "pendente_aprovacao",
    createdAt: "há 1 h",
  },
  {
    id: "act-4",
    type: "enviar_convite",
    title: "Enviar convite para Juliana Prado",
    preview:
      "Convite com nota: 'Vi seu trabalho na Magnet — a abordagem de growth em SaaS B2B é referência. Adoraria trocar uma ideia.'",
    context: "Head of Growth na Magnet, 6k seguidores. Fit com ICP Synkin.",
    accountId: "acc-1",
    reason: "Alta probabilidade de aceite (78%)",
    priority: "media",
    targetName: "Juliana Prado",
    status: "pendente_aprovacao",
    createdAt: "há 2 h",
  },
  {
    id: "act-5",
    type: "curtir",
    title: "Curtir 6 posts de leads em sequência",
    preview: "Posts recentes de: Bruno T., Juliana P., Rafael M., Camila S., Diego A., Larissa V.",
    context: "Micro-engajamento para aquecer antes do follow-up de amanhã.",
    accountId: "acc-1",
    reason: "Aumenta recall do perfil antes da mensagem direta",
    priority: "baixa",
    status: "pendente_aprovacao",
    createdAt: "há 3 h",
  },
];

// ============================================================
// ANÁLISE DE PERFIL
// ============================================================
export const profileAnalysis = {
  overall: 78,
  breakdown: [
    { label: "Completude do perfil", score: 86 },
    { label: "Clareza de posicionamento", score: 71 },
    { label: "Consistência de conteúdo", score: 82 },
    { label: "Sinal de autoridade", score: 73 },
  ],
  sections: {
    headline: {
      current: "Engenheiro de Software | Dados, Automação & IA aplicada a produtos",
      score: 71,
      suggestions: [
        "Engenhheiro de Software · 8 anos construindo plataformas de dados, automação e IA para times de produto",
        "Ajudo empresas a transformar dados em produto | Eng. de Software @ Synkin Labs · ex-Stone, ex-Nubank",
        "Engenheiro de Software focado em dados e automação · escrevo sobre decisões técnicas que escalam",
      ],
    },
    about: {
      current:
        "Engenheiro apaixonado por tecnologia. Atuo com desenvolvimento, dados e automação. Busco sempre as melhores práticas e estou em constante aprendizado.",
      score: 64,
      keywordsFound: ["Engenheiro", "tecnologia", "automação", "dados"],
      keywordsMissing: ["escala", "decisão técnica", "produto", "B2B SaaS", "resultado"],
      suggestion:
        "Sou engenheiro de software há 8 anos, com foco em dados, automação e IA aplicada a produtos. Nos últimos 4 anos ajudei empresas B2B a transformar dados brutos em decisões técnicas que escalam — de pipelines com 2M eventos/dia a integrações que reduziram custo em 38%.\n\nHoje lidero engenharia na Synkin Labs, onde construo o motor de IA que sugere ações de LinkedIn para mais de 200 times comerciais.\n\nSe você está construindo plataformas de dados, avaliando automação comercial ou só quer trocar uma ideia sobre engenharia aplicada a produto — me chama.",
      issues: [
        "Falta de prova / números concretos",
        "Sem CTA claro para o próximo passo",
        "Palavras-chave do nicho ausentes (escala, B2B, decisão técnica)",
      ],
    },
    experience: {
      score: 75,
      weak: [
        {
          role: "Engenheiro de Software Pleno · Stone (2018–2020)",
          issue: "Bullets genéricos, sem impacto mensurável",
        },
        {
          role: "Desenvolvedor · Freelance (2016–2018)",
          issue: "Falta de contexto e resultados",
        },
      ],
      suggestions: [
        "Liderei migração de 14 microsserviços para arquitetura orientada a eventos, reduzindo incidentes P1 em 42%",
        "Implementei plataforma de feature flags usada por 8 squads, acelerando deploys de 2 dias para 20 min",
      ],
    },
    highlights: {
      score: 58,
      missing: ["Post fixado sobre sua área de atuação", "Link para case / portfólio", "Link para newsletter ou canal"],
      ideas: [
        "Fixar: 'Como avaliamos IA para prospecção no LinkedIn (sem virar spam)'",
        "Destacar: Case Synkin Labs — 'De ideia a 200 clientes em 6 meses'",
        "Adicionar link para raniere.dev (portfólio técnico)",
      ],
    },
    keywords: {
      present: ["Engenheiro", "Software", "Dados", "Automação", "IA", "Produto"],
      recommended: ["B2B SaaS", "Engenharia de dados", "Pipelines", "Observabilidade", "Plataforma", "Decisão técnica"],
    },
    positioning: {
      summary:
        "Você comunica 'sou técnico e faço várias coisas', mas seu nicho (dados + IA aplicada a produto B2B) pede 'sou referência em X para Y, com provas de Z'.",
      tip: "Apostar no recorte 'engenharia de software para times de dados' e reforçar provas de escala vai aumentar bastante seu SSI e a conversão de convites.",
    },
  },
};

// ============================================================
// CALENDÁRIO DE CONTEÚDO
// ============================================================
export interface CalendarPost {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  status: PostStatus;
  accountId: string;
  pillar: string;
  preview: string;
}

export const calendarPosts: CalendarPost[] = [
  { id: "p1", date: "2026-01-19", time: "09:00", title: "5 lições migrando monolito → microsserviços", status: "aguardando_aprovacao", accountId: "acc-1", pillar: "Engenharia", preview: "Thread contando o que funcionou (e o que não funcionou)..." },
  { id: "p2", date: "2026-01-19", time: "17:30", title: "Por que paramos de usar feature flags caseiras", status: "agendado", accountId: "acc-1", pillar: "Engenharia", preview: "Case curto sobre escalar deploys..." },
  { id: "p3", date: "2026-01-20", time: "08:30", title: "Data contracts salvam seu pipeline", status: "agendado", accountId: "acc-1", pillar: "Dados", preview: "Pipelines quebram no contrato, não no código..." },
  { id: "p4", date: "2026-01-20", time: "12:00", title: "Bastidores Synkin Labs — semana 24", status: "rascunho", accountId: "acc-2", pillar: "Bastidores", preview: "O que aprendemos essa semana sobre IA + LinkedIn..." },
  { id: "p5", date: "2026-01-21", time: "09:00", title: "O mito do 'LinkedIn automation'", status: "agendado", accountId: "acc-2", pillar: "Produto", preview: "Automação cega queima marca. IA como copiloto, não como bot..." },
  { id: "p6", date: "2026-01-22", time: "10:00", title: "3 decisões erradas em pipelines de dados", status: "rascunho", accountId: "acc-1", pillar: "Dados", preview: "Erros comuns que custaram 6 meses de retroativo..." },
  { id: "p7", date: "2026-01-23", time: "11:00", title: "Stack 2026 para times de dados pequenos", status: "agendado", accountId: "acc-1", pillar: "Engenharia", preview: "Stack enxuta que entrega valor sem virar big data..." },
  { id: "p8", date: "2026-01-16", time: "09:00", title: "Como construímos nosso agente de IA", status: "publicado", accountId: "acc-2", pillar: "Produto", preview: "Arquitetura do motor Synkin..." },
  { id: "p9", date: "2026-01-15", time: "09:00", title: "Por que devs precisam entender de produto", status: "publicado", accountId: "acc-1", pillar: "Carreira", preview: "Lição que aprendi na prática..." },
  { id: "p10", date: "2026-01-14", time: "18:00", title: "Thread: 7 ferramentas de dados que uso todo dia", status: "publicado", accountId: "acc-1", pillar: "Ferramentas", preview: "Tooling de 2026 que virou padrão..." },
];

export const ideas = [
  { title: "Antes/depois: refatorar para event-driven", pillar: "Engenharia" },
  { title: "O que NÃO publicar no LinkedIn (mesmo parecendo boa ideia)", pillar: "Estratégia" },
  { title: "Case: como Synkin reduziu churn em 22% com onboarding ativo", pillar: "Produto" },
  { title: "Por que sua headline não está convertendo convites", pillar: "Perfil" },
  { title: "O fim do 'vender no LinkedIn' — como conduzir conversa que converte", pillar: "Outbound" },
  { title: "Erro de principiante: automatizar antes de posicionar", pillar: "Estratégia" },
];

// ============================================================
// COPILOTO DE ENGAJAMENTO
// ============================================================
export interface EngagementOpportunity {
  id: string;
  author: string;
  authorRole: string;
  authorFollowers: number;
  preview: string;
  reason: string;
  suggestedComment: string;
  type: "influenciador" | "pergunta_aberta" | "trend_setor";
  engagement: number;
}

export const engagementOpportunities: EngagementOpportunity[] = [
  {
    id: "op-1",
    author: "Carla Menezes",
    authorRole: "Head of Data · Magnet",
    authorFollowers: 38420,
    preview:
      "Depois de 3 anos construindo plataformas de dados, a lição mais cara que aprendi: pipelines quebram no contrato, não no código. Data contracts primeiro, código depois. Sempre.",
    reason: "Post com 4.2k reações · 312 comentários · tom aberto a debate técnico",
    suggestedComment:
      "Excelente ponto, Carla. Na nossa experiência o ponto mais subestimado costuma ser a governança dos schemas antes mesmo da parte técnica — versionamento + owner claro por domínio. Tem funcionado bem em times com 10+ produtores de dados.",
    type: "influenciador",
    engagement: 4200,
  },
  {
    id: "op-2",
    author: "Rafael Cordeiro",
    authorRole: "CTO · Plune",
    authorFollowers: 12480,
    preview:
      "Pergunta séria para o time técnico: qual foi a decisão arquitetural que mais te arrependeu em 2025? Vou começar: migrar para microserviços antes de ter observabilidade de verdade.",
    reason: "Pergunta aberta do seu nicho · 89 respostas em 2h · alcance alto",
    suggestedComment:
      "Topa compartilhar pra ajudar o debate? Na Synkin cometi o mesmo erro em 2022 — saí de um monólito saudável pra um distribuído sem tracing. Só estabilizou quando adotamos OpenTelemetry de baixo pra cima. Lição: observabilidade não é feature, é pré-requisito.",
    type: "pergunta_aberta",
    engagement: 1860,
  },
  {
    id: "op-3",
    author: "Diego Almeida",
    authorRole: "Eng. Sênior · Vortex",
    authorFollowers: 6240,
    preview:
      "Hot take: feature flags caseiras viram dívida em 6 meses. Use LaunchDarkly, Unleash ou similar. Não reinventa a roda.",
    reason: "Post polêmico do seu nicho · thread crescendo rápido",
    suggestedComment:
      "Concordo em 80%, discordo em 20%. Para times pequenos (até 5 devs) um toggle em config + audit log simples resolve e evita mais uma dependência. Pra 10+ devs, plataforma dedicada vira obrigatória — o problema é o meio termo.",
    type: "trend_setor",
    engagement: 940,
  },
  {
    id: "op-4",
    author: "Larissa Vilanova",
    authorRole: "VP Engineering · Loop",
    authorFollowers: 21340,
    preview:
      "Promovi 4 engenheiros a staff em 2025. O que separei eles dos demais: tomada de decisão técnica considerando produto, custo e prazo — não só a 'melhor' solução técnica.",
    reason: "Tema liderança técnica · audiência coincide com a sua · 1.2k reações",
    suggestedComment:
      "Excelente recorte, Larissa. Costumo chamar isso de 'alfabetização de trade-off' — e é o que mais falta em promoções. Tem um framework interno que usa pra avaliar isso? Seria ouro pra quem está construindo carreira de staff.",
    type: "influenciador",
    engagement: 1240,
  },
  {
    id: "op-5",
    author: "Camila Siqueira",
    authorRole: "Data Engineer · Freelance",
    authorFollowers: 3810,
    preview:
      "Dica rápida: se seu pipeline está lento, o problema raramente é o 'compute'. É o modelo de dados. 9 em 10 vezes, redesenhar 3 tabelas destrava 80% da performance.",
    reason: "Conteúdo evergreen do seu nicho · boa janela para fixar presença",
    suggestedComment:
      "Verdade. Adiciono um adendo: quando o modelo está certo e ainda tem gargalo, o próximo suspeito é o I/O entre estágios — paralelismo mal calibrado é vilão silencioso. Vale o post completo sobre isso?",
    type: "trend_setor",
    engagement: 620,
  },
];

// ============================================================
// INBOX / CRM
// ============================================================
export interface Conversation {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarColor: string;
  initials: string;
  temperature: LeadTemp;
  temperatureReason: string;
  intent: "interesse_comercial" | "networking" | "duvida" | "spam";
  score: number;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: "aguardando" | "respondido" | "fechado";
  messages: { from: "lead" | "user"; text: string; time: string }[];
  threadSummary: string;
  nextReplySuggestion: string;
  tags: string[];
  history: { type: string; date: string }[];
  nextAction: string;
  notes: string;
}

export const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Bruno Tavares",
    role: "Head of Growth · Plune",
    company: "Plune",
    avatarColor: "from-blue-500 to-cyan-500",
    initials: "BT",
    temperature: "quente",
    temperatureReason: "Pediu retorno sobre Synkin, mencionou budget aprovado p/ Q1",
    intent: "interesse_comercial",
    score: 87,
    lastMessage: "Topa uma call de 20min quinta? Quero entender o motor de IA.",
    lastTime: "14 min",
    unread: 2,
    status: "aguardando",
    messages: [
      { from: "lead", text: "Raniere, vi seu case sobre Synkin no post. Atendemos 30 PMEs B2B com prospecção fria — estamos queimando a marca com automação cega. Vocês atendem mercado BR?", time: "ontem 16:42" },
      { from: "user", text: "Bruno! Atendemos sim, 100% LATAM. O ponto que mais fez diferença pros clientes B2B foi exatamente esse: parar de automação cega e usar IA como copiloto, sempre com aprovação humana. Posso te mandar um case curto?", time: "ontem 17:05" },
      { from: "lead", text: "Manda! E se fizer sentido, topa uma call de 20min quinta? Quero entender o motor de IA.", time: "14 min" },
    ],
    threadSummary:
      "Lead quente com fit forte. Bruno viu conteúdo do Synkin, está com dor ativa (automação cega queimando marca), tem budget aprovado para Q1 e pediu call. Próximo passo: confirmar reunião quinta + enviar case curto personalizado.",
    nextReplySuggestion:
      "Bruno, perfeito! Quinta às 10:30 (BRT) funciona pra você? Mando invite em 2 minutos. E segue um case curto de um cliente B2B com 12 SDRs que estava no mesmo cenário que você: [link case]. Spoiler: o ganho não foi 'mais mensagens', foi 'mensagens certas + 0 queima de marca'.",
    tags: ["B2B", "budget Q1", "demo pedida", "ICP fit"],
    history: [
      { type: "Mensagem enviada", date: "ontem 17:05" },
      { type: "Lead abriu seu post", date: "ontem 15:20" },
      { type: "Lead visualizou perfil", date: "ontem 14:58" },
    ],
    nextAction: "Confirmar call quinta 10:30 + enviar case personalizado",
    notes: "Indicado pela Carla M. Pediu sigilo sobre o budget até fechar.",
  },
  {
    id: "c2",
    name: "Juliana Prado",
    role: "Head of Growth · Magnet",
    company: "Magnet",
    avatarColor: "from-violet-500 to-fuchsia-500",
    initials: "JP",
    temperature: "morno",
    temperatureReason: "Abriu 2 mensagens, respondeu 1. Pesquisa ativa no nicho.",
    intent: "interesse_comercial",
    score: 64,
    lastMessage: "Interessante! Vocês têm caso de uso em growth B2B?",
    lastTime: "1 h",
    unread: 1,
    status: "aguardando",
    messages: [
      { from: "lead", text: "Oi Raniere, tudo bem? Sou Juliana da Magnet. Vi seu post sobre LinkedIn + IA e curti o recorte 'humano no controle'. Faz sentido trocar uma ideia?", time: "ter 09:12" },
      { from: "user", text: "Juliana! Tudo ótimo. Adoraria. Você está olhando isso pra growth da Magnet mesmo, ou para um projeto paralelo?", time: "ter 09:40" },
      { from: "lead", text: "Interessante! Vocês têm caso de uso em growth B2B?", time: "1 h" },
    ],
    threadSummary:
      "Lead morno com bom fit. Juliana veio orgânica, demonstrou interesse no recorte 'humano no controle' (perfil ICP). Próximo passo: enviar case B2B + oferecer diagnóstico rápido de 15 min.",
    nextReplySuggestion:
      "Sim! Temos um case de uma HR Tech B2B que escalou 3x a taxa de resposta de outbound com Synkin, mantendo 0 incidentes de marca. Topa um diagnóstico de 15min do seu cenário? Em 15min eu já te mostro onde estão as maiores oportunidades.",
    tags: ["growth", "Magnet", "B2B", "indicação"],
    history: [
      { type: "Mensagem enviada", date: "ter 09:40" },
      { type: "Lead visualizou perfil", date: "ter 09:08" },
    ],
    nextAction: "Enviar case B2B + propor diagnóstico 15min",
    notes: "",
  },
  {
    id: "c3",
    name: "Camila Siqueira",
    role: "Data Engineer · Freelance",
    company: "Autônoma",
    avatarColor: "from-emerald-500 to-teal-500",
    initials: "CS",
    temperature: "morno",
    temperatureReason: "Engajou em 3 posts seus, veio com dúvida técnica genuína",
    intent: "networking",
    score: 58,
    lastMessage: "Tem algum material que você recomenda pra aprofundar em data contracts?",
    lastTime: "3 h",
    unread: 1,
    status: "aguardando",
    messages: [
      { from: "lead", text: "Raniere, vi seu comentário no post do Rafael sobre data contracts. Você tem material pra indicar? Tô montando um pipeline novo e quero evitar os erros clássicos.", time: "ontem 22:18" },
      { from: "user", text: "Camila! Sim. Te mando 3 referências (1 post longo meu, 1 thread do Andrew, 1 paper) + o template de schema review que a gente usa. Pode ser por aqui mesmo?", time: "ontem 23:02" },
      { from: "lead", text: "Pode! Tem algum material que você recomenda pra aprofundar em data contracts?", time: "3 h" },
    ],
    threadSummary:
      "Networking qualificado. Camila veio por conteúdo, tem dor técnica real (pipeline novo), engajou em 3 posts. Boa candidata a comentar em posts dela no futuro (reciprocidade).",
    nextReplySuggestion:
      "Fechou! 3 materiais + 1 template prático: 1) post longo 'Data contracts salvam seu pipeline' (meu, saio às 09:00 amanhã); 2) thread do Andrew Jones sobre schema evolution; 3) paper do Martin Kleppmann. Template de schema review: [link]. Avisa se travar em algo!",
    tags: ["data engineering", "conteúdo", "engajou 3 posts"],
    history: [
      { type: "Comentou em 3 posts seus", date: "últimos 7 dias" },
      { type: "Mensagem enviada", date: "ontem 23:02" },
    ],
    nextAction: "Enviar 3 referências + template",
    notes: "Possível co-autora de post futuro sobre data contracts.",
  },
  {
    id: "c4",
    name: "Diego Almeida",
    role: "Eng. Sênior · Vortex",
    company: "Vortex",
    avatarColor: "from-orange-500 to-rose-500",
    initials: "DA",
    temperature: "frio",
    temperatureReason: "Respondeu 1x, sem engajamento subsequente",
    intent: "networking",
    score: 32,
    lastMessage: "Valeu! Vou dar uma olhada.",
    lastTime: "2 dias",
    unread: 0,
    status: "respondido",
    messages: [
      { from: "lead", text: "Curti seu último post. Achei o ponto sobre feature flags caseiras bem polêmico. Você usa o quê hoje?", time: "qua 11:24" },
      { from: "user", text: "Diego! Polêmico mas vivido na pele kk. Hoje usamos Unleash self-hosted (custo zero + controle total). Antes era um toggle em config e quase virou incidente P1. Tu tá passando por isso?", time: "qua 12:10" },
      { from: "lead", text: "Na verdade sim, tô reavaliando nosso setup. Valeu! Vou dar uma olhada.", time: "2 dias" },
    ],
    threadSummary: "Networking frio. Diego respondeu mas sem sinal claro de próximo passo. Sem urgência no momento.",
    nextReplySuggestion:
      "(Sem ação imediata — acompanhar engajamento nas próximas 2 semanas antes de novo approach)",
    tags: ["engenharia", "sem urgência"],
    history: [
      { type: "Mensagem enviada", date: "qua 12:10" },
    ],
    nextAction: "Acompanhar — sem follow-up imediato",
    notes: "",
  },
  {
    id: "c5",
    name: "Larissa Vilanova",
    role: "VP Engineering · Loop",
    company: "Loop",
    avatarColor: "from-rose-500 to-pink-500",
    initials: "LV",
    temperature: "quente",
    temperatureReason: "Engajou em 2 posts, pediu troca de ideia sobre carreira staff",
    intent: "networking",
    score: 79,
    lastMessage: "Faz total sentido. Vamos marcar um café virtual?",
    lastTime: "5 h",
    unread: 1,
    status: "aguardando",
    messages: [
      { from: "lead", text: "Raniere, vi que você comenta bastante sobre carreira técnica. Tô revisando o programa de promoções aqui da Loop e queria te pedir uma opinião.", time: "ter 18:30" },
      { from: "user", text: "Larissa, adoraria ajudar. Topa uma conversa de 30min na próxima semana? Em troca posso te mandar o framework que a gente usa pra avaliar 'alfabetização de trade-off'.", time: "ter 19:45" },
      { from: "lead", text: "Faz total sentido. Vamos marcar um café virtual?", time: "5 h" },
    ],
    threadSummary: "Networking qualificado de alto valor. Larissa é VP, quer input sobre promoções — boa troca de valor. Possível abertura para Synkin no futuro.",
    nextReplySuggestion:
      "Perfeito! Tenho 3 janelas livres na semana que vem: terça 14h, quarta 10h ou quinta 16h. Qual te serve melhor? Te mando invite com 1 doc anexo (framework de trade-off) pra leitura prévia.",
    tags: ["VP Eng", "alto valor", "troca de ideia"],
    history: [
      { type: "Comentou em 2 posts seus", date: "últimos 14 dias" },
    ],
    nextAction: "Confirmar café virtual semana que vem",
    notes: "Indicadora em potencial pra Synkin (pode influenciar decisão em Loop).",
  },
  {
    id: "c6",
    name: "Marcelo Braga",
    role: "CEO · Lumin",
    company: "Lumin",
    avatarColor: "from-amber-500 to-orange-500",
    initials: "MB",
    temperature: "quente",
    temperatureReason: "Pediu demo, respondeu rápido, trouxe time na call",
    intent: "interesse_comercial",
    score: 92,
    lastMessage: "Fechado. Quarta às 15h com o time comercial.",
    lastTime: "1 dia",
    unread: 0,
    status: "respondido",
    messages: [
      { from: "lead", text: "Raniere, preciso de uma demo essa semana se possível. Estamos avaliando Synkin vs. duas outras ferramentas e o recorte de aprovação humana pesou muito.", time: "seg 10:00" },
      { from: "user", text: "Marcelo, fechado! Quarta às 15h? Convido meu time comercial e mando um doc de 1 página com os 3 pilares de Synkin. Funciona?", time: "seg 10:34" },
      { from: "lead", text: "Fechado. Quarta às 15h com o time comercial.", time: "1 dia" },
    ],
    threadSummary: "Lead super quente. Marcelo pediu demo, trouxe time. Próximo passo: call demo quarta 15h.",
    nextReplySuggestion: "(Sem ação — aguardando call demo de quarta)",
    tags: ["demo agendada", "lead quente", "comparando mercado"],
    history: [
      { type: "Call agendada", date: "quarta 15:00" },
      { type: "Doc enviado", date: "seg 10:35" },
    ],
    nextAction: "Call demo quarta 15h — preparar case HR Tech B2B",
    notes: "Cliente estratégico. Pediu NDA antes de compartilhar números.",
  },
  {
    id: "c7",
    name: "Helena Costa",
    role: "Recrutadora · Acme",
    company: "Acme Talent",
    avatarColor: "from-pink-500 to-purple-500",
    initials: "HC",
    temperature: "frio",
    temperatureReason: "Mensagem genérica, sem personalização",
    intent: "spam",
    score: 12,
    lastMessage: "Vi seu perfil e tenho uma oportunidade incrível para você!",
    lastTime: "3 dias",
    unread: 0,
    status: "fechado",
    messages: [
      { from: "lead", text: "Vi seu perfil e tenho uma oportunidade incrível para você! Vaga Sênior em startup americana, 100% remoto, USD acima do mercado. Topa conversar?", time: "3 dias" },
    ],
    threadSummary: "Mensagem genérica de recrutamento, sem personalização. Sugestão: descartar.",
    nextReplySuggestion: "(Sem ação — classificar como spam)",
    tags: ["recrutamento", "genérica"],
    history: [],
    nextAction: "Descartar / arquivar",
    notes: "",
  },
  {
    id: "c8",
    name: "André Salles",
    role: "CTO · Synapse",
    company: "Synapse",
    avatarColor: "from-indigo-500 to-blue-500",
    initials: "AS",
    temperature: "morno",
    temperatureReason: "Indicado por Bruno, ainda no primeiro contato",
    intent: "interesse_comercial",
    score: 56,
    lastMessage: "Valeu pela indicação! Vou olhar com calma essa semana.",
    lastTime: "1 dia",
    unread: 0,
    status: "respondido",
    messages: [
      { from: "lead", text: "Raniere, Bruno me passou seu contato. Somos uma startup B2B de 14 pessoas crescendo devagar no LinkedIn. Topa trocar uma ideia sobre estratégia?", time: "2 dias" },
      { from: "user", text: "André, Bruno é fera! Topo sim. Mandei meu calendário com 3 opções pra próxima semana. Antes da call, qual seu maior bloqueio hoje no LinkedIn?", time: "2 dias" },
      { from: "lead", text: "Valeu pela indicação! Vou olhar com calma essa semana.", time: "1 dia" },
    ],
    threadSummary: "Lead morno, indicado. André pediu tempo para avaliar. Próximo passo: follow-up em 5 dias úteis se não houver retorno.",
    nextReplySuggestion: "(Sem ação — follow-up em 5 dias úteis)",
    tags: ["indicado Bruno", "startup B2B"],
    history: [
      { type: "Indicação recebida", date: "2 dias" },
    ],
    nextAction: "Follow-up em 5 dias úteis se sem retorno",
    notes: "",
  },
  {
    id: "c9",
    name: "Patrícia Nogueira",
    role: "Marketing Lead · Zeta",
    company: "Zeta",
    avatarColor: "from-teal-500 to-emerald-500",
    initials: "PN",
    temperature: "quente",
    temperatureReason: "Veio por post sobre IA + marketing, quer partnership",
    intent: "networking",
    score: 74,
    lastMessage: "Amei a ideia! Topa marcar um brainstorming semana que vem?",
    lastTime: "6 h",
    unread: 1,
    status: "aguardando",
    messages: [
      { from: "lead", text: "Raniere, vi seu post sobre IA como copiloto (não bot) e fez total sentido. A gente na Zeta tem uma dor parecida em conteúdo. Topa explorar uma parceria?", time: "ontem 21:15" },
      { from: "user", text: "Patrícia, amei o recorte! Acho que tem sinergia real. Posso te mandar 2 cases curtos de co-marketing que funcionaram e a gente marca 30min pra explorar?", time: "ontem 22:30" },
      { from: "lead", text: "Amei a ideia! Topa marcar um brainstorming semana que vem?", time: "6 h" },
    ],
    threadSummary: "Networking qualificado. Patrícia quer explorar parceria de co-marketing. Bom fit e potencial mútuo.",
    nextReplySuggestion:
      "Fechado! Tenho terça 11h ou quinta 14h. Pra ir mais preparada, te mando antes: 1) meu último case de co-marketing (B2B + HR Tech, gerou 38 leads MQL); 2) recorte do público que mais engajou. Topa?",
    tags: ["parceria", "co-marketing", "alto valor"],
    history: [
      { type: "Lead abriu seu post", date: "ontem 20:30" },
    ],
    nextAction: "Confirmar brainstorming + enviar cases",
    notes: "",
  },
  {
    id: "c10",
    name: "Vinícius Tavares",
    role: "Analista Jr · Stone",
    company: "Stone",
    avatarColor: "from-cyan-500 to-blue-500",
    initials: "VT",
    temperature: "morno",
    temperatureReason: "Carreira júnior, veio com dúvida genuína",
    intent: "duvida",
    score: 48,
    lastMessage: "Faz sentido! Vou começar a aplicar hoje mesmo.",
    lastTime: "1 dia",
    unread: 0,
    status: "respondido",
    messages: [
      { from: "lead", text: "Raniere, tô no início da carreira e queria te pedir uma orientação. Como foi sua transição de dev júnior para o que você faz hoje? Tô meio perdido.", time: "3 dias" },
      { from: "user", text: "Vinícius, transição boa é feita de 3 coisas: 1) domínio técnico profundo em 1 área (não 5); 2) visibilidade do que você faz (escrever, falar, compartilhar); 3) relacionamento. Posso te mandar um post meu sobre isso?", time: "3 dias" },
      { from: "lead", text: "Faz sentido! Vou começar a aplicar hoje mesmo.", time: "1 dia" },
    ],
    threadSummary: "Carreira júnior, networking de longo prazo. Sem urgência comercial.",
    nextReplySuggestion: "(Sem ação — sem follow-up imediato, observar engajamento)",
    tags: ["carreira júnior", "sem urgência"],
    history: [
      { type: "Comentou em 1 post", date: "últimos 7 dias" },
    ],
    nextAction: "Sem follow-up imediato",
    notes: "",
  },
];

// ============================================================
// OUTBOUND
// ============================================================
export interface ProspectList {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  description: string;
}

export const prospectLists: ProspectList[] = [
  { id: "l1", name: "CTOs B2B SaaS — Brasil", size: 124, createdAt: "12 jan 2026", description: "CTOs, Heads of Eng e VPs em SaaS B2B com 20–200 funcionários" },
  { id: "l2", name: "Growth Leads — HR Tech LATAM", size: 48, createdAt: "08 jan 2026", description: "Heads e Leads de Growth em HR Techs e EdTechs" },
  { id: "l3", name: "VP Sales — Fintechs BR", size: 67, createdAt: "02 jan 2026", description: "VPs e Diretores comerciais em Fintechs brasileiras" },
];

export interface Prospect {
  id: string;
  name: string;
  role: string;
  company: string;
  city: string;
  fitScore: number;
  status: ProspectStatus;
  followers: number;
  reason: string;
  suggestedApproach: string;
  approachVariations: string[];
}

export const prospects: Prospect[] = [
  {
    id: "pr1",
    name: "Carla Menezes",
    role: "Head of Data · Magnet",
    company: "Magnet",
    city: "São Paulo, SP",
    fitScore: 92,
    status: "respondeu",
    followers: 38420,
    reason: "Já respondeu mensagem + demonstrou interesse em IA + recorte técnico forte",
    suggestedApproach:
      "Carla, acompanho seu trabalho na Magnet há meses — o recorte 'dados com governança' é raro. Estou construindo algo nessa linha (Synkin) e adoraria te mostrar. Topa 15min?",
    approachVariations: [
      "(Tom direto) Carla, seu post sobre data contracts salvou minha semana. Estou construindo IA para times comerciais com esse mesmo princípio de governança. Topa trocar uma ideia?",
      "(Tom storytelling) Vi seu último post e me veio uma memória boa de 2022, quando a gente passou pelo mesmo problema. A solução que encontrei virou o motor do Synkin. Posso te contar?",
      "(Tom provocador) Carla, hot take: 80% dos times de dados não precisa de mais ferramentas, precisa de aprovação humana em pipelines. Concorda?",
    ],
  },
  {
    id: "pr2",
    name: "Rafael Cordeiro",
    role: "CTO · Plune",
    company: "Plune",
    city: "Rio de Janeiro, RJ",
    fitScore: 88,
    status: "convite_enviado",
    followers: 12480,
    reason: "ICP perfeito (CTO SaaS B2B) + já engajou em posts",
    suggestedApproach:
      "Rafael, acompanho o crescimento da Plune — time pequeno, decisões cirúrgicas. Estou com um case curto de como um CTO SaaS similar reduziu 38% do custo de prospecção sem queimar marca. Mando?",
    approachVariations: [
      "(Tom direto) Rafael, sou Raniere (Synkin). Posso te mandar um case curto de 1 página? 2 min de leitura, decisão sua depois.",
      "(Tom técnico) Rafael, sobre o post de microserviços: a gente passou pelo mesmo em 2022. A solução virou produto. Topa 15min?",
      "(Tom curioso) Rafael, o que mais te desafia hoje no crescimento da Plune? Posso estar viajando, mas tenho algumas hipóteses.",
    ],
  },
  {
    id: "pr3",
    name: "Juliana Prado",
    role: "Head of Growth · Magnet",
    company: "Magnet",
    city: "São Paulo, SP",
    fitScore: 85,
    status: "aceitou",
    followers: 6010,
    reason: "Já aceitou convite + veio por conteúdo + ICP forte",
    suggestedApproach:
      "Juliana, valeu por aceitar! Mando aqui um case curto de uma HR Tech B2B que escalou 3x a resposta de outbound mantendo 0 incidentes. Topa olhar?",
    approachVariations: [],
  },
  {
    id: "pr4",
    name: "Felipe Andrade",
    role: "VP Sales · Loop",
    company: "Loop",
    city: "Belo Horizonte, MG",
    fitScore: 79,
    status: "nao_contactado",
    followers: 3210,
    reason: "ICP alto, não contactado ainda",
    suggestedApproach:
      "Felipe, vi a Loop crescendo no setor. Tenho um recorte que pode te interessar: 3 times comerciais B2B que triplicaram reuniões qualificadas sem aumentar volume de mensagens. Mando?",
    approachVariations: [
      "(Tom direto) Felipe, 1 case curto de 1 página. Se fizer sentido, 15min. Se não, sem problema.",
      "(Tom storytelling) Felipe, tô ajudando times como o seu a parar de queimar marca no LinkedIn. Topa 15min sem compromisso?",
    ],
  },
  {
    id: "pr5",
    name: "Renata Borges",
    role: "CEO · Nimble",
    company: "Nimble",
    city: "Florianópolis, SC",
    fitScore: 76,
    status: "nao_contactado",
    followers: 4520,
    reason: "CEO startup B2B, foco growth",
    suggestedApproach:
      "Renata, vi a Nimble crescer com consistência — fora do padrão de startup barulhenta. Tenho 1 insight sobre LinkedIn B2B que pode acelerar esse movimento. Mando?",
    approachVariations: [
      "(Tom direto) Renata, 1 pergunta antes de qualquer coisa: qual seu maior bloqueio no LinkedIn hoje?",
      "(Tom storytelling) Renata, tô escrevendo sobre outbound sem queima de marca. Topa ser uma das vozes do post?",
    ],
  },
  {
    id: "pr6",
    name: "Tiago Mendonça",
    role: "Head of Engineering · Pulse",
    company: "Pulse",
    city: "Curitiba, PR",
    fitScore: 72,
    status: "convite_enviado",
    followers: 2180,
    reason: "Convidado, aguardando aceite",
    suggestedApproach:
      "Tiago, manda um café virtual de 15min? Sobre engenharia + IA + comercial — sem pitch, só troca de ideia.",
    approachVariations: [],
  },
  {
    id: "pr7",
    name: "Mariana Costa",
    role: "CMO · Vector",
    company: "Vector",
    city: "São Paulo, SP",
    fitScore: 81,
    status: "respondeu",
    followers: 8740,
    reason: "Já respondeu, demonstrou interesse em parceria",
    suggestedApproach:
      "Mariana, topa um brainstorm de 30min sobre co-marketing B2B? Tenho 2 cases recentes que funcionaram bem.",
    approachVariations: [],
  },
  {
    id: "pr8",
    name: "Pedro Sampaio",
    role: "Founder · Kube",
    company: "Kube",
    city: "Recife, PE",
    fitScore: 68,
    status: "nao_contactado",
    followers: 1820,
    reason: "Founder early-stage, pode virar cliente / parceiro",
    suggestedApproach:
      "Pedro, vi o Kube entrando no mercado. Tenho 1 framework rápido que pode ajudar nos primeiros 100 clientes B2B. Mando?",
    approachVariations: [
      "(Tom direto) Pedro, 1 case curto + 15min. Sem compromisso.",
      "(Tom curioso) Pedro, o que mais te desafia no GTM early-stage?",
    ],
  },
];

export const outboundMetrics = {
  acceptanceRate: 38.4,
  responseRate: 22.1,
  followUpsPending: 14,
  sentThisWeek: 47,
};

// ============================================================
// RELATÓRIOS
// ============================================================
export const reportsData = {
  connectionsGrowth: [
    { month: "Jul", value: 980 },
    { month: "Ago", value: 1050 },
    { month: "Set", value: 1110 },
    { month: "Out", value: 1180 },
    { month: "Nov", value: 1220 },
    { month: "Dez", value: 1260 },
    { month: "Jan", value: 1284 },
  ],
  funnel: [
    { stage: "Impressões", value: 18420, color: "#0A66C2" },
    { stage: "Engajamento", value: 1240, color: "#3b82f6" },
    { stage: "Conexões", value: 84, color: "#60a5fa" },
    { stage: "Conversas", value: 32, color: "#8b5cf6" },
    { stage: "Leads quentes", value: 7, color: "#a78bfa" },
  ],
  channelBreakdown: [
    { name: "Posts orgânicos", value: 58 },
    { name: "Comentários", value: 22 },
    { name: "Outbound", value: 14 },
    { name: "Indicações", value: 6 },
  ],
};

// ============================================================
// TOASTS
// ============================================================
export const initialNotifications = [
  { id: "n1", text: "5 ações aguardando sua aprovação", type: "aprovacao" as const, time: "agora" },
  { id: "n2", text: "Bruno Tavares respondeu (lead quente)", type: "mensagem" as const, time: "14 min" },
  { id: "n3", text: "Post agendado para hoje 09:00", type: "agendamento" as const, time: "1 h" },
  { id: "n4", text: "Score de perfil subiu 4 pontos", type: "perfil" as const, time: "ontem" },
];

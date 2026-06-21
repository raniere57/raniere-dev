export type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'site' | 'telefone';
export type ConversationStatus = 'aberta' | 'aguardando' | 'resolvida';

export interface Message {
  id: string;
  sender: 'cliente' | 'agente' | 'ia';
  text: string;
  time: string;
  agentName?: string;
}

export interface Conversation {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientTags: string[];
  channel: Channel;
  status: ConversationStatus;
  lastMessage: string;
  lastTime: string;
  unread: number;
  slaBreached?: boolean;
  waitingMinutes?: number;
  messages: Message[];
  previousConversations: number;
  notes: string;
  assignedAgent: string;
}

export const conversations: Conversation[] = [
  {
    id: 'c1',
    clientName: 'Maria Silva',
    clientPhone: '+55 11 99234-5678',
    clientEmail: 'maria.silva@email.com',
    clientTags: ['VIP', 'Recorrente'],
    channel: 'whatsapp',
    status: 'aberta',
    lastMessage: 'Oi, quero saber sobre minha fatura do mês passado',
    lastTime: '09:43',
    unread: 3,
    slaBreached: false,
    waitingMinutes: 5,
    assignedAgent: 'Raniere',
    previousConversations: 7,
    notes: 'Cliente prefere atendimento rápido. Sempre resolve na primeira chamada.',
    messages: [
      { id: 'm1', sender: 'cliente', text: 'Olá, bom dia!', time: '09:30' },
      { id: 'm2', sender: 'ia', text: 'Bom dia! Sou o Agente de IA da Signal. Como posso ajudar você hoje?', time: '09:30', agentName: 'Agente IA' },
      { id: 'm3', sender: 'cliente', text: 'Preciso ver minha fatura do mês passado. Veio um valor diferente do normal.', time: '09:31' },
      { id: 'm4', sender: 'ia', text: 'Entendi! Vou verificar sua fatura agora. Pode me confirmar seu CPF ou número do contrato?', time: '09:31', agentName: 'Agente IA' },
      { id: 'm5', sender: 'cliente', text: 'CPF: 123.456.789-00', time: '09:32' },
      { id: 'm6', sender: 'ia', text: 'Localizei seu cadastro, Maria! Sua fatura de dezembro foi R$ 187,90 (valor normal: R$ 149,90). A diferença de R$ 38,00 refere-se a uma taxa de uso adicional de dados. Posso detalhar mais?', time: '09:33', agentName: 'Agente IA' },
      { id: 'm7', sender: 'cliente', text: 'Oi, quero saber sobre minha fatura do mês passado', time: '09:43' },
    ],
  },
  {
    id: 'c2',
    clientName: 'João Pedro Oliveira',
    clientPhone: '+55 21 98765-4321',
    clientEmail: 'joao.pedro@gmail.com',
    clientTags: ['Novo Cliente'],
    channel: 'instagram',
    status: 'aguardando',
    lastMessage: 'Tá, mas vocês têm um plano mais barato?',
    lastTime: '09:15',
    unread: 1,
    slaBreached: true,
    waitingMinutes: 28,
    assignedAgent: 'Fernanda',
    previousConversations: 1,
    notes: '',
    messages: [
      { id: 'm1', sender: 'cliente', text: 'Oi! Vi o anúncio de vocês no insta', time: '08:45' },
      { id: 'm2', sender: 'ia', text: 'Olá, João! Fico feliz que tenha nos encontrado! Qual plano te interessa?', time: '08:45', agentName: 'Agente IA' },
      { id: 'm3', sender: 'cliente', text: 'Quero saber o plano empresarial', time: '08:50' },
      { id: 'm4', sender: 'agente', text: 'Oi João! Sou a Fernanda. Nosso plano empresarial começa em R$ 299/mês com até 5 usuários. Quer que eu envie a proposta completa?', time: '08:55', agentName: 'Fernanda' },
      { id: 'm5', sender: 'cliente', text: 'Tá, mas vocês têm um plano mais barato?', time: '09:15' },
    ],
  },
  {
    id: 'c3',
    clientName: 'Ana Costa',
    clientPhone: '+55 31 97654-3210',
    clientEmail: 'ana.costa@empresa.com',
    clientTags: ['Suporte', 'Prioritário'],
    channel: 'site',
    status: 'aberta',
    lastMessage: 'O sistema ainda está fora do ar aqui',
    lastTime: '09:50',
    unread: 2,
    slaBreached: true,
    waitingMinutes: 45,
    assignedAgent: 'Lucas',
    previousConversations: 3,
    notes: 'Conta empresarial. Escalar para equipe técnica se necessário.',
    messages: [
      { id: 'm1', sender: 'cliente', text: 'Estou com problema no acesso ao painel', time: '09:00' },
      { id: 'm2', sender: 'ia', text: 'Olá Ana! Vou ajudar com o acesso. Qual erro está aparecendo na tela?', time: '09:00', agentName: 'Agente IA' },
      { id: 'm3', sender: 'cliente', text: 'Aparece "Erro 503 - Serviço indisponível"', time: '09:02' },
      { id: 'm4', sender: 'agente', text: 'Ana, sou o Lucas do suporte técnico. Estamos cientes de uma instabilidade. Nossa equipe está trabalhando na solução.', time: '09:10', agentName: 'Lucas' },
      { id: 'm5', sender: 'cliente', text: 'O sistema ainda está fora do ar aqui', time: '09:50' },
    ],
  },
  {
    id: 'c4',
    clientName: 'Carlos Mendes',
    clientPhone: '+55 41 96543-2109',
    clientEmail: 'carlos.mendes@hotmail.com',
    clientTags: ['Cancelamento'],
    channel: 'facebook',
    status: 'aguardando',
    lastMessage: 'Quero cancelar meu plano imediatamente',
    lastTime: '08:30',
    unread: 0,
    slaBreached: false,
    waitingMinutes: 12,
    assignedAgent: 'Fernanda',
    previousConversations: 12,
    notes: 'Cliente antigo, tentativa de retenção. Oferecer desconto de 20%.',
    messages: [
      { id: 'm1', sender: 'cliente', text: 'Quero cancelar meu plano imediatamente', time: '08:30' },
      { id: 'm2', sender: 'ia', text: 'Olá Carlos, lamento saber disso. Pode me contar o motivo? Gostaria de tentar resolver antes de processar o cancelamento.', time: '08:30', agentName: 'Agente IA' },
      { id: 'm3', sender: 'cliente', text: 'O serviço caiu 3 vezes esse mês', time: '08:32' },
      { id: 'm4', sender: 'ia', text: 'Entendo sua frustração, Carlos. Transferindo para um especialista de retenção que poderá oferecer uma solução adequada.', time: '08:33', agentName: 'Agente IA' },
    ],
  },
  {
    id: 'c5',
    clientName: 'Beatriz Santos',
    clientPhone: '+55 51 95432-1098',
    clientEmail: 'bia.santos@email.com',
    clientTags: ['VIP', 'B2B'],
    channel: 'whatsapp',
    status: 'resolvida',
    lastMessage: 'Ótimo! Muito obrigada pelo atendimento 😊',
    lastTime: '08:00',
    unread: 0,
    assignedAgent: 'Raniere',
    previousConversations: 15,
    notes: 'Gerente de TI da Nexcom. Prefere comunicação formal.',
    messages: [
      { id: 'm1', sender: 'cliente', text: 'Boa tarde! Preciso de uma nota fiscal da compra de ontem', time: '07:30' },
      { id: 'm2', sender: 'ia', text: 'Boa tarde, Beatriz! Claro, já localizei sua compra. Enviando a NF-e para seu e-mail cadastrado agora.', time: '07:31', agentName: 'Agente IA' },
      { id: 'm3', sender: 'cliente', text: 'Ótimo! Muito obrigada pelo atendimento 😊', time: '08:00' },
    ],
  },
  {
    id: 'c6',
    clientName: 'Rafael Almeida',
    clientPhone: '+55 62 94321-0987',
    clientEmail: 'rafael.almeida@email.com',
    clientTags: ['Suporte'],
    channel: 'telefone',
    status: 'aberta',
    lastMessage: 'Chamada ativa - 04:32',
    lastTime: '09:55',
    unread: 0,
    assignedAgent: 'Lucas',
    previousConversations: 2,
    notes: '',
    messages: [
      { id: 'm1', sender: 'agente', text: '[Chamada iniciada]', time: '09:51', agentName: 'Lucas' },
      { id: 'm2', sender: 'cliente', text: 'Alô? Preciso de ajuda com minha configuração de internet', time: '09:51' },
      { id: 'm3', sender: 'agente', text: 'Pois não, Rafael! Sou o Lucas. Vou ajudar com a configuração.', time: '09:52', agentName: 'Lucas' },
    ],
  },
  {
    id: 'c7',
    clientName: 'Juliana Ferreira',
    clientPhone: '+55 71 93210-9876',
    clientEmail: 'ju.ferreira@email.com',
    clientTags: ['Novo Cliente', 'Lead'],
    channel: 'instagram',
    status: 'aberta',
    lastMessage: 'Quanto custa o plano básico?',
    lastTime: '09:40',
    unread: 1,
    waitingMinutes: 15,
    assignedAgent: 'Fernanda',
    previousConversations: 0,
    notes: '',
    messages: [
      { id: 'm1', sender: 'cliente', text: 'Oi! Vi vocês no Instagram', time: '09:35' },
      { id: 'm2', sender: 'ia', text: 'Oi Juliana! Que bom! Como posso ajudar?', time: '09:35', agentName: 'Agente IA' },
      { id: 'm3', sender: 'cliente', text: 'Quanto custa o plano básico?', time: '09:40' },
    ],
  },
  {
    id: 'c8',
    clientName: 'Marcos Rocha',
    clientPhone: '+55 81 92109-8765',
    clientEmail: 'marcos.rocha@empresa.com.br',
    clientTags: ['Financeiro'],
    channel: 'facebook',
    status: 'aguardando',
    lastMessage: 'Meu boleto ainda não chegou no e-mail',
    lastTime: '09:20',
    unread: 2,
    waitingMinutes: 35,
    slaBreached: false,
    assignedAgent: 'Raniere',
    previousConversations: 4,
    notes: 'Solicita 2ª via de boletos frequentemente. Verificar e-mail cadastrado.',
    messages: [
      { id: 'm1', sender: 'cliente', text: 'Bom dia, preciso da 2ª via do boleto', time: '09:10' },
      { id: 'm2', sender: 'ia', text: 'Bom dia, Marcos! Vou gerar sua 2ª via agora. Para qual e-mail envio?', time: '09:10', agentName: 'Agente IA' },
      { id: 'm3', sender: 'cliente', text: 'marcos.rocha@empresa.com.br', time: '09:12' },
      { id: 'm4', sender: 'ia', text: 'Perfeito! 2ª via enviada com sucesso para seu e-mail.', time: '09:13', agentName: 'Agente IA' },
      { id: 'm5', sender: 'cliente', text: 'Meu boleto ainda não chegou no e-mail', time: '09:20' },
    ],
  },
];

export const contacts = [
  { id: '1', name: 'Maria Silva', phone: '+55 11 99234-5678', email: 'maria.silva@email.com', preferredChannel: 'whatsapp' as Channel, tags: ['VIP', 'Recorrente'], lastInteraction: '2025-01-15', conversations: 7 },
  { id: '2', name: 'João Pedro Oliveira', phone: '+55 21 98765-4321', email: 'joao.pedro@gmail.com', preferredChannel: 'instagram' as Channel, tags: ['Novo Cliente'], lastInteraction: '2025-01-15', conversations: 1 },
  { id: '3', name: 'Ana Costa', phone: '+55 31 97654-3210', email: 'ana.costa@empresa.com', preferredChannel: 'site' as Channel, tags: ['Suporte', 'Prioritário'], lastInteraction: '2025-01-15', conversations: 3 },
  { id: '4', name: 'Carlos Mendes', phone: '+55 41 96543-2109', email: 'carlos.mendes@hotmail.com', preferredChannel: 'facebook' as Channel, tags: ['Cancelamento'], lastInteraction: '2025-01-14', conversations: 12 },
  { id: '5', name: 'Beatriz Santos', phone: '+55 51 95432-1098', email: 'bia.santos@email.com', preferredChannel: 'whatsapp' as Channel, tags: ['VIP', 'B2B'], lastInteraction: '2025-01-15', conversations: 15 },
  { id: '6', name: 'Rafael Almeida', phone: '+55 62 94321-0987', email: 'rafael.almeida@email.com', preferredChannel: 'telefone' as Channel, tags: ['Suporte'], lastInteraction: '2025-01-15', conversations: 2 },
  { id: '7', name: 'Juliana Ferreira', phone: '+55 71 93210-9876', email: 'ju.ferreira@email.com', preferredChannel: 'instagram' as Channel, tags: ['Lead'], lastInteraction: '2025-01-15', conversations: 0 },
  { id: '8', name: 'Marcos Rocha', phone: '+55 81 92109-8765', email: 'marcos.rocha@empresa.com.br', preferredChannel: 'facebook' as Channel, tags: ['Financeiro'], lastInteraction: '2025-01-15', conversations: 4 },
  { id: '9', name: 'Patricia Lima', phone: '+55 85 91098-7654', email: 'patricia.lima@email.com', preferredChannel: 'whatsapp' as Channel, tags: ['VIP'], lastInteraction: '2025-01-13', conversations: 9 },
  { id: '10', name: 'Fernando Gomes', phone: '+55 92 90987-6543', email: 'fernando.gomes@email.com', preferredChannel: 'site' as Channel, tags: ['B2B'], lastInteraction: '2025-01-12', conversations: 6 },
];

export const campaigns = [
  {
    id: 'cp1',
    name: 'Promoção Janeiro 2025',
    channel: 'whatsapp' as Channel,
    status: 'concluída' as const,
    recipients: 1240,
    deliveryRate: 94.2,
    sent: 1240,
    delivered: 1168,
    read: 876,
    failed: 72,
    createdAt: '2025-01-10',
    scheduledAt: '2025-01-12 09:00',
  },
  {
    id: 'cp2',
    name: 'Reengajamento Clientes Inativos',
    channel: 'whatsapp' as Channel,
    status: 'enviando' as const,
    recipients: 580,
    deliveryRate: 88.5,
    sent: 420,
    delivered: 372,
    read: 210,
    failed: 48,
    createdAt: '2025-01-14',
    scheduledAt: '2025-01-15 10:00',
  },
  {
    id: 'cp3',
    name: 'Novidade: Plano Empresarial Plus',
    channel: 'instagram' as Channel,
    status: 'agendada' as const,
    recipients: 320,
    deliveryRate: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    createdAt: '2025-01-15',
    scheduledAt: '2025-01-17 14:00',
  },
  {
    id: 'cp4',
    name: 'Pesquisa de Satisfação Q4',
    channel: 'facebook' as Channel,
    status: 'rascunho' as const,
    recipients: 890,
    deliveryRate: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    createdAt: '2025-01-15',
    scheduledAt: '',
  },
  {
    id: 'cp5',
    name: 'Black Friday 2024',
    channel: 'whatsapp' as Channel,
    status: 'concluída' as const,
    recipients: 3200,
    deliveryRate: 96.8,
    sent: 3200,
    delivered: 3098,
    read: 2456,
    failed: 102,
    createdAt: '2024-11-25',
    scheduledAt: '2024-11-29 08:00',
  },
];

export const callHistory = [
  { id: 'ph1', name: 'Maria Silva', number: '+55 11 99234-5678', type: 'entrada' as const, duration: '04:32', time: '09:55', status: 'atendida' as const, agent: 'Raniere' },
  { id: 'ph2', name: 'Desconhecido', number: '+55 21 3456-7890', type: 'entrada' as const, duration: '00:45', time: '09:30', status: 'perdida' as const, agent: '-' },
  { id: 'ph3', name: 'Carlos Mendes', number: '+55 41 96543-2109', type: 'saída' as const, duration: '08:17', time: '09:00', status: 'atendida' as const, agent: 'Fernanda' },
  { id: 'ph4', name: 'Ana Costa', number: '+55 31 97654-3210', type: 'entrada' as const, duration: '12:04', time: '08:30', status: 'atendida' as const, agent: 'Lucas' },
  { id: 'ph5', name: 'Beatriz Santos', number: '+55 51 95432-1098', type: 'saída' as const, duration: '03:22', time: '08:00', status: 'atendida' as const, agent: 'Raniere' },
  { id: 'ph6', name: 'Desconhecido', number: '+55 62 9000-1234', type: 'entrada' as const, duration: '00:00', time: '07:45', status: 'perdida' as const, agent: '-' },
];

export const agentQueue = [
  { id: 'q1', name: 'Rafael Almeida', number: '+55 62 94321-0987', waitTime: '04:12', priority: 'alta' as const },
  { id: 'q2', name: 'Patricia Lima', number: '+55 85 91098-7654', waitTime: '02:30', priority: 'normal' as const },
  { id: 'q3', name: 'Fernando Gomes', number: '+55 92 90987-6543', waitTime: '01:05', priority: 'normal' as const },
];

export const agents = [
  { id: 'a1', name: 'Raniere', extension: '1001', status: 'disponível' as const, callsToday: 12 },
  { id: 'a2', name: 'Fernanda', extension: '1002', status: 'em chamada' as const, callsToday: 9 },
  { id: 'a3', name: 'Lucas', extension: '1003', status: 'em chamada' as const, callsToday: 7 },
  { id: 'a4', name: 'Agente IA', extension: 'IA-01', status: 'disponível' as const, callsToday: 34 },
];

export const aiLogs = [
  { id: 'ai1', time: '09:43', client: 'Maria Silva', channel: 'whatsapp', action: 'Verificou fatura', tool: 'consulta_fatura', transferred: false },
  { id: 'ai2', time: '09:35', client: 'Juliana Ferreira', channel: 'instagram', action: 'Apresentou planos', tool: 'catalogo_planos', transferred: false },
  { id: 'ai3', time: '09:10', client: 'Marcos Rocha', channel: 'facebook', action: 'Gerou 2ª via boleto', tool: 'gerar_boleto', transferred: false },
  { id: 'ai4', time: '08:45', client: 'João Pedro Oliveira', channel: 'instagram', action: 'Apresentou plano empresarial', tool: 'catalogo_planos', transferred: true },
  { id: 'ai5', time: '08:30', client: 'Carlos Mendes', channel: 'facebook', action: 'Tentou retenção', tool: 'retencao_clientes', transferred: true },
  { id: 'ai6', time: '08:00', client: 'Beatriz Santos', channel: 'whatsapp', action: 'Enviou NF-e', tool: 'emitir_nfe', transferred: false },
  { id: 'ai7', time: '07:30', client: 'Patricia Lima', channel: 'whatsapp', action: 'Agendou visita técnica', tool: 'agendamento', transferred: false },
];

export const knowledgeBases = [
  { id: 'kb1', name: 'Manual de Produtos e Planos', type: 'PDF', size: '2.4 MB', updated: '2025-01-10', status: 'ativo' },
  { id: 'kb2', name: 'FAQ - Perguntas Frequentes', type: 'Web', size: '-', updated: '2025-01-14', status: 'ativo' },
  { id: 'kb3', name: 'Tabela de Preços 2025', type: 'XLSX', size: '340 KB', updated: '2025-01-01', status: 'ativo' },
  { id: 'kb4', name: 'Políticas de Cancelamento', type: 'PDF', size: '890 KB', updated: '2024-12-15', status: 'ativo' },
  { id: 'kb5', name: 'Guia de Configuração de Equipamentos', type: 'PDF', size: '5.1 MB', updated: '2024-11-20', status: 'inativo' },
];

export const weeklyData = [
  { day: 'Seg', conversas: 87, resolvidas: 72 },
  { day: 'Ter', conversas: 103, resolvidas: 91 },
  { day: 'Qua', conversas: 94, resolvidas: 78 },
  { day: 'Qui', conversas: 118, resolvidas: 99 },
  { day: 'Sex', conversas: 132, resolvidas: 108 },
  { day: 'Sáb', conversas: 64, resolvidas: 58 },
  { day: 'Dom', conversas: 41, resolvidas: 38 },
];

export const channelData = [
  { name: 'WhatsApp', value: 42, color: '#25D366' },
  { name: 'Instagram', value: 23, color: '#E1306C' },
  { name: 'Facebook', value: 15, color: '#1877F2' },
  { name: 'Site', value: 13, color: '#94a3b8' },
  { name: 'Telefone', value: 7, color: '#f59e0b' },
];

export const reportData = {
  responseTime: [
    { canal: 'WhatsApp', tempo: 2.3 },
    { canal: 'Instagram', tempo: 4.1 },
    { canal: 'Facebook', tempo: 5.8 },
    { canal: 'Site', tempo: 1.9 },
    { canal: 'Telefone', tempo: 0.5 },
  ],
  csat: [
    { month: 'Out', score: 87 },
    { month: 'Nov', score: 89 },
    { month: 'Dez', score: 91 },
    { month: 'Jan', score: 93 },
  ],
  agentPerformance: [
    { name: 'Agente IA', resolvidas: 340, tempo: 1.2 },
    { name: 'Raniere', resolvidas: 89, tempo: 4.5 },
    { name: 'Fernanda', resolvidas: 76, tempo: 5.1 },
    { name: 'Lucas', resolvidas: 68, tempo: 4.8 },
  ],
};

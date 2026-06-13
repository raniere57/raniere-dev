import type { 
  Atendimento, Agente, Monitoria, ModeloAvaliacao, Criterio, 
  ScoreHistoryPoint, ChannelDistribution, TimelineItem 
} from '../types';

export const scoreHistory: ScoreHistoryPoint[] = [
  { dia: '01/01', score: 72 },
  { dia: '02/01', score: 74 },
  { dia: '03/01', score: 71 },
  { dia: '04/01', score: 76 },
  { dia: '05/01', score: 78 },
  { dia: '06/01', score: 75 },
  { dia: '07/01', score: 79 },
  { dia: '08/01', score: 81 },
  { dia: '09/01', score: 80 },
  { dia: '10/01', score: 82 },
  { dia: '11/01', score: 79 },
  { dia: '12/01', score: 83 },
  { dia: '13/01', score: 85 },
  { dia: '14/01', score: 84 },
];

export const channelDistribution: ChannelDistribution[] = [
  { canal: 'WhatsApp', quantidade: 482, cor: '#10b981' },
  { canal: 'Telefone', quantidade: 298, cor: '#06b6d4' },
  { canal: 'Chat', quantidade: 187, cor: '#8b5cf6' },
  { canal: 'E-mail', quantidade: 95, cor: '#f59e0b' },
];

const timelineExemplo: TimelineItem[] = [
  { id: '1', remetente: 'sistema', mensagem: 'Atendimento iniciado via WhatsApp', horario: '14:02' },
  { id: '2', remetente: 'cliente', mensagem: 'Olá, preciso de ajuda com o meu plano. Estou sendo cobrado incorretamente há 3 meses.', horario: '14:02' },
  { id: '3', remetente: 'agente', mensagem: 'Bom dia! Meu nome é Carolina, vou verificar isso para você. Poderia me informar seu CPF?', horario: '14:03' },
  { id: '4', remetente: 'cliente', mensagem: '123.456.789-00', horario: '14:03' },
  { id: '5', remetente: 'agente', mensagem: 'Obrigada! Identifiquei sua conta. Vejo que houve uma alteração no plano no mês passado que pode ter gerado essa cobrança. Vou solicitar o estorno dos valores incorretos.', horario: '14:05' },
  { id: '6', remetente: 'cliente', mensagem: 'Ótimo, muito obrigado! Quanto tempo leva o estorno?', horario: '14:05' },
  { id: '7', remetente: 'agente', mensagem: 'O estorno será processado em até 5 dias úteis. Também vou aplicar um desconto de cortesia pela inconveniência. Mais alguma coisa que posso ajudar?', horario: '14:06' },
  { id: '8', remetente: 'cliente', mensagem: 'Não, é só isso. Obrigado pela ajuda!', horario: '14:07' },
  { id: '9', remetente: 'agente', mensagem: 'Por nada! Se precisar de qualquer coisa, estamos à disposição. Tenha um ótimo dia!', horario: '14:07' },
  { id: '10', remetente: 'sistema', mensagem: 'Atendimento encerrado pelo agente', horario: '14:07' },
];

export const atendimentos: Atendimento[] = [
  {
    id: 'at-001', protocolo: 'SAT-2024-001421', cliente: 'Marcela Andrade', canal: 'WhatsApp',
    agente: 'Carolina Mendes', agenteId: 'ag-003', setor: 'Financeiro', data: '14/01/2024', duracao: '5min',
    statusAnalise: 'concluída', scoreIA: 92, risco: 'baixo',
    resumoIA: 'Atendimento exemplar. Agente identificou rapidamente o problema de cobrança, ofereceu solução e aplicou cortesia. Cliente satisfeito.',
    sentimento: 'positivo', intencao: 'Reclamação de cobrança',
    problemas: [], pontosPositivos: ['Saudação adequada', 'Identificação rápida do problema', 'Oferta de cortesia', 'Encerramento educado'],
    pontosMelhoria: ['Poderia informar prazo de estorno de forma proativa'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 100, peso: 10 }, { criterio: 'Identificação do cliente', score: 100, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 95, peso: 15 }, { criterio: 'Empatia', score: 90, peso: 15 },
      { criterio: 'Resolução do problema', score: 95, peso: 20 }, { criterio: 'Oferta correta de solução', score: 90, peso: 10 },
      { criterio: 'Script obrigatório', score: 85, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 100, peso: 10 },
      { criterio: 'Encerramento adequado', score: 95, peso: 5 }
    ],
    sugestaoFeedback: 'Excelente atendimento! Destaque para a proatividade na oferta de cortesia. Sugestão: antecipar informações sobre prazos de estorno sem que o cliente precise perguntar.',
    timeline: timelineExemplo,
  },
  {
    id: 'at-002', protocolo: 'SAT-2024-001422', cliente: 'Ricardo Farias', canal: 'Telefone',
    agente: 'Thiago Rocha', agenteId: 'ag-001', setor: 'Suporte Técnico', data: '14/01/2024', duracao: '12min',
    statusAnalise: 'concluída', scoreIA: 67, risco: 'médio',
    resumoIA: 'Atendimento com falhas. Agente não seguiu o script de identificação e forneceu informação incorreta sobre configuração do roteador.',
    sentimento: 'negativo', intencao: 'Suporte técnico',
    problemas: ['Informação incorreta sobre configuração', 'Não seguiu script de identificação'],
    pontosPositivos: ['Tom de voz adequado', 'Tentou ajudar'],
    pontosMelhoria: ['Seguir script de identificação', 'Verificar informações antes de repassar', 'Não interromper o cliente'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 70, peso: 10 }, { criterio: 'Identificação do cliente', score: 40, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 65, peso: 15 }, { criterio: 'Empatia', score: 70, peso: 15 },
      { criterio: 'Resolução do problema', score: 50, peso: 20 }, { criterio: 'Oferta correta de solução', score: 45, peso: 10 },
      { criterio: 'Script obrigatório', score: 30, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 20, peso: 10 },
      { criterio: 'Encerramento adequado', score: 80, peso: 5 }
    ],
    sugestaoFeedback: 'Thiago, atenção ao script de identificação — é obrigatório em todos os atendimentos. A informação sobre a configuração do roteador estava incorreta. Sempre valide no knowledge base antes de orientar o cliente.',
    timeline: [],
  },
  {
    id: 'at-003', protocolo: 'SAT-2024-001423', cliente: 'Ana Paula Torres', canal: 'Chat',
    agente: 'Juliana Costa', agenteId: 'ag-002', setor: 'Comercial', data: '14/01/2024', duracao: '8min',
    statusAnalise: 'concluída', scoreIA: 88, risco: 'baixo',
    resumoIA: 'Bom atendimento comercial. Agente apresentou planos com clareza e conseguiu a conversão. Pequena falha no encerramento.',
    sentimento: 'positivo', intencao: 'Interesse em upgrade de plano',
    problemas: ['Encerramento sem confirmar se cliente precisava de mais algo'],
    pontosPositivos: ['Apresentação clara dos planos', 'Usou argumentos de valor', 'Conseguiu conversão'],
    pontosMelhoria: ['Melhorar o encerramento', 'Oferecer serviços adicionais'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 95, peso: 10 }, { criterio: 'Identificação do cliente', score: 90, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 90, peso: 15 }, { criterio: 'Empatia', score: 85, peso: 15 },
      { criterio: 'Resolução do problema', score: 90, peso: 20 }, { criterio: 'Oferta correta de solução', score: 95, peso: 10 },
      { criterio: 'Script obrigatório', score: 80, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 95, peso: 10 },
      { criterio: 'Encerramento adequado', score: 60, peso: 5 }
    ],
    sugestaoFeedback: 'Ótimo trabalho na conversão! Lembre-se sempre de confirmar se o cliente precisa de mais alguma coisa antes de encerrar. Considere oferecer serviços complementares.',
    timeline: [],
  },
  {
    id: 'at-004', protocolo: 'SAT-2024-001424', cliente: 'Pedro Henrique Lima', canal: 'WhatsApp',
    agente: 'Rafael Almeida', agenteId: 'ag-004', setor: 'Retenção', data: '13/01/2024', duracao: '15min',
    statusAnalise: 'concluída', scoreIA: 45, risco: 'crítico',
    resumoIA: 'Atendimento crítico. Agente foi indelicado, não ofereceu alternativas de retenção e não seguiu nenhuma etapa do script obrigatório.',
    sentimento: 'negativo', intencao: 'Cancelamento de serviço',
    problemas: ['Tom agressivo com o cliente', 'Não ofereceu alternativas', 'Script de retenção ignorado', 'Não aplicou desconto oferecido pela política'],
    pontosPositivos: [],
    pontosMelhoria: ['Seguir script de retenção', 'Manter tom empático', 'Oferecer alternativas antes de processar cancelamento', 'Aplicar benefícios conforme política'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 30, peso: 10 }, { criterio: 'Identificação do cliente', score: 50, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 40, peso: 15 }, { criterio: 'Empatia', score: 15, peso: 15 },
      { criterio: 'Resolução do problema', score: 20, peso: 20 }, { criterio: 'Oferta correta de solução', score: 10, peso: 10 },
      { criterio: 'Script obrigatório', score: 0, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 60, peso: 10 },
      { criterio: 'Encerramento adequado', score: 25, peso: 5 }
    ],
    sugestaoFeedback: 'Atendimento crítico que exige revisão urgente. O script de retenção é obrigatório e deve ser seguido em todos os casos. Recomendo treinamento imediato em gestão de conflitos e retenção.',
    timeline: [],
  },
  {
    id: 'at-005', protocolo: 'SAT-2024-001425', cliente: 'Beatriz Santos', canal: 'E-mail',
    agente: 'Carolina Mendes', agenteId: 'ag-003', setor: 'Financeiro', data: '13/01/2024', duracao: '18min',
    statusAnalise: 'concluída', scoreIA: 85, risco: 'baixo',
    resumoIA: 'Bom atendimento por e-mail. Resposta completa e profissional. Tempo de resposta dentro do SLA.',
    sentimento: 'neutro', intencao: 'Solicitação de 2ª via de fatura',
    problemas: [],
    pontosPositivos: ['Resposta completa', 'Profissionalismo', 'Dentro do SLA'],
    pontosMelhoria: ['Poderia antecipar perguntas frequentes'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 95, peso: 10 }, { criterio: 'Identificação do cliente', score: 90, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 90, peso: 15 }, { criterio: 'Empatia', score: 80, peso: 15 },
      { criterio: 'Resolução do problema', score: 90, peso: 20 }, { criterio: 'Oferta correta de solução', score: 85, peso: 10 },
      { criterio: 'Script obrigatório', score: 85, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 95, peso: 10 },
      { criterio: 'Encerramento adequado', score: 90, peso: 5 }
    ],
    sugestaoFeedback: 'Bom trabalho na resposta por e-mail. Considere incluir informações sobre canais de autoatendimento para reduzir demandas futuras.',
    timeline: [],
  },
  {
    id: 'at-006', protocolo: 'SAT-2024-001426', cliente: 'Felipe Martins', canal: 'Telefone',
    agente: 'Thiago Rocha', agenteId: 'ag-001', setor: 'Suporte Técnico', data: '13/01/2024', duracao: '22min',
    statusAnalise: 'em análise', scoreIA: 72, risco: 'médio',
    resumoIA: 'Atendimento longo com resolução parcial. Agente precisou escalar para 2º nível mas não comunicou ao cliente adequadamente.',
    sentimento: 'misto', intencao: 'Problema de conexão',
    problemas: ['Não comunicou escalation ao cliente', 'Deu informações conflitantes'],
    pontosPositivos: ['Persistência em resolver', 'Documentou o caso'],
    pontosMelhoria: ['Comunicar transferências', 'Manter coerência nas informações'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 85, peso: 10 }, { criterio: 'Identificação do cliente', score: 75, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 55, peso: 15 }, { criterio: 'Empatia', score: 70, peso: 15 },
      { criterio: 'Resolução do problema', score: 60, peso: 20 }, { criterio: 'Oferta correta de solução', score: 65, peso: 10 },
      { criterio: 'Script obrigatório', score: 60, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 50, peso: 10 },
      { criterio: 'Encerramento adequado', score: 70, peso: 5 }
    ],
    sugestaoFeedback: 'Quando for escalar um atendimento, sempre explique ao cliente o que está acontecendo e o prazo esperado. Informações conflitantes geram frustração.',
    timeline: [],
  },
  {
    id: 'at-007', protocolo: 'SAT-2024-001427', cliente: 'Camila Rodrigues', canal: 'WhatsApp',
    agente: 'Juliana Costa', agenteId: 'ag-002', setor: 'Comercial', data: '12/01/2024', duracao: '6min',
    statusAnalise: 'concluída', scoreIA: 91, risco: 'baixo',
    resumoIA: 'Excelente atendimento comercial. Apresentação personalizada, argumentação eficaz e fechamento natural.',
    sentimento: 'positivo', intencao: 'Contratação de serviço',
    problemas: [],
    pontosPositivos: ['Apresentação personalizada', 'Argumentação eficaz', 'Fechamento natural', 'Follow-up prometido'],
    pontosMelhoria: [],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 100, peso: 10 }, { criterio: 'Identificação do cliente', score: 95, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 95, peso: 15 }, { criterio: 'Empatia', score: 90, peso: 15 },
      { criterio: 'Resolução do problema', score: 90, peso: 20 }, { criterio: 'Oferta correta de solução', score: 95, peso: 10 },
      { criterio: 'Script obrigatório', score: 85, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 95, peso: 10 },
      { criterio: 'Encerramento adequado', score: 90, peso: 5 }
    ],
    sugestaoFeedback: 'Excelente! A personalização da apresentação fez toda a diferença. Continue usando essa abordagem.',
    timeline: [],
  },
  {
    id: 'at-008', protocolo: 'SAT-2024-001428', cliente: 'Lucas Ferreira', canal: 'Chat',
    agente: 'Rafael Almeida', agenteId: 'ag-004', setor: 'Retenção', data: '12/01/2024', duracao: '10min',
    statusAnalise: 'concluída', scoreIA: 58, risco: 'alto',
    resumoIA: 'Atendimento abaixo do esperado. Agente não aplicou os descontos autorizados e demorou a responder.',
    sentimento: 'negativo', intencao: 'Ameaça de cancelamento',
    problemas: ['Não aplicou desconto autorizado', 'Tempo de resposta lento', 'Não demonstrou empatia'],
    pontosPositivos: ['Identificou o cliente corretamente'],
    pontosMelhoria: ['Aplicar benefícios conforme política', 'Melhorar tempo de resposta', 'Demonstrar empatia'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 60, peso: 10 }, { criterio: 'Identificação do cliente', score: 90, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 50, peso: 15 }, { criterio: 'Empatia', score: 30, peso: 15 },
      { criterio: 'Resolução do problema', score: 40, peso: 20 }, { criterio: 'Oferta correta de solução', score: 35, peso: 10 },
      { criterio: 'Script obrigatório', score: 25, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 70, peso: 10 },
      { criterio: 'Encerramento adequado', score: 50, peso: 5 }
    ],
    sugestaoFeedback: 'Rafael, é fundamental aplicar os descontos autorizados pela política de retenção. O tempo de resposta no chat precisa melhorar — o SLA é de 2 minutos.',
    timeline: [],
  },
  {
    id: 'at-009', protocolo: 'SAT-2024-001429', cliente: 'Isabela Nascimento', canal: 'Telefone',
    agente: 'Carolina Mendes', agenteId: 'ag-003', setor: 'Financeiro', data: '12/01/2024', duracao: '7min',
    statusAnalise: 'pendente', scoreIA: 0, risco: 'médio',
  },
  {
    id: 'at-010', protocolo: 'SAT-2024-001430', cliente: 'Gustavo Barbosa', canal: 'WhatsApp',
    agente: 'Thiago Rocha', agenteId: 'ag-001', setor: 'Suporte Técnico', data: '11/01/2024', duracao: '9min',
    statusAnalise: 'concluída', scoreIA: 78, risco: 'baixo',
    resumoIA: 'Atendimento satisfatório. Resolução adequada com pequenos desvios do script.',
    sentimento: 'neutro', intencao: 'Dúvida sobre configuração',
    problemas: ['Pequeno desvio do script'],
    pontosPositivos: ['Resolução rápida', 'Tom adequado'],
    pontosMelhoria: ['Seguir script com mais rigor'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 85, peso: 10 }, { criterio: 'Identificação do cliente', score: 80, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 80, peso: 15 }, { criterio: 'Empatia', score: 75, peso: 15 },
      { criterio: 'Resolução do problema', score: 85, peso: 20 }, { criterio: 'Oferta correta de solução', score: 80, peso: 10 },
      { criterio: 'Script obrigatório', score: 60, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 85, peso: 10 },
      { criterio: 'Encerramento adequado', score: 80, peso: 5 }
    ],
    sugestaoFeedback: 'Bom atendimento. Atenção ao script obrigatório — mesmo desvios pequenos podem impactar a conformidade.',
    timeline: [],
  },
  {
    id: 'at-011', protocolo: 'SAT-2024-001431', cliente: 'Mariana Silva', canal: 'E-mail',
    agente: 'Juliana Costa', agenteId: 'ag-002', setor: 'Comercial', data: '11/01/2024', duracao: '25min',
    statusAnalise: 'concluída', scoreIA: 82, risco: 'baixo',
    resumoIA: 'Atendimento comercial por e-mail com boa qualificação e proposta adequada.',
    sentimento: 'neutro', intencao: 'Solicitação de proposta',
    problemas: [], pontosPositivos: ['Proposta detalhada', 'Qualificação completa'], pontosMelhoria: ['Reduzir tempo de resposta'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 90, peso: 10 }, { criterio: 'Identificação do cliente', score: 85, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 85, peso: 15 }, { criterio: 'Empatia', score: 75, peso: 15 },
      { criterio: 'Resolução do problema', score: 80, peso: 20 }, { criterio: 'Oferta correta de solução', score: 85, peso: 10 },
      { criterio: 'Script obrigatório', score: 80, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 90, peso: 10 },
      { criterio: 'Encerramento adequado', score: 80, peso: 5 }
    ],
    sugestaoFeedback: 'Boa qualificação e proposta. Tente reduzir o tempo de resposta para e-mails comerciais.',
    timeline: [],
  },
  {
    id: 'at-012', protocolo: 'SAT-2024-001432', cliente: 'Diego Oliveira', canal: 'Chat',
    agente: 'Rafael Almeida', agenteId: 'ag-004', setor: 'Retenção', data: '10/01/2024', duracao: '14min',
    statusAnalise: 'concluída', scoreIA: 52, risco: 'alto',
    resumoIA: 'Atendimento insatisfatório. Agente não conseguiu reter o cliente e foi pouco empático.',
    sentimento: 'negativo', intencao: 'Cancelamento',
    problemas: ['Falha na retenção', 'Pouca empatia', 'Não ofereceu alternativas'],
    pontosPositivos: ['Registrou o cancelamento corretamente'],
    pontosMelhoria: ['Aplicar técnicas de retenção', 'Demonstrar empatia', 'Oferecer alternativas'],
    scoresCriterios: [
      { criterio: 'Saudação adequada', score: 55, peso: 10 }, { criterio: 'Identificação do cliente', score: 70, peso: 10 },
      { criterio: 'Clareza na comunicação', score: 45, peso: 15 }, { criterio: 'Empatia', score: 25, peso: 15 },
      { criterio: 'Resolução do problema', score: 35, peso: 20 }, { criterio: 'Oferta correta de solução', score: 30, peso: 10 },
      { criterio: 'Script obrigatório', score: 20, peso: 5 }, { criterio: 'Ausência de informações incorretas', score: 75, peso: 10 },
      { criterio: 'Encerramento adequado', score: 55, peso: 5 }
    ],
    sugestaoFeedback: 'Rafael, é essencial tentar reter o cliente oferecendo alternativas antes de processar o cancelamento. Revise o script de retenção.',
    timeline: [],
  },
];

export const agentes: Agente[] = [
  {
    id: 'ag-001', nome: 'Thiago Rocha', iniciais: 'TR', scoreMedio: 72, atendimentosAvaliados: 156,
    pontosFortes: ['Resolução técnica', 'Documentação de casos', 'Persistência'],
    pontosMelhoria: ['Seguir scripts', 'Verificar informações', 'Comunicação com cliente durante escalation'],
    tendencia: 'estável', alertas: ['2 atendimentos com informação incorreta esta semana'],
    scoreHistorico: [68, 70, 69, 72, 71, 73, 72],
    principaisErros: ['Informação incorreta', 'Script não seguido', 'Falta de comunicação em escalation'],
    principaisElogios: ['Persistência', 'Documentação', 'Conhecimento técnico'],
    recomendacoesTreinamento: ['Comunicação em transferências', 'Verificação de informações no KB', 'Scripts obrigatórios'],
  },
  {
    id: 'ag-002', nome: 'Juliana Costa', iniciais: 'JC', scoreMedio: 87, atendimentosAvaliados: 203,
    pontosFortes: ['Apresentação de planos', 'Argumentação comercial', 'Conversão', 'Personalização'],
    pontosMelhoria: ['Encerramento', 'Oferta de serviços adicionais'],
    tendencia: 'subindo', alertas: [],
    scoreHistorico: [82, 84, 85, 86, 87, 88, 87],
    principaisErros: ['Encerramento sem confirmação', 'Não oferece upsell'],
    principaisElogios: ['Conversão alta', 'Personalização', 'Clareza'],
    recomendacoesTreinamento: ['Técnicas de encerramento', 'Cross-sell e upsell'],
  },
  {
    id: 'ag-003', nome: 'Carolina Mendes', iniciais: 'CM', scoreMedio: 89, atendimentosAvaliados: 178,
    pontosFortes: ['Empatia', 'Profissionalismo', 'Resolução ágil', 'Comunicação clara'],
    pontosMelhoria: ['Antecipar informações ao cliente'],
    tendencia: 'subindo', alertas: [],
    scoreHistorico: [85, 86, 87, 88, 89, 90, 89],
    principaisErros: ['Não antecipa prazos de estorno'],
    principaisElogios: ['Excelente empatia', 'Comunicação exemplar', 'Proatividade'],
    recomendacoesTreinamento: ['Comunicação proativa de prazos e processos'],
  },
  {
    id: 'ag-004', nome: 'Rafael Almeida', iniciais: 'RA', scoreMedio: 52, atendimentosAvaliados: 134,
    pontosFortes: ['Registro de processos', 'Identificação de clientes'],
    pontosMelhoria: ['Empatia', 'Seguir scripts de retenção', 'Tempo de resposta', 'Tom com clientes'],
    tendencia: 'descendo', alertas: ['3 atendimentos críticos este mês', 'Taxa de retenção abaixo de 30%', 'Reclamações de clientes'],
    scoreHistorico: [58, 56, 55, 53, 52, 50, 52],
    principaisErros: ['Ignora script de retenção', 'Tom indelicado', 'Não aplica benefícios autorizados', 'Tempo de resposta alto'],
    principaisElogios: ['Identificação correta', 'Registros precisos'],
    recomendacoesTreinamento: ['Gestão de conflitos (urgente)', 'Script de retenção (urgente)', 'Empatia no atendimento', 'SLA de resposta'],
  },
  {
    id: 'ag-005', nome: 'Amanda Ribeiro', iniciais: 'AR', scoreMedio: 81, atendimentosAvaliados: 145,
    pontosFortes: ['Clareza', 'Organização', 'Follow-up'],
    pontosMelhoria: ['Velocidade de resolução'],
    tendencia: 'subindo', alertas: [],
    scoreHistorico: [76, 78, 79, 80, 81, 82, 81],
    principaisErros: ['Demora na resolução'],
    principaisElogios: ['Clareza exemplar', 'Follow-up consistente', 'Organização'],
    recomendacoesTreinamento: ['Técnicas de resolução ágil'],
  },
  {
    id: 'ag-006', nome: 'Bruno Cardoso', iniciais: 'BC', scoreMedio: 76, atendimentosAvaliados: 167,
    pontosFortes: ['Conhecimento técnico', 'Paciência', 'Didática'],
    pontosMelhoria: ['Empatia', 'Seguir scripts'],
    tendencia: 'estável', alertas: ['1 script não seguido esta semana'],
    scoreHistorico: [74, 75, 75, 76, 77, 76, 76],
    principaisErros: ['Desvia do script', 'Pouca empatia em reclamações'],
    principaisElogios: ['Excelente didática', 'Paciência com clientes', 'Conhecimento profundo'],
    recomendacoesTreinamento: ['Gestão de emoções', 'Aderência a scripts'],
  },
  {
    id: 'ag-007', nome: 'Larissa Santos', iniciais: 'LS', scoreMedio: 83, atendimentosAvaliados: 112,
    pontosFortes: ['Comunicação', 'Resolução', 'Proatividade'],
    pontosMelhoria: ['Documentação de casos'],
    tendencia: 'subindo', alertas: [],
    scoreHistorico: [78, 80, 81, 82, 83, 84, 83],
    principaisErros: ['Documentação incompleta'],
    principaisElogios: ['Proatividade', 'Comunicação excelente', 'Resolução eficaz'],
    recomendacoesTreinamento: ['Documentação de casos no CRM'],
  },
  {
    id: 'ag-008', nome: 'Fernando Dias', iniciais: 'FD', scoreMedio: 69, atendimentosAvaliados: 98,
    pontosFortes: ['Velocidade', 'Agilidade'],
    pontosMelhoria: ['Qualidade da informação', 'Empatia', 'Encerramento'],
    tendencia: 'descendo', alertas: ['Aumento de reclamações nos últimos 7 dias'],
    scoreHistorico: [74, 73, 72, 71, 70, 69, 69],
    principaisErros: ['Informação superficial', 'Encerramento apressado', 'Pouca empatia'],
    principaisElogios: ['Agilidade', 'Velocidade de atendimento'],
    recomendacoesTreinamento: ['Qualidade sobre velocidade', 'Empatia no atendimento', 'Técnicas de encerramento'],
  },
];

export const monitorias: Monitoria[] = [
  {
    id: 'mon-001', nome: 'Monitoria Semanal - Financeiro', modelo: 'Atendimento Geral', canal: 'WhatsApp',
    fila: 'Financeiro', qtdAvaliados: 87, status: 'concluída', ultimaExecucao: '14/01/2024', scoreMedio: 82,
  },
  {
    id: 'mon-002', nome: 'Auditoria Retenção - Janeiro', modelo: 'Retenção', canal: 'Todos',
    fila: 'Retenção', qtdAvaliados: 134, status: 'em execução', ultimaExecucao: '14/01/2024', scoreMedio: 58,
  },
  {
    id: 'mon-003', nome: 'Qualidade Comercial Q1', modelo: 'Atendimento Comercial', canal: 'Telefone',
    fila: 'Comercial', qtdAvaliados: 56, status: 'concluída', ultimaExecucao: '12/01/2024', scoreMedio: 87,
  },
  {
    id: 'mon-004', nome: 'Suporte Técnico - Diária', modelo: 'Suporte Técnico', canal: 'Chat',
    fila: 'Suporte N1', qtdAvaliados: 23, status: 'em execução', ultimaExecucao: '14/01/2024', scoreMedio: 74,
  },
  {
    id: 'mon-005', nome: 'Cobrança - Mensal', modelo: 'Cobrança', canal: 'Telefone',
    fila: 'Cobrança', qtdAvaliados: 0, status: 'agendada', ultimaExecucao: '01/02/2024', scoreMedio: 0,
  },
  {
    id: 'mon-006', nome: 'Revisão Geral - Semanal', modelo: 'Atendimento Geral', canal: 'Todos',
    fila: 'Todos', qtdAvaliados: 245, status: 'concluída', ultimaExecucao: '10/01/2024', scoreMedio: 79,
  },
];

export const modelosAvaliacao: ModeloAvaliacao[] = [
  {
    id: 'mod-001', nome: 'Atendimento Comercial', descricao: 'Modelo para avaliação de atendimentos comerciais com foco em conversão e qualidade da apresentação.',
    pesoTotal: 100, status: 'publicado', versao: '2.1',
    criterios: [
      { id: 'c-001', nome: 'Saudação adequada', peso: 10, instrucaoIA: 'Verificar se o agente realizou saudação inicial conforme padrão.', exemplosAprovacao: ['Bom dia! Meu nome é...', 'Olá, como posso ajudar?'], exemplosReprovacao: ['Oi', 'Fala'], severidade: 'média' },
      { id: 'c-002', nome: 'Identificação correta do cliente', peso: 10, instrucaoIA: 'Verificar se o agente solicitou e confirmou dados de identificação.', exemplosAprovacao: ['Poderia informar seu CPF?', 'Confirmando: seu nome é...'], exemplosReprovacao: ['Me conta seu problema', 'O que você quer?'], severidade: 'alta' },
      { id: 'c-003', nome: 'Clareza na comunicação', peso: 15, instrucaoIA: 'Avaliar se o agente se comunicou de forma clara e objetiva.', exemplosAprovacao: ['O plano custa R$89/mês e inclui...'], exemplosReprovacao: ['É tipo assim, mais ou menos...'], severidade: 'alta' },
      { id: 'c-004', nome: 'Empatia', peso: 15, instrucaoIA: 'Verificar se o agente demonstrou empatia e compreensão.', exemplosAprovacao: ['Entendo sua preocupação...', 'Compreendo a situação'], exemplosReprovacao: ['Isso é política da empresa', 'Não posso fazer nada'], severidade: 'alta' },
      { id: 'c-005', nome: 'Apresentação de planos', peso: 20, instrucaoIA: 'Avaliar se o agente apresentou planos de forma personalizada e completa.', exemplosAprovacao: ['Baseado no seu perfil, recomendo o plano...'], exemplosReprovacao: ['Tem esse plano aí'], severidade: 'crítica' },
      { id: 'c-006', nome: 'Oferta correta de solução', peso: 10, instrucaoIA: 'Verificar se a solução oferecida é adequada e correta.', exemplosAprovacao: ['Para sua necessidade, o ideal é...'], exemplosReprovacao: ['Pega qualquer um'], severidade: 'crítica' },
      { id: 'c-007', nome: 'Script obrigatório', peso: 5, instrucaoIA: 'Verificar cumprimento do script obrigatório de comercial.', exemplosAprovacao: ['Seguindo nosso processo, vou...'], exemplosReprovacao: ['Vou direto ao ponto'], severidade: 'média' },
      { id: 'c-008', nome: 'Ausência de informações incorretas', peso: 10, instrucaoIA: 'Verificar se não houve informação incorreta ou enganosa.', exemplosAprovacao: ['Informação confirmada no sistema'], exemplosReprovacao: ['Acho que é isso', 'Não tenho certeza mas...'], severidade: 'crítica' },
      { id: 'c-009', nome: 'Encerramento adequado', peso: 5, instrucaoIA: 'Verificar se o encerramento seguiu o padrão.', exemplosAprovacao: ['Mais alguma coisa que posso ajudar?'], exemplosReprovacao: ['Tchau', 'Pronto'], severidade: 'baixa' },
    ],
  },
  {
    id: 'mod-002', nome: 'Suporte Técnico', descricao: 'Modelo para avaliação de atendimentos de suporte técnico com foco em resolução e precisão.',
    pesoTotal: 100, status: 'publicado', versao: '1.4',
    criterios: [
      { id: 'c-010', nome: 'Saudação adequada', peso: 8, instrucaoIA: 'Verificar saudação inicial.', exemplosAprovacao: ['Bom dia! Suporte técnico, como posso ajudar?'], exemplosReprovacao: ['Suporte'], severidade: 'média' },
      { id: 'c-011', nome: 'Identificação correta do cliente', peso: 10, instrucaoIA: 'Verificar identificação e número do contrato.', exemplosAprovacao: ['Poderia informar seu número de contrato?'], exemplosReprovacao: ['Me fala o problema'], severidade: 'alta' },
      { id: 'c-012', nome: 'Diagnóstico do problema', peso: 20, instrucaoIA: 'Avaliar se o agente realizou diagnóstico completo antes de sugerir solução.', exemplosAprovacao: ['Vou verificar alguns pontos... Qual é o modelo do equipamento?'], exemplosReprovacao: ['Reinicia que funciona'], severidade: 'crítica' },
      { id: 'c-013', nome: 'Clareza nas instruções', peso: 15, instrucaoIA: 'Avaliar se as instruções técnicas foram claras e passo a passo.', exemplosAprovacao: ['Primeiro, acesse as configurações. Depois, clique em...'], exemplosReprovacao: ['É só mexer lá nas config'], severidade: 'alta' },
      { id: 'c-014', nome: 'Precisão da informação', peso: 20, instrucaoIA: 'Verificar se as informações técnicas repassadas estavam corretas.', exemplosAprovacao: ['Conforme documentação, o procedimento é...'], exemplosReprovacao: ['Acho que é assim', 'Não sei ao certo'], severidade: 'crítica' },
      { id: 'c-015', nome: 'Resolução do problema', peso: 15, instrucaoIA: 'Verificar se o problema foi resolvido ou adequadamente escalado.', exemplosAprovacao: ['O problema foi resolvido. Precisa de mais alguma coisa?'], exemplosReprovacao: ['Vou ter que transferir, não sei resolver'], severidade: 'crítica' },
      { id: 'c-016', nome: 'Script obrigatório', peso: 5, instrucaoIA: 'Verificar cumprimento do script de suporte.', exemplosAprovacao: ['Conforme nosso processo, vou...'], exemplosReprovacao: ['Deixa eu ver aqui'], severidade: 'média' },
      { id: 'c-017', nome: 'Encerramento adequado', peso: 7, instrucaoIA: 'Verificar encerramento com confirmação de resolução.', exemplosAprovacao: ['O problema está resolvido? Posso ajudar em mais algo?'], exemplosReprovacao: ['Então é isso'], severidade: 'média' },
    ],
  },
  {
    id: 'mod-003', nome: 'Cobrança', descricao: 'Modelo para avaliação de atendimentos de cobrança com foco em negociação e conformidade.',
    pesoTotal: 100, status: 'publicado', versao: '1.2',
    criterios: [
      { id: 'c-018', nome: 'Saudação adequada', peso: 8, instrucaoIA: 'Verificar saudação.', exemplosAprovacao: ['Bom dia! Departamento de cobrança.'], exemplosReprovacao: ['Cobrança'], severidade: 'média' },
      { id: 'c-019', nome: 'Identificação do débito', peso: 15, instrucaoIA: 'Verificar se o agente identificou e apresentou o débito corretamente.', exemplosAprovacao: ['Consta em aberto o valor de R$... referente a...'], exemplosReprovacao: ['Você tá devendo'], severidade: 'crítica' },
      { id: 'c-020', nome: 'Oferta de negociação', peso: 25, instrucaoIA: 'Avaliar se o agente ofereceu alternativas de negociação conforme política.', exemplosAprovacao: ['Podemos oferecer parcelamento em até...'], exemplosReprovacao: ['Tem que pagar à vista'], severidade: 'crítica' },
      { id: 'c-021', nome: 'Empatia e respeito', peso: 15, instrucaoIA: 'Verificar se o agente manteve tom respeitoso e empático.', exemplosAprovacao: ['Entendo que este é um momento difícil...'], exemplosReprovacao: ['O senhor precisa pagar'], severidade: 'crítica' },
      { id: 'c-022', nome: 'Conformidade regulatória', peso: 20, instrucaoIA: 'Verificar conformidade com regulamentações de cobrança.', exemplosAprovacao: ['Conforme o Código de Defesa do Consumidor...'], exemplosReprovacao: ['Vamos incluir em órgão de proteção'], severidade: 'crítica' },
      { id: 'c-023', nome: 'Acordo registrado', peso: 10, instrucaoIA: 'Verificar se o acordo foi devidamente registrado no sistema.', exemplosAprovacao: ['Estou registrando o acordo: parcela de R$... até...'], exemplosReprovacao: ['Está combinado'], severidade: 'alta' },
      { id: 'c-024', nome: 'Encerramento adequado', peso: 7, instrucaoIA: 'Verificar encerramento com resumo do acordo.', exemplosAprovacao: ['Para confirmar: o acordo é de... até...'], exemplosReprovacao: ['Ok, tchau'], severidade: 'média' },
    ],
  },
  {
    id: 'mod-004', nome: 'Retenção', descricao: 'Modelo para avaliação de atendimentos de retenção com foco em salvar o cliente e aplicar políticas de benefícios.',
    pesoTotal: 100, status: 'rascunho', versao: '3.0-beta',
    criterios: [
      { id: 'c-025', nome: 'Saudação adequada', peso: 5, instrucaoIA: 'Verificar saudação.', exemplosAprovacao: ['Bom dia! Entendo que deseja cancelar. Vou verificar como posso ajudar.'], exemplosReprovacao: ['Cancelamento?'], severidade: 'média' },
      { id: 'c-026', nome: 'Escuta ativa', peso: 15, instrucaoIA: 'Avaliar se o agente ouviu e compreendeu o motivo do cancelamento.', exemplosAprovacao: ['Entendo que o motivo principal é... É isso?'], exemplosReprovacao: ['Ok, vou cancelar'], severidade: 'crítica' },
      { id: 'c-027', nome: 'Oferta de alternativas', peso: 25, instrucaoIA: 'Verificar se o agente ofereceu alternativas antes de processar cancelamento.', exemplosAprovacao: ['Antes de cancelar, gostaria de oferecer...'], exemplosReprovacao: ['Não tem como reverter'], severidade: 'crítica' },
      { id: 'c-028', nome: 'Aplicação de benefícios', peso: 20, instrucaoIA: 'Verificar se o agente aplicou descontos/benefícios conforme política.', exemplosAprovacao: ['Posso oferecer 30% de desconto por 3 meses...'], exemplosReprovacao: ['Não tenho desconto'], severidade: 'crítica' },
      { id: 'c-029', nome: 'Empatia', peso: 15, instrucaoIA: 'Verificar demonstração de empatia.', exemplosAprovacao: ['Valorizamos muito sua permanência...'], exemplosReprovacao: ['Se quiser cancelar, cancela'], severidade: 'crítica' },
      { id: 'c-030', nome: 'Script de retenção', peso: 10, instrucaoIA: 'Verificar cumprimento do script de retenção.', exemplosAprovacao: ['Conforme nossa política de retenção, posso oferecer...'], exemplosReprovacao: ['Vou processar o cancelamento'], severidade: 'alta' },
      { id: 'c-031', nome: 'Encerramento adequado', peso: 10, instrucaoIA: 'Verificar encerramento com resumo e próximos passos.', exemplosAprovacao: ['O benefício será aplicado na próxima fatura. Posso ajudar em mais algo?'], exemplosReprovacao: ['Pronto'], severidade: 'média' },
    ],
  },
  {
    id: 'mod-005', nome: 'Atendimento Geral', descricao: 'Modelo padrão para avaliação de atendimentos gerais de qualquer natureza.',
    pesoTotal: 100, status: 'publicado', versao: '2.0',
    criterios: [
      { id: 'c-032', nome: 'Saudação adequada', peso: 10, instrucaoIA: 'Verificar saudação inicial.', exemplosAprovacao: ['Bom dia! Como posso ajudar?'], exemplosReprovacao: ['Oi'], severidade: 'média' },
      { id: 'c-033', nome: 'Identificação correta do cliente', peso: 10, instrucaoIA: 'Verificar identificação.', exemplosAprovacao: ['Poderia confirmar seus dados?'], exemplosReprovacao: ['O que precisa?'], severidade: 'alta' },
      { id: 'c-034', nome: 'Clareza na comunicação', peso: 15, instrucaoIA: 'Avaliar clareza da comunicação.', exemplosAprovacao: ['Vou verificar isso para você...'], exemplosReprovacao: ['É o seguinte...'], severidade: 'alta' },
      { id: 'c-035', nome: 'Empatia', peso: 15, instrucaoIA: 'Verificar demonstração de empatia.', exemplosAprovacao: ['Entendo sua situação...'], exemplosReprovacao: ['Isso é regra'], severidade: 'alta' },
      { id: 'c-036', nome: 'Resolução do problema', peso: 20, instrucaoIA: 'Verificar se o problema foi resolvido.', exemplosAprovacao: ['Sua solicitação foi atendida.'], exemplosReprovacao: ['Não consegui resolver'], severidade: 'crítica' },
      { id: 'c-037', nome: 'Oferta correta de solução', peso: 10, instrucaoIA: 'Verificar se a solução oferecida era correta.', exemplosAprovacao: ['A solução para seu caso é...'], exemplosReprovacao: ['Tenta aí e veja se funciona'], severidade: 'crítica' },
      { id: 'c-038', nome: 'Script obrigatório', peso: 5, instrucaoIA: 'Verificar script.', exemplosAprovacao: ['Conforme nosso procedimento...'], exemplosReprovacao: ['Vou fazer do meu jeito'], severidade: 'média' },
      { id: 'c-039', nome: 'Ausência de informações incorretas', peso: 10, instrucaoIA: 'Verificar precisão das informações.', exemplosAprovacao: ['Informação validada no sistema'], exemplosReprovacao: ['Acho que é isso'], severidade: 'crítica' },
      { id: 'c-040', nome: 'Encerramento adequado', peso: 5, instrucaoIA: 'Verificar encerramento.', exemplosAprovacao: ['Mais alguma coisa que posso ajudar?'], exemplosReprovacao: ['Falou'], severidade: 'baixa' },
    ],
  },
];

export const criterios: Criterio[] = [
  { id: 'c-001', nome: 'Saudação adequada', categoria: 'Comunicação', pesoSugerido: 10, severidade: 'média', usadoEmModelos: 5, status: 'ativo' },
  { id: 'c-002', nome: 'Identificação correta do cliente', categoria: 'Processo', pesoSugerido: 10, severidade: 'alta', usadoEmModelos: 4, status: 'ativo' },
  { id: 'c-003', nome: 'Clareza na comunicação', categoria: 'Comunicação', pesoSugerido: 15, severidade: 'alta', usadoEmModelos: 5, status: 'ativo' },
  { id: 'c-004', nome: 'Empatia', categoria: 'Comportamento', pesoSugerido: 15, severidade: 'alta', usadoEmModelos: 5, status: 'ativo' },
  { id: 'c-005', nome: 'Resolução do problema', categoria: 'Resultado', pesoSugerido: 20, severidade: 'crítica', usadoEmModelos: 4, status: 'ativo' },
  { id: 'c-006', nome: 'Oferta correta de solução', categoria: 'Resultado', pesoSugerido: 10, severidade: 'crítica', usadoEmModelos: 3, status: 'ativo' },
  { id: 'c-007', nome: 'Cumprimento de script obrigatório', categoria: 'Conformidade', pesoSugerido: 5, severidade: 'média', usadoEmModelos: 5, status: 'ativo' },
  { id: 'c-008', nome: 'Ausência de informações incorretas', categoria: 'Conformidade', pesoSugerido: 10, severidade: 'crítica', usadoEmModelos: 4, status: 'ativo' },
  { id: 'c-009', nome: 'Encerramento adequado', categoria: 'Comunicação', pesoSugerido: 5, severidade: 'baixa', usadoEmModelos: 5, status: 'ativo' },
  { id: 'c-010', nome: 'Diagnóstico do problema', categoria: 'Processo', pesoSugerido: 20, severidade: 'crítica', usadoEmModelos: 1, status: 'ativo' },
  { id: 'c-011', nome: 'Oferta de negociação', categoria: 'Resultado', pesoSugerido: 25, severidade: 'crítica', usadoEmModelos: 1, status: 'ativo' },
  { id: 'c-012', nome: 'Conformidade regulatória', categoria: 'Conformidade', pesoSugerido: 20, severidade: 'crítica', usadoEmModelos: 1, status: 'ativo' },
  { id: 'c-013', nome: 'Escuta ativa', categoria: 'Comportamento', pesoSugerido: 15, severidade: 'crítica', usadoEmModelos: 1, status: 'ativo' },
  { id: 'c-014', nome: 'Aplicação de benefícios', categoria: 'Processo', pesoSugerido: 20, severidade: 'crítica', usadoEmModelos: 1, status: 'ativo' },
  { id: 'c-015', nome: 'Tempo de resposta no SLA', categoria: 'Eficiência', pesoSugerido: 10, severidade: 'alta', usadoEmModelos: 2, status: 'ativo' },
  { id: 'c-016', nome: 'Registro no CRM', categoria: 'Processo', pesoSugerido: 5, severidade: 'média', usadoEmModelos: 3, status: 'inativo' },
];

export const aiInsights = [
  { id: '1', tipo: 'alerta' as const, titulo: 'Risco na equipe de Retenção', descricao: 'O score médio da equipe de Retenção caiu 12% nos últimos 7 dias. Rafael Almeida representa 68% dos atendimentos críticos.' },
  { id: '2', tipo: 'oportunidade' as const, titulo: 'Padrão de erro recorrente', descricao: '73% dos atendimentos com falha têm o critério "Script obrigatório" como não atendido. Considere revisar a forma como os scripts são apresentados aos agentes.' },
  { id: '3', tipo: 'melhoria' as const, titulo: 'Oportunidade de treinamento', descricao: 'Agentes que completaram o módulo de empatia têm score 23% superior. Recomenda-se treinamento obrigatório para a equipe de Retenção.' },
  { id: '4', tipo: 'sucesso' as const, titulo: 'Melhora no canal WhatsApp', descricao: 'O score médio de atendimentos via WhatsApp aumentou 8% após a implementação do novo modelo de avaliação.' },
  { id: '5', tipo: 'alerta' as const, titulo: 'SLA de chat em risco', descricao: 'O tempo médio de resposta no chat ultrapassou o SLA em 40% dos atendimentos da última semana.' },
];

export const monthlyQuality = [
  { mes: 'Ago', score: 71 },
  { mes: 'Set', score: 73 },
  { mes: 'Out', score: 76 },
  { mes: 'Nov', score: 78 },
  { mes: 'Dez', score: 80 },
  { mes: 'Jan', score: 82 },
];

export const qualityByChannel = [
  { canal: 'WhatsApp', score: 84 },
  { canal: 'Telefone', score: 72 },
  { canal: 'Chat', score: 76 },
  { canal: 'E-mail', score: 85 },
];

export const qualityBySetor = [
  { setor: 'Comercial', score: 87 },
  { setor: 'Financeiro', score: 82 },
  { setor: 'Suporte Técnico', score: 74 },
  { setor: 'Retenção', score: 55 },
  { setor: 'Cobrança', score: 71 },
];

export const criteriosMaisReprovados = [
  { criterio: 'Script obrigatório', reprovações: 42 },
  { criterio: 'Empatia', reprovações: 31 },
  { criterio: 'Oferta de alternativas', reprovações: 28 },
  { criterio: 'Encerramento adequado', reprovações: 24 },
  { criterio: 'Informações incorretas', reprovações: 19 },
  { criterio: 'Identificação do cliente', reprovações: 15 },
];

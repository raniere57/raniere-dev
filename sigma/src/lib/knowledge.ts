// Base de conhecimento — conteúdo operacional que ajuda os agentes de IA a
// explicar e agir certo no atendimento. Estrutura reusável: alimenta a tela de
// Base de Conhecimento hoje e pode virar contexto/tool das LLMs depois.
//
// Categoria "Wiki do ERP": fatos extraídos da wiki oficial do ERP ERP
// (wiki.erp.com.br), o sistema usado pela NovaConecta.

export type KnowledgeSource = { label: string; url?: string };

export type KnowledgeArticle = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  /** O que o agente deve fazer com isso no atendimento. */
  agentHint?: string;
  source?: KnowledgeSource;
};

export type KnowledgeCategory = {
  id: string;
  name: string;
  description: string;
  articles: KnowledgeArticle[];
};

const WIKI = "https://wiki.erp.com.br/pt-br";

export const KNOWLEDGE_BASE: KnowledgeCategory[] = [
  {
    id: "wiki-erp",
    name: "Wiki do ERP",
    description:
      "Conhecimento do ERP ERP (sistema da NovaConecta). Define o significado de status, regras financeiras e fluxos — para o agente explicar e agir com precisão.",
    articles: [
      {
        id: "status-servico",
        title: "Status do serviço — o que cada um significa",
        summary:
          "O status do serviço diz se o cliente tem internet e por quê. É a primeira coisa a checar quando alguém reclama de acesso.",
        points: [
          "Habilitado: plano ativo, cliente com acesso à internet e cobrado normalmente.",
          "Suspenso por débito: cortado por falta de pagamento; no faturamento o sistema cobra só o proporcional dos dias usados (não cobra os dias suspenso). Cliente fica sem acesso até regularizar ou usar desbloqueio de confiança.",
          "Suspenso parcialmente / suspensão temporária: serviço pausado por um período.",
          "Bloqueado: acesso bloqueado (em geral por débito); pode permitir desbloqueio de confiança.",
          "Cancelado: serviço encerrado; não entra no faturamento.",
          "Aguardando (instalação, configuração, liberação, assinatura de contrato, migração): estados temporários antes do serviço ficar ativo.",
        ],
        agentHint:
          "Se o cliente diz 'estou sem internet', confira o status antes de tratar como suporte técnico. Suspenso/bloqueado por débito = causa financeira: direcione para regularizar a fatura ou desbloqueio de confiança, não abra ordem de serviço de 'internet caiu'.",
        source: { label: "Status do Serviço", url: `${WIKI}/modulos/configuracao/geral/servico_status` },
      },
      {
        id: "faturas-situacao",
        title: "Faturas — situações e ações possíveis",
        summary: "Toda fatura tem uma situação e um conjunto de ações que o atendimento pode tomar.",
        points: [
          "Situações: em aberto, paga, vencida, cancelada/inativa.",
          "Ações no ERP: receber, receber via cartão, visualizar, editar, prorrogar, ver histórico, enviar por e-mail, enviar por SMS, imprimir.",
          "Prorrogar fatura adia o vencimento (Financeiro do cliente > fatura > Ações > Prorrogar).",
          "Não é possível prorrogar uma fatura vinculada a uma renegociação que ainda não foi finalizada.",
        ],
        agentHint:
          "Segunda via = reenviar/visualizar a fatura em aberto. Liste débitos com vencimento e valor antes de qualquer ação. Prorrogação é uma alternativa quando o cliente não consegue pagar na data.",
        source: { label: "Financeiro do Cliente", url: `${WIKI}/modulos/cliente/consultar/financeiro_cliente` },
      },
      {
        id: "pagamento",
        title: "Formas de pagamento (boleto, PIX, cartão)",
        summary: "Como o cliente pode pagar e o que acontece depois.",
        points: [
          "Aceitos: boleto bancário, PIX e cartão.",
          "PIX: o QR Code fica no boleto e na Central do Assinante; após o pagamento a baixa é automática.",
          "PIX Automático: débito recorrente na data acordada (ideal para mensalidade).",
          "Cartão: opção 'receber via cartão'.",
        ],
        agentHint:
          "Ao enviar a 2ª via, separe em blocos: link/PDF do boleto, PIX copia-e-cola e linha digitável. Pagamento por PIX dá baixa automática — a conexão tende a restabelecer sozinha logo após o pagamento.",
        source: { label: "Integrações PIX", url: `${WIKI}/modulos/configuracao/integracao/pix` },
      },
      {
        id: "desbloqueio-confianca",
        title: "Desbloqueio de confiança",
        summary: "Libera o serviço por um período mesmo com débito em aberto, para o cliente pagar com acesso.",
        points: [
          "Permite desbloquear o serviço até uma data, dentro do limite do perfil de suspensão do cliente.",
          "Autoatendimento: o próprio cliente faz pelo aplicativo (opção 'Auto Desbloqueio' no menu) ou pela Central do Assinante.",
          "As regras (dias permitidos e quais status liberam) ficam no Perfil de Suspensão. Em geral só vale para serviços 'Suspenso Parcialmente' ou 'Suspenso por Débito'.",
        ],
        agentHint:
          "Se o cliente bloqueado quer acesso enquanto paga, verifique elegibilidade antes de prometer. Se elegível, ofereça o desbloqueio (ou oriente o autodesbloqueio no app/central) e explique a validade em dias. Se inelegível, explique o motivo (ex.: limite do mês já usado).",
        source: { label: "Serviços do Cliente", url: `${WIKI}/modulos/cliente/consultar/servicos_cliente` },
      },
      {
        id: "suspensao",
        title: "Suspensão e perfil de suspensão",
        summary: "Como e por que o serviço é suspenso, e a cobrança nesse período.",
        points: [
          "Suspensão por débito: automática por falta de pagamento.",
          "Suspensão temporária: a pedido, por um período.",
          "Faturamento de suspenso por débito: cobra apenas o proporcional aos dias efetivamente usados.",
          "O Perfil de Suspensão define as regras de bloqueio e de desbloqueio de confiança do cliente.",
        ],
        agentHint:
          "Use isso para explicar cobranças proporcionais e os limites de desbloqueio sem prometer o que o perfil não permite.",
        source: { label: "Perfil de Suspensão", url: `${WIKI}/modulos/configuracao/geral/perfil_suspensao` },
      },
      {
        id: "atendimento-os",
        title: "Atendimentos e Ordens de Serviço (OS)",
        summary: "Como o contato vira protocolo e quando gera uma OS.",
        points: [
          "Um atendimento registra o contato do cliente e gera um protocolo.",
          "Toda OS está vinculada a um atendimento, mas nem todo atendimento gera OS.",
          "Existem tipos de OS (ex.: mudança de endereço abre uma OS específica).",
          "Se o atendimento é fechado antes de preencher tudo, vira rascunho — mantendo o protocolo já gerado.",
          "O cliente também pode abrir atendimento pelo próprio aplicativo, se o provedor habilitar.",
        ],
        agentHint:
          "Sempre informe o número de protocolo ao cliente. Evite OS duplicada: se já existe atendimento aberto para o caso, informe o andamento em vez de abrir outro.",
        source: { label: "Atendimentos", url: `${WIKI}/modulos/atendimento-e-os/atendimentos` },
      },
      {
        id: "conexao",
        title: "Conexão (online/offline) e reinício de equipamento",
        summary: "O que dá para fazer remotamente depende do equipamento estar online.",
        points: [
          "O sistema mostra o status de conexão: Online ou Offline.",
          "Com a conexão Online é possível enviar comando de desconexão/reinício remoto (exige permissão).",
          "Equipamento Offline não responde a comando remoto.",
        ],
        agentHint:
          "Reiniciar o equipamento (CPE/ONU) só funciona com a ONU online. Se está offline, é provável queda física/energia — oriente verificar cabos e energia, ou avalie abrir OS. Antes de abrir OS por lentidão, tente o reinício.",
        source: { label: "Serviços do Cliente", url: `${WIKI}/modulos/cliente/consultar/servicos_cliente` },
      },
      {
        id: "renegociacao",
        title: "Renegociação de dívida",
        summary: "Junta faturas vencidas em uma nova negociação/parcelamento.",
        points: [
          "Gera uma nova fatura vinculada ao serviço da dívida.",
          "Pode exigir o campo 'Data Base' no formulário, quando configurado como obrigatório.",
          "Os dados são consultados conforme o serviço vinculado à fatura gerada pela renegociação.",
        ],
        agentHint:
          "Simule as opções (parcelas/desconto) e apresente antes; efetive só com confirmação explícita do cliente. Se o cliente já renegociou recentemente, verifique antes de oferecer de novo.",
        source: { label: "Financeiro do Cliente", url: `${WIKI}/modulos/cliente/consultar/financeiro_cliente` },
      },
      {
        id: "autoatendimento",
        title: "Autoatendimento — App do Cliente e Central do Assinante",
        summary: "O que o cliente consegue resolver sozinho.",
        points: [
          "App/Central permitem: ver e baixar 2ª via, pagar via PIX (QR), fazer autodesbloqueio e abrir atendimento (se habilitado).",
          "Pagamento por PIX na Central tem baixa automática.",
        ],
        agentHint:
          "O agente já resolve direto pelas tools, mas pode orientar o cliente ao app/Central como caminho alternativo e mais rápido para casos simples.",
        source: { label: "Aplicativo para Clientes", url: `${WIKI}/app_cliente` },
      },
    ],
  },
];

const OMNI: KnowledgeSource = { label: "Omnichannel NovaConecta · v_mensagens_matrix" };

KNOWLEDGE_BASE.push({
  id: "omnichannel-novaconecta",
  name: "Omnichannel NovaConecta",
  description:
    "Padrões reais do atendimento que já roda em produção (WhatsApp, bot Aurora). Extraído das conversas trocadas — tom, menu, intenções mais comuns e os sinais que os clientes trazem. Serve de espelho para os agentes soarem como a NovaConecta e anteciparem demandas.",
  articles: [
    {
      id: "bot-atual-aurora",
      title: "Aurora e limites do bot legado",
      summary:
        "O atendimento já começa por um bot chamado Aurora no WhatsApp. Isso preserva identidade, mas não deve virar script rígido.",
      points: [
        "Aurora é a identidade do atendimento; use essa continuidade sem repetir a mesma abertura a cada turno.",
        "O menu principal antigo mapeia assuntos: vendas, suporte, fatura, desbloqueio, informações, cancelamento e encerrar.",
        "Identificação por CPF/CNPJ do titular, com memória do último CPF atendido (oferece 'Continuar' ou 'Mudar CPF').",
        "Triagem inicial: 'Sou cliente' / 'Não sou cliente'.",
        "Transferência humana, encerramento por inatividade e pesquisa são regras de canal; use só quando houver fluxo real para isso.",
      ],
      agentHint:
        "Preserve a identidade Aurora e a cobertura de assuntos, mas converse de forma natural. Não force menu numerado quando uma pergunta contextual resolve.",
      source: OMNI,
    },
    {
      id: "tom-mensagens",
      title: "Tom e templates oficiais (HSM)",
      summary: "Como a NovaConecta fala com o cliente — base para o agente soar igual.",
      points: [
        "Tom cordial e direto; trate pelo nome quando houver nome vindo da tool.",
        "Use frases curtas, uma pergunta por vez e conecte a resposta com o que o cliente acabou de dizer.",
        "Emojis leves podem aparecer em acolhimento/encerramento, mas não substituem clareza.",
        "Templates de fatura, boleto vencido, conexão, visita e retomada comercial são referência de estrutura — não texto obrigatório.",
        "Para dados copiáveis, mantenha blocos separados (boleto/PDF, PIX, linha digitável).",
      ],
      agentHint:
        "Use os templates como padrão de clareza, não como fala literal. Varie a linguagem e nunca invente valores/códigos — use o que as tools retornarem.",
      source: OMNI,
    },
    {
      id: "intencoes-comuns",
      title: "Intenções mais comuns dos clientes",
      summary: "O que os clientes realmente pedem, em ordem de frequência observada.",
      points: [
        "Fatura: segunda via, código de barras/PDF, listar faturas, 'minha fatura desse mês foi paga?', mudar dia de vencimento.",
        "Desbloquear internet (cliente em débito querendo acesso).",
        "Sem internet — muitas vezes com urgência (trabalho, estudo, consulta médica).",
        "Lentidão / quedas — frequentemente 'paguei e continua lento/caindo'.",
        "Senha do wi-fi esquecida; app do cliente não abre/não loga.",
        "Status de instalação, visita técnica ou mudança de endereço ('vão vir hoje? que horas?').",
        "Trocar o local do roteador (gera visita).",
        "Cancelamento — costuma vir de insatisfação por demora não resolvida.",
        "Vendas: interesse em plano (ex.: 'Plano de 620MB'), contratação.",
        "Financeiro complexo: pagamento em duplicidade e pedido de estorno/abatimento.",
      ],
      agentHint:
        "Antecipar essas demandas acelera o atendimento. 'Paguei e continua lento' é recorrente: confirme pagamento/status antes de abrir OS. Pagamento duplicado exige conferência; não prometa crédito ou estorno sem validação.",
      source: OMNI,
    },
    {
      id: "sinais-tecnicos",
      title: "Sinais técnicos que o cliente relata",
      summary: "Como o cliente descreve problemas — traduza para diagnóstico.",
      points: [
        "'Luz vermelha piscando' na ONU = perda de sinal óptico (fibra rompida/desconectada). Em geral exige visita, não resolve por reinício.",
        "'Cai e volta', 'para de funcionar aí volta' = instabilidade intermitente.",
        "'Não abre nem o WhatsApp' = sem conexão efetiva, não só lentidão.",
        "Cliente costuma mandar áudio e print (imagem) — o canal recebe AUDIO/IMG com frequência.",
        "Reclamações de dias sem internet impactam trabalho/estudo/saúde — alto peso emocional.",
      ],
      agentHint:
        "Mapeie a fala para hipóteses, não para certeza. Luz vermelha sugere sinal óptico/visita; reinício só ajuda se a ONU está online. Reconheça a urgência antes de pedir passos técnicos.",
      source: OMNI,
    },
    {
      id: "onboarding-vendas",
      title: "Fluxo de contratação (não-cliente)",
      summary: "O que o bot coleta para vender/instalar.",
      points: [
        "Pergunta o nome, depois se a internet é para Casa ou Empresa.",
        "Coleta CPF, CEP e endereço (rua, número, referência), e-mail e data de nascimento.",
        "Oferece seguir pelo WhatsApp ou contratar pelo site.",
        "Cliente escolhe plano e dia de vencimento ('quero pro dia 20/28'), depois 'Concluir contratação'.",
      ],
      agentHint:
        "No escopo Comercial, conduza a coleta em etapas pequenas e confirme cobertura/viabilidade antes de prometer instalação. Não despeje formulário inteiro de uma vez.",
      source: OMNI,
    },
    {
      id: "particularidades-dados",
      title: "Particularidades das mensagens (ruído e formato)",
      summary: "Detalhes do canal que afetam a leitura das mensagens.",
      points: [
        "Emojis chegam codificados como ##unicode## (ex.: ##1f923##) — ruído, deve ser ignorado/limpo.",
        "Muitas mensagens são apenas opções de menu curtas ('Continuar', 'Sou cliente', 'Mais opções').",
        "CPF, CEP e telefone vêm com e sem formatação (pontos, traços, espaços) — normalize só os dígitos.",
        "Áudio e imagem são comuns; nem toda mensagem é texto.",
        "Clientes às vezes pedem continuidade com um atendente específico que já acompanhava o caso.",
      ],
      agentHint:
        "Limpe o ruído de emoji, aceite documentos com/sem formatação e não trate opção de menu como pergunta aberta. Se o cliente pede um atendente específico, registre a preferência.",
      source: OMNI,
    },
    {
      id: "limites-chatbot-legado",
      title: "O que não copiar do chatbot legado",
      summary: "O fluxo antigo ajuda a entender capacidades, mas não deve definir a fala da IA.",
      points: [
        "Menus numerados são mapa de assuntos, não forma padrão de conversa.",
        "Mensagens de transferência só fazem sentido quando houver handoff real ou registro claro da solicitação.",
        "Encerramento por inatividade e pesquisa CSAT são regras de canal, não resposta para todo atendimento.",
        "Frases como 'opção inválida' só fazem sentido em fluxo de botão/menu; em conversa livre, peça esclarecimento natural.",
      ],
      agentHint:
        "Use o legado para saber o que resolver, não para soar como árvore de decisão. Priorize conversa contextual, curta e humana.",
      source: { label: "NovaConecta flow · catálogo histórico de mensagens" },
    },
  ],
});

export function knowledgeArticleCount(): number {
  return KNOWLEDGE_BASE.reduce((sum, category) => sum + category.articles.length, 0);
}

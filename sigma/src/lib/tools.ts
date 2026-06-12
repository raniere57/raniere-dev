import type { FlowNodeKind } from "../types/flow";

export type ToolScope = Exclude<FlowNodeKind, "reception">;

export type ToolParameter = {
  name: string;
  type: "string" | "number" | "boolean" | "enum";
  description: string;
  required?: boolean;
  options?: string[];
};

export type ToolDefinition = {
  id: string;
  label: string;
  scope: ToolScope;
  /** Resumo curto, exibido no card da tool. */
  summary: string;
  /** Explicação do que a tool faz, exibida ao expandir. */
  description: string;
  /** Entradas que a IA precisa fornecer para executar a tool. */
  parameters: ToolParameter[];
  /** O que a tool devolve para a IA usar na resposta. */
  returns: string;
  /** Disponível para habilitar em qualquer escopo, não só no `scope`. */
  global?: boolean;
  /** Executa de verdade no backend (consome integração) quando habilitada. */
  executable?: boolean;
  /** Ação de escrita/efeito colateral: roda só sob confirmação, nunca automático. */
  action?: boolean;
  /** Integração consumida pela execução. */
  integration?: string;
};

// ---------------------------------------------------------------------------
// Catálogo de tools — cadastrado em código, conforme cada necessidade.
// Para adicionar uma tool: inclua um objeto aqui com escopo, resumo, descrição,
// parâmetros e retorno. O front exibe tudo automaticamente.
// ---------------------------------------------------------------------------

export const ERP_WIKI_TOOL_ID = "consultar_wiki_erp";
export const OMNICHANNEL_TOOL_ID = "consultar_omnichannel_novaconecta";

export const TOOL_CATALOG: ToolDefinition[] = [
  {
    id: OMNICHANNEL_TOOL_ID,
    label: "Consultar Omnichannel NovaConecta",
    scope: "support",
    global: true,
    executable: true,
    summary: "Busca padrões reais de conversa, intenção e ruído do WhatsApp.",
    description:
      "Consulta a base curada de mensagens reais do Omnichannel NovaConecta. Use para tornar a conversa mais natural, interpretar intenções comuns, reconhecer sinais técnicos descritos pelo cliente e lidar com ruído de canal (áudio, imagem, opções curtas, documentos formatados). Não use como script literal nem como regra operacional: dados, valores, status, elegibilidade e ações reais continuam vindo das tools operacionais.",
    parameters: [
      { name: "consulta", type: "string", description: "Mensagem/assunto do cliente usado na busca; preenchido automaticamente pelo simulador.", required: true },
      {
        name: "escopo",
        type: "enum",
        description: "Escopo atual do atendimento, usado só para desempate de relevância.",
        required: false,
        options: ["reception", "finance", "support", "retention", "commercial", "operations"],
      },
      { name: "limite", type: "number", description: "Máximo de padrões retornados (1 a 3; padrão 2).", required: false },
    ],
    returns: "Até 3 padrões curados: título, resumo, fatos, orientação para o agente e fonte.",
  },
  {
    id: ERP_WIKI_TOOL_ID,
    label: "Consultar Wiki do ERP",
    scope: "support",
    global: true,
    executable: true,
    summary: "Busca poucos artigos curados da wiki do ERP por assunto.",
    description:
      "Consulta a base curada da wiki do ERP e retorna apenas os artigos mais relevantes para o assunto atual. Use para explicar regras, status e fluxos do ERP (status do serviço, faturas, PIX, desbloqueio de confiança, suspensão, atendimento/OS, conexão e renegociação). Não substitui dados reais do cliente: valores, status atual, elegibilidade, protocolos e prazos devem vir das tools operacionais.",
    parameters: [
      { name: "consulta", type: "string", description: "Mensagem/assunto do cliente usado na busca; preenchido automaticamente pelo simulador.", required: true },
      {
        name: "escopo",
        type: "enum",
        description: "Escopo atual do atendimento, usado só para desempate de relevância.",
        required: false,
        options: ["reception", "finance", "support", "retention", "commercial", "operations"],
      },
      { name: "limite", type: "number", description: "Máximo de artigos retornados (1 a 3; padrão 2).", required: false },
    ],
    returns: "Até 3 artigos curados: título, resumo, fatos, orientação para o agente e fonte.",
  },
  {
    id: "consultar_cliente_erp",
    label: "Consultar cliente (ERP)",
    scope: "support",
    global: true,
    executable: true,
    integration: "banco_erp",
    summary: "Busca dados do cliente no ERP da NovaConecta pelo CPF.",
    description:
      "Consulta o cadastro do cliente no ERP da NovaConecta a partir do CPF e retorna os serviços contratados: plano, nome do cliente, status da conexão, status do serviço e tecnologia. Use para identificar a situação do cliente antes de resolver financeiro, suporte, retenção, comercial ou operação.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Lista de serviços do cliente: plano, cliente, status_conexao, status_servico e tecnologia.",
  },
  {
    id: "consultar_faturas_erp",
    label: "Consultar faturas (ERP)",
    scope: "finance",
    executable: true,
    integration: "banco_erp",
    summary: "Busca faturas em aberto do cliente no ERP pelo CPF.",
    description:
      "Consulta no ERP da NovaConecta as faturas em aberto do cliente (vencidas ou a vencer em até 30 dias) pelo CPF e retorna plano, vencimento, valor, código de barras e QR Code PIX. Use para informar débitos e enviar a segunda via / linha digitável / PIX ao cliente.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Lista de faturas em aberto: plano, cliente, data_vencimento, valor, codigo_barras e qr_code (PIX).",
  },
  {
    id: "consultar_faturas_vencidas",
    label: "Consultar faturas vencidas (ERP)",
    scope: "finance",
    executable: true,
    integration: "banco_erp",
    summary: "Busca só as faturas já vencidas e não pagas.",
    description:
      "Consulta no ERP as faturas do cliente que já passaram do vencimento e seguem sem pagamento, pelo CPF. Retorna plano, vencimento, valor, código de barras e QR Code PIX. Use para tratar débitos em atraso, oferecer 2ª via e regularização.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Faturas vencidas: plano, cliente, data_vencimento, valor, codigo_barras e qr_code (PIX).",
  },
  {
    id: "consultar_faturas_a_vencer",
    label: "Consultar faturas a vencer (ERP)",
    scope: "finance",
    executable: true,
    integration: "banco_erp",
    summary: "Busca as faturas em aberto que ainda não venceram.",
    description:
      "Consulta no ERP as faturas do cliente com vencimento futuro e ainda não pagas, pelo CPF. Retorna plano, vencimento, valor, código de barras e QR Code PIX. Use quando o cliente quer adiantar pagamento ou ver o próximo boleto.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Faturas a vencer: plano, cliente, data_vencimento, valor, codigo_barras e qr_code (PIX).",
  },
  {
    id: "consultar_status_conexao",
    label: "Consultar status da conexão (ERP)",
    scope: "support",
    executable: true,
    integration: "banco_erp",
    summary: "Verifica se a conexão está online/offline e desde quando.",
    description:
      "Consulta no ERP o status atual da conexão do cliente (RADIUS) pelo CPF: se está conectado ou não e desde quando (status_em). Use no diagnóstico de queda/lentidão antes de orientar reboot ou abrir OS.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Status da conexão: plano, cliente, status_conexao e status_em (momento do status).",
  },
  {
    id: "consultar_ultimo_atendimento",
    label: "Consultar último atendimento (ERP)",
    scope: "support",
    executable: true,
    integration: "banco_erp",
    summary: "Mostra o atendimento mais recente do cliente.",
    description:
      "Consulta no ERP o último atendimento registrado para o cliente pelo CPF: tipo, data de abertura e data de fechamento. Use para evitar abrir chamado duplicado e para dar continuidade a um atendimento recente.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Último atendimento: plano, cliente, tipo_atendimento, data_cadastro e data_fechamento.",
  },
  {
    id: "consultar_cliente_api",
    label: "Consultar cliente — API (ERP)",
    scope: "support",
    global: true,
    executable: true,
    integration: "api_erp",
    summary: "Resumo operacional do cliente pela API oficial do ERP (CPF).",
    description:
      "Consulta o cliente direto na API REST do ERP pelo CPF e retorna um resumo operacional compacto: id do cliente, serviços, contratos, status, cobrança, autenticação técnica e última conexão. É a base para identificar serviços e IDs sem saturar o contexto. Use quando precisar de dados oficiais/atualizados além do que o banco de leitura entrega.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF/CNPJ do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Resumo do cliente na API: ids, serviços/contratos, status, cobrança, autenticação técnica e última conexão.",
  },
  {
    id: "verificar_caixa_atendimento",
    label: "Verificar atendimentos abertos (ERP)",
    scope: "support",
    executable: true,
    integration: "api_erp",
    summary: "Lista atendimentos/OS já abertos do cliente.",
    description:
      "Consulta no ERP os atendimentos em aberto (pendentes) do cliente pelo CPF: protocolo, tipo e abertura. Use ANTES de abrir um novo chamado para não duplicar — se já existe atendimento aberto para o mesmo problema, informe o protocolo e o andamento em vez de abrir outro.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Atendimentos abertos: id_atendimento, protocolo, tipo, abertura, data e status.",
  },
  {
    id: "consultar_extrato_conexao",
    label: "Extrato de conexão (ERP)",
    scope: "support",
    executable: true,
    integration: "api_erp",
    summary: "Histórico recente de conexões/quedas do cliente.",
    description:
      "Consulta o extrato de conexão (RADIUS) do cliente pelo CPF: sessões recentes com início, fim, consumo e MAC. Use no diagnóstico para ver se a conexão está caindo/reconectando e confirmar efeito de um reinício.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Sessões de conexão: login, início, fim, MAC, download e upload.",
  },
  {
    id: "consultar_dados_contato",
    label: "Dados de contato (ERP)",
    scope: "support",
    global: true,
    executable: true,
    integration: "api_erp",
    summary: "Telefones e e-mail cadastrados do cliente.",
    description:
      "Retorna os dados de contato cadastrados do cliente (telefones e e-mail) pelo CPF. Use para conferir se o contato está atualizado — dado desatualizado faz boleto/aviso não chegar. Para alterar, oriente a atualização (a mudança em si é tratada à parte).",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Contato: nome, telefones (primário/secundário/terciário) e e-mail.",
  },
  {
    id: "consultar_notas_fiscais",
    label: "Notas fiscais (ERP)",
    scope: "finance",
    executable: true,
    integration: "api_erp",
    summary: "Notas fiscais emitidas para o cliente.",
    description:
      "Consulta as notas fiscais do cliente pelo CPF: número, série, valor e identificação. Use quando o cliente pede a nota fiscal de um pagamento.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
    ],
    returns: "Notas fiscais: numero_nota, serie_nota, valor e identificacao.",
  },
  {
    id: "consultar_alertas",
    label: "Alertas / incidência massiva (ERP)",
    scope: "support",
    global: true,
    executable: true,
    integration: "api_erp",
    summary: "Alertas ativos aplicáveis ao cliente identificado.",
    description:
      "Consulta os alertas ativos configurados no ERP e cruza com o cadastro do cliente/serviço (cidade, bairro, interface, POP, caixa óptica, grupos e status). Use na recepção/suporte: só informe incidência massiva quando esta tool retornar um alerta aplicável ao cliente identificado. Se retornar vazio, não diga que há rompimento/massiva na região.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF/CNPJ do titular para cruzar alertas com os serviços do cliente.", required: true },
      { name: "id_cliente_servico", type: "string", description: "ID do serviço alvo, quando já identificado.", required: false },
    ],
    returns: "Alertas aplicáveis: id_alerta, descrição, serviço, cidade/bairro, critério de aplicabilidade e janela de início/fim.",
  },
  {
    id: "reiniciar_cpe",
    label: "Reiniciar equipamento (ERP)",
    scope: "support",
    executable: true,
    action: true,
    integration: "api_erp",
    summary: "Reinicia remotamente a ONU/CPE do cliente.",
    description:
      "AÇÃO: reinicia remotamente o equipamento (ONU/CPE) do cliente. Localiza o equipamento pelo serviço do cliente e dispara o reboot via API. Primeira medida em queda/lentidão. Só execute após confirmar com o cliente; pode derrubar a conexão por alguns instantes. Se o cliente tem mais de um serviço, informe id_cliente_servico do serviço correto.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
      { name: "id_cliente_servico", type: "string", description: "ID do serviço alvo (obrigatório quando o cliente tem 2+ serviços; pegue dos dados do cliente após o cliente escolher).", required: false },
    ],
    returns: "Resultado por equipamento: phy_addr e se o reinício foi disparado.",
  },
  {
    id: "abrir_atendimento",
    label: "Abrir atendimento / OS (ERP)",
    scope: "support",
    executable: true,
    action: true,
    integration: "api_erp",
    summary: "Registra atendimento e abre ordem de serviço para o cliente.",
    description:
      "AÇÃO: abre um atendimento no ERP (com ordem de serviço) para o serviço do cliente, a partir do CPF e de uma descrição do problema. Use quando o diagnóstico remoto não resolveu e é preciso visita/análise técnica. Só execute após confirmar com o cliente e garantir que não há atendimento aberto recente. Se o cliente tem mais de um serviço, informe id_cliente_servico do serviço correto (confirme com o cliente qual plano).",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
      { name: "descricao", type: "string", description: "Resumo claro do problema relatado pelo cliente.", required: true },
      { name: "id_cliente_servico", type: "string", description: "ID do serviço alvo (obrigatório quando o cliente tem 2+ serviços; pegue dos dados do cliente após o cliente escolher o plano).", required: false },
    ],
    returns: "Dados do atendimento/OS aberto (id, protocolo e status quando retornados).",
  },
  {
    id: "simular_renegociacao",
    label: "Simular renegociação (ERP)",
    scope: "finance",
    executable: true,
    action: true,
    integration: "api_erp",
    summary: "Simula o parcelamento das faturas vencidas (sem efetivar).",
    description:
      "AÇÃO de consulta (sem efeito real): simula a renegociação de TODAS as faturas vencidas do cliente pelo CPF, na quantidade de parcelas e vencimento informados. Pode ser usada livremente para apresentar opções ao cliente — não exige confirmação. Sempre simule antes de efetivar.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular.", required: true },
      { name: "vencimento", type: "string", description: "Data de vencimento da 1ª parcela (YYYY-MM-DD).", required: true },
      { name: "quantidade_parcelas", type: "number", description: "Número de parcelas desejado (1 a 12).", required: true },
    ],
    returns: "Simulação: valor total, descontos, parcelas e condições.",
  },
  {
    id: "desbloqueio_confianca",
    label: "Desbloqueio em confiança (ERP)",
    scope: "finance",
    executable: true,
    action: true,
    integration: "api_erp",
    summary: "Libera a conexão por alguns dias mesmo com fatura em aberto.",
    description:
      "AÇÃO de escrita: concede desbloqueio em confiança ao cliente bloqueado por pendência, por N dias (1 a 7). O ERP valida a regra (ex.: 1× por mês). Use quando o cliente promete pagar e precisa da conexão de volta agora; confirme com o cliente antes. Se a regra não permitir, explique ao cliente sem expor detalhes técnicos.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular (somente dígitos ou formatado).", required: true },
      { name: "dias_desbloqueio", type: "number", description: "Quantidade de dias de desbloqueio (1 a 7; padrão 1).", required: false },
      { name: "id_cliente_servico", type: "string", description: "ID do serviço alvo (obrigatório quando o cliente tem 2+ serviços).", required: false },
    ],
    returns: "Confirmação do desbloqueio (dias liberados) ou o motivo da recusa.",
  },
  {
    id: "efetivar_renegociacao",
    label: "Efetivar renegociação (ERP)",
    scope: "finance",
    executable: true,
    action: true,
    integration: "api_erp",
    summary: "Efetiva a renegociação das faturas vencidas do cliente.",
    description:
      "AÇÃO de escrita: efetiva a renegociação de TODAS as faturas vencidas do cliente pelo CPF, com o parcelamento e vencimento escolhidos. Use SOMENTE após simular e o cliente confirmar explicitamente a opção. Não efetive sem confirmação.",
    parameters: [
      { name: "cpf", type: "string", description: "CPF do titular.", required: true },
      { name: "vencimento", type: "string", description: "Data de vencimento da 1ª parcela (YYYY-MM-DD), igual à simulada.", required: true },
      { name: "quantidade_parcelas", type: "number", description: "Número de parcelas confirmado pelo cliente (1 a 12).", required: true },
    ],
    returns: "Confirmação da renegociação efetivada (protocolo, parcelas, valores).",
  },
];

const TOOL_BY_ID = new Map(TOOL_CATALOG.map((tool) => [tool.id, tool]));

export function getTool(toolId: string): ToolDefinition | undefined {
  return TOOL_BY_ID.get(toolId);
}

export function toolsForScope(scope: FlowNodeKind): ToolDefinition[] {
  // Recepção só acessa tools globais (ex.: consultar dados do cliente para classificar).
  if (scope === "reception") return TOOL_CATALOG.filter((tool) => tool.global);
  return TOOL_CATALOG.filter((tool) => tool.global || tool.scope === scope);
}

/** Tools executáveis (rodam no backend) habilitadas na lista informada. */
export function executableEnabledTools(toolIds: string[]): ToolDefinition[] {
  return toolIds
    .map((id) => getTool(id))
    .filter((tool): tool is ToolDefinition => Boolean(tool?.executable));
}

/** Tools de leitura: rodam automático e injetam contexto no prompt. */
export function readEnabledTools(toolIds: string[]): ToolDefinition[] {
  return executableEnabledTools(toolIds).filter((tool) => !tool.action);
}

/** Tools de ação (escrita): só executam sob confirmação, nunca automático. */
export function actionEnabledTools(toolIds: string[]): ToolDefinition[] {
  return executableEnabledTools(toolIds).filter((tool) => tool.action);
}

/** Lista de ações habilitadas para o prompt (id + descrição + params). Vazio se nenhuma. */
export function buildActionsPromptBlock(toolIds: string[]): string {
  return actionEnabledTools(toolIds)
    .map((tool) => {
      // cpf é preenchido pelo runtime; o modelo só fornece os demais.
      const modelParams = tool.parameters.filter((parameter) => parameter.name !== "cpf");
      const paramsText =
        modelParams.length > 0
          ? ` params: ${modelParams
              .map((parameter) => `${parameter.name}${parameter.required ? "" : "?"} (${parameter.description})`)
              .join(", ")}`
          : " params: nenhum";
      return `  - ${tool.id} — ${tool.label}: ${tool.description}.${paramsText}`;
    })
    .join("\n");
}

function formatParameter(parameter: ToolParameter): string {
  const requirement = parameter.required ? "obrigatório" : "opcional";
  const options = parameter.options ? ` [${parameter.options.join(" | ")}]` : "";
  return `  - ${parameter.name} (${parameter.type}${options}, ${requirement}): ${parameter.description}`;
}

/** Bloco de texto descrevendo as tools habilitadas, injetado no prompt da área. */
export function buildToolsPromptBlock(toolIds: string[]): string {
  if (toolIds.length === 0) return "- Nenhuma tool operacional habilitada.";

  return toolIds
    .map((toolId) => {
      const tool = getTool(toolId);
      if (!tool) return `- ${toolId}`;

      const params =
        tool.parameters.length > 0
          ? `\n  Parâmetros:\n${tool.parameters.map(formatParameter).join("\n")}`
          : "\n  Parâmetros: nenhum.";

      return `- ${tool.label} (${tool.id}): ${tool.description}${params}\n  Retorno: ${tool.returns}`;
    })
    .join("\n");
}

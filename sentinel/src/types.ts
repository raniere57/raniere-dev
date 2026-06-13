export type Page = 
  | 'dashboard' 
  | 'atendimentos' 
  | 'atendimento-detail'
  | 'monitorias' 
  | 'modelos' 
  | 'modelo-editor'
  | 'criterios' 
  | 'agentes' 
  | 'agente-profile'
  | 'relatorios' 
  | 'configuracoes' 
  | 'about';

export type Theme = 'dark' | 'light';

export type Canal = 'WhatsApp' | 'Telefone' | 'Chat' | 'E-mail';
export type Risco = 'crítico' | 'alto' | 'médio' | 'baixo';
export type StatusAnalise = 'concluída' | 'em análise' | 'pendente' | 'erro';
export type StatusMonitoria = 'concluída' | 'em execução' | 'agendada' | 'pausada';
export type StatusModelo = 'publicado' | 'rascunho';
export type Severidade = 'crítica' | 'alta' | 'média' | 'baixa';
export type Sensibilidade = 'conservadora' | 'equilibrada' | 'rigorosa';
export type Frequencia = 'manual' | 'diária' | 'semanal' | 'mensal';
export type Sentimento = 'positivo' | 'neutro' | 'negativo' | 'misto';

export interface Atendimento {
  id: string;
  protocolo: string;
  cliente: string;
  canal: Canal;
  agente: string;
  agenteId: string;
  setor: string;
  data: string;
  duracao: string;
  statusAnalise: StatusAnalise;
  scoreIA: number;
  risco: Risco;
  resumoIA?: string;
  sentimento?: Sentimento;
  intencao?: string;
  problemas?: string[];
  pontosPositivos?: string[];
  pontosMelhoria?: string[];
  scoresCriterios?: { criterio: string; score: number; peso: number }[];
  sugestaoFeedback?: string;
  timeline?: TimelineItem[];
}

export interface TimelineItem {
  id: string;
  remetente: 'cliente' | 'agente' | 'sistema';
  mensagem: string;
  horario: string;
}

export interface Agente {
  id: string;
  nome: string;
  iniciais: string;
  scoreMedio: number;
  atendimentosAvaliados: number;
  pontosFortes: string[];
  pontosMelhoria: string[];
  tendencia: 'subindo' | 'estável' | 'descendo';
  alertas: string[];
  scoreHistorico: number[];
  principaisErros: string[];
  principaisElogios: string[];
  recomendacoesTreinamento: string[];
}

export interface Monitoria {
  id: string;
  nome: string;
  modelo: string;
  canal: Canal | 'Todos';
  fila: string;
  qtdAvaliados: number;
  status: StatusMonitoria;
  ultimaExecucao: string;
  scoreMedio: number;
}

export interface ModeloAvaliacao {
  id: string;
  nome: string;
  descricao: string;
  pesoTotal: number;
  criterios: CriterioModelo[];
  status: StatusModelo;
  versao: string;
}

export interface CriterioModelo {
  id: string;
  nome: string;
  peso: number;
  instrucaoIA: string;
  exemplosAprovacao: string[];
  exemplosReprovacao: string[];
  severidade: Severidade;
}

export interface Criterio {
  id: string;
  nome: string;
  categoria: string;
  pesoSugerido: number;
  severidade: Severidade;
  usadoEmModelos: number;
  status: 'ativo' | 'inativo';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ScoreHistoryPoint {
  dia: string;
  score: number;
}

export interface ChannelDistribution {
  canal: string;
  quantidade: number;
  cor: string;
}

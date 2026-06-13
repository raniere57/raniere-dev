import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Sparkles, Code2, Play, Save, ArrowRight,
  Database, Wand2, AlertCircle, GitMerge, BookOpen,
  ChevronDown,
} from "lucide-react";
import { SqlEditor } from "../components/shared/SqlEditor";
import { useToast } from "../components/shared/Toast";
import { mockChatHistory } from "../data/mockData";
import { cn } from "../utils/cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sql?: string | null;
  sqlExplanation?: string;
  sqlRisks?: string[];
}

const quickActions = [
  { label: "Gerar query de join", icon: <GitMerge size={12} /> },
  { label: "Explicar tabela", icon: <Database size={12} /> },
  { label: "Corrigir erro SQL", icon: <AlertCircle size={12} /> },
  { label: "Otimizar transformação", icon: <Sparkles size={12} /> },
  { label: "Criar view analítica", icon: <Code2 size={12} /> },
  { label: "Gerar documentação", icon: <BookOpen size={12} /> },
];

const aiResponses: Record<string, Partial<Message>> = {
  default: {
    content: "Entendido! Estou analisando o contexto das suas fontes e tabelas. Com base no schema disponível, posso ajudar com joins, transformações, validações e otimizações. O que você precisa especificamente?",
  },
  join: {
    content: "Identifico as tabelas para o join:\n\n**clientes** — chave: `id_cliente`\n**cobranças** — chave: `id_cliente`\n**atendimentos** — chave: `id_cliente`\n\nRecomendo LEFT JOIN para não perder clientes sem histórico de cobranças ou atendimentos. Gerei a query base:",
    sql: `SELECT
  c.id_cliente,
  c.nome,
  c.segmento,
  COUNT(cb.id_cobrança)  AS total_cobranças,
  SUM(cb.valor)          AS valor_total,
  COUNT(at.id_atendimento) AS total_atendimentos
FROM clientes c
LEFT JOIN cobranças  cb USING (id_cliente)
LEFT JOIN atendimentos at USING (id_cliente)
GROUP BY c.id_cliente, c.nome, c.segmento
ORDER BY total_cobranças DESC;`,
    sqlExplanation: "A query usa dois LEFT JOINs com `USING (id_cliente)` para simplificar a sintaxe. O GROUP BY agrega os dados por cliente para que COUNT e SUM funcionem corretamente.",
    sqlRisks: ["Se `cobranças` tiver múltiplos registros por cliente e `atendimentos` também, pode ocorrer multiplicação de linhas antes do GROUP BY. Considere usar CTEs para agregar cada tabela separadamente antes do join final."],
  },
  explain: {
    content: "**Tabela: clientes** (PostgreSQL ERP)\n\nContém a base cadastral de clientes ativos e inativos:\n\n- `id_cliente` — Chave primária, formato `C-XXXX`\n- `nome` — Razão social ou nome do cliente\n- `documento` — CPF ou CNPJ (sem máscara)\n- `segmento` — Enterprise | SMB | Startup\n- `status` — ativo | inativo | bloqueado\n- `dt_cadastro` — Data de criação do registro\n\n**87.240 registros ativos** · Última sync: 08:42 · Qualidade: 94%",
  },
  error: {
    content: "Identifiquei o erro! O problema está na linha 14:\n\n```\nERROR: column 'id' does not exist\n```\n\nA coluna correta na tabela `cobranças` é `id_cobrança`, não `id`. Aqui está a correção:",
    sql: `-- ANTES (com erro)
-- WHERE cb.id IS NOT NULL

-- DEPOIS (correto)
WHERE cb.id_cobrança IS NOT NULL`,
    sqlExplanation: "O DuckDB é case-sensitive para nomes de colunas com acentos. Use sempre o nome exato da coluna conforme o schema.",
    sqlRisks: ["Verifique se outros campos com acento estão referenciados corretamente na query."],
  },
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="typing-dot h-1.5 w-1.5 rounded-full bg-blue-400"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

export const AIAgent: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(mockChatHistory as Message[]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [expandedContext, setExpandedContext] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      sql: null,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const lower = text.toLowerCase();
    let response = aiResponses.default;
    if (lower.includes("join") || lower.includes("juntar")) response = aiResponses.join;
    else if (lower.includes("explicar") || lower.includes("tabela") || lower.includes("schema")) response = aiResponses.explain;
    else if (lower.includes("erro") || lower.includes("corrig")) response = aiResponses.error;

    setTimeout(() => {
      setTyping(false);
      const aiMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: response.content || "",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        sql: response.sql,
        sqlExplanation: response.sqlExplanation,
        sqlRisks: response.sqlRisks,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1800);
  };

  const handleQuickAction = (label: string) => {
    sendMessage(label);
  };

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Chat area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))", border: "1px solid rgba(139,92,246,0.3)" }}
            >
              <Bot size={15} className="text-violet-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">DataForge Agent</p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 status-running" />
                <p className="text-[11px] text-slate-500">Online · Contexto completo carregado · Modo: OpenAI GPT-4o (simulado)</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpandedContext(!expandedContext)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-slate-700/40 hover:border-slate-600 hover:text-slate-200 transition-colors"
          >
            <Database size={11} />
            Contexto
            <ChevronDown size={11} className={cn("transition-transform", expandedContext && "rotate-180")} />
          </button>
        </div>

        {/* Context panel */}
        <AnimatePresence>
          {expandedContext && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(59,130,246,0.08)" }}
            >
              <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Fontes", value: "6 conectadas" },
                  { label: "Tabelas no contexto", value: "52 tabelas" },
                  { label: "Queries salvas", value: "4 queries" },
                  { label: "Objetivo atual", value: "Score de churn" },
                ].map((item) => (
                  <div key={item.label} className="px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{item.label}</p>
                    <p className="text-xs font-medium text-slate-300 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))", border: "1px solid rgba(139,92,246,0.25)" }}>
                  <Bot size={13} className="text-violet-300" />
                </div>
              )}
              <div className={cn("max-w-xl flex-1", msg.role === "user" ? "items-end flex flex-col" : "")}>
                <div
                  className={cn("px-4 py-3 rounded-xl text-sm leading-relaxed", msg.role === "user" ? "chat-user" : "chat-ai")}
                  style={{ maxWidth: msg.role === "user" ? 420 : "100%" }}
                >
                  {msg.content.split("\n").map((line, i) => {
                    const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100">$1</strong>');
                    const codeParsed = boldParsed.replace(/`(.*?)`/g, '<code class="bg-slate-700/50 text-cyan-300 px-1 rounded font-mono text-[11px]">$1</code>');
                    return (
                      <p key={i} className="text-slate-300" dangerouslySetInnerHTML={{ __html: codeParsed }} />
                    );
                  })}
                </div>

                {/* SQL Card */}
                {msg.sql && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 rounded-xl overflow-hidden w-full"
                    style={{ border: "1px solid rgba(59,130,246,0.2)", background: "rgba(5,14,31,0.9)" }}
                  >
                    <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
                      <div className="flex items-center gap-1.5">
                        <Code2 size={12} className="text-blue-400" />
                        <span className="text-xs font-medium text-slate-300">Query gerada</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Validada</span>
                      </div>
                    </div>
                    <SqlEditor value={msg.sql} readOnly height="180px" />
                    {msg.sqlExplanation && (
                      <div className="px-3 py-2.5" style={{ borderTop: "1px solid rgba(59,130,246,0.08)" }}>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{msg.sqlExplanation}</p>
                      </div>
                    )}
                    {msg.sqlRisks && msg.sqlRisks.length > 0 && (
                      <div className="px-3 py-2" style={{ borderTop: "1px solid rgba(59,130,246,0.08)", background: "rgba(245,158,11,0.04)" }}>
                        {msg.sqlRisks.map((risk, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <AlertCircle size={10} className="text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-300/80">{risk}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderTop: "1px solid rgba(59,130,246,0.08)" }}>
                      {[
                        { label: "Inserir no editor", icon: <ArrowRight size={10} />, action: () => toast("success", "Inserido no editor", "Abra o Workspace SQL para ver a query.") },
                        { label: "Executar preview", icon: <Play size={10} />, action: () => toast("info", "Executando preview", "3.2s · 87.240 linhas") },
                        { label: "Ajustar com IA", icon: <Wand2 size={10} />, action: () => toast("info", "Ajustando", "Aguardando sua instrução...") },
                        { label: "Salvar", icon: <Save size={10} />, action: () => toast("success", "Salva", "Query adicionada ao histórico.") },
                      ].map((btn) => (
                        <button
                          key={btn.label}
                          onClick={btn.action}
                          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-slate-400 border border-slate-700/40 hover:border-slate-600 hover:text-slate-200 transition-colors"
                        >
                          {btn.icon}
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <p className="text-[10px] text-slate-600 mt-1 px-1">{msg.timestamp}</p>
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="h-7 w-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))", border: "1px solid rgba(139,92,246,0.25)" }}>
                <Bot size={13} className="text-violet-300" />
              </div>
              <div className="chat-ai px-4 py-3 rounded-xl">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick actions */}
        <div className="flex-shrink-0 px-5 py-2" style={{ borderTop: "1px solid rgba(59,130,246,0.08)" }}>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                onClick={() => handleQuickAction(qa.label)}
                className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-400 border border-slate-700/40 hover:border-blue-500/30 hover:text-blue-300 transition-colors whitespace-nowrap"
              >
                {qa.icon}
                {qa.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-5 py-3" style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }}>
          <div
            className="flex items-end gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(10,25,50,0.5)", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Peça ao agente: gerar SQL, explicar tabela, otimizar query, criar view..."
              className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-300 placeholder-slate-600"
              rows={2}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="flex-shrink-0 p-2 rounded-lg transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 mt-1.5 text-center">
            Agente simulado · Sem chamadas reais a modelos de IA · Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
};

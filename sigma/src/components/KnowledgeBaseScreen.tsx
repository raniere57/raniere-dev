import { useState } from "react";
import { BookOpen, ChevronDown, Database, ExternalLink, Library, Lightbulb } from "lucide-react";
import clsx from "clsx";

import { KNOWLEDGE_BASE, knowledgeArticleCount, type KnowledgeArticle } from "../lib/knowledge";

export function KnowledgeBaseScreen() {
  const [activeCategoryId, setActiveCategoryId] = useState(KNOWLEDGE_BASE[0]?.id ?? "");
  const [openArticleId, setOpenArticleId] = useState<string | null>(KNOWLEDGE_BASE[0]?.articles[0]?.id ?? null);

  const activeCategory = KNOWLEDGE_BASE.find((category) => category.id === activeCategoryId) ?? KNOWLEDGE_BASE[0];

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_16%_10%,rgba(199,255,61,.08),transparent_26%),linear-gradient(135deg,#070908_0%,#0d1210_52%,#080808_100%)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-acid">base de conhecimento</p>
            <h2 className="mt-2 text-2xl font-semibold">Memória do atendimento</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">
              O que os agentes precisam saber para explicar e agir com precisão. Conhecimento curado por
              categoria — fonte de contexto para as LLMs.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
            {knowledgeArticleCount()} artigos
          </span>
        </div>

        <div className="mt-8 grid grid-cols-[240px_minmax(0,1fr)] gap-6 max-md:grid-cols-1">
          {/* categorias */}
          <aside className="flex flex-col gap-2 max-md:flex-row max-md:flex-wrap">
            {KNOWLEDGE_BASE.map((category) => {
              const active = category.id === activeCategory?.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    setOpenArticleId(category.articles[0]?.id ?? null);
                  }}
                  className={clsx(
                    "flex items-start gap-3 rounded-[10px] border p-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-acid/40",
                    active ? "border-acid/45 bg-acid/[.07]" : "border-white/10 bg-white/[.025] hover:border-white/20",
                  )}
                >
                  <span
                    className={clsx(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-md border",
                      active ? "border-acid/40 bg-black/30 text-acid" : "border-white/10 bg-black/25 text-steel",
                    )}
                  >
                    <Library size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">{category.name}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
                      {category.articles.length} artigos
                    </span>
                  </span>
                </button>
              );
            })}
          </aside>

          {/* artigos */}
          <div className="min-w-0">
            {activeCategory && (
              <>
                <p className="mb-4 text-sm leading-6 text-steel">{activeCategory.description}</p>
                <div className="space-y-2.5">
                  {activeCategory.articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      open={openArticleId === article.id}
                      onToggle={() => setOpenArticleId((current) => (current === article.id ? null : article.id))}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  article,
  open,
  onToggle,
}: {
  article: KnowledgeArticle;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={clsx("overflow-hidden rounded-[11px] border bg-white/[.025] transition", open ? "border-acid/30" : "border-white/10")}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-acid/40"
      >
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-black/25 text-acid">
          <BookOpen size={15} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-white">{article.title}</span>
          <span className="mt-1 block text-xs leading-5 text-steel">{article.summary}</span>
        </span>
        <ChevronDown size={16} className={clsx("mt-1 shrink-0 text-steel transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-white/[.07] px-4 pb-4 pt-3">
          <ul className="space-y-2">
            {article.points.map((point, index) => (
              <li key={index} className="flex gap-2.5 text-[13px] leading-6 text-[#dce5df]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-acid/70" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {article.agentHint && (
            <div className="mt-3 flex gap-2.5 rounded-md border border-acid/20 bg-acid/[.06] p-3">
              <Lightbulb size={15} className="mt-0.5 shrink-0 text-acid" />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-acid">para o agente</p>
                <p className="mt-1 text-[13px] leading-6 text-[#dce5df]">{article.agentHint}</p>
              </div>
            </div>
          )}

          {article.source &&
            (article.source.url ? (
              <a
                href={article.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-steel outline-none transition hover:text-acid focus-visible:ring-2 focus-visible:ring-acid/40"
              >
                <ExternalLink size={12} />
                fonte: {article.source.label}
              </a>
            ) : (
              <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
                <Database size={12} />
                fonte: {article.source.label}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

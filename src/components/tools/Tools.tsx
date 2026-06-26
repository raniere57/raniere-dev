import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  defaultToolId,
  getToolById,
  getToolCategory,
  getToolCategoryShortLabel,
  toolCategories,
  tools,
  type ToolCategoryId,
  type ToolDefinition,
} from '../../data/tools'
import { useReveal } from '../../hooks/useReveal'
import { isImplementedTool, TOOL_LOADERS } from './toolRegistry'
import './tools.css'

function normalizeToolId(raw: string | null): string {
  if (raw && getToolById(raw)) return raw
  return defaultToolId
}

const LAZY_TOOLS = Object.fromEntries(
  Object.entries(TOOL_LOADERS).map(([id, loader]) => [id, lazy(loader)]),
) as Record<string, ReturnType<typeof lazy>>

function LazyToolPanel({ toolId }: { toolId: string }) {
  const Component = LAZY_TOOLS[toolId]
  if (!Component) {
    return (
      <div className="tool-detail__soon">
        <p>Esta ferramenta ainda não está disponível.</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="tool-detail__loading">Carregando ferramenta…</div>}>
      <Component />
    </Suspense>
  )
}

function ToolPanel({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId)

  if (!tool) {
    return (
      <div className="tool-detail__soon">
        <p>Ferramenta não encontrada.</p>
      </div>
    )
  }

  if (tool.status !== 'available' || !isImplementedTool(toolId)) {
    return (
      <div className="tool-detail__soon">
        <p>Esta ferramenta ainda está em desenvolvimento.</p>
        <p className="tool-detail__soon-hint">Volte em breve — ela aparecerá aqui quando estiver pronta.</p>
      </div>
    )
  }

  return <LazyToolPanel toolId={toolId} />
}

function matchesSearch(tool: ToolDefinition, query: string): boolean {
  if (!query.trim()) return true
  const haystack = [tool.name, tool.description, ...tool.keywords].join(' ').toLowerCase()
  return haystack.includes(query.trim().toLowerCase())
}

function ToolDetail({ tool }: { tool: ToolDefinition }) {
  const category = getToolCategory(tool.category)

  return (
    <article key={tool.id} className="tool-detail">
      <span className="tool-detail__mark" aria-hidden="true">
        {tool.mark}
      </span>

      <header className="tool-detail__header">
        <div className="tool-detail__meta">
          <p className="tool-detail__category">{category?.label}</p>
          <div className="tool-detail__badges">
            {tool.status === 'available' ? (
              <span className="tool-detail__badge">Disponível</span>
            ) : (
              <span className="tool-detail__badge tool-detail__badge--muted">Em breve</span>
            )}
            <span className="tool-detail__badge tool-detail__badge--muted">
              <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="10"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8 11V8a4 4 0 1 1 8 0v3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              100% local
            </span>
          </div>
        </div>

        <div className="tool-detail__title-block">
          <span className="tool-detail__glyph" aria-hidden="true">
            {tool.mark}
          </span>
          <div>
            <h3 className="tool-detail__title">{tool.name}</h3>
            <p className="tool-detail__description">{tool.description}</p>
          </div>
        </div>

        <ul className="tool-detail__keywords" aria-label="Palavras-chave">
          {tool.keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
      </header>

      <div className="tool-detail__panel">
        <ToolPanel toolId={tool.id} />
      </div>
    </article>
  )
}

export function Tools() {
  const sectionRef = useReveal<HTMLElement>()
  const listRef = useRef<HTMLElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | ToolCategoryId>('all')
  const [activeToolId, setActiveToolId] = useState(defaultToolId)

  const activeTool = getToolById(activeToolId) ?? getToolById(defaultToolId)!
  const showGroupedList = activeCategory === 'all' && !searchQuery.trim()

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const categoryOk = activeCategory === 'all' || tool.category === activeCategory
      return categoryOk && matchesSearch(tool, searchQuery)
    })
  }, [activeCategory, searchQuery])

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(toolCategories.map((category) => [category.id, 0])) as Record<
      ToolCategoryId,
      number
    >

    tools.forEach((tool) => {
      if (matchesSearch(tool, searchQuery)) counts[tool.category] += 1
    })

    return counts
  }, [searchQuery])

  const selectTool = (toolId: string) => {
    const tool = getToolById(toolId)
    if (!tool) return

    setActiveToolId(toolId)
    const url = new URL(window.location.href)
    url.searchParams.set('tool', toolId)
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromUrl = params.get('tool')
    if (fromUrl && getToolById(fromUrl)) {
      setActiveToolId(fromUrl)
    } else {
      setActiveToolId(normalizeToolId(fromUrl))
    }

    if (params.get('tool') || window.location.hash === '#ferramentas') {
      window.requestAnimationFrame(() => {
        document.getElementById('ferramentas')?.scrollIntoView()
      })
    }
  }, [])

  useEffect(() => {
    const activeItem = listRef.current?.querySelector<HTMLElement>('.tools-sidebar__item.is-active')
    activeItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeToolId, filteredTools.length])

  function renderSidebarItem(tool: ToolDefinition) {
    const isActive = tool.id === activeToolId
    const isSoon = tool.status === 'soon'

    return (
      <li key={tool.id}>
        <button
          type="button"
          className={`tools-sidebar__item${isActive ? ' is-active' : ''}${isSoon ? ' is-soon' : ''}`}
          onClick={() => selectTool(tool.id)}
          disabled={isSoon}
          aria-current={isActive ? 'true' : undefined}
        >
          <span className="tools-sidebar__item-row">
            <span className="tools-sidebar__mark" aria-hidden="true">
              {tool.mark}
            </span>
            <span className="tools-sidebar__item-copy">
              <span className="tools-sidebar__item-name">{tool.name}</span>
              <span className="tools-sidebar__item-desc">{tool.description}</span>
            </span>
            {isSoon ? (
              <span className="tools-sidebar__pill tools-sidebar__pill--muted">Em breve</span>
            ) : (
              <span className="tools-sidebar__pill">Ativa</span>
            )}
          </span>
        </button>
      </li>
    )
  }

  return (
    <section
      id="ferramentas"
      ref={sectionRef}
      className="section tools"
      aria-labelledby="tools-heading"
    >
      <div className="container">
        <p className="section-label reveal">03 / Ferramentas</p>
        <div className="tools__intro reveal">
          <h2 id="tools-heading" className="section-title tools__title">
            Utilitários no navegador
          </h2>
          <p className="tools__lead">
            Conversores, validadores e testes rápidos — escolha na lista e use à direita, sem
            cadastro e sem backend.
          </p>
          <p className="tools__privacy">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M8 11V8a4 4 0 1 1 8 0v3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Processado no seu navegador — nada é enviado a servidores.
          </p>
        </div>

        <div className="tools__hub reveal">
          <aside className="tools-sidebar" aria-label="Lista de ferramentas">
            <div className="tools-sidebar__search">
              <label className="visually-hidden" htmlFor="tools-search">
                Buscar ferramenta
              </label>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <line
                  x1="16"
                  y1="16"
                  x2="20"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="tools-search"
                type="search"
                className="tools-sidebar__input"
                placeholder="Buscar…"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tools-sidebar__clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>

            <div className="tools-sidebar__categories" role="tablist" aria-label="Categorias">
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'all'}
                className={`tools-sidebar__category${activeCategory === 'all' ? ' is-active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                Todas
                <span className="tools-sidebar__count">{tools.length}</span>
              </button>
              {toolCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category.id}
                  className={`tools-sidebar__category${activeCategory === category.id ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                  title={category.label}
                >
                  {getToolCategoryShortLabel(category.id)}
                  <span className="tools-sidebar__count">{categoryCounts[category.id]}</span>
                </button>
              ))}
            </div>

            <nav ref={listRef} className="tools-sidebar__list" aria-label="Ferramentas filtradas">
              {filteredTools.length === 0 ? (
                <p className="tools-sidebar__empty">Nenhuma ferramenta encontrada.</p>
              ) : showGroupedList ? (
                toolCategories.map((category) => {
                  const items = filteredTools.filter((tool) => tool.category === category.id)
                  if (items.length === 0) return null

                  return (
                    <div key={category.id} className="tools-sidebar__group">
                      <p className="tools-sidebar__group-label">
                        {getToolCategoryShortLabel(category.id)}
                      </p>
                      <ul className="tools-sidebar__items">{items.map(renderSidebarItem)}</ul>
                    </div>
                  )
                })
              ) : (
                <ul className="tools-sidebar__items tools-sidebar__items--flat">
                  {filteredTools.map(renderSidebarItem)}
                </ul>
              )}
            </nav>
          </aside>

          <div className="tools-workspace">
            <div className="tools-workspace__mobile-picker">
              <label className="tools-workspace__mobile-label" htmlFor="tools-mobile-select">
                Ferramenta ativa
              </label>
              <select
                id="tools-mobile-select"
                className="tools-workspace__mobile-select"
                value={activeToolId}
                onChange={(event) => selectTool(event.target.value)}
              >
                {tools.map((tool) => (
                  <option key={tool.id} value={tool.id} disabled={tool.status === 'soon'}>
                    {tool.name}
                    {tool.status === 'soon' ? ' (em breve)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <ToolDetail tool={activeTool} />
          </div>
        </div>
      </div>
    </section>
  )
}

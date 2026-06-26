import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  defaultProjectId,
  getProjectById,
  getProjectCategoryTag,
  getProjectGroup,
  getProjectGroupLabel,
  getProjectShortName,
  getProjectSubtitle,
  projectGroups,
  projects,
  type Project,
} from '../../data/projects'
import { useReveal } from '../../hooks/useReveal'
import './projects.css'

function ProjectLinks({ project }: { project: Project }) {
  const { links } = project

  return (
    <div className="project-detail__actions">
      {links.demo && (
        <a
          href={links.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link project-link--primary"
        >
          Abrir demonstração
          <span aria-hidden="true">↗</span>
        </a>
      )}
      {links.case && (
        <a href={links.case} className={`project-link${links.demo ? '' : ' project-link--primary'}`}>
          Ver case
        </a>
      )}
      {links.code && (
        <a href={links.code} target="_blank" rel="noopener noreferrer" className="project-link">
          Ver código
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  )
}

function ProjectDetail({ project }: { project: Project }) {
  const shortName = getProjectShortName(project.title)
  const subtitle = getProjectSubtitle(project.title)
  const categoryTag = getProjectCategoryTag(project.category)

  const brandStyle: Record<string, string> = project.brand
    ? {
        '--p-accent': project.brand.accent,
        '--p-accent-ink': project.brand.accentInk,
        '--p-surface': project.brand.surface,
      }
    : {}

  return (
    <article
      key={project.id}
      className={`project-detail${project.brand ? ' project-detail--branded' : ''}`}
      style={brandStyle as CSSProperties}
    >
      {project.brand && (
        <span className="project-detail__mark" aria-hidden="true">
          {project.brand.mark}
        </span>
      )}

      <header className="project-detail__header">
        <div className="project-detail__meta">
          <p className="project-detail__category">{project.category}</p>
          <div className="project-detail__badges">
            {project.links.demo && <span className="project-detail__badge">Demo navegável</span>}
            <span className="project-detail__badge project-detail__badge--muted">{categoryTag}</span>
          </div>
        </div>

        <div className="project-detail__title-block">
          {project.brand && (
            <span className="project-detail__glyph" aria-hidden="true">
              {project.brand.mark}
            </span>
          )}
          <div>
            <h3 className="project-detail__title">{shortName}</h3>
            {subtitle && <p className="project-detail__subtitle">{subtitle}</p>}
          </div>
        </div>
      </header>

      <p className="project-detail__description">{project.description}</p>

      <ul className="project-detail__tech" aria-label="Tecnologias utilizadas">
        {project.tech.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      <ProjectLinks project={project} />
    </article>
  )
}

function matchesSearch(project: Project, query: string): boolean {
  if (!query.trim()) return true

  const haystack = [
    project.title,
    getProjectShortName(project.title),
    project.description,
    project.category,
    ...project.tech,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query.trim().toLowerCase())
}

function normalizeProjectId(raw: string | null): string {
  if (raw && getProjectById(raw)) return raw
  return defaultProjectId
}

function getSidebarItemStyle(project: Project, isActive: boolean): CSSProperties | undefined {
  if (!isActive || !project.brand) return undefined

  return {
    '--item-accent': project.brand.accent,
  } as CSSProperties
}

export function Projects() {
  const sectionRef = useReveal<HTMLElement>()
  const listRef = useRef<HTMLElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState<'all' | string>('all')
  const [activeProjectId, setActiveProjectId] = useState(defaultProjectId)

  const activeProject = getProjectById(activeProjectId) ?? getProjectById(defaultProjectId)!
  const showGroupedList = activeGroup === 'all' && !searchQuery.trim()

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const groupOk = activeGroup === 'all' || getProjectGroup(project.category) === activeGroup
      return groupOk && matchesSearch(project, searchQuery)
    })
  }, [activeGroup, searchQuery])

  const groupCounts = useMemo(() => {
    const counts = Object.fromEntries(projectGroups.map((group) => [group, 0])) as Record<
      string,
      number
    >

    projects.forEach((project) => {
      if (matchesSearch(project, searchQuery)) {
        counts[getProjectGroup(project.category)] += 1
      }
    })

    return counts
  }, [searchQuery])

  const selectProject = (projectId: string) => {
    if (!getProjectById(projectId)) return

    setActiveProjectId(projectId)
    const url = new URL(window.location.href)
    url.searchParams.set('project', projectId)
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromUrl = normalizeProjectId(params.get('project'))
    setActiveProjectId(fromUrl)

    if (params.get('project') || window.location.hash === '#projetos') {
      window.requestAnimationFrame(() => {
        document.getElementById('projetos')?.scrollIntoView()
      })
    }
  }, [])

  useEffect(() => {
    const activeItem = listRef.current?.querySelector<HTMLElement>('.projects-sidebar__item.is-active')
    activeItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeProjectId, filteredProjects.length])

  function renderSidebarItem(project: Project) {
    const isActive = project.id === activeProjectId
    const shortName = getProjectShortName(project.title)
    const subtitle = getProjectSubtitle(project.title)

    return (
      <li key={project.id}>
        <button
          type="button"
          className={`projects-sidebar__item${isActive ? ' is-active' : ''}${project.brand ? ' has-brand' : ''}`}
          style={getSidebarItemStyle(project, isActive)}
          onClick={() => selectProject(project.id)}
          aria-current={isActive ? 'true' : undefined}
        >
          <span className="projects-sidebar__item-row">
            {project.brand && (
              <span className="projects-sidebar__mark" aria-hidden="true">
                {project.brand.mark}
              </span>
            )}
            <span className="projects-sidebar__item-copy">
              <span className="projects-sidebar__item-name">{shortName}</span>
              <span className="projects-sidebar__item-desc">
                {subtitle ?? getProjectCategoryTag(project.category)}
              </span>
            </span>
            {project.links.demo && <span className="projects-sidebar__pill">Demo</span>}
          </span>
        </button>
      </li>
    )
  }

  return (
    <section
      id="projetos"
      ref={sectionRef}
      className="section projects"
      aria-labelledby="projects-heading"
    >
      <div className="container">
        <p className="section-label reveal">02 / Projetos</p>
        <div className="projects__intro reveal">
          <h2 id="projects-heading" className="section-title projects__title">
            Projetos
          </h2>
          <p className="projects__lead">
            Demos navegáveis, integrações e automações — escolha na lista e explore o contexto
            completo à direita.
          </p>
        </div>

        <div className="projects__hub reveal">
          <aside className="projects-sidebar" aria-label="Lista de projetos">
            <div className="projects-sidebar__search">
              <label className="visually-hidden" htmlFor="projects-search">
                Buscar projeto
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
                id="projects-search"
                type="search"
                className="projects-sidebar__input"
                placeholder="Buscar…"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="projects-sidebar__clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>

            <div
              className="projects-sidebar__categories"
              role="tablist"
              aria-label="Áreas"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeGroup === 'all'}
                className={`projects-sidebar__category${activeGroup === 'all' ? ' is-active' : ''}`}
                onClick={() => setActiveGroup('all')}
              >
                Todos
                <span className="projects-sidebar__count">{projects.length}</span>
              </button>
              {projectGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  role="tab"
                  aria-selected={activeGroup === group}
                  className={`projects-sidebar__category${activeGroup === group ? ' is-active' : ''}`}
                  onClick={() => setActiveGroup(group)}
                  title={group}
                >
                  {getProjectGroupLabel(group)}
                  <span className="projects-sidebar__count">{groupCounts[group]}</span>
                </button>
              ))}
            </div>

            <nav ref={listRef} className="projects-sidebar__list" aria-label="Projetos filtrados">
              {filteredProjects.length === 0 ? (
                <p className="projects-sidebar__empty">Nenhum projeto encontrado.</p>
              ) : showGroupedList ? (
                projectGroups.map((group) => {
                  const items = filteredProjects.filter(
                    (project) => getProjectGroup(project.category) === group,
                  )
                  if (items.length === 0) return null

                  return (
                    <div key={group} className="projects-sidebar__group">
                      <p className="projects-sidebar__group-label">
                        {getProjectGroupLabel(group)}
                      </p>
                      <ul className="projects-sidebar__items">{items.map(renderSidebarItem)}</ul>
                    </div>
                  )
                })
              ) : (
                <ul className="projects-sidebar__items projects-sidebar__items--flat">
                  {filteredProjects.map(renderSidebarItem)}
                </ul>
              )}
            </nav>
          </aside>

          <div className="projects-workspace">
            <div className="projects-workspace__mobile-picker">
              <label className="projects-workspace__mobile-label" htmlFor="projects-mobile-select">
                Projeto ativo
              </label>
              <select
                id="projects-mobile-select"
                className="projects-workspace__mobile-select"
                value={activeProjectId}
                onChange={(event) => selectProject(event.target.value)}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {getProjectShortName(project.title)}
                  </option>
                ))}
              </select>
            </div>

            <ProjectDetail project={activeProject} />
          </div>
        </div>
      </div>
    </section>
  )
}

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  defaultProjectId,
  getProjectById,
  getProjectGroup,
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
      {links.case && (
        <a href={links.case} className="project-link project-link--primary">
          Ver case
        </a>
      )}
      {links.demo && (
        <a href={links.demo} target="_blank" rel="noopener noreferrer" className="project-link">
          Abrir demonstração
          <span aria-hidden="true">↗</span>
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
  const brandStyle: Record<string, string> = project.brand
    ? {
        '--p-accent': project.brand.accent,
        '--p-accent-ink': project.brand.accentInk,
        '--p-surface': project.brand.surface,
      }
    : {}

  return (
    <article
      className={`project-detail reveal is-visible${project.brand ? ' project-detail--branded' : ''}`}
      style={brandStyle as CSSProperties}
    >
      {project.brand && (
        <span className="project-detail__mark" aria-hidden="true">
          {project.brand.mark}
        </span>
      )}

      <p className="project-detail__category">{project.category}</p>
      <h3 className="project-detail__title">{project.title}</h3>
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

  const haystack = [project.title, project.description, project.category, ...project.tech]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query.trim().toLowerCase())
}

function normalizeProjectId(raw: string | null): string {
  if (raw && getProjectById(raw)) return raw
  return defaultProjectId
}

export function Projects() {
  const sectionRef = useReveal<HTMLElement>()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState<'all' | string>('all')
  const [activeProjectId, setActiveProjectId] = useState(defaultProjectId)

  const activeProject = getProjectById(activeProjectId) ?? getProjectById(defaultProjectId)!

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
            Demos navegáveis, integrações e automações — escolha um item na lista para ver o
            contexto completo.
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
                placeholder="Buscar por nome, stack ou área…"
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

            <div className="projects-sidebar__categories" role="tablist" aria-label="Áreas">
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
                >
                  {group}
                  <span className="projects-sidebar__count">{groupCounts[group]}</span>
                </button>
              ))}
            </div>

            <nav className="projects-sidebar__list" aria-label="Projetos filtrados">
              {filteredProjects.length === 0 ? (
                <p className="projects-sidebar__empty">Nenhum projeto encontrado.</p>
              ) : (
                projectGroups.map((group) => {
                  const items = filteredProjects.filter(
                    (project) => getProjectGroup(project.category) === group,
                  )
                  if (items.length === 0) return null

                  return (
                    <div key={group} className="projects-sidebar__group">
                      <p className="projects-sidebar__group-label">{group}</p>
                      <ul className="projects-sidebar__items">
                        {items.map((project) => {
                          const isActive = project.id === activeProjectId

                          return (
                            <li key={project.id}>
                              <button
                                type="button"
                                className={`projects-sidebar__item${isActive ? ' is-active' : ''}`}
                                onClick={() => selectProject(project.id)}
                                aria-current={isActive ? 'true' : undefined}
                              >
                                <span className="projects-sidebar__item-head">
                                  {project.brand && (
                                    <span className="projects-sidebar__mark" aria-hidden="true">
                                      {project.brand.mark}
                                    </span>
                                  )}
                                  <span className="projects-sidebar__item-name">
                                    {project.title}
                                  </span>
                                </span>
                                <span className="projects-sidebar__item-desc">
                                  {project.category}
                                </span>
                                {project.links.demo && (
                                  <span className="projects-sidebar__badge">Demo</span>
                                )}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })
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
                    {project.title}
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

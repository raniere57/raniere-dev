import type { CSSProperties } from 'react'
import { projects } from '../../data/projects'
import type { Project } from '../../data/projects'
import { useReveal } from '../../hooks/useReveal'
import './projects.css'

function ProjectLinks({ project }: { project: Project }) {
  const { links } = project

  return (
    <div className="project-card__actions">
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

export function Projects() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="projetos"
      ref={sectionRef}
      className="section projects"
      aria-labelledby="projects-heading"
    >
      <div className="container">
        <p className="section-label reveal">02 / Projetos</p>
        <h2 id="projects-heading" className="section-title reveal">
          Projetos
        </h2>

        <div className="projects__grid">
          {projects.map((project, index) => {
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
              className={`project-card reveal${project.brand ? ' project-card--branded' : ''}`}
              style={{ '--reveal-delay': `${index * 90}ms`, ...brandStyle } as CSSProperties}
            >
              {project.brand && (
                <span className="project-card__mark" aria-hidden="true">
                  {project.brand.mark}
                </span>
              )}
              <p className="project-card__category">{project.category}</p>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__description">{project.description}</p>

              <ul className="project-card__tech" aria-label="Tecnologias utilizadas">
                {project.tech.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>

              <ProjectLinks project={project} />
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

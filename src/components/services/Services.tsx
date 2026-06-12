import type { CSSProperties } from 'react'
import { services } from '../../data/services'
import { useReveal } from '../../hooks/useReveal'
import './services.css'

export function Services() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="section services"
      aria-labelledby="services-heading"
    >
      <div className="container">
        <p className="section-label reveal">01 / Serviços</p>
        <h2 id="services-heading" className="section-title reveal">
          Frentes de atuação
        </h2>

        <div className="services__grid">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="service-card reveal"
              style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
            >
              <span className="service-card__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__description">{service.description}</p>
              <ul className="service-card__tags">
                {service.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

import { HeroTerminal } from './HeroTerminal'
import './hero.css'

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-heading">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">
            <span className="hero__pulse" aria-hidden="true" />
            Software · Dados · Automação
          </p>

          <h1 id="hero-heading" className="hero__title">
            <span className="hero__line">Sistemas conectados.</span>
            <span className="hero__line hero__line--accent">Dados organizados.</span>
            <span className="hero__line hero__line--outline">Decisões melhores.</span>
          </h1>

          <p className="hero__lead">
            Sou <strong>Raniere Rodrigues Gomes</strong>. Desenvolvo software sob medida — web,
            mobile e desktop — e conecto sistemas, organizo dados e automatizo processos para
            transformar informação em decisão.
          </p>

          <div className="hero__actions">
            <a href="#projetos" className="hero__cta hero__cta--primary">
              Ver projetos
            </a>
            <a href="#contato" className="hero__cta hero__cta--ghost">
              Iniciar conversa
            </a>
          </div>

          <p className="hero__availability">
            <span className="hero__pulse" aria-hidden="true" />
            Disponível para novos projetos
          </p>
        </div>

        <HeroTerminal />
      </div>
    </section>
  )
}

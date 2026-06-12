import { useReveal } from '../../hooks/useReveal'
import './about.css'

const STACK_GROUPS = [
  {
    title: 'Desenvolvimento de software',
    items: ['Web', 'iOS & Android', 'Desktop', 'APIs', 'Integrações', 'Sistemas sob medida'],
  },
  {
    title: 'Dados & BI',
    items: ['Pipelines de dados', 'Data warehouse', 'Dashboards', 'Qualidade de dados'],
  },
  {
    title: 'Operação & infraestrutura',
    items: ['CI/CD', 'Containers', 'Linux', 'Monitoramento', 'Backups'],
  },
]

const PRINCIPLES = [
  {
    title: 'Problema primeiro',
    description:
      'Tecnologia é meio. Antes de qualquer linha de código, o processo, o gargalo e o resultado esperado são mapeados.',
  },
  {
    title: 'Simples e sustentável',
    description:
      'A melhor solução é a que a equipe consegue operar amanhã. Sem complexidade desnecessária e sem dependência de uma única pessoa.',
  },
  {
    title: 'Dados confiáveis',
    description:
      'Dashboard bonito com número errado é pior que planilha. Qualidade e rastreabilidade vêm antes da estética.',
  },
]

export function About() {
  const sectionRef = useReveal<HTMLElement>()

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="section about"
      aria-labelledby="about-heading"
    >
      <div className="container">
        <p className="section-label reveal">03 / Sobre</p>
        <h2 id="about-heading" className="section-title reveal">
          Como o trabalho acontece
        </h2>

        <div className="about__layout">
          <div className="about__principles">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="about__principle reveal">
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            ))}
          </div>

          <div className="about__stack reveal">
            <p className="about__stack-heading">Áreas de domínio</p>
            {STACK_GROUPS.map((group) => (
              <div key={group.title} className="about__stack-group">
                <p className="about__stack-title">{group.title}</p>
                <ul className="about__stack-items">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

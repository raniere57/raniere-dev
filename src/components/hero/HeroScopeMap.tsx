import type { CSSProperties } from 'react'

const LANES = [
  {
    id: 'software',
    title: 'Software',
    detail: 'Web · Mobile · Desktop · APIs',
  },
  {
    id: 'automacao',
    title: 'Automação',
    detail: 'Integrações · Rotinas · Back-office',
  },
  {
    id: 'dados',
    title: 'Dados',
    detail: 'ETL · BI · Dashboards · Modelagem',
  },
]

function ScopeArtifact({ id }: { id: string }) {
  if (id === 'software') {
    return (
      <div className="scope-artifact scope-artifact--software">
        <span className="artifact-window__bar" />
        <span className="artifact-code__line artifact-code__line--one">const app = build()</span>
        <span className="artifact-code__line artifact-code__line--two">api.sync(data)</span>
        <span className="artifact-code__line artifact-code__line--three">return ui</span>
        <span className="artifact-window__cursor" />
      </div>
    )
  }

  if (id === 'automacao') {
    return (
      <div className="scope-artifact scope-artifact--automacao">
        <span className="artifact-flow__line artifact-flow__line--a" />
        <span className="artifact-flow__line artifact-flow__line--b" />
        <span className="artifact-flow__node artifact-flow__node--source" />
        <span className="artifact-flow__node artifact-flow__node--router" />
        <span className="artifact-flow__node artifact-flow__node--target" />
      </div>
    )
  }

  return (
    <div className="scope-artifact scope-artifact--dados">
      <span className="artifact-data__bar artifact-data__bar--one" />
      <span className="artifact-data__bar artifact-data__bar--two" />
      <span className="artifact-data__bar artifact-data__bar--three" />
      <span className="artifact-data__base artifact-data__base--top" />
      <span className="artifact-data__base artifact-data__base--bottom" />
    </div>
  )
}

export function HeroScopeMap() {
  return (
    <div className="scope-map" aria-hidden="true">
      <div className="scope-map__grid">
        <div className="scope-map__core">
          <span />
        </div>

        {LANES.map((lane, index) => (
          <div
            key={lane.id}
            className={`scope-map__domain scope-map__domain--${lane.id}`}
            style={{ '--lane-index': index } as CSSProperties}
          >
            <ScopeArtifact id={lane.id} />
            <div className="scope-map__label">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{lane.title}</strong>
              <small>{lane.detail}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

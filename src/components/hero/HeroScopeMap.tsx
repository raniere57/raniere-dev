import type { CSSProperties } from 'react'

const LANES = [
  {
    id: 'software',
    title: 'Software',
    items: ['Web', 'Mobile', 'Desktop', 'APIs'],
  },
  {
    id: 'automacao',
    title: 'Automação',
    items: ['Integrações', 'Rotinas', 'Webhooks', 'Back-office'],
  },
  {
    id: 'dados',
    title: 'Dados',
    items: ['ETL / ELT', 'BI', 'Dashboards', 'Modelagem'],
  },
]

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
            className={`scope-map__lane scope-map__lane--${lane.id}`}
            style={{ '--lane-index': index } as CSSProperties}
          >
            <span className="scope-map__index">{String(index + 1).padStart(2, '0')}</span>
            <h2>{lane.title}</h2>
            <ul>
              {lane.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

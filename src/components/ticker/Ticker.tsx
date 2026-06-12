import './ticker.css'

const WORDS = [
  'Desenvolvimento de software',
  'Web',
  'iOS',
  'Android',
  'Desktop',
  'APIs',
  'Business Intelligence',
  'Dados',
  'ETL',
  'Automação',
  'Integrações',
  'Dashboards',
  'Infraestrutura',
]

/**
 * Faixa de palavras em rolagem contínua entre o hero e os serviços.
 * Decorativa (o conteúdo se repete nas seções) — escondida de leitores de tela.
 * O conteúdo é duplicado para o loop do marquee fechar sem emenda.
 */
export function Ticker() {
  const items = [...WORDS, ...WORDS]

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {items.map((word, index) => (
          <span key={index} className="ticker__item">
            {word}
            <span className="ticker__sep">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

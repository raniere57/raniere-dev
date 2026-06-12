import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

interface StatusLine {
  label: string
  detail: string
}

const STATUS_LINES: StatusLine[] = [
  { label: 'software', detail: 'sistemas sob medida' },
  { label: 'dados', detail: 'modelos confiáveis' },
  { label: 'automação', detail: 'rotinas conectadas' },
]

const LOG_POOL: StatusLine[] = [
  { label: 'problema', detail: 'gargalo identificado' },
  { label: 'processo', detail: 'fluxo redesenhado' },
  { label: 'integração', detail: 'sistemas alinhados' },
  { label: 'dados', detail: 'fonte validada' },
  { label: 'interface', detail: 'decisão em foco' },
  { label: 'deploy', detail: 'ambiente preparado' },
  { label: 'operação', detail: 'rotina documentada' },
  { label: 'melhoria', detail: 'próximo ciclo aberto' },
]

const VISIBLE_LOGS = 3
const LOG_INTERVAL_MS = 2600

/**
 * Painel decorativo: terminal conceitual com log "ao vivo".
 * Conteúdo é ilustrativo — escondido de leitores de tela.
 * Com prefers-reduced-motion, o log fica estático.
 */
export function HeroTerminal() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setTick((t) => t + 1), LOG_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  const visibleLogs = Array.from({ length: VISIBLE_LOGS }, (_, position) => {
    const absoluteIndex = tick + position
    return { key: absoluteIndex, ...LOG_POOL[absoluteIndex % LOG_POOL.length] }
  })

  return (
    <div className="terminal" aria-hidden="true">
      <div className="terminal__bar">
        <span className="terminal__dot" />
        <span className="terminal__dot" />
        <span className="terminal__dot" />
        <span className="terminal__bar-title">raniere@prod ~ monitor</span>
      </div>
      <div className="terminal__body">
        <p className="terminal__line" style={{ '--line-index': 0 } as CSSProperties}>
          <span className="terminal__prompt">$</span> status --servicos
        </p>
        {STATUS_LINES.map((line, index) => (
          <p
            key={line.label}
            className="terminal__line"
            style={{ '--line-index': index + 1 } as CSSProperties}
          >
            <span className="terminal__status">●</span>
            <span className="terminal__label">{line.label}</span>
            <span className="terminal__detail">{line.detail}</span>
          </p>
        ))}
        <p className="terminal__line" style={{ '--line-index': 4 } as CSSProperties}>
          <span className="terminal__prompt">$</span> tail -f operacao.log
        </p>
        {visibleLogs.map((log) => (
          <p key={log.key} className="terminal__line terminal__line--log">
            <span className="terminal__status">●</span>
            <span className="terminal__label">{log.label}</span>
            <span className="terminal__detail">{log.detail}</span>
          </p>
        ))}
        <p className="terminal__line" style={{ '--line-index': 8 } as CSSProperties}>
          <span className="terminal__prompt">$</span>
          <span className="terminal__cursor" />
        </p>
      </div>
    </div>
  )
}

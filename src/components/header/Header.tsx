import { useTheme } from '../../hooks/useTheme'
import './header.css'

const NAV_ITEMS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#ferramentas', label: 'Ferramentas' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#inicio" className="site-header__brand">
          raniere<span className="site-header__brand-accent">.dev</span>
        </a>

        <nav aria-label="Navegação principal" className="site-header__nav">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="site-header__link">
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={isDark ? 'Modo claro' : 'Modo escuro'}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line x1="12" y1="2.5" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="21.5" />
                <line x1="2.5" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="21.5" y2="12" />
                <line x1="5.3" y1="5.3" x2="7" y2="7" />
                <line x1="17" y1="17" x2="18.7" y2="18.7" />
                <line x1="5.3" y1="18.7" x2="7" y2="17" />
                <line x1="17" y1="7" x2="18.7" y2="5.3" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M20 13.5A8.5 8.5 0 0 1 10.5 4 8.5 8.5 0 1 0 20 13.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}

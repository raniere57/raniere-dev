import './footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__brand">
          raniere<span>.dev</span>
        </p>
        <p className="site-footer__note">
          © {year} Raniere Rodrigues Gomes · Desenvolvimento, dados e automação
        </p>
      </div>
    </footer>
  )
}

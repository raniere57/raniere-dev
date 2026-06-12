import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'
import './contact.css'

// Trocar pelos perfis reais antes de publicar.
const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/raniere' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raniere' },
]

const EMAIL = 'contato@raniere.dev'
const WHATSAPP_URL = 'https://wa.me/5586981902712'

const COPIED_FEEDBACK_MS = 2200

function legacyCopy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const succeeded = document.execCommand('copy')
    textarea.remove()
    if (succeeded) {
      resolve()
    } else {
      reject(new Error('execCommand copy falhou'))
    }
  })
}

function writeToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    // Clipboard API pode ser negada (permissões, iframe) — cai no fallback
    return navigator.clipboard.writeText(text).catch(() => legacyCopy(text))
  }
  return legacyCopy(text)
}

export function Contact() {
  const sectionRef = useReveal<HTMLElement>()
  const [isEmailCopied, setIsEmailCopied] = useState(false)
  const copyTimeoutRef = useRef<number>()

  useEffect(() => () => window.clearTimeout(copyTimeoutRef.current), [])

  function handleEmailClick() {
    // Não chama preventDefault: o mailto abre o app de e-mail normalmente
    writeToClipboard(EMAIL)
      .then(() => {
        setIsEmailCopied(true)
        window.clearTimeout(copyTimeoutRef.current)
        copyTimeoutRef.current = window.setTimeout(
          () => setIsEmailCopied(false),
          COPIED_FEEDBACK_MS,
        )
      })
      .catch(() => {
        // Clipboard indisponível — o mailto continua funcionando
      })
  }

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="section contact"
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className="contact__panel reveal">
          <p className="section-label">04 / Contato</p>
          <h2 id="contact-heading" className="contact__title">
            Tem um processo manual, um dado preso ou dois sistemas que não conversam?
          </h2>
          <p className="contact__lead">
            Descreva o problema. A resposta vem como um caminho técnico claro — sem enrolação e
            sem proposta genérica.
          </p>

          <div className="contact__actions">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__cta"
            >
              Chamar no WhatsApp
            </a>
            <a
              href={`mailto:${EMAIL}`}
              onClick={handleEmailClick}
              className={`contact__social contact__email${isEmailCopied ? ' contact__email--copied' : ''}`}
            >
              <span aria-live="polite">{isEmailCopied ? 'E-mail copiado ✓' : EMAIL}</span>
            </a>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social"
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

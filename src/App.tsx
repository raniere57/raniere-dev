import { Header } from './components/header/Header'
import { Hero } from './components/hero/Hero'
import { Ticker } from './components/ticker/Ticker'
import { Services } from './components/services/Services'
import { Projects } from './components/projects/Projects'
import { About } from './components/about/About'
import { Contact } from './components/contact/Contact'
import { Footer } from './components/footer/Footer'
import { useSmoothAnchors } from './hooks/useSmoothAnchors'

export function App() {
  useSmoothAnchors()

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Ticker />
        <Services />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

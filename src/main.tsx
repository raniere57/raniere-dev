import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { clearChunkReloadFlag, stripChunkReloadQuery } from './utils/chunkReload'
import './styles/global.css'

// Recarregar a página sempre começa do topo (sem restaurar scroll anterior)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

clearChunkReloadFlag()
stripChunkReloadQuery()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no documento')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

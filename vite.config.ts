import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const SIGMA_DIST = join(__dirname, 'sigma', 'dist')

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
}

/**
 * Em dev, serve o demo Sigma já buildado (sigma/dist) em /sigma, espelhando o
 * que o GitHub Pages faz em produção. Rode `npm --prefix sigma run build` antes.
 * Em produção o link /sigma/ é servido pelo Pages — este plugin é só para dev.
 */
function serveSigmaDemo(): Plugin {
  return {
    name: 'serve-sigma-demo',
    configureServer(server) {
      server.middlewares.use('/sigma', (req, res, next) => {
        if (!existsSync(SIGMA_DIST)) return next()

        const rawPath = (req.url ?? '/').split('?')[0]
        const relative = normalize(rawPath).replace(/^(\.\.[/\\])+/, '')
        let filePath = join(SIGMA_DIST, relative)

        if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
          filePath = join(SIGMA_DIST, 'index.html') // fallback SPA
        }

        res.setHeader('Content-Type', MIME[extname(filePath)] ?? 'application/octet-stream')
        res.end(readFileSync(filePath))
      })
    },
  }
}

// Domínio customizado (raniere.dev) → base '/'.
// Se um dia servir como project page (user.github.io/repo), trocar para '/repo/'.
export default defineConfig({
  plugins: [react(), serveSigmaDemo()],
  base: '/',
  server: {
    // Permite que o ambiente atribua a porta (PORT); 5173 como padrão.
    port: Number(process.env.PORT) || 5173,
  },
})

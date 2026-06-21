import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
}

// Demos buildados como apps independentes, servidos em subpaths.
const DEMOS = ['sigma', 'sentinel', 'insightgate', 'dataforge', 'signal']

/**
 * Em dev, serve os demos já buildados (<demo>/dist) em /<demo>, espelhando o que
 * o GitHub Pages faz em produção. Rode `npm --prefix <demo> run build` antes.
 * Em produção os links /<demo>/ são servidos pelo Pages — o plugin é só p/ dev.
 */
function serveDemos(): Plugin {
  return {
    name: 'serve-demos',
    configureServer(server) {
      for (const demo of DEMOS) {
        const distDir = join(__dirname, demo, 'dist')
        server.middlewares.use(`/${demo}`, (req, res, next) => {
          if (!existsSync(distDir)) return next()

          const rawPath = (req.url ?? '/').split('?')[0]
          const relative = normalize(rawPath).replace(/^(\.\.[/\\])+/, '')
          let filePath = join(distDir, relative)

          if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
            filePath = join(distDir, 'index.html') // fallback SPA
          }

          res.setHeader('Content-Type', MIME[extname(filePath)] ?? 'application/octet-stream')
          res.end(readFileSync(filePath))
        })
      }
    },
  }
}

// Domínio customizado (raniere.dev) → base '/'.
// Se um dia servir como project page (user.github.io/repo), trocar para '/repo/'.
export default defineConfig({
  plugins: [react(), serveDemos()],
  base: '/',
  server: {
    // Permite que o ambiente atribua a porta (PORT); 5173 como padrão.
    port: Number(process.env.PORT) || 5173,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Domínio customizado (raniere.dev) → base '/'.
// Se um dia servir como project page (user.github.io/repo), trocar para '/repo/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    // Permite que o ambiente atribua a porta (PORT); 5173 como padrão.
    port: Number(process.env.PORT) || 5173,
  },
})

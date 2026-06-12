# raniere.dev

Landing page pessoal — portfólio e vitrine de serviços de desenvolvimento de software, dados, BI e automação.

100% estática (React + Vite + TypeScript), hospedada no GitHub Pages com domínio customizado.

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
```

## Deploy (GitHub Pages)

O workflow em `.github/workflows/deploy.yml` publica automaticamente a cada push na branch `main`.

Configuração única no repositório:

1. **Settings → Pages → Source**: selecionar **GitHub Actions**.
2. **Settings → Pages → Custom domain**: `raniere.dev` (o arquivo `public/CNAME` já mantém o domínio a cada deploy).
3. No DNS do domínio, apontar:
   - `raniere.dev` → registros `A` do GitHub Pages (`185.199.108.153`, `.109.`, `.110.`, `.111.`)
   - ou `CNAME` de `www` → `<usuario>.github.io`
4. Marcar **Enforce HTTPS** depois que o certificado for emitido.

> Se um dia o site for servido como *project page* (`usuario.github.io/repo`) em vez de domínio customizado, ajustar `base` em `vite.config.ts` para `'/repo/'`.

## Estrutura

```
src/
├── components/     # um diretório por seção (tsx + css)
├── hooks/          # useTheme (dark/light + localStorage), useReveal (scroll)
├── data/           # serviços e projetos (editar aqui para atualizar conteúdo)
└── styles/         # tokens.css (design tokens) e global.css
```

## Conteúdo

- **Projetos**: editar `src/data/projects.ts` — os links de case/demo/código são placeholders (`demo.raniere.dev`, `github.com/raniere`); trocar pelos reais.
- **Serviços**: editar `src/data/services.ts`.
- **E-mail e redes**: editar constantes em `src/components/contact/Contact.tsx`.

## Tema

Dark é o padrão. O toggle no header alterna para light e persiste em `localStorage` (`theme`). Um script inline no `index.html` aplica o tema antes do primeiro paint para evitar flash.

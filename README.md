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
src/                # portfólio (raniere.dev)
├── components/     # um diretório por seção (tsx + css)
├── hooks/          # useTheme (dark/light + localStorage), useReveal (scroll)
├── data/           # serviços e projetos (editar aqui para atualizar conteúdo)
└── styles/         # tokens.css (design tokens) e global.css

sigma/              # demo do projeto Sigma (raniere.dev/sigma/)
├── src/            # app React (Vite, base '/sigma/')
│   ├── components/LoginScreen.tsx   # login pré-preenchido (cosmético)
│   ├── components/DemoBackPill.tsx  # pílula de volta ao portfólio
│   └── lib/mockBackend.ts           # intercepta fetch → dados fictícios
```

### Demo Sigma

`sigma/` é uma app Vite independente, buildada com `base: '/sigma/'` e publicada
em `dist/sigma` pelo mesmo workflow do GitHub Actions. Sem backend: `mockBackend.ts`
intercepta `window.fetch` e responde aos endpoints da API com dados fictícios
(operadora "NovaConecta" — nenhum nome real de cliente). A IA é mockada com
respostas canned. Login já preenchido entra direto.

```bash
npm --prefix sigma install
npm --prefix sigma run dev      # serve em /sigma/
npm --prefix sigma run build
```

> Limitação conhecida: por ser SPA em subpath no Pages, recarregar uma sub-rota
> profunda (ex.: `/sigma/agents`) pode dar 404 — entrar pela raiz `/sigma/` e
> navegar pela interface funciona normalmente.

## Conteúdo

- **Projetos**: editar `src/data/projects.ts` — os links de case/demo/código são placeholders (`demo.raniere.dev`, `github.com/raniere`); trocar pelos reais.
- **Serviços**: editar `src/data/services.ts`.
- **E-mail e redes**: editar constantes em `src/components/contact/Contact.tsx`.

## Tema

Dark é o padrão. O toggle no header alterna para light e persiste em `localStorage` (`theme`). Um script inline no `index.html` aplica o tema antes do primeiro paint para evitar flash.

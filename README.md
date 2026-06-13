# raniere.dev

Meu site profissional: portfólio, vitrine de projetos e ponto de contato.

O objetivo dele é simples: mostrar como eu trabalho na interseção entre
**software, automação e dados**. Sem tentar parecer uma empresa enorme, sem
landing page genérica e sem esconder o que importa atrás de buzzword.

[raniere.dev](https://raniere.dev)

## A ideia

`raniere.dev` é uma primeira conversa comigo.

Ele apresenta:

- o tipo de problema que eu resolvo;
- os serviços que eu consigo entregar;
- projetos e demos navegáveis;
- uma forma direta de entrar em contato.

A linguagem visual segue a mesma linha do trabalho que quero comunicar:
técnica, organizada, escura, com movimento suficiente para parecer viva, mas
sem virar enfeite gratuito.

## O que o site mostra

**Software sob medida**

Aplicações web, mobile, desktop, APIs e sistemas internos.

**Automação e integrações**

Rotinas manuais, sistemas que não conversam, processos repetitivos e fluxos de
back-office.

**Dados e BI**

Pipelines, modelagem, dashboards, indicadores e organização de informação para
decisão.

## Projeto em destaque

### Sigma

Sigma é um sistema de atendimento com IA.

Para uma pessoa de negócio, ele resolve este problema: clientes precisam ser
atendidos com contexto, regras e histórico, sem depender de respostas soltas ou
operação manual demais.

Por baixo, ele organiza agentes por área, conecta ferramentas como ERP e bancos
de dados, usa base de conhecimento e registra cada execução. A demo publicada em
`/sigma/` usa dados fictícios e backend mockado.

### Sentinel QA

Sentinel é uma plataforma de monitoria de qualidade de atendimentos.

Ele resolve este problema: equipes de atendimento precisam saber se as conversas
seguem o padrão esperado, sem depender de auditoria manual amostra por amostra.

Por baixo, define modelos e critérios de avaliação, pontua cada atendimento com
IA, acompanha agentes e gera relatórios e dashboards. A demo publicada em
`/sentinel/` usa dados fictícios.

## Bastidores

O site principal é uma aplicação estática em React, Vite e TypeScript. Cada demo
vive como uma aplicação Vite independente dentro do mesmo repositório, com `base`
própria (`/sigma/`, `/sentinel/`), e é publicada junto no GitHub Pages.

```text
src/
  components/    seções do portfólio
  data/          projetos e serviços
  hooks/         tema, reveals e âncoras suaves
  styles/        tokens e estilos globais

sigma/
  src/           demo navegável do Sigma (backend mockado)

sentinel/
  src/           demo navegável do Sentinel QA (dados fictícios)
```

## Stack

- React
- TypeScript
- Vite
- CSS modular por seção
- GitHub Pages
- GitHub Actions

## Manutenção

Isto aqui não é o foco do README, mas fica registrado para evolução do site:

```bash
npm install
npm run dev
npm run build
```

Demos (Sigma / Sentinel):

```bash
npm --prefix sigma install && npm --prefix sigma run build
npm --prefix sentinel install && npm --prefix sentinel run build
```

> Os links `/sigma/` e `/sentinel/` no portfólio são servidos pelo Pages em
> produção. Para abri-los no dev local, builde cada demo antes — o `vite.config.ts`
> serve `<demo>/dist` no subpath correspondente.

O deploy acontece automaticamente a cada push na `main`, usando
`.github/workflows/deploy.yml`.

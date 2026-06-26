# Roadmap — Ferramentas e widgets (raniere.dev)

Extensões úteis no site usando **APIs públicas** ou **lógica 100% client-side**, sem backend próprio (GitHub Pages).

Ordem de execução acordada: começar pelo **item 4**, depois 5 → 9.

---

## Fase 1 — Micro-ferramentas client-side (item 4)

Tudo roda no browser; zero API externa. Encaixa na seção **Ferramentas** (`#ferramentas`) ou subpath `/tools/`.

| # | Ferramenta | Descrição | Status |
|---|------------|-----------|--------|
| 4.1 | **JSON ↔ CSV** | Colar JSON → tabela/CSV; colar CSV → JSON. Download do resultado. | pendente |
| 4.2 | **Validador CPF/CNPJ** | Input → válido/inválido, formatação, dígitos verificadores. | pendente |
| 4.3 | **Testador de regex** | Pattern + flags + texto de teste → matches destacados. | pendente |
| 4.4 | **Próximas execuções cron** | Expressão cron + timezone → próximas N datas legíveis. | pendente |
| 4.5 | **Diff JSON / texto** | Dois blocos → diff visual (linhas +/-). | pendente |

### Notas técnicas (fase 1)

- UI alinhada ao site: tokens CSS, tema claro/escuro, mobile ok.
- Cada ferramenta pode ser um card com expand/modal ou abas num hub único.
- Privacidade: badge “processado no seu navegador — nada é enviado”.

---

## Fase 2 — Clima / horário local (item 5)

| # | Feature | API | Status |
|---|---------|-----|--------|
| 5.1 | Clima discreto no footer ou Sobre | [Open-Meteo](https://open-meteo.com/) (sem key, CORS ok) | pendente |
| 5.2 | “Disponível · Teresina, PI” + hora local | `Intl` + geolocalização opcional ou cidade fixa | pendente |

---

## Fase 3 — Mapa de demos + métricas reais (item 6)

| # | Feature | Fonte | Status |
|---|---------|-------|--------|
| 6.1 | Healthcheck das demos (`/sigma/`, `/synkin/`, …) | `fetch` no próprio domínio | pendente |
| 6.2 | Stars / último commit por repo demo | GitHub API (público) | pendente |
| 6.3 | Card “Bastidores” colapsável na seção Sobre | combina 6.1 + 6.2 | pendente |

---

## Fase 4 — Widgets de dados / APIs públicas (item 7)

Exemplos como **demo de consumo de API**, não decoração financeira.

| # | Widget | API sugerida | Status |
|---|--------|--------------|--------|
| 7.1 | Câmbio USD/BRL (ou EUR) | [Frankfurter](https://www.frankfurter.app/) ou AwesomeAPI | pendente |
| 7.2 | Consulta CEP → endereço | ViaCEP | pendente |
| 7.3 | População / município (IBGE) | servicodados.ibge.gov.br | pendente |

---

## Fase 5 — Contato inteligente (item 8)

| # | Feature | Serviço | Status |
|---|---------|---------|--------|
| 8.1 | Formulário que envia e-mail sem backend | Formspree / Web3Forms / Getform | pendente |
| 8.2 | Embed agendamento de call (opcional) | Cal.com | pendente |

---

## Fase 6 — Preview de links / Open Graph (item 9)

| # | Feature | API | Status |
|---|---------|-----|--------|
| 9.1 | Colar URL → title, description, imagem | Microlink.io ou similar (free tier) | pendente |
| 9.2 | UI tipo “link unfurl” + copiar metadados | — | pendente |

---

## Onde viver no site

```
Opção A (recomendada para fase 1):
  #ferramentas — seção no scroll do portfólio (hub com abas/cards)

Opção B (se crescer muito):
  /tools/ — mini-app Vite no monorepo (igual demos), link no header/footer
```

Decisão atual: **Opção A** para 4.1–4.2; reavaliar `/tools/` se passar de ~5 ferramentas.

---

## Checklist antes de publicar cada feature

- [ ] Funciona em tema claro e escuro
- [ ] Mobile ok
- [ ] Sem API key secreta no front
- [ ] CORS testado (fases 2+)
- [ ] Não pesa o LCP (lazy load / seção abaixo da dobra)
- [ ] README atualizado se novo subpath

---

## Histórico

| Data | Nota |
|------|------|
| 2026-06-22 | Roadmap criado; fase 1 (item 4) priorizada. |

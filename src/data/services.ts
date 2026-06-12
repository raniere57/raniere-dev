export interface Service {
  id: string
  title: string
  description: string
  tags: string[]
}

// Linha de cima: frentes de sistema/software. Linha de baixo: dados e infraestrutura.
export const services: Service[] = [
  {
    id: 'software',
    title: 'Desenvolvimento de software',
    description:
      'Aplicações sob medida para qualquer plataforma — web, mobile (iOS e Android) e desktop — construídas para durar e evoluir junto com o negócio.',
    tags: ['Web', 'iOS & Android', 'Desktop'],
  },
  {
    id: 'automacao',
    title: 'Automações e integrações',
    description:
      'Processos manuais viram rotinas automáticas. Sistemas que não conversavam passam a trocar dados sem intervenção humana.',
    tags: ['Integrações', 'Rotinas automáticas', 'Webhooks'],
  },
  {
    id: 'apis',
    title: 'APIs e sistemas internos',
    description:
      'Camadas de serviço que conectam ERP, CRM e ferramentas internas, com documentação, versionamento e segurança.',
    tags: ['API design', 'ERP / CRM', 'Back-office'],
  },
  {
    id: 'bi',
    title: 'Business Intelligence e dashboards',
    description:
      'Painéis que respondem perguntas de verdade. Indicadores confiáveis, atualizados e desenhados para quem decide.',
    tags: ['Dashboards', 'KPIs', 'Self-service BI'],
  },
  {
    id: 'dados',
    title: 'Engenharia de dados',
    description:
      'Pipelines de ETL/ELT que tiram dados de onde estão presos e entregam onde geram valor — com qualidade e rastreabilidade.',
    tags: ['ETL / ELT', 'Data warehouse', 'Modelagem'],
  },
  {
    id: 'infra',
    title: 'Deploy e infraestrutura',
    description:
      'Ambientes Linux e Docker configurados para rodar com estabilidade: deploy automatizado, monitoramento e backup.',
    tags: ['Linux', 'Containers', 'CI/CD'],
  },
]

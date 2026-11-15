// Кейсы: реальные проекты для заказчиков. Список для /cases/ и карточки на главной.

export type CaseItem = {
  slug: string
  title: string
  client: string
  lead: string
  date: string // для подписи, по-русски
  cover: string
  tags: string[]
}

export const cases: CaseItem[] = [
  {
    slug: 'olimpfish',
    title: 'Редизайн интернет-магазина «Олимп Фиш»',
    client: 'olimp-fish.ru · рыба, икра и морепродукты, Москва',
    lead: 'Бесплатный концепт для холодного предложения превратился в заказ: за три дня перенёс новый дизайн на их WordPress и WooCommerce, не меняя логику магазина. Цены, доставка, оплата, формы и письма работают как раньше.',
    date: 'ноябрь 2026',
    cover: '/cases/olimpfish/cover.webp',
    tags: ['WordPress', 'WooCommerce', 'WoodMart', 'PHP', 'CSS', 'JS'],
  },
]

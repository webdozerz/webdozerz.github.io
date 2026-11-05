// Состояние интерфейса концепта rkdon: выезжающее меню, панель «Отдел продаж», демо-чат.
// Корзины и списка нет — у оригинала заказ идёт звонком и письмом в отдел продаж.
export const useRkdonUi = () => {
  const menu = useState('rk-menu', () => false)
  const sales = useState('rk-sales', () => false)
  const chat = useState('rk-chat', () => false)
  const chatLog = useState<{ from: 'op' | 'me'; text: string }[]>('rk-chat-log', () => [
    { from: 'op', text: 'Здравствуйте! Я Андрей, менеджер «Рыбокомбината Донской». Подскажу по ассортименту, фасовке и отгрузке.' },
  ])
  const closeAll = () => {
    menu.value = false
    sales.value = false
    chat.value = false
  }
  const openChat = () => {
    sales.value = false
    menu.value = false
    chat.value = true
  }
  return { menu, sales, chat, chatLog, closeAll, openChat }
}

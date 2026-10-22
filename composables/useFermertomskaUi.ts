// Общие окна концепта «Куендатское»: вход, обратный звонок, «Купить в 1 клик», поиск, меню.
export type FtModal = { kind: 'login' } | { kind: 'callback' } | { kind: 'oneclick'; productId: string }

export const useFermertomskaUi = () => {
  const modal = useState<FtModal | null>('ft-modal', () => null)
  const menuOpen = useState('ft-menu', () => false)
  const searchOpen = useState('ft-search', () => false)
  const user = useState<string | null>('ft-user', () => null)

  const open = (value: FtModal) => {
    menuOpen.value = false
    searchOpen.value = false
    modal.value = value
  }
  const close = () => {
    modal.value = null
  }

  return { modal, menuOpen, searchOpen, user, open, close }
}

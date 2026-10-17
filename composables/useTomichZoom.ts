// Просмотр фото во весь экран (у оригинала — fancybox): список картинок и текущий индекс.
export const useTomichZoom = () => {
  const state = useState<{ list: string[]; index: number; title: string } | null>(
    'tm-zoom',
    () => null,
  )
  const open = (list: string[], title = '', index = 0) => {
    state.value = { list, index, title }
  }
  const close = () => {
    state.value = null
  }
  const step = (delta: number) => {
    if (!state.value) return
    const n = state.value.list.length
    state.value = { ...state.value, index: (state.value.index + delta + n) % n }
  }
  return { state, open, close, step }
}

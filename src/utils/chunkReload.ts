/** Chave compartilhada com o script inline em index.html */
export const CHUNK_RELOAD_KEY = 'app-chunk-reload'

export function clearChunkReloadFlag(): void {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY)
}

export function stripChunkReloadQuery(): void {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('_cb')) return
  url.searchParams.delete('_cb')
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}

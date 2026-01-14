export type Route =
  | { name: 'list' }
  | { name: 'edit'; id: string }
  | { name: 'print'; id: string }

function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, '') || '/'
  const parts = h.split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'list' }
  if (parts[0] === 'trip' && parts[1]) return { name: 'edit', id: parts[1] }
  if (parts[0] === 'print' && parts[1]) return { name: 'print', id: parts[1] }
  return { name: 'list' }
}

export function useHashRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(parseHash(window.location.hash))

  function nav(r: Route) {
    switch (r.name) {
      case 'list':
        window.location.hash = '/'
        break
      case 'edit':
        window.location.hash = `/trip/${r.id}`
        break
      case 'print':
        window.location.hash = `/print/${r.id}`
        break
    }
  }

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return [route, nav]
}

import { useEffect, useState } from 'react'


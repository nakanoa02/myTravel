import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import type { MapRef } from 'react-map-gl/maplibre'
import { Map, Marker } from 'react-map-gl/maplibre'

type Place = {
  label: string
  lat: number
  lng: number
}

type Spot = {
  name: string
  address: string
}

export default function MapTab() {
  const styleUrl = import.meta.env.VITE_MAP_STYLE_URL as string | undefined
  const mapRef = useRef<MapRef | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState<string | null>(null)
  const [mapFailed, setMapFailed] = useState(false)

  const initialViewState = useMemo(
    // Busan area
    () => ({ latitude: 35.1796, longitude: 129.0756, zoom: 11 }),
    []
  )

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setError(null)
        // Load spots from mock API
        const res = await fetch('/mock/api/spots.json', { headers: { Accept: 'application/json' } })
        if (!res.ok) throw new Error(`Failed to load spots: ${res.status}`)
        const spots: Spot[] = await res.json()

        // Geocode all addresses
        const results: Place[] = []
        for (const s of spots) {
          const q = s.address?.trim()
          if (!q) continue
          try {
            const url = new URL('https://nominatim.openstreetmap.org/search')
            url.searchParams.set('format', 'json')
            url.searchParams.set('limit', '1')
            url.searchParams.set('q', q)
            const geoRes = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
            if (!geoRes.ok) throw new Error(`Geocoding failed: ${geoRes.status}`)
            const data: Array<{ lat: string; lon: string }> = await geoRes.json()
            if (!data || data.length === 0) continue
            const top = data[0]
            const lat = parseFloat(top.lat)
            const lng = parseFloat(top.lon)
            results.push({ label: s.name || q, lat, lng })
          } catch (e) {
            // skip failed ones, continue
            console.warn('Geocoding failed for', q, e)
          }
        }
        if (!mounted) return
        setPlaces(results)
        // Fit bounds to include all markers
        const m = mapRef.current
        if (m && results.length > 0) {
          const minLat = Math.min(...results.map(r => r.lat))
          const maxLat = Math.max(...results.map(r => r.lat))
          const minLng = Math.min(...results.map(r => r.lng))
          const maxLng = Math.max(...results.map(r => r.lng))
          m.getMap().fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40 })
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'スポット情報の読み込みに失敗しました')
      }
    })()
    return () => { mounted = false }
  }, [])

  const hasCriticalError = !styleUrl || mapFailed

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      {error && <Alert severity="warning">{error}</Alert>}
      <Box sx={{ position: 'relative', width: '100%', height: 480, borderRadius: 2, overflow: 'hidden', boxShadow: 'var(--shadow)', bgcolor: 'background.default' }}>
        {hasCriticalError ? (
          <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
            <img src="/images/placeholder.svg" alt="Map placeholder" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
        ) : (
          <Map
            ref={mapRef}
            initialViewState={initialViewState}
            mapStyle={styleUrl}
            style={{ width: '100%', height: '100%' }}
            onError={() => setMapFailed(true)}
          >
            {places.map((p, i) => (
              <Marker key={i} longitude={p.lng} latitude={p.lat} anchor="bottom">
                <Box sx={{ transform: 'translateY(4px)', color: '#e11d48' }} title={p.label}>📍</Box>
              </Marker>
            ))}
          </Map>
        )}
      </Box>
    </Stack>
  )
}

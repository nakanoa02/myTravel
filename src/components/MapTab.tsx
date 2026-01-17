import { useCallback, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import type { MapRef } from 'react-map-gl/maplibre'
import { Map, Marker } from 'react-map-gl/maplibre'

type Place = {
  label: string
  lat: number
  lng: number
}

const PRESET_ADDRESSES = [
  '東京都千代田区丸の内1-9-1 東京駅',
  '東京都墨田区押上1-1-2 東京スカイツリー',
  '東京都台東区上野公園8-36 上野動物園',
]

export default function MapTab() {
  const styleUrl = import.meta.env.VITE_MAP_STYLE_URL as string | undefined
  const mapRef = useRef<MapRef | null>(null)
  const [query, setQuery] = useState(PRESET_ADDRESSES[0])
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState<string | null>(null)

  const initialViewState = useMemo(
    () => ({ latitude: 35.681236, longitude: 139.767125, zoom: 10 }),
    []
  )

  const addPlace = useCallback(async () => {
    setError(null)
    const q = query?.trim()
    if (!q) {
      setError('住所を入力してください')
      return
    }
    try {
      const url = new URL('https://nominatim.openstreetmap.org/search')
      url.searchParams.set('format', 'json')
      url.searchParams.set('limit', '1')
      url.searchParams.set('q', q)
      const res = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
        },
      })
      if (!res.ok) {
        throw new Error(`Geocoding failed: ${res.status}`)
      }
      const data: Array<{ lat: string; lon: string; display_name: string }> = await res.json()
      if (!data || data.length === 0) {
        setError('住所が見つかりませんでした')
        return
      }
      const top = data[0]
      const lat = parseFloat(top.lat)
      const lng = parseFloat(top.lon)
      const newPlace: Place = { label: q, lat, lng }
      setPlaces((prev) => [...prev, newPlace])
      // Fly to the new place
      const m = mapRef.current
      if (m) {
        m.getMap().flyTo({ center: [lng, lat], zoom: 14, essential: true })
      }
    } catch (e: any) {
      setError(e?.message ?? '位置情報の取得に失敗しました')
    }
  }, [query])

  if (!styleUrl) {
    return <Alert severity="error">地図スタイルURL (VITE_MAP_STYLE_URL) が未設定です。</Alert>
  }

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="住所"
          placeholder="例: 東京都千代田区丸の内1-9-1 東京駅"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="contained" onClick={addPlace}>追加</Button>
      </Stack>
      {error && <Alert severity="warning">{error}</Alert>}
      <Box sx={{ position: 'relative', width: '100%', height: 480, borderRadius: 2, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <Map
          ref={mapRef}
          initialViewState={initialViewState}
          mapStyle={styleUrl}
          style={{ width: '100%', height: '100%' }}
        >
          {places.map((p, i) => (
            <Marker key={i} longitude={p.lng} latitude={p.lat} anchor="bottom">
              <Box sx={{ transform: 'translateY(4px)', color: '#e11d48' }}>📍</Box>
            </Marker>
          ))}
        </Map>
      </Box>
    </Stack>
  )
}


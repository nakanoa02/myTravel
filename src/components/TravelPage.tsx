import { useEffect, useState } from 'react'
import axios from 'axios'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Link from '@mui/material/Link'

type PlanItem = {
  photoUrl?: string
  title: string
  startTime: string // HH:MM
  endTime: string // HH:MM
  place: string
  tags?: string[]
  importance?: 'main' | 'minor'
  webUrl?: string
  webURL?: string
}

type Day = {
  date: string // YYYY-MM-DD
  items: PlanItem[]
}

// Load itinerary from JSON (to be replaced by backend API in the future)
async function fetchItinerary() {
  const res = await axios.get<Day[]>('/mock/api/itinerary.json')
  return res.data
}

function compareTime(a?: string, b?: string) {
  return (a ?? '').localeCompare(b ?? '')
}

function TimeRangeText({ start, end }: { start?: string; end?: string }) {
  const s = start?.trim()
  const e = end?.trim()
  // Show only one value if one is missing or both are equal.
  if (s && (!e || s === e)) {
    return <time dateTime={s}>{s}</time>
  }
  if (!s && e) {
    return <time dateTime={e}>{e}</time>
  }
  if (s && e && s !== e) {
    return (
      <>
        <time dateTime={s}>{s}</time>
        {' '}–{' '}
        <time dateTime={e}>{e}</time>
      </>
    )
  }
  return null
}


export default function TravelPage() {
  const [showMinor, setShowMinor] = useState(false)
  const [itinerary, setItinerary] = useState<Day[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchItinerary()
        if (mounted) setItinerary(data)
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'データの取得に失敗しました')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])
  return (
    <Container maxWidth="md" className="page">
      <Box className="page-header">
        <Box className="filter-row">
          <FormControlLabel
            label={<Typography variant="body2">補助項目を表示する</Typography>}
            control={<Switch checked={showMinor} onChange={(e) => setShowMinor(e.target.checked)} />}
          />
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      )}

      {!loading && !error && itinerary.map((day, dIdx) => (
        <section key={day.date} className="day">
          <Typography variant="h6" className="day-title">
            <time dateTime={day.date}>{day.date}</time>
          </Typography>
          <Stack component="ul" className="cards" spacing={2}>
            {(Array.isArray(day.items) ? [...day.items] : [])
              .filter((it) => showMinor || it.importance !== 'minor')
              .sort((i1, i2) => compareTime(i1.startTime, i2.startTime))
              .map((item, idx) => (
              <Card
                key={(day.date || String(dIdx)) + '-' + idx}
                component="li"
                className="card"
                variant="outlined"
                elevation={0}
                sx={{ borderColor: 'divider', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', borderRadius: '12px' }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Box sx={{ width: { xs: '100%', sm: 240 } }}>
                    {item.photoUrl ? (
                      <CardMedia component="img" src={item.photoUrl} alt={item.title?.trim() || 'タイトルなし'} sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '10px' }} />
                    ) : (
                      <Box className="img-placeholder" sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '10px' }} aria-label={item.title?.trim() || 'タイトルなし'} />
                    )}
                  </Box>
                  <CardContent sx={{ p: 0, flex: 1 }}>
                    <Typography variant="h6" className="card-title">{item.title?.trim() || 'タイトルなし'}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" className="meta-row">
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2" className="time-range">
                        <TimeRangeText start={item.startTime} end={item.endTime} />
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" className="meta-row">
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2" className="place">{item.place ?? ''}</Typography>
                    </Stack>
                    {(item.webUrl || item.webURL) && (
                      <Stack direction="row" spacing={1} alignItems="center" className="meta-row">
                        <OpenInNewIcon fontSize="small" />
                        <Link
                          href={(item.webUrl ?? item.webURL) || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          variant="body2"
                        >
                          Webサイトを開く
                        </Link>
                      </Stack>
                    )}
                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" className="tags">
                        {item.tags.map((t) => (
                          <Chip key={t} label={t} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Stack>
              </Card>
            ))}
          </Stack>
        </section>
      ))}
    </Container>
  )
}

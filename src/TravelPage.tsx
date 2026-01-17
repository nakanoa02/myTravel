import { useState } from 'react'
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
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'

type PlanItem = {
  photoUrl?: string
  title: string
  startTime: string // HH:MM
  endTime: string // HH:MM
  place: string
  tags?: string[]
  importance?: 'main' | 'minor'
}

type Day = {
  date: string // YYYY-MM-DD
  items: PlanItem[]
}

const itinerary: Day[] = [
  {
    date: '2025-03-20',
    items: [
      {
        photoUrl: '/images/placeholder.svg',
        title: '朝食カフェ',
        startTime: '08:30',
        endTime: '09:30',
        place: '中目黒 Cafe A',
        tags: ['food', 'cafe']
      },
      {
        photoUrl: '/images/placeholder.svg',
        title: '電車で移動',
        startTime: '09:30',
        endTime: '10:00',
        place: '中目黒駅 → 代々木駅',
        tags: ['move'],
        importance: 'minor'
      },
      {
        photoUrl: '/images/placeholder.svg',
        title: '美術館',
        startTime: '10:00',
        endTime: '12:00',
        place: '東京都現代美術館',
        tags: ['art', 'museum']
      },
      {
        photoUrl: '/images/placeholder.svg',
        title: 'ランチ',
        startTime: '12:30',
        endTime: '13:30',
        place: '銀座 Restaurant B',
        tags: ['food']
      },
    ],
  },
  {
    date: '2025-03-21',
    items: [
      {
        photoUrl: '/images/placeholder.svg',
        title: '散策',
        startTime: '09:00',
        endTime: '11:00',
        place: '浅草〜上野エリア',
        tags: ['walk']
      },
      {
        photoUrl: '/images/placeholder.svg',
        title: 'スイーツタイム',
        startTime: '15:00',
        endTime: '16:00',
        place: '表参道 パティスリー C',
        tags: ['dessert', 'cafe']
      },
    ],
  },
]

function compareTime(a: string, b: string) {
  return a.localeCompare(b)
}

export default function TravelPage() {
  const [showMinor, setShowMinor] = useState(false)
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

      {itinerary.map((day) => (
        <section key={day.date} className="day">
          <Typography variant="h6" className="day-title">
            <time dateTime={day.date}>{day.date}</time>
          </Typography>
          <Stack component="ul" className="cards" spacing={2}>
            {[...day.items]
              .filter((it) => showMinor || it.importance !== 'minor')
              .sort((i1, i2) => compareTime(i1.startTime, i2.startTime))
              .map((item, idx) => (
              <Card
                key={day.date + '-' + idx}
                component="li"
                className="card"
                variant="outlined"
                elevation={0}
                sx={{ borderColor: 'divider', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', borderRadius: '12px' }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Box sx={{ width: { xs: '100%', sm: 240 } }}>
                    {item.photoUrl ? (
                      <CardMedia component="img" src={item.photoUrl} alt={item.title} sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '10px' }} />
                    ) : (
                      <Box className="img-placeholder" sx={{ width: '100%', aspectRatio: '16/9', borderRadius: '10px' }} aria-label={item.title} />
                    )}
                  </Box>
                  <CardContent sx={{ p: 0, flex: 1 }}>
                    <Typography variant="h6" className="card-title">{item.title}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" className="meta-row">
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2" className="time-range">
                        <time dateTime={item.startTime}>{item.startTime}</time>
                        {' '}–{' '}
                        <time dateTime={item.endTime}>{item.endTime}</time>
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" className="meta-row">
                      <LocationOnIcon fontSize="small" />
                      <Typography variant="body2" className="place">{item.place}</Typography>
                    </Stack>
                    {item.tags && item.tags.length > 0 && (
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

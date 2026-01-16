import './App.css'
import TravelPage from './TravelPage'
import Container from '@mui/material/Container'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

function App() {
  const [tab, setTab] = useState(0)

  return (
    <Container maxWidth="md" className="page">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          aria-label="top-level tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="いくとこリスト" />
          <Tab label="新しいタブ1" />
          <Tab label="新しいタブ2" />
          <Tab label="新しいタブ3" />
        </Tabs>
      </Box>

      {/* Tab panels */}
      <Box role="tabpanel" hidden={tab !== 0}>
        {tab === 0 && <TravelPage />}
      </Box>
      <Box role="tabpanel" hidden={tab !== 1}>
        {tab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography>新しいタブ</Typography>
          </Box>
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 2}>
        {tab === 2 && (
          <Box sx={{ p: 2 }}>
            <Typography>新しいタブ</Typography>
          </Box>
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 3}>
        {tab === 3 && (
          <Box sx={{ p: 2 }}>
            <Typography>新しいタブ</Typography>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default App

import './App.css'
import TravelPage from './components/TravelPage'
import Container from '@mui/material/Container'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useState } from 'react'
import TabPanel from './components/TabPanel'
import NewTabContent from './components/NewTabContent'
import MapTab from './components/MapTab'

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

      <TabPanel value={tab} index={0}>
        <TravelPage />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <MapTab />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <NewTabContent label="新しいタブ2" />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <NewTabContent label="新しいタブ3" />
      </TabPanel>
    </Container>
  )
}

export default App

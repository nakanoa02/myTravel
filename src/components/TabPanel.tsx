import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

type TabPanelProps = {
  value: number
  index: number
  children: ReactNode
}

export default function TabPanel({ value, index, children }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </Box>
  )
}


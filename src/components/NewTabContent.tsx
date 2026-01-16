import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type Props = {
  label?: string
}

export default function NewTabContent({ label = '新しいタブ' }: Props) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography>{label}</Typography>
    </Box>
  )
}


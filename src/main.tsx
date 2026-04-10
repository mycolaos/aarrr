import './index.css'

import AARRR from './AARRR.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import mixpanel from 'mixpanel-browser'

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  autocapture: true,
  record_sessions_percent: 100,
  api_host: 'https://api-eu.mixpanel.com',
  debug: import.meta.env.DEV,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AARRR />
  </StrictMode>,
)

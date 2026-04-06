import './index.css'

import AARRR from './AARRR.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AARRR />
  </StrictMode>,
)

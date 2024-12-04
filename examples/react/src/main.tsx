import { createRoot } from 'react-dom/client'
import { scan } from 'react-scan'
import './index.css'
import { App } from './App.tsx'

scan({
    enabled: true,
    alwaysShowLabels: true,
})

createRoot(document.getElementById('root')!).render(<App />)

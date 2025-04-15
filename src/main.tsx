import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './EmailApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/*
# The following code removes the duplicated backend console output
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './EmailApp.tsx'
const root = createRoot(document.getElementById('root')!);

root.render(
  <App />
);

*/
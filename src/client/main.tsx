import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/index.css'
import { router } from './router'

const removePreloader = () => {
  const preloader = document.getElementById('preloader')
  if (preloader && !preloader.classList.contains('fade-out')) {
    preloader.classList.add('fade-out')
  }
}

if (document.readyState === 'complete') {
  setTimeout(removePreloader, 300)
} else {
  window.addEventListener('load', () => setTimeout(removePreloader, 300))
  // Fallback de seguridad por si el evento load ya pasó o se demora
  setTimeout(removePreloader, 2500)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

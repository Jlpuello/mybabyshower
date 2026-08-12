import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/index.css'
import { router } from './router'

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader')
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out')
    }, 2000)
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

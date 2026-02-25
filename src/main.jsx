import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/Auth/AuthProvider.jsx'
import { ToastProvider } from './context/Toast/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider >
  </ToastProvider>,
)
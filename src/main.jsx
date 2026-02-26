import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/Auth/AuthProvider.jsx'
import { ToastProvider } from './context/Toast/ToastProvider.jsx'
// import DataProvider from './context/Data/DataProvider.jsx'

createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <AuthProvider>
      {/* <DataProvider> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      {/* </DataProvider> */}
    </AuthProvider >
  </ToastProvider>,
)
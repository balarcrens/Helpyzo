import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage.jsx'
import AboutUs from './components/pages/AboutUs.jsx'
import Register from './components/pages/Register.jsx'

const App = () => {
  return (
    <>
      <div
        className='font-serif min-h-screen'
        style={{
          cursor: 'url("https://cdn.jsdelivr.net/gh/dhameliyahit/buket/images/1766134050847-cursor.png"), auto'
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  )
}

export default App
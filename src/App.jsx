import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage.jsx'
import AboutUs from './components/pages/AboutUs.jsx'
import Register from './components/pages/Register.jsx'
import ContactUs from './components/pages/ContactUs.jsx'
import './App.css'
import ServiceDetail from './components/pages/ServiceDetail.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Services from './components/pages/Services.jsx'
import FAQ from './components/pages/FAQ.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import SuperDashboard from './components/pages/superadmin/Dashboard.jsx'
import Partners from './components/pages/superadmin/Partners.jsx'
import Categories from './components/pages/superadmin/Categories.jsx'
import AdminDashboard from './components/pages/admin/Dashboard.jsx'
import Bookings from './components/pages/admin/Bookings.jsx'
import AdminServices from './components/pages/admin/AdminServices.jsx'
import NotFound from './components/pages/NotFound.jsx'

const CURRENT_ROLE = "superadmin";

const App = () => {
    return (
        <>
            <div
                className='font-serif min-h-screen'
                style={{
                    // cursor: 'url("https://cdn.jsdelivr.net/gh/dhameliyahit/buket/images/1766134050847-cursor.png"), auto'
                }}
            >
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/service/:slug" element={<ServiceDetail />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="*" element={<NotFound />} />
                    <Route
                        path="/"
                        element={<Navigate to={`/${CURRENT_ROLE}`} />}
                    />

                    <Route
                        path="/superadmin"
                        element={<AdminLayout role="superadmin" />}
                    >
                        <Route index element={<SuperDashboard />} />
                        <Route path="partners" element={<Partners />} />
                        <Route path="categories" element={<Categories />} />
                    </Route>

                    <Route
                        path="/admin"
                        element={<AdminLayout role="admin" />}
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="services" element={<AdminServices />} />
                        <Route path="bookings" element={<Bookings />} />
                    </Route>
                </Routes>
            </div>
        </>
    )
}

export default App
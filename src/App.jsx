import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/pages/HomePage.jsx'
import AboutUs from './components/pages/AboutUs.jsx'
import Register from './components/pages/Register.jsx'
import ContactUs from './components/pages/ContactUs.jsx'
import './App.css'
import ServiceDetail from './components/pages/ServiceDetail.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import FAQ from './components/pages/FAQ.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import SuperDashboard from './components/pages/superadmin/Dashboard.jsx'
import Partners from './components/pages/superadmin/Partners.jsx'
import Categories from './components/pages/superadmin/Categories.jsx'
import AdminDashboard from './components/pages/admin/Dashboard.jsx'
import Bookings from './components/pages/admin/Bookings.jsx'
import AdminServices from './components/pages/admin/AdminServices.jsx'
import NotFound from './components/pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Category from './components/pages/Category.jsx'
import ServicePage from './components/pages/Services.jsx'
import Profile from './components/pages/Profile.jsx'
import PartnerDetail from './components/pages/superadmin/PartnerDetail.jsx'
import BookingDetails from './components/pages/admin/BookingDetail.jsx'
import UserBookings from './components/pages/UserBookings.jsx'
import Users from './components/pages/superadmin/Users.jsx'
import AllBookings from './components/pages/superadmin/AllBookings.jsx'

const CURRENT_ROLE = "superadmin";

const App = () => {
    return (
        <>
            <div className='font-serif min-h-screen'>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category/:category" element={<ServicePage />} />
                    <Route path="/category/:category/:slug" element={<ServiceDetail />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/my-bookings" element={<UserBookings />} />
                    <Route
                        path="/"
                        element={<Navigate to={`/${CURRENT_ROLE}`} />}
                    />

                    <Route
                        path="/superadmin"
                        element={<ProtectedRoute allowedRoles={["superadmin"]}>
                            <AdminLayout role="superadmin" />
                        </ProtectedRoute>}
                    >
                        <Route index element={<SuperDashboard />} />
                        <Route path="partners" element={<Partners />} />
                        <Route path="partners/:id" element={<PartnerDetail />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="users" element={<Users />} />
                        <Route path="bookings" element={<AllBookings />} />
                    </Route>

                    <Route
                        path="/admin"
                        element={<ProtectedRoute allowedRoles={["partner"]}>
                            <AdminLayout role="admin" />
                        </ProtectedRoute>}
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="services" element={<AdminServices />} />
                        <Route path="bookings" element={<Bookings />} />
                        <Route path="bookings/:id" element={<BookingDetails />} />
                    </Route>
                </Routes>
            </div>
        </>
    )
}

export default App
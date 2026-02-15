/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";

export default function AdminLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    }, [sidebarOpen]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Section */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Page Content */}
                <motion.main
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 px-4 sm:px-6 py-6 bg-gray-50"
                >
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </motion.main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}

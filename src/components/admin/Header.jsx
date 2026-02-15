/* eslint-disable no-unused-vars */
import { Bell, Search, ChevronDown, Menu, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/Auth/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";

export default function Header({ onMenuClick }) {
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const currentPage = location.split("/")[2] || "";
    const subPage = location.split("/")[3] || "";
    const { user, logout } = useContext(AuthContext);

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <motion.header
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 py-2"
        >
            <div className="flex items-center justify-between">
                {/* LEFT */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 active:scale-95"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-2 text-sm text-gray-500 capitalize">
                        <span>Dashboard</span>
                        {currentPage && <>
                            <span className="text-gray-300">/</span>
                            <span className="font-medium text-gray-900">{currentPage}</span>
                        </>}
                        {subPage && <>
                            <span className="text-gray-300">/</span>
                            <span className="font-medium text-gray-900">{subPage}</span>
                        </>}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border bg-gray-50">
                        <Search size={16} className="text-gray-400" />
                        <input placeholder="Search..." className="bg-transparent outline-none text-sm w-44" />
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-xl hover:bg-gray-100">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#9fe870] rounded-full ring-2 ring-white" />
                    </button>

                    {/* PROFILE DROPDOWN */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://i.pravatar.cc/40"
                                className="w-8 h-8 rounded-full"
                            />
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                                >
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
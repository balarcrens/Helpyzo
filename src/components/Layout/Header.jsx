import React, { useState, useEffect } from "react";
import { FiHome, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Login from "../pages/Login";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isLoginModal, setIsLoginModal] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState(null);

    // NEW: track login state
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoggedIn(!!token);
    }, []);

    // optional if login happens in another tab
    useEffect(() => {
        const syncLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
        window.addEventListener("storage", syncLogin);
        return () => window.removeEventListener("storage", syncLogin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMobileMenuOpen(false);
        setMobileDropdown(null);
    }, [navigate]);

    const navItems = [
        {
            label: "Home",
            path: "/",
        },
        {
            label: "Service",
            path: "/services",
        },
        {
            label: "Services",
            dropdown: [
                { label: "Cleaning", path: "/services/cleaning" },
                { label: "Repair", path: "/services/repair" },
                { label: "Installation", path: "/services/installation" },
                { label: "Maintenance", path: "/services/maintenance" },
            ],
        },
        {
            label: "About Us",
            path: "/about",
        },
        {
            label: "More",
            dropdown: [
                { label: "Contact", path: "/contact" },
                { label: "FAQ", path: "/faq" },
            ],
        },
    ];

    return (
        <>
            {isLoginModal && <Login onClose={() => setIsLoginModal(false)} />}

            <header className="fixed top-0 z-50 w-full px-4 py-2 sm:px-6">
                <div
                    className={`mx-auto max-w-7xl transition-all duration-500 rounded-4xl px-6 py-3 flex items-center justify-between ${isScrolled
                        ? "bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl"
                        : "bg-black/20 backdrop-blur-none border border-white/5"
                        }`}
                >
                    {/* Logo */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-white group cursor-pointer shrink-0"
                    >
                        <img src="/helpyZo.png" width={150} />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-1 py-1">
                        {navItems.map((item, i) => (
                            <div
                                key={i}
                                className="relative"
                                onMouseEnter={() => setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button
                                    onClick={() => item.path && navigate(item.path)}
                                    className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium transition-all rounded-full text-gray-200 hover:text-white hover:bg-white/5"
                                >
                                    {item.label}
                                    {item.dropdown && <FiChevronDown className="text-xs opacity-70" />}
                                </button>

                                <AnimatePresence>
                                    {item.dropdown && activeDropdown === item.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2"
                                        >
                                            {item.dropdown.map((sub, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => navigate(sub.path)}
                                                    className="px-4 py-2 text-sm text-gray-300 hover:text-[#9fe870] hover:bg-white/5 rounded-lg cursor-pointer"
                                                >
                                                    {sub.label}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* RIGHT SIDE ACTIONS */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    className="cursor-pointer border border-white/20 px-6 py-2 rounded-full text-white font-medium hover:bg-white/10"
                                    onClick={() => navigate("/profile")}
                                >
                                    Profile
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="ml-3 cursor-pointer text-red-400 hover:text-red-300 text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Sign In */}
                                <button
                                    onClick={() => navigate("/register")}
                                    className="cursor-pointer border border-stone-400 hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95"
                                >
                                    Sign Up
                                </button>

                                {/* Login */}
                                <button
                                    onClick={() => setIsLoginModal(true)}
                                    className="bg-[#9FE870] cursor-pointer hover:bg-[#9fe870] text-white px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="lg:hidden cursor-pointer text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="lg:hidden mt-4 mx-auto max-w-sm bg-stone-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-2xl"
                        >
                            <div className="flex flex-col gap-4">
                                {navItems.map((item, i) => (
                                    <div key={i}>
                                        <button onClick={() => {
                                            if (item.dropdown) {
                                                setMobileDropdown(
                                                    mobileDropdown === item.label ? null : item.label
                                                );
                                            } else {
                                                navigate(item.path);
                                                setIsMobileMenuOpen(false);
                                            }
                                        }} className="w-full flex justify-between items-center text-gray-300 font-medium py-3">
                                            {item.label}
                                            {item.dropdown && (
                                                <FiChevronDown className={`transition-transform ${mobileDropdown === item.label ? "rotate-180" : ""}`}
                                                />
                                            )}
                                        </button>

                                        {/* MOBILE DROPDOWN */}
                                        <AnimatePresence>
                                            {item.dropdown && mobileDropdown === item.label && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="pl-4 flex flex-col gap-2"
                                                >
                                                    {item.dropdown.map((sub, idx) => (
                                                        <button key={idx} onClick={() => {
                                                            navigate(sub.path);
                                                            setIsMobileMenuOpen(false);
                                                            setMobileDropdown(null);
                                                        }}
                                                            className="text-sm text-gray-400 py-2 text-left hover:text-[#9fe870]"
                                                        >
                                                            {sub.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}

                                {isLoggedIn ? (
                                    <>
                                        <button onClick={() => navigate("/profile")} className="mt-2 bg-white/10 text-white w-full py-4 rounded-2xl font-bold" >
                                            Profile
                                        </button>

                                        <button onClick={handleLogout} className="mt-2 bg-red-500/20 text-red-300 w-full py-4 rounded-2xl font-bold" >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button className="mt-4 cursor-pointer bg-[#b4f481] text-black w-full py-4 rounded-2xl font-bold"
                                        onClick={() => setIsLoginModal(true)}>
                                        Login
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;

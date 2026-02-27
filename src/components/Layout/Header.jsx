import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/Auth/AuthContext";
import { FiHome, FiChevronDown, FiMenu, FiX, FiLogOut, FiUser, FiLayout, FiBookOpen } from "react-icons/fi";

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Login from "../pages/Login";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { isLoggedIn, logout, loading, user, isSuperAdmin } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isLoginModal, setIsLoginModal] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Get initials from user name
    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMobileMenuOpen(false);
        setMobileDropdown(null);
        setIsProfileMenuOpen(false);
    }, [navigate]);

    const navItems = [
        {
            label: "Home",
            path: "/",
        },
        {
            label: "Category",
            path: "/category",
        },
        {
            label: "Services",
            dropdown: [
                { label: "Home & Kitchen Cleaning", path: "/category/home cleaning" },
                { label: "Plumbing Services", path: "/category/plumbing" },
                { label: "Appliance Repair", path: "/category/appliance repair" },
                { label: "Electrical Services", path: "/category/electrical services" },
                { label: "All Services", path: "/category/all" }
            ],
        },
        {
            label: "More",
            dropdown: [
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
                { label: "FAQ", path: "/faq" },
            ],
        },
    ];

    if (loading) return null;

    return (
        <>
            {isLoginModal && <Login onClose={() => setIsLoginModal(false)} />}

            <header className="fixed top-0 font-sans z-50 w-full px-4 py-2 sm:px-6">
                <div className={`mx-auto max-w-7xl transition-all duration-500 rounded-4xl pl-4 pr-6 py-3 flex items-center justify-between 
                        ${isScrolled ? "bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl" : "bg-black/40 backdrop-blur-none border border-white/5"}`}
                >
                    {/* Logo */}
                    <div onClick={() => navigate("/")} className="flex items-center gap-2 text-white group cursor-pointer shrink-0">
                        <img src="/helpyZo.png" width={150} />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-1 py-1">
                        {navItems.map((item, i) => (
                            <div key={i} className="relative"
                                onMouseEnter={() => setActiveDropdown(item.label)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button onClick={() => item.path && navigate(item.path)}
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
                                                <div key={idx} onClick={() => navigate(sub.path)}
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
                            <div className="flex items-center gap-3">
                                {/* Profile Avatar Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className={`w-10 h-10 rounded-full ${user?.profileImage ? '' : 'bg-gradient-to-br from-[#9FE870] to-[#7ec850]'} flex items-center justify-center text-black font-bold text-sm hover:scale-110 transition-transform`}
                                    >
                                        {user?.profileImage ? <img src={user?.profileImage} alt="profile" className="w-full h-full rounded-full" /> : getInitials(user?.name)}
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    <AnimatePresence>
                                        {isProfileMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-3 w-48 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50"
                                            >
                                                {/* Profile Option */}
                                                <button
                                                    onClick={() => {
                                                        navigate("/profile");
                                                        setIsProfileMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-[#9fe870] hover:bg-white/5 rounded-lg cursor-pointer transition-all"
                                                >
                                                    <FiUser size={16} />
                                                    <span>Profile</span>
                                                </button>

                                                {/* My Bookings */}
                                                {user?.role && (
                                                    <button
                                                        onClick={() => {
                                                            navigate("/my-bookings");
                                                            setIsProfileMenuOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-[#9fe870] hover:bg-white/5 rounded-lg cursor-pointer transition-all"
                                                    >
                                                        <FiBookOpen size={16} />
                                                        <span>My Bookings</span>
                                                    </button>
                                                )}

                                                {user?.role === "partner" || user?.role === "superadmin" ?
                                                    <button
                                                        onClick={() => {
                                                            if (isSuperAdmin) {
                                                                navigate("/superadmin");
                                                            } else {
                                                                navigate("/admin");
                                                            }
                                                            setIsProfileMenuOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-[#9fe870] hover:bg-white/5 rounded-lg cursor-pointer transition-all"
                                                    >
                                                        <FiLayout size={16} />
                                                        <span>Dashboard</span>
                                                    </button>
                                                    : null
                                                }

                                                {/* Divider */}
                                                <div className="h-px bg-white/10 my-2" />

                                                {/* Logout Option */}
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        navigate("/");
                                                        setIsProfileMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all"
                                                >
                                                    <FiLogOut size={16} />
                                                    <span>Logout</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* Sign Up – Secondary */}
                                <button onClick={() => navigate("/register")}
                                    className="rounded-full cursor-pointer border border-white/25 bg-white/5 px-7 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
                                >
                                    Sign Up
                                </button>

                                {/* Login – Primary */}
                                <button onClick={() => setIsLoginModal(true)}
                                    className="relative cursor-pointer overflow-hidden rounded-full bg-[#9FE870] px-8 py-2.5 text-sm font-bold text-black shadow-lg shadow-[#9FE870]/30 transition-all hover:shadow-xl hover:shadow-[#9FE870]/40 hover:scale-[1.03] active:scale-95"
                                >
                                    <span className="relative z-10">Login</span>

                                    {/* Subtle shine effect */}
                                    <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity hover:opacity-100" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button className="lg:hidden cursor-pointer text-white p-2"
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
                                        <button onClick={() => {
                                            navigate("/profile");
                                            setIsMobileMenuOpen(false);
                                        }} className="mt-1 bg-white/10 text-white w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2" >
                                            <FiUser size={16} />
                                            Profile
                                        </button>

                                        {/* My Bookings — mobile */}
                                        {user?.role && (
                                            <button onClick={() => {
                                                navigate("/my-bookings");
                                                setIsMobileMenuOpen(false);
                                            }} className="bg-[#9fe870]/15 text-[#9fe870] w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2" >
                                                <FiBookOpen size={16} />
                                                My Bookings
                                            </button>
                                        )}

                                        <button onClick={() => {
                                            if (isSuperAdmin) {
                                                navigate("/superadmin");
                                            } else {
                                                navigate("/admin");
                                            }
                                            setIsMobileMenuOpen(false);
                                        }} className="bg-blue-500/20 text-blue-300 w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2" >
                                            <FiLayout size={16} />
                                            Dashboard
                                        </button>

                                        <button onClick={() => {
                                            logout();
                                            navigate("/");

                                            setIsMobileMenuOpen(false);
                                        }} className="bg-red-500/20 text-red-300 w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2" >
                                            <FiLogOut size={16} />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button className="mt-2 cursor-pointer bg-[#b4f481] text-black w-full py-3 rounded-2xl font-bold"
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

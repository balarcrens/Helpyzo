/* eslint-disable no-unused-vars */
import { Bell, ChevronDown, Menu, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/Auth/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { notificationAPI } from "../../services/api";
import { X } from "lucide-react";

export default function Header({ onMenuClick }) {
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const currentPage = location.split("/")[2] || "";
    const subPage = location.split("/")[3] || "";
    const { user, logout } = useContext(AuthContext);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notifLoading, setNotifLoading] = useState(false);
    const notifRef = useRef(null);

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

    const fetchNotifications = async () => {
        try {
            setNotifLoading(true);
            const res = await notificationAPI.getNotifications();
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error("Failed to fetch notifications");
        } finally {
            setNotifLoading(false);
        }
    };

    const handleBellClick = () => {
        setNotifOpen((prev) => !prev);
        if (!notifOpen) fetchNotifications();
    };

    const markAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id ? { ...n, isRead: true } : n
                )
            );
        } catch (err) {
            console.error("Failed to mark notification");
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 capitalize">
                        <span><Link to={`/${user?.role === 'partner' ? 'admin' : user?.role}`}>Dashboard</Link></span>
                        {currentPage && <>
                            <span className="text-gray-300">/</span>
                            {user?.role === 'partner' ? <Link className="font-medium text-gray-900" to={`/admin/${currentPage}`}>{currentPage}</Link> : <Link className="font-medium text-gray-900" to={`/${user?.role}/${currentPage}`}>{currentPage}</Link>}
                        </>}
                        {subPage && <>
                            <span className="text-gray-300">/</span>
                            <span className="font-medium text-gray-900">{subPage}</span>
                        </>}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 sm:gap-4">
                    {/* Notifications */}
                    <div ref={notifRef} className="relative">
                        <button
                            onClick={handleBellClick}
                            className="relative p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
                        >
                            <Bell size={20} className={notifOpen ? "text-gray-900" : "text-gray-600"} />

                            {notifications.some(n => !n.isRead) && (
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white" />
                            )}
                        </button>
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 16, scale: 0.96 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-[360px] lg:absolute lg:left-auto lg:translate-x-0 lg:right-0 lg:top-full lg:mt-3 lg:w-[380px] lg:max-w-[380px] bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                                    {/* HEADER */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-400">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                Notifications
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {notifications.filter(n => !n.isRead).length} unread
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setNotifOpen(false)}
                                            className="p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="max-h-[65vh] sm:max-h-[320px] overflow-y-auto no-scrollbar divide-y divide-gray-200">
                                        {notifLoading ? (
                                            <div className="p-6 text-center text-sm text-gray-500">
                                                Loading notifications…
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <Bell size={28} className="mx-auto text-gray-300 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    You’re all caught up 🎉
                                                </p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div key={n._id} onClick={() => !n.isRead && markAsRead(n._id)}
                                                    className={`relative px-5 py-4 cursor-pointer transition
                                                        ${n.isRead
                                                            ? "bg-white hover:bg-gray-50"
                                                            : "bg-blue-50/70 hover:bg-blue-50"
                                                        }`}
                                                >
                                                    {!n.isRead && (
                                                        <span className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-full" />
                                                    )}
                                                    <div className="flex gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                                            ${n.isRead
                                                                ? "bg-gray-100 text-gray-500"
                                                                : "bg-blue-100 text-blue-600"
                                                            }`}>
                                                            <Bell size={16} />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {n.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                                {n.message}
                                                            </p>
                                                            <p className="text-[11px] text-gray-400 mt-1">
                                                                {n.time || "Just now"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* FOOTER */}
                                    {notifications.length > 0 && (
                                        <div className="border-t border-gray-400 bg-gray-50 px-5 py-3 flex justify-end">
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs font-semibold text-blue-600 hover:underline"
                                            >
                                                Mark all as read
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* PROFILE DROPDOWN */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition"
                        >
                            <img
                                src={user?.profileImage || `https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png`}
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
/* eslint-disable no-unused-vars */
import { Bell, ChevronDown, Menu, LogOut, X, CheckCheck, Info, AlertTriangle, Star, UserCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/Auth/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import { notificationAPI } from "../../services/api";

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

    const markAllAsRead = async () => {
        try {
            const unread = notifications.filter((n) => !n.isRead);
            await Promise.all(unread.map((n) => notificationAPI.markAsRead(n._id)));
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Failed to mark all as read");
        }
    };

    /* ── Notification type config ── */
    const getNotifConfig = (type = "") => {
        const t = type?.toLowerCase();
        if (t?.includes("warn") || t?.includes("alert"))
            return { icon: <AlertTriangle size={15} />, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", border: "border-l-amber-400", text: "text-amber-600", unreadBg: "bg-amber-50/60" };
        if (t?.includes("success") || t?.includes("approv") || t?.includes("complet"))
            return { icon: <CheckCheck size={15} />, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", border: "border-l-emerald-400", text: "text-emerald-600", unreadBg: "bg-emerald-50/50" };
        if (t?.includes("reject") || t?.includes("cancel") || t?.includes("error"))
            return { icon: <X size={15} />, gradient: "from-red-500 to-rose-500", bg: "bg-red-50", border: "border-l-red-400", text: "text-red-600", unreadBg: "bg-red-50/50" };
        if (t?.includes("user") || t?.includes("partner"))
            return { icon: <UserCheck size={15} />, gradient: "from-violet-500 to-purple-500", bg: "bg-violet-50", border: "border-l-violet-400", text: "text-violet-600", unreadBg: "bg-violet-50/50" };
        if (t?.includes("star") || t?.includes("review") || t?.includes("rating"))
            return { icon: <Star size={15} />, gradient: "from-yellow-400 to-amber-500", bg: "bg-yellow-50", border: "border-l-yellow-400", text: "text-yellow-600", unreadBg: "bg-yellow-50/50" };
        return { icon: <Zap size={15} />, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50", border: "border-l-blue-400", text: "text-blue-600", unreadBg: "bg-blue-50/50" };
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "Just now";
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
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
                        {/* Bell Button */}
                        <button
                            onClick={handleBellClick}
                            className={`relative p-2.5 rounded-xl transition-all active:scale-95 ${notifOpen
                                ? "bg-indigo-50 text-indigo-600"
                                : "hover:bg-gray-100 text-gray-600"
                                }`}
                        >
                            <Bell size={20} />
                            {notifications.some((n) => !n.isRead) && (
                                <>
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full ring-2 ring-white flex items-center justify-center">
                                        <span className="text-[9px] text-white font-bold leading-none">
                                            {notifications.filter((n) => !n.isRead).length > 9
                                                ? "9+"
                                                : notifications.filter((n) => !n.isRead).length}
                                        </span>
                                    </span>
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-400 animate-ping opacity-60" />
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 14, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 14, scale: 0.95 }}
                                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                    className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-sm lg:absolute lg:left-auto lg:translate-x-0 lg:right-0 lg:top-full lg:mt-3 lg:w-96 lg:max-w-none rounded-3xl shadow-2xl overflow-hidden border border-gray-100/80 bg-white"
                                >
                                    <div className="relative px-5 pt-5 pb-8 overflow-hidden">
                                        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 h-16 w-40 rounded-full bg-white/5 blur-xl pointer-events-none" />

                                        <div className="relative z-10 flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="h-7 w-7 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                                                        <Bell size={14} />
                                                    </div>
                                                    <h4 className="text-base font-extrabold tracking-tight">
                                                        Notifications
                                                    </h4>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setNotifOpen(false)}
                                                className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition active:scale-90"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>

                                        {!notifLoading && notifications.length > 0 && (
                                            <div className="relative z-10 flex gap-2 mt-2 flex-wrap">
                                                <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/20 text-[11px] text-indigo-500 font-bold px-3 py-1 rounded-full">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                                    {notifications.length} Total
                                                </span>
                                                {notifications.filter((n) => !n.isRead).length > 0 && (
                                                    <span className="inline-flex items-center gap-1.5 bg-rose-400/30 border border-rose-300/30 text-red-500 text-[11px] font-bold px-3 py-1 rounded-full">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        {notifications.filter((n) => !n.isRead).length} Unread
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="-mt-4 rounded-t-2xl bg-white relative z-10">
                                        <div className="max-h-[55vh] sm:max-h-72 overflow-y-auto no-scrollbar">
                                            {notifLoading ? (
                                                <div className="p-4 space-y-3">
                                                    {[...Array(4)].map((_, i) => (
                                                        <div key={i} className="flex gap-3 p-3">
                                                            <div className="h-10 w-10 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                                                            <div className="flex-1 space-y-2 pt-1">
                                                                <div className="h-3 w-3/5 bg-gray-100 rounded-full animate-pulse" />
                                                                <div className="h-2.5 w-4/5 bg-gray-100 rounded-full animate-pulse" />
                                                                <div className="h-2 w-1/4 bg-gray-100 rounded-full animate-pulse" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : notifications.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                                                        <Bell size={28} className="text-indigo-400" />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-800 mb-1">You're all caught up!</p>
                                                    <p className="text-xs text-gray-400">
                                                        No new notifications right now. Check back later.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-gray-50">
                                                    {notifications.map((n, idx) => {
                                                        const cfg = getNotifConfig(n.type || n.title);
                                                        return (
                                                            <motion.div
                                                                key={n._id}
                                                                initial={{ opacity: 0, x: -8 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.04 }}
                                                                onClick={() => !n.isRead && markAsRead(n._id)}
                                                                className={`relative flex gap-3.5 px-4 py-3.5 cursor-pointer transition-all border-l-[3px] ${n.isRead
                                                                    ? "border-l-transparent hover:bg-gray-50/80"
                                                                    : `${cfg.border} ${cfg.unreadBg} hover:brightness-95`
                                                                    }`}
                                                            >
                                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${n.isRead
                                                                    ? "bg-gray-100 text-gray-400"
                                                                    : `bg-gradient-to-br ${cfg.gradient} text-white shadow-sm`
                                                                    }`}>
                                                                    {cfg.icon}
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <p className={`text-sm leading-tight ${n.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                                                                            {n.title || "Notification"}
                                                                        </p>
                                                                        {!n.isRead && (
                                                                            <span className={`flex-shrink-0 h-2 w-2 rounded-full mt-1 ${cfg.text.replace("text-", "bg-")}`} />
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                                                        {n.message || "No details available."}
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                                                                        {formatTime(n.createdAt || n.time)}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {notifications.length > 0 && (
                                        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-100 bg-gray-50/60">
                                            <p className="text-[11px] text-gray-400 font-medium">
                                                {notifications.filter((n) => n.isRead).length} of {notifications.length} read
                                            </p>
                                            {notifications.some((n) => !n.isRead) && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition active:scale-95"
                                                >
                                                    <CheckCheck size={12} />
                                                    Mark all read
                                                </button>
                                            )}
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
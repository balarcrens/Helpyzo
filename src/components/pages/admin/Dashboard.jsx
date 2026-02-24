/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiCalendar,
    FiTrendingUp,
    FiBriefcase,
    FiUsers,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiArrowRight,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useBookings } from "../../../hooks/useData";
import { usePartner } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const avatarPalette = [
    "from-blue-400 to-indigo-500",
    "from-violet-400 to-purple-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-400",
    "from-pink-400 to-rose-400",
];

const statusCfg = {
    completed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    cancelled: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
    confirmed: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
    "in-progress": { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
};

export default function Dashboard() {
    const navigate = useNavigate();
    const { bookings, fetchPartnerBookings } = useBookings();
    const { user } = usePartner();

    const [stats, setStats] = useState({
        totalBookings: 0, completedBookings: 0, totalEarnings: 0,
        pendingBookings: 0, cancelledBookings: 0, todayBookings: 0,
        upcomingBookings: 0, avgOrderValue: 0, completionRate: 0,
    });

    useEffect(() => { fetchPartnerBookings(user?._id); }, [user?._id]);

    useEffect(() => {
        if (!bookings || bookings.length === 0) return;
        const today = new Date().toDateString();
        const completed = bookings.filter((b) => b.status === "completed");
        const pending = bookings.filter((b) => b.status === "pending");
        const cancelled = bookings.filter((b) => b.status === "cancelled");
        const todayB = bookings.filter((b) => new Date(b.bookedDate).toDateString() === today);
        const upcoming = bookings.filter((b) => new Date(b.bookedDate) > new Date() && b.status === "pending");
        const totalEarnings = completed.reduce((s, b) => s + (b.amount || 0), 0);

        setStats({
            totalBookings: bookings.length,
            completedBookings: completed.length,
            pendingBookings: pending.length,
            cancelledBookings: cancelled.length,
            todayBookings: todayB.length,
            upcomingBookings: upcoming.length,
            totalEarnings,
            avgOrderValue: completed.length ? Math.round(totalEarnings / completed.length) : 0,
            completionRate: bookings.length ? Math.round((completed.length / bookings.length) * 100) : 0,
        });
    }, [bookings]);

    const primaryStats = [
        {
            label: "Total Bookings",
            value: stats.totalBookings,
            icon: FiCalendar,
            iconBg: "bg-blue-50 text-blue-600",
            border: "border-blue-100",
            link: "bookings",
        },
        {
            label: "Total Earnings",
            value: `₹${stats.totalEarnings.toLocaleString()}`,
            icon: FiBriefcase,
            iconBg: "bg-emerald-50 text-emerald-600",
            border: "border-emerald-100",
        },
        {
            label: "Completed",
            value: stats.completedBookings,
            icon: FiCheckCircle,
            iconBg: "bg-violet-50 text-violet-600",
            border: "border-violet-100",
        },
        {
            label: "Pending",
            value: stats.pendingBookings,
            icon: FiClock,
            iconBg: "bg-amber-50 text-amber-600",
            border: "border-amber-100",
            link: "bookings",
        },
    ];

    const secondaryStats = [
        { label: "Today's Bookings", value: stats.todayBookings, icon: FiCalendar, color: "text-cyan-600" },
        { label: "Upcoming", value: stats.upcomingBookings, icon: FiTrendingUp, color: "text-indigo-600" },
        { label: "Avg Order Value", value: `₹${stats.avgOrderValue}`, icon: FiBriefcase, color: "text-pink-600" },
        { label: "Cancelled", value: stats.cancelledBookings, icon: FiXCircle, color: "text-red-500" },
    ];

    return (
        <div className="space-y-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0 shadow-md">
                        {getInitials(user?.name)}
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Partner Dashboard</p>
                        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                            Welcome back, {user?.name?.split(" ")[0]}!
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">Here's your business overview for today</p>
                    </div>
                </div>

                <div className="flex-shrink-0 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <FiTrendingUp size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Completion Rate</p>
                        <p className="text-2xl font-extrabold text-gray-900">{stats.completionRate}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {primaryStats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => s.link && navigate(s.link)}
                        className={`bg-white rounded-2xl border ${s.border} shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 ${s.link ? "cursor-pointer hover:-translate-y-0.5" : ""}`}
                    >
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${s.iconBg}`}>
                            <s.icon size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 truncate">{s.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{s.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {secondaryStats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 + i * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3"
                    >
                        <s.icon className={`${s.color} flex-shrink-0`} size={16} />
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">{s.label}</p>
                            <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Recent Bookings */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <FiCalendar size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-gray-900">Recent Bookings</h3>
                                <p className="text-[11px] text-gray-400">{Math.min(bookings?.length || 0, 5)} of {bookings?.length || 0} shown</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("bookings")}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition"
                        >
                            View all <FiArrowRight size={12} />
                        </button>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {!bookings || bookings.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                                    <FiCalendar size={22} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-400">No bookings yet</p>
                            </div>
                        ) : (
                            bookings.slice(0, 5).map((booking, idx) => {
                                const sc = statusCfg[booking.status] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
                                return (
                                    <motion.div
                                        key={booking._id}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="px-6 py-4 hover:bg-gray-50/60 transition-colors"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {/* Avatar */}
                                            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${avatarPalette[idx % avatarPalette.length]} text-white text-[11px] font-extrabold flex items-center justify-center flex-shrink-0`}>
                                                {getInitials(booking.user?.name)}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{booking.user?.name || "Customer"}</p>
                                                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-lg capitalize ${sc.bg} ${sc.text}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                    <p className="text-xs text-gray-500 truncate">{booking.serviceName}</p>
                                                    <span className="text-gray-200">•</span>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(booking.bookedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                                        {booking.scheduledTime ? ` · ${booking.scheduledTime}` : ""}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                                <p className="text-sm font-extrabold text-gray-900">₹{booking.amount || 0}</p>
                                                <button
                                                    onClick={() => navigate(`bookings/${booking._id}`)}
                                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                                                >
                                                    Details →
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                                <FiTrendingUp size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-gray-900">Booking Breakdown</h3>
                                <p className="text-[11px] text-gray-400">Status distribution</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: "Completed", count: stats.completedBookings, color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
                                { label: "Pending", count: stats.pendingBookings, color: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
                                { label: "Cancelled", count: stats.cancelledBookings, color: "bg-red-400", text: "text-red-600", bg: "bg-red-50" },
                            ].map((item, i) => {
                                const pct = stats.totalBookings > 0
                                    ? Math.round((item.count / stats.totalBookings) * 100)
                                    : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                                            <span className={`text-[11px] font-bold ${item.text} ${item.bg} px-2 py-0.5 rounded-lg`}>
                                                {item.count}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.7, delay: i * 0.1 }}
                                                className={`h-full ${item.color} rounded-full`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400 font-medium">Total Bookings</span>
                            <span className="text-base font-extrabold text-gray-900">{stats.totalBookings}</span>
                        </div>
                    </div>

                    {/* Earnings Summary */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <FiBriefcase size={15} />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-gray-900">Earnings Summary</h3>
                                <p className="text-[11px] text-gray-400">From completed bookings</p>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            {[
                                { label: "Total Earned", value: `₹${stats.totalEarnings.toLocaleString()}`, accent: "text-emerald-600" },
                                { label: "Avg Order Value", value: `₹${stats.avgOrderValue}`, accent: "text-indigo-600" },
                                { label: "Completed Jobs", value: stats.completedBookings, accent: "text-gray-900" },
                                { label: "Upcoming Bookings", value: stats.upcomingBookings, accent: "text-amber-600" },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100">
                                    <span className="text-xs text-gray-500 font-medium">{row.label}</span>
                                    <span className={`text-sm font-extrabold ${row.accent}`}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Today Summary */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-5 text-white shadow-md">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-8 w-8 rounded-xl bg-white/15 flex items-center justify-center">
                                <FiCalendar size={15} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Today</span>
                        </div>
                        <p className="text-3xl font-extrabold">{stats.todayBookings}</p>
                        <p className="text-xs text-white/70 mt-0.5">
                            Booking{stats.todayBookings !== 1 ? "s" : ""} scheduled today
                        </p>
                        <button
                            onClick={() => navigate("bookings")}
                            className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/20 py-2 rounded-xl transition active:scale-95"
                        >
                            View all bookings <FiArrowRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

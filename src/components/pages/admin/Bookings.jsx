/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookings } from "../../../hooks/useData";
import { usePartner } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiUser,
    FiDollarSign,
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiLoader,
    FiList,
} from "react-icons/fi";
import ToastContext from "../../../context/Toast/ToastContext";

const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const avatarPalette = [
    "from-blue-400 to-indigo-500",
    "from-violet-400 to-purple-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-400",
    "from-pink-400 to-rose-400",
    "from-cyan-400 to-sky-500",
];

const STATUS_CFG = {
    pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
    confirmed: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", label: "Confirmed" },
    "in-progress": { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500", label: "In Progress" },
    completed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
    cancelled: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500", label: "Cancelled" },
};

const FILTERS = ["all", "pending", "confirmed", "in-progress", "completed", "cancelled"];

export default function Bookings() {
    const navigate = useNavigate();
    const { bookings, updateBookingStatus, loading } = useBookings();
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredBookings = statusFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === statusFilter);

    const counts = {
        all: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        "in-progress": bookings.filter((b) => b.status === "in-progress").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };

    const summaryCards = [
        { label: "Total", value: counts.all, icon: FiList, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" },
        { label: "Pending", value: counts.pending, icon: FiClock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        { label: "Confirmed", value: counts.confirmed, icon: FiCheckCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "In Progress", value: counts["in-progress"], icon: FiLoader, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
        { label: "Completed", value: counts.completed, icon: FiCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        { label: "Cancelled", value: counts.cancelled, icon: FiXCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Bookings</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage and track all your service bookings</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2 flex items-center gap-2 self-start sm:self-auto">
                    <FiCalendar size={14} className="text-indigo-500" />
                    <span className="text-sm font-bold text-indigo-700">{bookings.length} Total Bookings</span>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {summaryCards.map((s, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setStatusFilter(s.label.toLowerCase().replace(" ", "-") === "total" ? "all" : s.label.toLowerCase().replace(" ", "-"))}
                        className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl border transition-all ${s.bg} ${s.border} hover:shadow-sm active:scale-95`}
                    >
                        <s.icon size={15} className={s.color} />
                        <span className={`text-lg font-extrabold ${s.color}`}>{s.value}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{s.label}</span>
                    </motion.button>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                {FILTERS.map((status) => {
                    const cfg = STATUS_CFG[status];
                    const isActive = statusFilter === status;
                    return (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-1.5 cursor-pointer rounded-xl text-xs font-bold capitalize transition-all border ${isActive
                                ? status === "all"
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : `${cfg?.bg} ${cfg?.text} border-transparent shadow-sm ring-1 ring-inset ${cfg?.dot.replace("bg-", "ring-")}`
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                                }`}
                        >
                            {status === "all" ? "All" : cfg?.label}
                            <span className={`ml-1.5 text-[12px] font-extrabold ${isActive && status !== "all" ? cfg?.text : "text-gray-400"}`}>
                                {counts[status]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-gray-100 p-5 animate-pulse">
                            <div className="flex gap-4 items-center mb-4">
                                <div className="h-10 w-10 rounded-xl bg-gray-100" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-1/3 bg-gray-100 rounded-full" />
                                    <div className="h-2.5 w-1/4 bg-gray-100 rounded-full" />
                                </div>
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-8 bg-gray-100 rounded-xl" />
                                <div className="h-8 bg-gray-100 rounded-xl" />
                                <div className="h-8 bg-gray-100 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                        <FiCalendar size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-700">No bookings found</p>
                    <p className="text-xs text-gray-400 mt-1">
                        {statusFilter === "all" ? "You have no bookings yet" : `No ${statusFilter} bookings`}
                    </p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <div className="space-y-4">
                        {filteredBookings.map((booking, idx) => {
                            const sc = STATUS_CFG[booking.status] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: booking.status };
                            return (
                                <motion.div
                                    key={booking._id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                                >
                                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${avatarPalette[idx % avatarPalette.length]} text-white text-[11px] font-extrabold flex items-center justify-center flex-shrink-0`}>
                                                {getInitials(booking.user?.name)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-extrabold text-gray-900">{booking.user?.name || "Customer"}</p>
                                                <p className="text-[10px] font-mono text-gray-400">
                                                    #{booking.bookingNumber || booking._id.slice(-8).toUpperCase()}
                                                </p>
                                            </div>
                                        </div>

                                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl capitalize ${sc.bg} ${sc.text}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                            {sc.label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 px-5 py-4">
                                        <div className="pb-3 sm:pb-0 sm:pr-5">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <FiUser size={11} className="text-gray-400" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">{booking.user?.name || "—"}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{booking.user?.phone || "No phone"}</p>
                                        </div>

                                        <div className="py-3 sm:py-0 sm:px-5">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <FiCalendar size={11} className="text-gray-400" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service & Date</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 truncate">{booking.serviceName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {new Date(booking.bookedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                {booking.scheduledTime ? ` · ${booking.scheduledTime}` : ""}
                                            </p>
                                        </div>

                                        {/* Payment */}
                                        <div className="pt-3 sm:pt-0 sm:pl-5">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <FiDollarSign size={11} className="text-gray-400" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment</p>
                                            </div>
                                            <p className="text-lg font-extrabold text-gray-900">₹{booking.amount || 0}</p>
                                            <p className="text-xs text-gray-500 capitalize mt-0.5">{booking.paymentMethod || "—"}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-100 bg-gray-50/40">
                                        <button
                                            onClick={() => navigate(`${booking._id}`)}
                                            className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl transition active:scale-95"
                                        >
                                            View Details <FiArrowRight size={12} />
                                        </button>

                                        <div className="flex gap-2 flex-wrap">
                                            {booking.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => updateBookingStatus(booking._id, "confirmed")}
                                                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
                                                    >
                                                        ✓ Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => updateBookingStatus(booking._id, "cancelled")}
                                                        className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition active:scale-95"
                                                    >
                                                        ✕ Cancel
                                                    </button>
                                                </>
                                            )}

                                            {booking.status === "confirmed" && (
                                                <button
                                                    onClick={() => updateBookingStatus(booking._id, "in-progress")}
                                                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
                                                >
                                                    ▶ Start Job
                                                </button>
                                            )}

                                            {booking.status === "in-progress" && (
                                                <button
                                                    onClick={() => updateBookingStatus(booking._id, "completed")}
                                                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
                                                >
                                                    ✓ Mark Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
}
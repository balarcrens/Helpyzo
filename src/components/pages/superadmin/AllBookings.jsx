import React, { useEffect, useState } from "react";
import { bookingAPI } from "../../../services/api";
import {
    FiClipboard, FiCheckCircle, FiXCircle, FiClock,
    FiSearch, FiTrash2, FiCalendar,
    FiUser, FiTool, FiRefreshCw, FiChevronDown,
    FiAlertCircle, FiTag,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

const STATUS_META = {
    pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    confirmed: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
    "in-progress": { label: "In Progress", bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
    completed: { label: "Completed", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
};
const PAYMENT_META = {
    paid: { bg: "bg-emerald-100", text: "text-emerald-700" },
    unpaid: { bg: "bg-rose-100", text: "text-rose-600" },
    pending: { bg: "bg-amber-100", text: "text-amber-700" },
    refunded: { bg: "bg-purple-100", text: "text-purple-700" },
};
const ALL_STATUSES = ["all", "pending", "confirmed", "in-progress", "completed", "cancelled"];

const fmt = (d) => d
    ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const currency = (n) =>
    n !== undefined && n !== null ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

export default function AllBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deletingId, setDeletingId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true); setError(null);
            const res = await bookingAPI.getAllBookings();
            setBookings(res.data.bookings || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load bookings.");
        } finally { setLoading(false); }
    };
    useEffect(() => { fetchBookings(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this booking? This cannot be undone.")) return;
        try {
            setDeletingId(id);
            await bookingAPI.deleteBooking(id);
            setBookings(prev => prev.filter(b => b._id !== id));
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete.");
        } finally { setDeletingId(null); }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdatingId(id);
            await bookingAPI.updateBookingStatus(id, newStatus);
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update status.");
        } finally { setUpdatingId(null); }
    };

    const filtered = bookings.filter(b => {
        const q = search.toLowerCase();
        const matchSearch =
            b._id?.toLowerCase().includes(q) ||
            b.user?.name?.toLowerCase().includes(q) ||
            b.partner?.name?.toLowerCase().includes(q) ||
            b.serviceName?.toLowerCase().includes(q) ||
            b.status?.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = [
        { label: "Total", value: bookings.length, icon: <FiClipboard size={18} />, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Pending", value: bookings.filter(b => b.status === "pending").length, icon: <FiClock size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Completed", value: bookings.filter(b => b.status === "completed").length, icon: <FiCheckCircle size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, icon: <FiXCircle size={18} />, color: "text-red-500", bg: "bg-red-50" },
        {
            label: "Revenue", value: currency(bookings.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + (b.amount || 0), 0)),
            icon: <FaIndianRupeeSign size={18} />, color: "text-purple-600", bg: "bg-purple-50", small: true
        },
    ];

    /* ── shared loading / error / empty states ── */
    const StateView = () => {
        if (loading) return (
            <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                <div className="h-7 w-7 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
                <span className="text-sm font-medium">Loading bookings…</span>
            </div>
        );
        if (error) return (
            <div className="flex flex-col items-center justify-center py-16 text-red-500 gap-3">
                <FiAlertCircle size={36} className="opacity-60" />
                <p className="text-sm font-medium">{error}</p>
                <button onClick={fetchBookings} className="cursor-pointer text-xs font-semibold text-indigo-500 underline">Retry</button>
            </div>
        );
        if (filtered.length === 0) return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                <FiClipboard size={40} className="opacity-30" />
                <p className="text-sm">No bookings found{search ? ` for "${search}"` : ""}</p>
                {search && <button onClick={() => setSearch("")} className="cursor-pointer text-xs font-semibold text-indigo-500 underline">Clear search</button>}
            </div>
        );
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">All Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor, manage and update every service booking</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
                        <FiCalendar size={12} />
                        <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <button
                        onClick={fetchBookings}
                        disabled={loading}
                        className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-2xl px-3 py-2 shadow-sm transition disabled:opacity-60"
                    >
                        <FiRefreshCw size={12} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {stats.map((s, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                        <div className={`${s.bg} ${s.color} h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            {s.icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 font-medium truncate">{s.label}</p>
                            <p className={`font-extrabold text-gray-900 mt-0.5 ${s.small ? "text-base" : "text-xl"}`}>
                                {loading ? "…" : s.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col flex-wrap gap-3 px-4 py-4 border-b overflow-hidden border-gray-100 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                        <input
                            type="text"
                            placeholder="Search user, partner, service…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-400"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                        {ALL_STATUSES.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => setStatusFilter(s)}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${statusFilter === s
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {s === "all" ? `All (${bookings.length})` : s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:hidden">
                    {(loading || error || filtered.length === 0) ? <StateView /> : (
                        <div className="divide-y divide-gray-100">
                            {filtered.map((booking, idx) => {
                                const sm2 = STATUS_META[booking.status] || STATUS_META.pending;
                                const pm = PAYMENT_META[booking.paymentStatus] || PAYMENT_META.pending;
                                const isExpanded = expandedRow === booking._id;
                                return (
                                    <div key={idx} className="p-4 hover:bg-gray-50/60 transition-colors">
                                        {/* card top */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden shadow-sm">
                                                    {booking.user?.profileImage
                                                        ? <img src={booking.user.profileImage} alt="" className="h-full w-full object-cover" />
                                                        : (booking.user?.name?.[0]?.toUpperCase() || <FiUser size={13} />)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm truncate">{booking.user?.name || "—"}</p>
                                                    <p className="text-xs text-gray-400 truncate">{booking.user?.email || "—"}</p>
                                                </div>
                                            </div>
                                            <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${sm2.bg} ${sm2.text}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${sm2.dot}`} />
                                                {sm2.label}
                                            </span>
                                        </div>

                                        {/* card meta row */}
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <FiTool size={11} className="text-purple-400 flex-shrink-0" />
                                                <span className="truncate">{booking.partner?.name || "—"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <FiTag size={11} className="text-indigo-400 flex-shrink-0" />
                                                <span className="truncate">{booking.serviceName || "—"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FiCalendar size={11} className="text-gray-400 flex-shrink-0" />
                                                <span>{fmt(booking.bookingDate || booking.scheduledDate || booking.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FaIndianRupeeSign size={11} className="text-gray-400 flex-shrink-0" />
                                                <span className="font-semibold text-gray-800">{currency(booking.amount)}</span>
                                            </div>
                                        </div>

                                        {/* card actions */}
                                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${pm.bg} ${pm.text}`}>
                                                {booking.paymentStatus || "—"}
                                            </span>
                                            <select
                                                value={booking.status}
                                                onChange={e => handleStatusChange(booking._id, e.target.value)}
                                                disabled={updatingId === booking._id || booking.status === "cancelled"}
                                                className="sm:flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {["pending", "confirmed", "in-progress", "completed", "cancelled"].map((s, idx) => (
                                                    <option key={idx} value={s} className="capitalize">{s}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => setExpandedRow(isExpanded ? null : booking._id)}
                                                className="cursor-pointer p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition border border-indigo-100"
                                            >
                                                <FiChevronDown size={13} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(booking._id)}
                                                disabled={deletingId === booking._id}
                                                className="cursor-pointer p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition border border-red-100 disabled:opacity-50"
                                            >
                                                {deletingId === booking._id
                                                    ? <div className="h-3.5 w-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                                                    : <FiTrash2 size={13} />}
                                            </button>
                                        </div>

                                        {/* expanded details on mobile */}
                                        {isExpanded && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                                                <DetailItem label="Booking ID" value={booking._id} mono />
                                                <DetailItem label="Phone" value={booking.user?.phone} />
                                                <DetailItem label="Booked On" value={fmt(booking.createdAt)} />
                                                {booking.timeSlot && <DetailItem label="Time Slot" value={booking.timeSlot} />}
                                                {booking.address && <DetailItem label="Address" value={[booking.address?.street, booking.address?.city, booking.address?.state].filter(Boolean).join(", ")} full />}
                                                {booking.notes && <DetailItem label="Notes" value={booking.notes} full />}
                                                {booking.rating !== undefined && <DetailItem label="Rating" value={`${"★".repeat(booking.rating)}${"☆".repeat(5 - booking.rating)} (${booking.rating}/5)`} />}
                                                {booking.review && <DetailItem label="Review" value={booking.review} full />}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    {(loading || error || filtered.length === 0) ? <StateView /> : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 w-16">#</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Partner</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden xl:table-cell">Service</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden xl:table-cell">Date</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Payment</th>
                                    <th className="text-center px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((booking, idx) => {
                                    // const sm2 = STATUS_META[booking.status] || STATUS_META.pending;
                                    const pm = PAYMENT_META[booking.paymentStatus] || PAYMENT_META.pending;
                                    const isExpanded = expandedRow === booking._id;
                                    return (
                                        <React.Fragment key={booking._id}>
                                            <tr className="hover:bg-indigo-50/30 transition-colors group">
                                                {/* # */}
                                                <td className="px-5 py-4">
                                                    <p className="text-xs font-bold text-gray-400">#{idx + 1}</p>
                                                    <p className="font-mono text-[10px] text-gray-500 mt-0.5">{booking._id?.slice(-6).toUpperCase()}</p>
                                                </td>
                                                {/* Customer */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden shadow-sm">
                                                            {booking.user?.profileImage
                                                                ? <img src={booking.user.profileImage} alt="" className="h-full w-full object-cover" />
                                                                : (booking.user?.name?.[0]?.toUpperCase() || <FiUser size={12} />)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-900 text-xs truncate max-w-[120px]">{booking.user?.name || "—"}</p>
                                                            <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{booking.user?.email || "—"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Partner */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden shadow-sm">
                                                            {booking.partner?.profileImage
                                                                ? <img src={booking.partner.profileImage} alt="" className="h-full w-full object-cover" />
                                                                : (booking.partner?.name?.[0]?.toUpperCase() || <FiTool size={10} />)}
                                                        </div>
                                                        <p className="font-medium text-gray-700 text-xs truncate max-w-[100px]">{booking.partner?.name || "—"}</p>
                                                    </div>
                                                </td>
                                                {/* Service */}
                                                <td className="px-5 py-4 hidden xl:table-cell">
                                                    <div className="flex items-center gap-1.5">
                                                        <FiTag size={11} className="text-indigo-400 flex-shrink-0" />
                                                        <span className="text-xs text-gray-700 font-medium truncate max-w-[130px]">{booking.serviceName || "—"}</span>
                                                    </div>
                                                </td>
                                                {/* Date */}
                                                <td className="px-5 py-4 hidden xl:table-cell">
                                                    <p className="text-xs text-gray-600">{fmt(booking.bookingDate || booking.scheduledDate || booking.createdAt)}</p>
                                                    {booking.timeSlot && <p className="text-[10px] text-gray-400 mt-0.5">{booking.timeSlot}</p>}
                                                </td>
                                                {/* Payment */}
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${pm.bg} ${pm.text}`}>
                                                        {booking.paymentStatus || "—"}
                                                    </span>
                                                </td>
                                                {/* Actions */}
                                                <td className="px-5 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <div className="relative">
                                                            <select
                                                                value={booking.status}
                                                                onChange={e => handleStatusChange(booking._id, e.target.value)}
                                                                disabled={updatingId === booking._id || booking.status === "cancelled"}
                                                                className="appearance-none cursor-pointer pl-2 pr-5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                            >
                                                                {["pending", "confirmed", "in-progress", "completed", "cancelled"].map((s, idx) => (
                                                                    <option key={idx} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                            <FiChevronDown size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                            {updatingId === booking._id && (
                                                                <FaSpinner size={9} className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" />
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => setExpandedRow(isExpanded ? null : booking._id)}
                                                            className="cursor-pointer p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 transition"
                                                            title="Details"
                                                        >
                                                            <FiChevronDown size={13} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(booking._id)}
                                                            disabled={deletingId === booking._id}
                                                            className="cursor-pointer p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                                                            title="Delete"
                                                        >
                                                            {deletingId === booking._id
                                                                ? <div className="h-3.5 w-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                                                                : <FiTrash2 size={13} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Expanded detail row */}
                                            {isExpanded && (
                                                <tr key={`${idx}-${booking._id}`} className="bg-indigo-50/40">
                                                    <td colSpan={9} className="px-6 py-4">
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 text-xs">
                                                            <DetailItem label="Booking ID" value={booking._id} mono />
                                                            <DetailItem label="Service" value={booking.serviceName} />
                                                            <DetailItem label="Phone" value={booking.user?.phone} />
                                                            <DetailItem label="Booking Date" value={fmt(booking.bookingDate || booking.scheduledDate || booking.createdAt)} />
                                                            <DetailItem label="Total Amount" value={currency(booking.amount)} bold />
                                                            {booking.timeSlot && <DetailItem label="Time Slot" value={booking.timeSlot} />}
                                                            {booking.address && <DetailItem label="Address" value={[booking.address?.street, booking.address?.city, booking.address?.state].filter(Boolean).join(", ")} full />}
                                                            {booking.notes && <DetailItem label="Notes" value={booking.notes} full />}
                                                            {booking.rating !== undefined && <DetailItem label="Rating" value={`${"★".repeat(booking.rating)}${"☆".repeat(5 - booking.rating)} (${booking.rating}/5)`} />}
                                                            {booking.review && <DetailItem label="Review" value={booking.review} full />}
                                                            <DetailItem label="Created At" value={fmt(booking.createdAt)} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <span>
                            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{bookings.length}</span> bookings
                        </span>
                        {(search || statusFilter !== "all") && (
                            <button
                                onClick={() => { setSearch(""); setStatusFilter("all"); }}
                                className="cursor-pointer text-indigo-500 hover:text-indigo-700 font-semibold transition"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Expanded detail item ── */
function DetailItem({ label, value, mono, bold, chip, chipMeta, full }) {
    if (!value && value !== 0) return null;
    return (
        <div className={full ? "col-span-2" : ""}>
            <p className="text-gray-400 font-medium mb-0.5">{label}</p>
            {chip && chipMeta ? (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${chipMeta.bg} ${chipMeta.text}`}>
                    {chipMeta.dot && <span className={`h-1.5 w-1.5 rounded-full ${chipMeta.dot}`} />}
                    <span className="capitalize">{value}</span>
                </span>
            ) : (
                <p className={`text-gray-700 break-all ${mono ? "font-mono text-indigo-700 text-[10px]" : ""} ${bold ? "font-bold text-gray-900" : "font-medium"}`}>
                    {value}
                </p>
            )}
        </div>
    );
}
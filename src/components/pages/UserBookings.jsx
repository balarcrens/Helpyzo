/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiPackage,
    FiStar,
    FiX,
    FiAlertCircle,
    FiCheckCircle,
    FiChevronRight,
    FiRefreshCw,
} from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import AuthContext from "../../context/Auth/AuthContext";
import { bookingAPI } from "../../services/api";
import RatingModal from "../RatingModal";
import { useNavigate } from "react-router-dom";

const STATUS_TABS = ["all", "pending", "confirmed", "in-progress", "completed", "cancelled"];

const STATUS_STYLES = {
    pending: { pill: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400" },
    confirmed: { pill: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
    "in-progress": { pill: "bg-violet-50 text-violet-700 border border-violet-200", dot: "bg-violet-500" },
    completed: { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
    cancelled: { pill: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500" },
};

export default function UserBookings() {
    const { isLoggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [cancelId, setCancelId] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [ratingBooking, setRatingBooking] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await bookingAPI.getUserBookings();
            setBookings(res.data.bookings || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load your bookings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) fetchBookings();
    }, [isLoggedIn]);

    const handleCancel = async (bookingId) => {
        try {
            setCancelLoading(true);
            await bookingAPI.updateBookingStatus(bookingId, "cancelled");
            setBookings(prev =>
                prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b)
            );
            setCancelId(null);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel booking.");
        } finally {
            setCancelLoading(false);
        }
    };

    const filtered = activeTab === "all"
        ? bookings
        : bookings.filter(b => b.status === activeTab);

    // Stats
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === "pending").length,
        completed: bookings.filter(b => b.status === "completed").length,
    };

    return (
        <Layout>
            <Header />

            {/* ── HERO BANNER ── */}
            <section className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 pt-28 pb-14 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#9fe870]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-xs font-semibold tracking-widest text-[#9fe870] uppercase">
                            My Account
                        </span>
                        <h1 className="mt-2 text-4xl md:text-5xl font-bold text-white tracking-tight">
                            My Bookings
                        </h1>
                        <p className="mt-3 text-stone-400 max-w-md">
                            Track, manage, and review all your service appointments in one place.
                        </p>
                    </motion.div>

                    {/* Stat chips */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex flex-wrap gap-3 mt-8"
                    >
                        {[
                            { label: "Total", value: stats.total, color: "bg-white/10 text-white" },
                            { label: "Pending", value: stats.pending, color: "bg-amber-400/15 text-amber-300" },
                            { label: "Completed", value: stats.completed, color: "bg-emerald-400/15 text-emerald-300" },
                        ].map(chip => (
                            <div key={chip.label} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur border border-white/10 ${chip.color}`}>
                                <span className="text-lg font-bold">{chip.value}</span>
                                <span className="opacity-70">{chip.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── MAIN CONTENT ── */}
            <section className="bg-slate-100 min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {STATUS_TABS.map(tab => {
                            const active = activeTab === tab;
                            return (
                                <motion.button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${active
                                            ? "text-stone-900 shadow"
                                            : "text-stone-500 hover:text-stone-800 bg-white"
                                        }`}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="active-booking-tab"
                                            className="absolute inset-0 rounded-full bg-[#9fe870]"
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                    <span className="relative z-10">{tab}</span>
                                </motion.button>
                            );
                        })}

                        {/* Refresh */}
                        <button
                            onClick={fetchBookings}
                            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-stone-500 hover:text-stone-800 text-sm font-semibold transition"
                        >
                            <FiRefreshCw size={14} />
                            Refresh
                        </button>
                    </div>

                    {/* ── STATES ── */}
                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} onRetry={fetchBookings} />
                    ) : filtered.length === 0 ? (
                        <EmptyState activeTab={activeTab} navigate={navigate} />
                    ) : (
                        <motion.div
                            layout
                            className="grid gap-5"
                        >
                            <AnimatePresence mode="popLayout">
                                {filtered.map((booking, i) => (
                                    <BookingCard
                                        key={booking._id}
                                        booking={booking}
                                        index={i}
                                        cancelId={cancelId}
                                        setCancelId={setCancelId}
                                        cancelLoading={cancelLoading}
                                        handleCancel={handleCancel}
                                        onRate={() => {
                                            setRatingBooking(booking);
                                            setShowRatingModal(true);
                                        }}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Rating Modal */}
            {ratingBooking && (
                <RatingModal
                    isOpen={showRatingModal}
                    bookingId={ratingBooking._id}
                    partnerName={ratingBooking.partner?.name}
                    serviceName={ratingBooking.serviceName}
                    onClose={() => {
                        setShowRatingModal(false);
                        setRatingBooking(null);
                    }}
                    onSuccess={() => {
                        fetchBookings();
                        setShowRatingModal(false);
                        setRatingBooking(null);
                    }}
                />
            )}
        </Layout>
    );
}

function BookingCard({ booking, index, cancelId, setCancelId, cancelLoading, handleCancel, onRate }) {
    const st = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
    const isPending = booking.status === "pending";
    const isCompleted = booking.status === "completed";
    const canCancel = isPending;
    const canRate = isCompleted && !booking.rating;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
            {/* ── TOP BAR ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    {/* Service thumbnail */}
                    {booking.serviceImage ? (
                        <img
                            src={booking.serviceImage}
                            alt={booking.serviceName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <FiPackage className="text-slate-400" size={20} />
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-stone-900 leading-tight">
                            {booking.serviceName}
                        </h3>
                        <p className="text-xs text-stone-400 mt-0.5">
                            #{booking.bookingNumber || booking._id?.slice(-8).toUpperCase()}
                        </p>
                    </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${st.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {booking.status}
                </span>
            </div>

            {/* ── BODY ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-5">
                {/* Partner */}
                <InfoItem
                    icon={<HiBadgeCheck className="text-blue-500" size={16} />}
                    label="Partner"
                    value={booking.partner?.name || "—"}
                />
                {/* Date */}
                <InfoItem
                    icon={<FiCalendar className="text-[#7ccf52]" size={15} />}
                    label="Date"
                    value={
                        booking.bookedDate
                            ? new Date(booking.bookedDate).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                            })
                            : "—"
                    }
                />
                {/* Time */}
                <InfoItem
                    icon={<FiClock className="text-violet-500" size={15} />}
                    label="Time"
                    value={booking.scheduledTime || "—"}
                />
                {/* Location */}
                <InfoItem
                    icon={<FiMapPin className="text-rose-400" size={15} />}
                    label="Address"
                    value={
                        booking.userAddress
                            ? `${booking.userAddress.street || ""}, ${booking.userAddress.city || ""}`.replace(/^,\s*/, "")
                            : "—"
                    }
                />
            </div>

            {/* ── FOOTER ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-3xl">
                {/* Amount + Payment */}
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-stone-900">
                        ₹{booking.amount}
                    </span>
                    <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${booking.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                    >
                        {booking.paymentStatus || "pending"}
                    </span>
                    <span className="text-xs text-stone-400 capitalize">
                        via {booking.paymentMethod || "online"}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    {canRate && (
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={onRate}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400/10 text-amber-700 text-sm font-semibold hover:bg-amber-400/20 transition"
                        >
                            <FiStar size={14} />
                            Rate Service
                        </motion.button>
                    )}

                    {booking.status === "completed" && booking.rating && (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold">
                            <FiStar size={13} className="fill-current" />
                            {booking.rating} Rated
                        </div>
                    )}

                    {canCancel && (
                        <>
                            {cancelId === booking._id ? (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2"
                                    >
                                        <FiAlertCircle className="text-red-500 shrink-0" size={15} />
                                        <span className="text-xs text-red-700 font-medium">Cancel this booking?</span>
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            disabled={cancelLoading}
                                            className="text-xs font-bold text-red-600 hover:text-red-800 disabled:opacity-50 transition"
                                        >
                                            {cancelLoading ? "..." : "Yes"}
                                        </button>
                                        <button
                                            onClick={() => setCancelId(null)}
                                            className="text-xs font-bold text-stone-500 hover:text-stone-700 transition"
                                        >
                                            No
                                        </button>
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setCancelId(booking._id)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                                >
                                    <FiX size={14} />
                                    Cancel
                                </motion.button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}


function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">{label}</p>
                <p className="text-sm font-medium text-stone-800 mt-0.5 leading-snug">{value}</p>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-[#9fe870] border-t-transparent animate-spin" />
            <p className="text-stone-500 font-medium">Loading your bookings...</p>
        </div>
    );
}

function ErrorState({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <FiAlertCircle className="text-red-500" size={28} />
            </div>
            <p className="text-stone-700 font-semibold">{message}</p>
            <button
                onClick={onRetry}
                className="px-6 py-2.5 bg-stone-900 text-white rounded-full text-sm font-semibold hover:bg-stone-700 transition"
            >
                Try Again
            </button>
        </div>
    );
}

function EmptyState({ activeTab, navigate }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-5 text-center"
        >
            <div className="w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center">
                <MdOutlineBookmarkBorder className="text-stone-300" size={44} />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-stone-800">
                    {activeTab === "all" ? "No bookings yet" : `No ${activeTab} bookings`}
                </h3>
                <p className="text-stone-500 mt-1.5 max-w-xs">
                    {activeTab === "all"
                        ? "You haven't booked any service yet. Browse and book your first one!"
                        : `You don't have any "${activeTab}" bookings right now.`}
                </p>
            </div>
            {activeTab === "all" && (
                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate("/category")}
                    className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#7cc44a] to-[#9fe870] text-stone-900 rounded-full font-bold shadow-lg shadow-[#9fe870]/30 hover:opacity-95 transition"
                >
                    Browse Services
                    <FiChevronRight size={18} />
                </motion.button>
            )}
        </motion.div>
    );
}

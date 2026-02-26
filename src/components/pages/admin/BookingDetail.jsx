/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiUser,
    FiPhone,
    FiMapPin,
    FiClock,
    FiCreditCard,
    FiCalendar,
    FiArrowLeft,
    FiFileText,
    FiHash,
    FiCheckCircle,
    FiDollarSign,
} from "react-icons/fi";
import ToastContext from "../../../context/Toast/ToastContext";
import { useBookings } from "../../../hooks/useData";

const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const STATUS_CFG = {
    pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    confirmed: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
    "in-progress": { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
    completed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    cancelled: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
};

const PAYMENT_STATUS_CFG = {
    pending: { bg: "bg-amber-100", text: "text-amber-700" },
    paid: { bg: "bg-emerald-100", text: "text-emerald-700" },
    failed: { bg: "bg-red-100", text: "text-red-600" },
    refunded: { bg: "bg-gray-100", text: "text-gray-600" },
};

const BOOKING_STATUSES = ["pending", "confirmed", "in-progress", "completed", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const InfoRow = ({ icon: Icon, label, value, valueClass = "text-gray-900" }) => (
    <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon size={13} className="text-gray-400" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
            <p className={`text-sm font-semibold leading-snug ${valueClass}`}>{value || "—"}</p>
        </div>
    </div>
);

const SectionCard = ({ icon: Icon, iconBg, title, subtitle, children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden ${className}`}
    >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <Icon size={16} />
            </div>
            <div>
                <h3 className="text-sm font-extrabold text-gray-900">{title}</h3>
                {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
            </div>
        </div>
        <div className="p-5">{children}</div>
    </motion.div>
);

export default function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { booking, fetchBookingById, loading, updateBookingStatus, updateBookingPaymentStatus } = useBookings();

    useEffect(() => { fetchBookingById(id); }, [id]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="h-28 bg-white rounded-3xl border border-gray-100 animate-pulse" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="h-52 bg-white rounded-3xl border border-gray-100 animate-pulse" />
                    <div className="h-52 bg-white rounded-3xl border border-gray-100 animate-pulse" />
                </div>
                <div className="h-40 bg-white rounded-3xl border border-gray-100 animate-pulse" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 text-center max-w-5xl mx-auto">
                <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                    <FiFileText size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-700">Booking not found</p>
                <p className="text-xs text-gray-400 mt-1">This booking may have been deleted or doesn't exist.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition"
                >
                    <FiArrowLeft size={13} /> Go Back
                </button>
            </div>
        );
    }

    const sc = STATUS_CFG[booking.status] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    const psc = PAYMENT_STATUS_CFG[booking.paymentStatus] || { bg: "bg-gray-100", text: "text-gray-600" };

    const address = booking.userAddress
        ? [
            booking.userAddress.street,
            booking.userAddress.city,
            booking.userAddress.state,
            booking.userAddress.pincode,
            booking.userAddress.country,
        ].filter(Boolean).join(", ")
        : "Address not provided";

    return (
        <div className="max-w-5xl mx-auto space-y-5">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="h-9 w-9 cursor-pointer rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition active:scale-90 flex-shrink-0"
                        >
                            <FiArrowLeft size={16} />
                        </button>

                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-base font-extrabold flex-shrink-0 shadow-md">
                            {getInitials(booking.user?.name)}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Booking ID</p>
                                <span className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                                    <FiHash size={10} />
                                    {booking.bookingNumber || booking._id?.slice(-8).toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-xl font-extrabold text-gray-900 mt-0.5">{booking.user?.name || "Customer Booking"}</h1>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                                <FiCalendar size={11} />
                                {new Date(booking.bookedDate).toLocaleString("en-IN", {
                                    day: "numeric", month: "long", year: "numeric",
                                    hour: "2-digit", minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Booking Status</p>
                        <div className={`relative inline-flex items-center gap-2 ${sc.bg} ${sc.text} rounded-xl px-1 py-1 pr-2`}>
                            <span className={`h-2 w-2 rounded-full ${sc.dot} ml-2`} />
                            <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(id, e.target.value)}
                                className={`bg-transparent text-sm font-bold capitalize outline-none cursor-pointer ${sc.text}`}
                            >
                                {BOOKING_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Customer Information */}
                <SectionCard
                    icon={FiUser}
                    iconBg="bg-blue-50 text-blue-600"
                    title="Customer Information"
                    subtitle="Contact & address details"
                >
                    <div className="space-y-3.5">
                        <InfoRow icon={FiUser} label="Full Name" value={booking.user?.name || "Unknown Customer"} />
                        <InfoRow icon={FiPhone} label="Phone" value={booking.user?.phone} />
                        <InfoRow icon={FiMapPin} label="Address" value={address} />
                    </div>
                </SectionCard>

                {/* Service Details */}
                <SectionCard
                    icon={FiCheckCircle}
                    iconBg="bg-violet-50 text-violet-600"
                    title="Service Details"
                    subtitle="What was booked"
                >
                    <div className="space-y-3.5">
                        <InfoRow icon={FiFileText} label="Service Name" value={booking.serviceName} />
                        <InfoRow icon={FiCalendar} label="Scheduled Date" value={
                            new Date(booking.bookedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                        } />
                        <InfoRow icon={FiClock} label="Scheduled Time" value={booking.scheduledTime || "Not specified"} />
                        <InfoRow icon={FiClock} label="Duration" value={booking.durationMinutes ? `${booking.durationMinutes} minutes` : undefined} />
                        {booking.notes && (
                            <InfoRow icon={FiFileText} label="Notes" value={booking.notes} />
                        )}
                    </div>
                </SectionCard>

            </div>

            {/* ── Payment ── */}
            <SectionCard
                icon={FiDollarSign}
                iconBg="bg-emerald-50 text-emerald-600"
                title="Payment Summary"
                subtitle="Billing and payment method"
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Total Amount</p>
                        <p className="text-3xl font-extrabold text-gray-900">₹{booking.amount || 0}</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Payment Method</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                <FiCreditCard size={14} className="text-gray-400" />
                            </div>
                            <p className="text-sm font-extrabold text-gray-900 capitalize">{booking.paymentMethod || "—"}</p>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Payment Status</p>
                        <div className={`inline-flex items-center gap-2 ${psc.bg} ${psc.text} rounded-xl px-1 py-1 pr-3 mt-1`}>
                            <span className={`h-2 w-2 rounded-full ml-2 ${booking.paymentStatus === "paid" ? "bg-emerald-500" :
                                booking.paymentStatus === "failed" ? "bg-red-500" :
                                    booking.paymentStatus === "refunded" ? "bg-gray-400" :
                                        "bg-amber-500"
                                }`} />
                            <select
                                name="paymentStatus"
                                value={booking.paymentStatus || "pending"}
                                onChange={(e) => updateBookingPaymentStatus(id, e.target.value)}
                                className={`bg-transparent text-sm font-bold capitalize outline-none cursor-pointer ${psc.text}`}
                            >
                                {PAYMENT_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    );
}
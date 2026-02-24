/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBookings } from "../../../hooks/useData";
import { usePartner } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { bookingAPI } from "../../../services/api";

export default function Bookings() {
    const navigate = useNavigate();
    const { user } = usePartner();
    const [bookings, setBookings] = useState([]);
    const { updateBookingStatus } = useBookings();
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchPartnerBookings = async () => {
        try {
            const res = await bookingAPI.getPartnerBookings(user._id);
            setBookings(res.data.bookings);
        } catch (error) {
            console.error("Failed to load bookings", error.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchPartnerBookings()
    }, []);

    const filteredBookings = statusFilter === "all"
        ? bookings
        : bookings.filter(b => b.status === statusFilter);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
            fetchPartnerBookings();
        } catch (error) {
            alert(error.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "in-progress":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-purple-100 text-purple-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
                <div className="flex gap-2 flex-wrap">
                    {["all", "pending", "confirmed", "in-progress", "completed", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${statusFilter === status
                                ? "bg-[#9fe870] text-stone-900"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading bookings...</div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No bookings found</div>
            ) : (
                <div className="grid gap-4">
                    {filteredBookings.map((booking) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
                        >
                            {/* TOP BAR */}
                            <div className="flex flex-wrap justify-between items-center px-5 py-4 border-b border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500">Booking ID</p>
                                    <p className="font-mono text-sm font-semibold">
                                        #{booking.bookingNumber || booking._id.slice(-6)}
                                    </p>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>

                            {/* MAIN CONTENT */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 py-4">
                                {/* CUSTOMER */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                                    <p className="font-semibold">{booking.user?.name}</p>
                                    <p className="text-sm text-gray-500">{booking.user?.phone}</p>
                                </div>

                                {/* SERVICE & DATE */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Service</p>
                                    <p className="font-semibold">{booking.serviceName}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(booking.bookedDate).toLocaleDateString()} • {booking.scheduledTime}
                                    </p>
                                </div>

                                {/* PAYMENT */}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Payment</p>
                                    <p className="font-semibold text-lg">₹{booking.amount}</p>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {booking.paymentMethod}
                                    </p>
                                </div>
                            </div>

                            {/* FOOTER ACTIONS */}
                            <div className="flex justify-between items-center px-5 py-4 border-t border-gray-200">
                                <button
                                    onClick={() => navigate(`${booking._id}`)}
                                    className="text-sm font-semibold text-blue-600 hover:underline"
                                >
                                    View Details →
                                </button>

                                <div className="flex gap-2">
                                    {booking.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(booking._id, "confirmed")}
                                                className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(booking._id, "cancelled")}
                                                className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}

                                    {booking.status === "confirmed" && (
                                        <button
                                            onClick={() => handleStatusChange(booking._id, "in-progress")}
                                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                                        >
                                            Start Job
                                        </button>
                                    )}

                                    {booking.status === "in-progress" && (
                                        <button
                                            onClick={() => handleStatusChange(booking._id, "completed")}
                                            className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold"
                                        >
                                            Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

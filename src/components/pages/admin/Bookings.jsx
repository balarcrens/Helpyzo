import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiClock } from "react-icons/fi";
import { useBookings } from "../../../hooks/useData";

export default function Bookings() {
    const { bookings, fetchPartnerBookings, updateBookingStatus, loading } = useBookings();
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchPartnerBookings();
    }, []);

    const filteredBookings = statusFilter === "all" 
        ? bookings 
        : bookings.filter(b => b.status === statusFilter);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
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
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                                statusFilter === status
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white p-4 rounded-xl border border-gray-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-gray-600 text-sm">Customer</p>
                                    <p className="font-semibold">{booking.user?.name}</p>
                                    <p className="text-gray-600 text-sm">{booking.user?.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Booking Details</p>
                                    <p className="font-semibold">₹{booking.amount}</p>
                                    <p className="text-gray-600 text-sm">{new Date(booking.bookedDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600 text-sm">{booking.paymentMethod}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className={`${getStatusColor(booking.status)} px-3 py-1 rounded-lg text-sm font-semibold w-fit`}>
                                        {booking.status}
                                    </span>
                                    {booking.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusChange(booking._id, "confirmed")}
                                                className="flex-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-1"
                                            >
                                                <FiCheck /> Confirm
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(booking._id, "cancelled")}
                                                className="flex-1 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-600 flex items-center justify-center gap-1"
                                            >
                                                <FiX /> Cancel
                                            </button>
                                        </div>
                                    )}
                                    {booking.status === "confirmed" && (
                                        <button
                                            onClick={() => handleStatusChange(booking._id, "in-progress")}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-600 flex items-center justify-center gap-1"
                                        >
                                            <FiClock /> Start
                                        </button>
                                    )}
                                    {booking.status === "in-progress" && (
                                        <button
                                            onClick={() => handleStatusChange(booking._id, "completed")}
                                            className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-purple-600 flex items-center justify-center gap-1"
                                        >
                                            <FiCheck /> Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                            {booking.notes && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-sm text-gray-600"><strong>Notes:</strong> {booking.notes}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

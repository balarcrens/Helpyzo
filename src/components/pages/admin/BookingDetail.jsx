/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bookingAPI } from "../../../services/api";
import {
    FiUser,
    FiPhone,
    FiMapPin,
    FiClock,
    FiCreditCard
} from "react-icons/fi";

export default function BookingDetails() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const fetchBooking = async () => {
        try {
            const res = await bookingAPI.getBookingById(id);
            setBooking(res.data.booking);
        } catch (err) {
            console.error("Failed to load booking", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (e) => {
        try {
            await bookingAPI.updateBookingStatus(id, e.target.value);
            fetchBooking();
        } catch (err) {
            console.error("Failed to update booking status", err.message);
        }
    };

    const handlePaymentStatusChange = async (e) => {
        try {
            await bookingAPI.updateBookingPaymentStatus(id, e.target.value);
            fetchBooking();
        } catch (error) {
            console.error("Failed to update payment status", error.message);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Loading booking details...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center py-20 text-gray-500">
                Booking not found
            </div>
        );
    }

    const address = booking.userAddress
        ? `${booking.userAddress.street}, ${booking.userAddress.city},
           ${booking.userAddress.state} - ${booking.userAddress.pincode},
           ${booking.userAddress.country}`
        : "—";

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-700",
        confirmed: "bg-blue-100 text-blue-700",
        "in-progress": "bg-indigo-100 text-indigo-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700"
    }[booking.status] || "bg-gray-100 text-gray-700";

    const bookingstatus = ["pending", "confirmed", "in-progress", "completed", "cancelled"]
    const paymentstatus = ['pending', 'paid', 'failed', 'refunded']

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* ===== HEADER ===== */}
            <div className="rounded-3xl p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm opacity-70">Booking ID</p>
                        <h1 className="text-3xl font-bold">
                            #{booking.bookingNumber}
                        </h1>
                        <p className="text-sm opacity-70 mt-1">
                            {new Date(booking.bookedDate).toLocaleString()}
                        </p>
                    </div>

                    <select
                        className={`px-5 py-2 rounded-full text-sm font-semibold capitalize ${statusColor}`}
                        value={booking.status}
                        onChange={(e) => handleStatusChange(e)}
                    >
                        {bookingstatus.map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ===== CONTENT GRID ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* CUSTOMER */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">
                        Customer Information
                    </h3>

                    <div className="space-y-3 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                            <FiUser className="text-gray-400" />
                            {booking.user?.name || "Unknown Customer"}
                        </p>

                        <p className="flex items-center gap-2">
                            <FiPhone className="text-gray-400" />
                            {booking.user?.phone || "N/A"}
                        </p>

                        <p className="flex items-start gap-2">
                            <FiMapPin className="text-gray-400 mt-1" />
                            {address}
                        </p>
                    </div>
                </div>

                {/* SERVICE */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-semibold text-lg mb-4">
                        Service Details
                    </h3>

                    <div className="space-y-3 text-sm text-gray-700">
                        <p>
                            <span className="text-gray-500">Service:</span>{" "}
                            <span className="font-medium">
                                {booking.serviceName}
                            </span>
                        </p>

                        <p className="flex items-center gap-2">
                            <FiClock className="text-gray-400" />
                            {booking.durationMinutes} minutes
                        </p>

                        <p>
                            <span className="text-gray-500">Notes:</span>{" "}
                            {booking.notes || "No additional notes"}
                        </p>
                    </div>
                </div>

                {/* PAYMENT */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
                    <h3 className="font-semibold text-lg mb-4">
                        Payment Summary
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                        <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-semibold text-2xl">
                                ₹{booking.amount}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Payment Method</p>
                            <p className="flex items-center gap-2 font-medium">
                                <FiCreditCard className="text-gray-400" />
                                {booking.paymentMethod}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-500">Payment Status</p>
                            {/* <span className="inline-block mt-1 px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                                {booking.paymentStatus || "Pending"}
                            </span> */}
                            <select name="paymentStatus" id="paymentStatus" value={booking.paymentStatus || "pending"} onChange={(e) => handlePaymentStatusChange(e)} className="mt-1 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                                {paymentstatus.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
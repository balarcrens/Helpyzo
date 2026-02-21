/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiUsers, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { useBookings } from "../../../hooks/useData";
import { usePartner } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const { bookings, fetchPartnerBookings } = useBookings();
    const { user } = usePartner();
    const [stats, setStats] = useState({
        totalBookings: 0,
        completedBookings: 0,
        totalEarnings: 0,
        pendingBookings: 0,
    });

    useEffect(() => {
        fetchPartnerBookings(user?._id);
    }, [user?._id]);

    useEffect(() => {
        if (!bookings || bookings.length === 0) return;

        const today = new Date().toDateString();

        const completed = bookings.filter(b => b.status === "completed");
        const pending = bookings.filter(b => b.status === "pending");
        const cancelled = bookings.filter(b => b.status === "cancelled");

        const todayBookings = bookings.filter(
            b => new Date(b.bookedDate).toDateString() === today
        );

        const upcoming = bookings.filter(
            b => new Date(b.bookedDate) > new Date() && b.status === "pending"
        );

        const totalEarnings = completed.reduce(
            (sum, b) => sum + (b.amount || 0),
            0
        );

        setStats({
            totalBookings: bookings.length,
            completedBookings: completed.length,
            pendingBookings: pending.length,
            cancelledBookings: cancelled.length,
            todayBookings: todayBookings.length,
            upcomingBookings: upcoming.length,
            totalEarnings,
            avgOrderValue: completed.length
                ? Math.round(totalEarnings / completed.length)
                : 0,
            completionRate: bookings.length
                ? Math.round((completed.length / bookings.length) * 100)
                : 0,
        });
    }, [bookings]);

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${color} p-6 rounded-xl text-white shadow-lg`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="opacity-80 text-sm font-semibold">{label}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <Icon className="text-3xl opacity-60" />
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
                <p className="text-gray-600">Here's your business overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={FiCalendar}
                    label="Total Bookings"
                    value={stats.totalBookings}
                    color="from-blue-500 to-blue-600"
                />
                <StatCard
                    icon={FiTrendingUp}
                    label="Completed"
                    value={stats.completedBookings}
                    color="from-green-500 to-green-600"
                />
                <StatCard
                    icon={FiBriefcase}
                    label="Total Earnings"
                    value={`₹${stats.totalEarnings}`}
                    color="from-purple-500 to-purple-600"
                />
                <StatCard
                    icon={FiUsers}
                    label="Pending"
                    value={stats.pendingBookings}
                    color="from-yellow-500 to-yellow-600"
                />

                <StatCard
                    icon={FiCalendar}
                    label="Today’s Bookings"
                    value={stats.todayBookings}
                    color="from-cyan-500 to-cyan-600"
                />

                <StatCard
                    icon={FiBriefcase}
                    label="Upcoming"
                    value={stats.upcomingBookings}
                    color="from-indigo-500 to-indigo-600"
                />

                <StatCard
                    icon={FiTrendingUp}
                    label="Avg Order Value"
                    value={`₹${stats.avgOrderValue}`}
                    color="from-pink-500 to-pink-600"
                />

                <StatCard
                    icon={FiUsers}
                    label="Completion Rate"
                    value={`${stats.completionRate}%`}
                    color="from-emerald-500 to-emerald-600"
                />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-stone-900">
                                        {booking.user?.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {booking.serviceName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(booking.bookedDate).toLocaleDateString()} •{" "}
                                        {booking.scheduledTime}
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : booking.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <p className="font-semibold text-stone-800">
                                    ₹{booking.amount}
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({booking.paymentMethod})
                                    </span>
                                </p>

                                <button
                                    className="text-sm font-semibold text-indigo-600 hover:underline"
                                    onClick={() => navigate(`bookings/${booking._id}`)}
                                >
                                    View Details →
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

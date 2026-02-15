/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiUsers, FiTrendingUp, FiCalendar } from "react-icons/fi";
import { useBookings } from "../../../hooks/useData";
import { usePartner } from "../../../hooks/useAuth";

export default function Dashboard() {
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
        if (bookings.length > 0) {
            const totalEarnings = bookings
                .filter(b => b.status === "completed")
                .reduce((sum, b) => sum + (b.amount || 0), 0);

            setStats({
                totalBookings: bookings.length,
                completedBookings: bookings.filter(b => b.status === "completed").length,
                totalEarnings,
                pendingBookings: bookings.filter(b => b.status === "pending").length,
            });
        }
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
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                        <motion.div
                            key={booking._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                            <div>
                                <p className="font-semibold">{booking.user?.name}</p>
                                <p className="text-sm text-gray-600">{new Date(booking.bookedDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹{booking.amount}</p>
                                <p className={`text-sm font-semibold ${booking.status === "completed" ? "text-green-600" :
                                        booking.status === "pending" ? "text-yellow-600" :
                                            "text-blue-600"
                                    }`}>{booking.status}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

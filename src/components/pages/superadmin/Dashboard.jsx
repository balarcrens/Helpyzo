/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
    FaUsers,
    FaTools,
    FaClipboardList,
    FaUserTie,
    FaArrowUp,
    FaArrowDown,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useBookings } from "../../../hooks/useData";
import { userAPI, partnerAPI } from "../../../services/api";

export default function Dashboard() {
    const { bookings, fetchBookings } = useBookings();
    const [users, setUsers] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [bookingsRes, usersRes, partnersRes] = await Promise.all([
                    fetchBookings(),
                    userAPI.getAllUsers(),
                    partnerAPI.getAllPartners(),
                ]);
                setUsers(usersRes.data.users);
                setPartners(partnersRes.data.partners);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        {
            title: "Total Users",
            value: (users && Array.isArray(users)) ? users.length : 0,
            change: "+12%",
            trend: "up",
            icon: <FaUsers />,
            gradient: "from-blue-500 to-indigo-600",
        },
        {
            title: "Active Partners",
            value: (partners && Array.isArray(partners)) ? partners.filter(p => p && p.isActive).length : 0,
            change: "+5%",
            trend: "up",
            icon: <FaTools />,
            gradient: "from-emerald-500 to-green-600",
        },
        {
            title: "Total Bookings",
            value: (bookings && Array.isArray(bookings)) ? bookings.length : 0,
            change: "-3%",
            trend: "down",
            icon: <FaClipboardList />,
            gradient: "from-amber-500 to-yellow-600",
        },
        {
            title: "Partners",
            value: (partners && Array.isArray(partners)) ? partners.length : 0,
            change: "+2%",
            trend: "up",
            icon: <FaUserTie />,
            gradient: "from-purple-500 to-fuchsia-600",
        },
    ];

    const statusColor = {
        completed: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        cancelled: "bg-red-100 text-red-700",
        confirmed: "bg-blue-100 text-blue-700",
        "in-progress": "bg-indigo-100 text-indigo-700",
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    SuperAdmin Dashboard
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Complete system overview & real-time controls
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all"
                    >
                        <div
                            className={`bg-gradient-to-br ${item.gradient} p-6 text-white`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm opacity-90">{item.title}</p>
                                    <h2 className="text-4xl font-bold mt-2">
                                        {item.value}
                                    </h2>
                                </div>

                                <div className="text-2xl bg-white/20 p-4 rounded-2xl">
                                    {item.icon}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6 text-sm">
                                {item.trend === "up" ? (
                                    <FaArrowUp className="text-green-200" />
                                ) : (
                                    <FaArrowDown className="text-red-200" />
                                )}
                                <span className="opacity-90">
                                    {item.change} from last month
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Bookings */}
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Recent Bookings
                        </h2>
                        <button className="text-sm font-semibold text-indigo-600 hover:underline">
                            View all
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400">
                                    <th className="pb-4">Booking ID</th>
                                    <th className="pb-4">User</th>
                                    <th className="pb-4">Service</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(bookings && Array.isArray(bookings)) ? (
                                    bookings.slice(0, 5).map((item) => (
                                        <tr
                                            key={item?._id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="py-4 font-medium text-gray-900">
                                                {item?._id?.slice(-6).toUpperCase() || 'N/A'}
                                            </td>
                                            <td>{item?.user?.name || 'Unknown'}</td>
                                            <td>{item?.serviceId || 'N/A'}</td>
                                            <td>
                                                <span
                                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${statusColor[item?.status] || ''}`}
                                                >
                                                    {item?.status || 'unknown'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="py-4 text-center text-gray-500">No bookings available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">
                        System Health
                    </h2>

                    <ul className="space-y-5 text-sm">
                        <li className="flex justify-between">
                            <span className="text-gray-500">API Status</span>
                            <span className="text-green-600 font-semibold">
                                Operational
                            </span>
                        </li>

                        <li className="flex justify-between">
                            <span className="text-gray-500">Active Users</span>
                            <span className="font-semibold text-gray-900">{(users && Array.isArray(users)) ? users.length : 0}</span>
                        </li>

                        <li className="flex justify-between">
                            <span className="text-gray-500">Pending Bookings</span>
                            <span className="font-semibold text-gray-900">{(bookings && Array.isArray(bookings)) ? bookings.filter(b => b && b.status === "pending").length : 0}</span>
                        </li>

                        <li className="flex justify-between">
                            <span className="text-gray-500">System Alerts</span>
                            <span className="text-green-600 font-semibold">0</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
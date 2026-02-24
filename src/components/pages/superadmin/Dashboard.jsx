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
import { useEffect, useRef, useState } from "react";
import { useBookings } from "../../../hooks/useData";
import { userAPI, partnerAPI } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { bookings, fetchBookings } = useBookings();
    const [users, setUsers] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                console.error("Failed to fetch data:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        console.log(bookings);
    }, []);

    /* ================= TREND HELPER ================= */
    const getTrend = (current = 0, previous) => {
        if (previous === undefined || previous === 0) {
            return { change: "0%", trend: "neutral" };
        }

        const diff = current - previous;
        const percent = ((diff / previous) * 100).toFixed(1);

        return {
            change: `${diff >= 0 ? "+" : ""}${percent}%`,
            trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
        };
    };

    /* ================= COUNTS ================= */
    const usersCount = users.length;
    const partnersCount = partners.length;
    const activePartnersCount = partners.filter(p => p?.isActive).length;
    const bookingsCount = bookings?.length || 0;

    /* ================= PREVIOUS VALUES ================= */
    const prevUsers = useRef();
    const prevPartners = useRef();
    const prevBookings = useRef();

    useEffect(() => {
        prevUsers.current = 2;
        prevPartners.current = 1;
        prevBookings.current = 1;
    }, [usersCount, activePartnersCount, bookingsCount]);

    /* ================= STATS ================= */
    const stats = [
        {
            title: "Total Users",
            value: usersCount,
            ...getTrend(usersCount, prevUsers.current),
            icon: <FaUsers />,
            gradient: "from-blue-500 to-indigo-600",
            link: "/superadmin/users",
        },
        {
            title: "Partners",
            value: partnersCount,
            ...getTrend(partnersCount, prevPartners.current),
            icon: <FaUserTie />,
            gradient: "from-purple-500 to-fuchsia-600",
            link: "/superadmin/partners",
        },
        {
            title: "Active Partners",
            value: activePartnersCount,
            ...getTrend(activePartnersCount, prevPartners.current),
            icon: <FaTools />,
            gradient: "from-emerald-500 to-green-600",
        },
        {
            title: "Total Bookings",
            value: bookingsCount,
            ...getTrend(bookingsCount, prevBookings.current),
            icon: <FaClipboardList />,
            gradient: "from-amber-500 to-yellow-600",
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
                        key={index} onClick={() => item?.link && navigate(item?.link)}
                        className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all ${item?.link ? "cursor-pointer" : ""}`}
                    >
                        <div
                            className={`bg-gradient-to-br ${item.gradient} p-6 text-white`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm opacity-90">{item.title}</p>
                                    {loading ? (
                                        <h2 className="text-4xl font-bold mt-2">
                                            ...
                                        </h2>
                                    ) : (
                                        <h2 className="text-4xl font-bold mt-2">
                                            {item.value}
                                        </h2>
                                    )}
                                </div>

                                <div className="text-2xl bg-white/20 p-4 rounded-2xl">
                                    {item.icon}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6 text-sm">
                                {item.trend === "up" && (
                                    <FaArrowUp className="text-green-200" />
                                )}
                                {item.trend === "down" && (
                                    <FaArrowDown className="text-red-200" />
                                )}
                                <span className="opacity-90">
                                    {item.change} from last update
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
                        <button onClick={() => navigate('bookings')} className="text-sm font-semibold text-indigo-600 hover:underline">
                            View all
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400">
                                    <th className="pb-4">Booking ID</th>
                                    <th className="pb-4">User</th>
                                    <th className="pb-4">Partner</th>
                                    <th className="pb-4">Service</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(bookings && Array.isArray(bookings) && bookings.length > 0) ? (
                                    bookings.slice(0, 5).map((item) => (
                                        <tr
                                            key={item?._id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="py-4 font-medium text-gray-900">
                                                {item?._id?.slice(-6).toUpperCase() || 'N/A'}
                                            </td>
                                            <td>{item?.user?.name || 'N/A'}</td>
                                            <td>{item?.partner?.name || 'N/A'}</td>
                                            <td>{item?.serviceName || 'N/A'}</td>
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
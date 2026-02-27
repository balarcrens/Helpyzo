/* eslint-disable react-hooks/refs */
import {
    FaUsers,
    FaTools,
    FaClipboardList,
    FaUserTie,
    FaArrowUp,
    FaArrowDown,
    FaChartLine,
    FaShieldAlt,
} from "react-icons/fa";
import { useEffect, useRef, useMemo } from "react";
import { useBookings, usePartners, useUsers } from "../../../hooks/useData";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { bookings } = useBookings();
    const { users } = useUsers();
    const { partners, loading } = usePartners();
    const navigate = useNavigate();

    /* trend helpers */
    const getTrend = (current = 0, previous = 0) => {
        if (!previous) return { change: "0%", trend: "neutral" };
        const diff = current - previous;
        const percent = ((diff / previous) * 100).toFixed(1);
        return {
            change: `${diff >= 0 ? "+" : ""}${percent}%`,
            trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
        };
    };

    /* counts */
    const usersCount = users.length;
    const partnersCount = partners.length;
    const verifiedPartnersCount = partners.filter((p) => p?.verification?.status === 'approved').length;
    const bookingsCount = bookings?.length || 0;
    const pendingBookings = bookings?.filter((b) => b?.status === "pending").length || 0;
    const completedBookings = bookings?.filter((b) => b?.status === "completed").length || 0;

    /* prev value */
    const prevUsers = useRef(1);
    const prevPartners = useRef(1);
    const prevBookings = useRef(1);

    const stats = useMemo(() => [
        {
            title: "Total Users",
            value: usersCount,
            ...getTrend(usersCount, prevUsers.current),
            icon: <FaUsers />,
            gradient: "from-blue-400 via-blue-500 to-indigo-500",
            bgGlow: "from-blue-400/20 to-indigo-400/10",
            link: "users",
            sub: "Registered accounts",
        },
        {
            title: "Total Partners",
            value: partnersCount,
            ...getTrend(partnersCount, prevPartners.current),
            icon: <FaUserTie />,
            gradient: "from-violet-400 via-purple-500 to-fuchsia-500",
            bgGlow: "from-purple-400/20 to-fuchsia-400/10",
            link: "partners",
            sub: "Service providers",
        },
        {
            title: "Verified Partner",
            value: verifiedPartnersCount,
            ...getTrend(verifiedPartnersCount, prevPartners.current),
            icon: <FaTools />,
            gradient: "from-emerald-400 via-green-500 to-teal-500",
            bgGlow: "from-emerald-400/20 to-teal-400/10",
            sub: "Currently active",
        },
        {
            title: "Total Bookings",
            value: bookingsCount,
            ...getTrend(bookingsCount, prevBookings.current),
            icon: <FaClipboardList />,
            gradient: "from-amber-400 via-orange-500 to-rose-500",
            bgGlow: "from-amber-400/20 to-orange-400/10",
            link: "bookings",
            sub: "All time bookings",
        },
    ], [usersCount, partnersCount, verifiedPartnersCount, bookingsCount]);

    useEffect(() => {
        prevUsers.current = usersCount;
        prevPartners.current = verifiedPartnersCount;
        prevBookings.current = bookingsCount;
    }, [usersCount, verifiedPartnersCount, bookingsCount]);

    const statusConfig = {
        completed: {
            bg: "bg-emerald-100",
            text: "text-emerald-700",
            dot: "bg-emerald-500",
        },
        pending: {
            bg: "bg-amber-100",
            text: "text-amber-700",
            dot: "bg-amber-500",
        },
        cancelled: {
            bg: "bg-red-100",
            text: "text-red-700",
            dot: "bg-red-500",
        },
        confirmed: {
            bg: "bg-blue-100",
            text: "text-blue-700",
            dot: "bg-blue-500",
        },
        "in-progress": {
            bg: "bg-indigo-100",
            text: "text-indigo-700",
            dot: "bg-indigo-500",
        },
    };

    const getInitials = (name = "") =>
        name.split(" ").map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "?";

    const avatarColors = [
        "from-blue-400 to-indigo-500",
        "from-violet-400 to-purple-500",
        "from-emerald-400 to-teal-500",
        "from-amber-400 to-orange-500",
        "from-pink-400 to-rose-500",
    ];

    const quickActions = [
        {
            label: "Manage Users",
            icon: <FaUsers size={16} />,
            color: "blue-600",
            path: "users",
        },
        {
            label: "View Partners",
            icon: <FaUserTie size={16} />,
            color: "purple-600",
            path: "partners",
        },
        {
            label: "All Bookings",
            icon: <FaClipboardList size={16} />,
            color: "orange-600",
            path: "bookings",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl p-4 sm:p-6">
                <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-32 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                    }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                                <FaShieldAlt size={16} />
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest">
                                SuperAdmin
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Control Dashboard
                        </h1>
                        <p className="text-sm mt-1">
                            Complete system overview &amp; real-time controls
                        </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(action.path)}
                                className={`flex cursor-pointer items-center gap-2 backdrop-blur-sm text-xs font-bold px-4 py-2.5 rounded-xl text-${action.color} border-b transition-all hover:scale-105 active:scale-95`}
                            >
                                {action.icon}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => item?.link && navigate(item?.link)}
                        className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ${item?.link ? "cursor-pointer hover:-translate-y-1" : ""}`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGlow} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                        <div className={`relative bg-gradient-to-br ${item.gradient} p-6 text-white`}>
                            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />

                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                                        {item.title}
                                    </p>
                                    {loading ? (
                                        <div className="h-10 w-20 bg-white/20 rounded-xl animate-pulse mt-2" />
                                    ) : (
                                        <h2 className="text-4xl font-extrabold mt-1 tracking-tight">
                                            {item.value}
                                        </h2>
                                    )}
                                    <p className="text-[11px] text-white/60 mt-1">{item.sub}</p>
                                </div>

                                <div className="relative z-10 text-2xl bg-white/20 p-3.5 rounded-2xl group-hover:bg-white/30 transition">
                                    {item.icon}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-5 text-xs bg-white/10 rounded-xl px-3 py-2 w-fit">
                                {item.trend === "up" && (
                                    <FaArrowUp className="text-green-200" size={10} />
                                )}
                                {item.trend === "down" && (
                                    <FaArrowDown className="text-red-200" size={10} />
                                )}
                                <span className="font-semibold text-white/90">
                                    {item.change} from last update
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                <FaClipboardList size={16} />
                            </span>
                            <div>
                                <h2 className="text-base font-extrabold text-gray-900">
                                    Recent Bookings
                                </h2>
                                <p className="text-[11px] text-gray-400">
                                    Latest {Math.min(bookings?.length || 0, 5)} of {bookingsCount} bookings
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("bookings")}
                            className="text-xs font-bold cursor-pointer text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition"
                        >
                            View all →
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto no-scrollbar">
                        {loading ? (
                            <div className="p-6 space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : bookings && Array.isArray(bookings) && bookings.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="py-3 px-6 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            Booking
                                        </th>
                                        <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            User
                                        </th>
                                        <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:table-cell">
                                            Partner
                                        </th>
                                        <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden md:table-cell">
                                            Service
                                        </th>
                                        <th className="py-3 px-6 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.slice(0, 5).map((item, idx) => {
                                        const sc = statusConfig[item?.status] || {
                                            bg: "bg-gray-100",
                                            text: "text-gray-600",
                                            dot: "bg-gray-400",
                                        };
                                        return (
                                            <tr
                                                key={item?._id}
                                                className="border-t border-gray-50 hover:bg-indigo-50/30 transition-colors"
                                            >
                                                <td className="py-3.5 px-6">
                                                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                                                        #{item?._id?.slice(-6).toUpperCase() || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0`}>
                                                            {getInitials(item?.user?.name)}
                                                        </div>
                                                        <span className="font-semibold text-gray-800 text-xs whitespace-nowrap">
                                                            {item?.user?.name || "N/A"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 hidden sm:table-cell">
                                                    <span className="text-xs text-gray-600 font-medium">
                                                        {item?.partner?.name || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 hidden md:table-cell">
                                                    <span className="text-xs text-gray-500 max-w-[120px] truncate block">
                                                        {item?.serviceName || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize ${sc.bg} ${sc.text}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                                        {item?.status || "unknown"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center">
                                <FaClipboardList className="text-gray-200 text-5xl mx-auto mb-3" />
                                <p className="text-sm text-gray-400 font-medium">No bookings available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right Column ── */}
                <div className="space-y-5">

                    {/* System Health */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <FaChartLine size={16} />
                            </span>
                            <div>
                                <h2 className="text-base font-extrabold text-gray-900">System Health</h2>
                                <p className="text-[11px] text-gray-400">Live status overview</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-sm">
                            {/* API Status */}
                            <li className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-gray-500 text-xs font-medium">API Status</span>
                                </div>
                                <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                    Operational
                                </span>
                            </li>

                            {/* Active Users */}
                            <li className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="text-gray-500 text-xs font-medium">Active Users</span>
                                </div>
                                <span className="font-bold text-gray-900 text-sm">
                                    {loading ? "..." : users?.length || 0}
                                </span>
                            </li>

                            {/* Pending Bookings */}
                            <li className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                                    <span className="text-gray-500 text-xs font-medium">Pending Bookings</span>
                                </div>
                                <span className="font-bold text-amber-600 text-sm">
                                    {loading ? "..." : pendingBookings}
                                </span>
                            </li>

                            {/* Completed */}
                            <li className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-gray-500 text-xs font-medium">Completed</span>
                                </div>
                                <span className="font-bold text-emerald-600 text-sm">
                                    {loading ? "..." : completedBookings}
                                </span>
                            </li>

                            {/* System Alerts */}
                            <li className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                                <div className="flex items-center gap-2.5">
                                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                                    <span className="text-gray-500 text-xs font-medium">System Alerts</span>
                                </div>
                                <span className="font-bold text-gray-400 text-xs bg-gray-100 px-2.5 py-1 rounded-lg">
                                    None
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Booking Breakdown */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                                <FaClipboardList size={16} />
                            </span>
                            <div>
                                <h2 className="text-base font-extrabold text-gray-900">Booking Overview</h2>
                                <p className="text-[11px] text-gray-400">By status breakdown</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                {
                                    label: "Completed",
                                    count: completedBookings,
                                    color: "bg-emerald-500",
                                    bg: "bg-emerald-50",
                                    text: "text-emerald-700",
                                },
                                {
                                    label: "Pending",
                                    count: pendingBookings,
                                    color: "bg-amber-500",
                                    bg: "bg-amber-50",
                                    text: "text-amber-700",
                                },
                                {
                                    label: "Cancelled",
                                    count: bookings?.filter((b) => b?.status === "cancelled").length || 0,
                                    color: "bg-red-400",
                                    bg: "bg-red-50",
                                    text: "text-red-600",
                                },
                                {
                                    label: "In Progress",
                                    count: bookings?.filter((b) => b?.status === "in-progress").length || 0,
                                    color: "bg-indigo-500",
                                    bg: "bg-indigo-50",
                                    text: "text-indigo-700",
                                },
                            ].map((item, i) => {
                                const pct = bookingsCount > 0 ? Math.round((item.count / bookingsCount) * 100) : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1.5 text-xs">
                                            <span className="font-semibold text-gray-600">{item.label}</span>
                                            <span className={`font-bold ${item.text} ${item.bg} px-2 py-0.5 rounded-lg`}>
                                                {loading ? "—" : item.count}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.color} rounded-full transition-all duration-700`}
                                                style={{ width: loading ? "0%" : `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400 font-medium">Total Bookings</span>
                            <span className="text-lg font-extrabold text-gray-900">
                                {loading ? "..." : bookingsCount}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
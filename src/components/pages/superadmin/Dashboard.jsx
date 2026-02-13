import {
    FaUsers,
    FaTools,
    FaClipboardList,
    FaUserTie,
    FaArrowUp,
    FaArrowDown,
} from "react-icons/fa";

export default function Dashboard() {
    const stats = [
        {
            title: "Total Users",
            value: "1,240",
            change: "+12%",
            trend: "up",
            icon: <FaUsers />,
            gradient: "from-blue-500 to-indigo-600",
        },
        {
            title: "Active Services",
            value: "58",
            change: "+5%",
            trend: "up",
            icon: <FaTools />,
            gradient: "from-emerald-500 to-green-600",
        },
        {
            title: "Total Bookings",
            value: "312",
            change: "-3%",
            trend: "down",
            icon: <FaClipboardList />,
            gradient: "from-amber-500 to-yellow-600",
        },
        {
            title: "Partners",
            value: "26",
            change: "+2%",
            trend: "up",
            icon: <FaUserTie />,
            gradient: "from-purple-500 to-fuchsia-600",
        },
    ];

    const recentBookings = [
        { id: "#BK1023", user: "Rahul Sharma", service: "AC Repair", status: "Completed" },
        { id: "#BK1024", user: "Amit Patel", service: "Plumbing", status: "Pending" },
        { id: "#BK1025", user: "Neha Singh", service: "Cleaning", status: "Cancelled" },
    ];

    const statusColor = {
        Completed: "bg-green-100 text-green-700",
        Pending: "bg-yellow-100 text-yellow-700",
        Cancelled: "bg-red-100 text-red-700",
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
                                {recentBookings.map((item, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="py-4 font-medium text-gray-900">
                                            {item.id}
                                        </td>
                                        <td>{item.user}</td>
                                        <td>{item.service}</td>
                                        <td>
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColor[item.status]}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
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
                            <span className="text-gray-500">Server Load</span>
                            <span className="text-yellow-600 font-semibold">
                                Moderate
                            </span>
                        </li>

                        <li className="flex justify-between">
                            <span className="text-gray-500">Pending Approvals</span>
                            <span className="font-semibold text-gray-900">4</span>
                        </li>

                        <li className="flex justify-between">
                            <span className="text-gray-500">System Alerts</span>
                            <span className="text-red-600 font-semibold">1</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
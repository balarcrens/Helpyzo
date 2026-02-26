import {
    FiUsers, FiUserCheck, FiUserX, FiSearch, FiTrash2,
    FiMail, FiPhone, FiMapPin, FiCalendar, FiShield,
    FiRefreshCw
} from "react-icons/fi";
import { useUsers } from "../../../hooks/useData";
import { useState } from "react";

export default function Users() {
    const { users, loading, deletingId, userDelete, userRoleChange, fetchUsers } = useUsers();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const currentUser = JSON.parse(localStorage.getItem("userInfo"))._id;

    const filtered = users.filter(u => {
        const matchSearch =
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.role?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.phone?.includes(search);
        const matchStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && u.isActive) ||
            (statusFilter === "inactive" && !u.isActive);
        return matchSearch && matchStatus;
    });

    const stats = [
        {
            label: "Total Users",
            value: users.length,
            icon: <FiUsers size={22} />,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            label: "Active",
            value: users.filter(u => u.isActive).length,
            icon: <FiUserCheck size={22} />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Inactive",
            value: users.filter(u => !u.isActive).length,
            icon: <FiUserX size={22} />,
            color: "text-red-500",
            bg: "bg-red-50",
        },
        {
            label: "Superadmins",
            value: users.filter(u => u.role === "superadmin").length,
            icon: <FiShield size={22} />,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    const getInitials = (name = "") =>
        name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    const avatarColors = [
        "from-indigo-400 to-indigo-600",
        "from-emerald-400 to-emerald-600",
        "from-pink-400 to-pink-600",
        "from-amber-400 to-amber-600",
        "from-cyan-400 to-cyan-600",
        "from-purple-400 to-purple-600",
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Registered Users</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all client accounts on the platform</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
                        <FiCalendar size={12} />
                        <span>
                            Last updated:{" "}
                            {new Date().toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-2xl px-3 py-2 shadow-sm transition disabled:opacity-60"
                    >
                        <FiRefreshCw size={12} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`${s.bg} ${s.color} h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search name, email or phone…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-400"
                        />
                    </div>

                    {/* Status Filter Pills */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {["all", "active", "inactive"].map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${statusFilter === f
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto w-full">
                    {loading ? (
                        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                            <div className="h-6 w-6 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
                            <span className="text-sm">Loading users…</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 text-sm">
                            <FiUsers size={36} className="mx-auto mb-3 opacity-30" />
                            No users found
                        </div>
                    ) : (
                        <table className="w-full max-w-full md:min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Contact</th>
                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Location</th>
                                    <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Joined</th>
                                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center     ">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((user, idx) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-indigo-50/40 transition-colors group"
                                    >
                                        {/* User + Name */}
                                        <td className="px-1 md:px-2 xl:px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center sm:justify-start items-center gap-1 sm:gap-3">
                                                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${user.profileImage ? '' : avatarColors[idx % avatarColors.length]} hidden sm:flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm overflow-hidden`}>
                                                    {user.profileImage
                                                        ? <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                                                        : getInitials(user.name)
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 leading-tight">{user.name || "—"}</p>
                                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                        <FiShield size={10} />
                                                        <span className="capitalize">{user.role}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-1 md:px-2 xl:px-6 py-4">
                                            <p className="flex items-center gap-1 text-gray-700 text-xs">
                                                <FiMail size={12} className="text-gray-400 flex-shrink-0" />

                                                <span
                                                    className="truncate max-w-[70px] sm:max-w-[220px] md:max-w-[280px]"
                                                    title={user.email}
                                                >
                                                    {user.email || "—"}
                                                </span>
                                            </p>
                                            <p className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                                <FiPhone size={12} className="text-gray-400 flex-shrink-0" />
                                                {user.phone || "—"}
                                            </p>
                                        </td>

                                        {/* Location */}
                                        <td className="px-1 md:px-2 xl:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <p className="flex items-center gap-1.5 text-gray-600 text-xs">
                                                <FiMapPin size={12} className="text-gray-400 flex-shrink-0" />
                                                {[user.address?.city, user.address?.state, user.address?.country]
                                                    .filter(Boolean).join(", ") || "—"}
                                            </p>
                                        </td>

                                        {/* Joined Date */}
                                        <td className="px-1 md:px-2 xl:px-6 py-4 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                                : "—"}
                                        </td>

                                        {/* Action */}
                                        <td className="px-1 md:px-2 xl:px-6 py-4 text-center whitespace-nowrap">
                                            <div className="inline-flex flex-wrap justify-center items-center gap-1">
                                                <select value={user.role} onChange={(e) => userRoleChange(user._id, e.target.value)}
                                                    className="ml-2 px-2 py-1 cursor-pointer border border-gray-300 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentUser === user._id}
                                                >
                                                    <option value="client">Client</option>
                                                    <option value="superadmin">Super Admin</option>
                                                </select>

                                                <button
                                                    onClick={() => userDelete(user._id)}
                                                    disabled={currentUser === user._id || deletingId === user._id || user.role === "superadmin"}
                                                    title="Delete user"
                                                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-red-600 bg-red-50 disabled:cursor-not-allowed hover:bg-red-100 disabled:opacity-50 transition-all"
                                                >
                                                    {deletingId === user._id
                                                        ? <div className="h-3.5 w-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                                                        : <FiTrash2 size={13} />
                                                    }
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer row count */}
                {!loading && filtered.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                        <span>Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{users.length}</span> users</span>
                        {search && (
                            <button onClick={() => setSearch("")} className="cursor-pointer text-indigo-500 hover:text-indigo-700 font-semibold transition">
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
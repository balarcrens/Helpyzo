import {
    FaUserTie, FaCheckCircle, FaTools, FaStar, FaStarHalfAlt, FaRegStar,
} from "react-icons/fa";
import {
    FiSearch, FiTrash2, FiEye, FiCalendar, FiMail, FiPhone,
    FiBriefcase, FiShield, FiAward, FiRefreshCw, FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { usePartners } from "../../../hooks/useData";
import { partnerAPI } from "../../../services/api";
import ToastContext from "../../../context/Toast/ToastContext";

const avatarColors = [
    "from-indigo-400 to-indigo-600",
    "from-purple-400 to-purple-600",
    "from-emerald-400 to-emerald-600",
    "from-pink-400 to-pink-600",
    "from-amber-400 to-amber-600",
    "from-cyan-400 to-cyan-600",
];

const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

function StarRating({ rating = 0 }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push(<FaStar key={i} className="text-amber-400" size={11} />);
        else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-amber-400" size={11} />);
        else stars.push(<FaRegStar key={i} className="text-gray-300" size={11} />);
    }
    return <span className="flex items-center gap-0.5">{stars}</span>;
}

const FILTERS = ["all", "verified", "pending"];

export default function Partners() {
    const { showToast, showConfirm } = useContext(ToastContext)
    const navigate = useNavigate();
    const { partners, loading } = usePartners();
    const [partnerList, setPartnerList] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        if (Array.isArray(partners)) setPartnerList(partners);
    }, [partners]);

    const stats = [
        {
            label: "Total Partners",
            value: partnerList.length,
            icon: <FaUserTie size={20} />,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            label: "Verified",
            value: partnerList.filter((p) => p?.verification?.status === "approved").length,
            icon: <FiShield size={20} />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Pending",
            value: partnerList.filter((p) => p?.verification?.status !== "approved").length,
            icon: <FiAward size={20} />,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Total Services",
            value: partnerList.reduce(
                (sum, p) => sum + (Array.isArray(p?.services) ? p.services.length : 0),
                0
            ),
            icon: <FaTools size={20} />,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    const handleDelete = async (partnerId) => {
        const confirmed = await showConfirm({
            message: "Are you sure you want to delete this partner?",
            subMessage: "This action cannot be undone.",
            type: "danger",
            confirmLabel: "Delete",
        });
        if (!confirmed) return;
        try {
            setDeletingId(partnerId);
            await partnerAPI.deletePartner(partnerId);
            showToast("Partner deleted successfully", "success");
            setPartnerList((prev) => prev.filter((p) => p._id !== partnerId));
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to delete partner", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = partnerList.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
            p?.name?.toLowerCase().includes(q) ||
            p?.email?.toLowerCase().includes(q) ||
            p?.phone?.includes(q) ||
            p?.business?.name?.toLowerCase().includes(q);
        const isVerified = p?.verification?.status === "approved";
        const matchStatus =
            statusFilter === "all" ||
            (statusFilter === "verified" && isVerified) ||
            (statusFilter === "pending" && !isVerified);
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Service Partners
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage vendors, approvals &amp; service partners
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
                        <FiCalendar size={13} />
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
                        onClick={() => window.location.reload()}
                        className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-2xl px-3 py-2 shadow-sm transition"
                    >
                        <FiRefreshCw size={12} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div
                            className={`${s.bg} ${s.color} h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0`}
                        >
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900">
                                {loading ? "…" : s.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <FiSearch
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={15}
                    />
                    <input
                        type="text"
                        placeholder="Search name, email, business…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-400"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${statusFilter === f
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                        >
                            {f === "all" ? `All (${partnerList.length})` : f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Partner */}
            {loading ? (
                <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                    <div className="h-7 w-7 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
                    <span className="text-sm font-medium">Loading partners…</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <FaUserTie size={42} className="opacity-20" />
                    <p className="text-sm">
                        No partners found{search ? ` for "${search}"` : ""}
                    </p>
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="cursor-pointer text-xs font-semibold text-indigo-500 underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map((partner, idx) => {
                            const isVerified = partner?.verification?.status === "approved";
                            const serviceCount = Array.isArray(partner?.services)
                                ? partner.services.length
                                : 0;
                            const rating = partner?.rating || 0;
                            const colorClass = avatarColors[idx % avatarColors.length];

                            return (
                                <div
                                    key={partner._id}
                                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    <div
                                        className={`h-1.5 w-full bg-gradient-to-r ${colorClass}`}
                                    />

                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${partner?.profileImage ? '' : colorClass} flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0 ${partner?.profileImage ? '' : 'shadow-md'} overflow-hidden`}
                                            >
                                                {partner?.profileImage ? (
                                                    <img
                                                        src={partner.profileImage}
                                                        alt={partner.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    getInitials(partner?.name || "?")
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                                                        {partner?.name || "Unknown"}
                                                    </h3>
                                                    <span
                                                        className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${isVerified
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-amber-100 text-amber-700"
                                                            }`}
                                                    >
                                                        {isVerified ? "✓ Verified" : "⏳ Pending"}
                                                    </span>
                                                </div>

                                                {/* Star rating */}
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <StarRating rating={rating} />
                                                    {rating > 0 && (
                                                        <span className="text-[11px] text-gray-400 font-medium">
                                                            {rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Business name */}
                                                {partner?.business?.name && (
                                                    <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                                                        <FiBriefcase size={11} className="text-gray-400" />
                                                        <span className="truncate">{partner.business.name}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="my-4 border-t border-gray-100" />

                                        {/* Contact details */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FiMail size={13} className="text-gray-400 flex-shrink-0" />
                                                <span className="truncate" title={partner?.email}>
                                                    {partner?.email || "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FiPhone size={13} className="text-gray-400 flex-shrink-0" />
                                                <span>{partner?.phone || "N/A"}</span>
                                            </div>
                                        </div>

                                        {/* Services + Stats row */}
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="flex-1 bg-indigo-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                                                <FaTools size={13} className="text-indigo-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wide">Services</p>
                                                    <p className="text-sm font-extrabold text-indigo-700">{serviceCount}</p>
                                                </div>
                                            </div>
                                            {partner?.totalBookings !== undefined && (
                                                <div className="flex-1 bg-purple-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                                                    <FaCheckCircle size={13} className="text-purple-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wide">Bookings</p>
                                                        <p className="text-sm font-extrabold text-purple-700">{partner.totalBookings}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="mt-5 flex gap-3">
                                            <button
                                                onClick={() =>
                                                    navigate(`/superadmin/partners/${partner?._id}`)
                                                }
                                                className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
                                            >
                                                <FiEye size={14} />
                                                View Profile
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    partner?._id && handleDelete(partner._id);
                                                }}
                                                disabled={deletingId === partner._id}
                                                className="flex items-center cursor-pointer justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {deletingId === partner._id ? (
                                                    <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <FiTrash2 size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer count */}
                    <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                        <span>
                            Showing{" "}
                            <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
                            <span className="font-semibold text-gray-600">{partnerList.length}</span>{" "}
                            partners
                        </span>
                        {(search || statusFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                }}
                                className="cursor-pointer text-indigo-500 hover:text-indigo-700 font-semibold transition"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

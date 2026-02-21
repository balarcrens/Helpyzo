/* eslint-disable react-hooks/set-state-in-effect */
import {
    FaUserTie,
    FaCheckCircle,
    FaClock,
    FaBan,
    FaEye,
    FaUserSlash,
    FaTools,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePartners } from "../../../hooks/useData";
import { partnerAPI } from "../../../services/api";

export default function Partners() {
    const navigate = useNavigate();
    const { partners, loading } = usePartners();
    const [partnerList, setPartnerList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (Array.isArray(partners)) {
            setPartnerList(partners);
        }
    }, [partners]);

    const stats = [
        { label: "Total Partners", value: (partnerList && Array.isArray(partnerList)) ? partnerList.length : 0, icon: <FaUserTie />, color: "text-indigo-600" },
        { label: "Active", value: (partnerList && Array.isArray(partnerList)) ? partnerList.filter(p => p && p.isActive).length : 0, icon: <FaCheckCircle />, color: "text-green-600" },
        { label: "Inactive", value: (partnerList && Array.isArray(partnerList)) ? partnerList.filter(p => p && !p.isActive).length : 0, icon: <FaClock />, color: "text-yellow-600" },
        { label: "Total Services", value: (partnerList && Array.isArray(partnerList)) ? partnerList.reduce((sum, p) => sum + (p && p.services && Array.isArray(p.services) ? p.services.length : 0), 0) : 0, icon: <FaTools />, color: "text-red-600" },
    ];

    const handleDelete = async (partnerId) => {
        if (!window.confirm("Are you sure you want to delete this partner?")) return;

        try {
            await partnerAPI.deletePartner(partnerId);

            setPartnerList(prev =>
                prev.filter(p => p._id !== partnerId)
            );
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete partner");
        }
    };

    const statusStyle = {
        true: "bg-green-100 text-green-700",
        false: "bg-red-100 text-red-700",
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Service Partners
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Manage vendors, approvals & service partners
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-4 hover:shadow-lg transition"
                    >
                        <div className={`text-3xl ${item.color}`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {item.value}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Partner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-8">Loading partners...</div>
                ) : error ? (
                    <div className="col-span-full text-center py-8 text-red-600">{error}</div>
                ) : !partnerList || partnerList.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">No partners found</div>
                ) : (
                    partnerList.map((partner) => (
                        <div
                            key={partner._id}
                            className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
                                    {partner?.name?.charAt(0) || '?'}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {partner?.name || 'Unknown'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {(partner && partner.services && Array.isArray(partner.services)) ? partner.services.length : 0} services
                                    </p>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[partner?.verification?.status === 'approved'] || ''}`}
                                >
                                    {partner?.verification?.status === 'approved' ? "Verified" : "Pending"}
                                </span>
                            </div>

                            <div className="mt-5 space-y-2 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium text-gray-900">Email:</span>{" "}
                                    {partner?.email || 'N/A'}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">Phone:</span>{" "}
                                    {partner?.phone || 'N/A'}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">Business:</span>{" "}
                                    {partner?.business?.name || "N/A"}
                                </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => navigate(`/superadmin/partners/${partner?._id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                                >
                                    <FaEye /> View
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        partner?._id && handleDelete(partner._id);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-xl text-sm font-semibold hover:bg-red-200 transition"
                                >
                                    <FaUserSlash /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

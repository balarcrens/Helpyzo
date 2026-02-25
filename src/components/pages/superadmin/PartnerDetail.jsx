/* eslint-disable react-hooks/exhaustive-deps */
import {
    FaPhoneAlt, FaCheckCircle, FaClock, FaBan, FaStar,
    FaTools, FaMapMarkerAlt, FaShieldAlt, FaClipboardList,
    FaCertificate,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { partnerAPI, userAPI } from "../../../services/api";
import { ChevronDown } from "lucide-react";
import { useNotifications } from "../../../hooks/useData";
import ToastContext from "../../../context/Toast/ToastContext";

export default function PartnerDetail() {
    const { showToast } = useContext(ToastContext);
    const { id } = useParams();
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const { fetchNotifications } = useNotifications();
    const STATUS_OPTIONS = [
        { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
        { value: "approved", label: "Approved", color: "bg-green-100 text-green-700" },
        { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
    ];

    const fetchPartnerDetails = async () => {
        try {
            setLoading(true);
            const response = await partnerAPI.getPartnerById(id);
            setPartner(response?.data?.partner);
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to load partner details", "error");
            console.error("Error fetching partner:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartnerDetails();
    }, [id]);

    const handleDocumentStatusChange = async (docId, status) => {
        try {
            let rejectionReason = '';

            if (status === 'rejected') {
                rejectionReason = prompt('Enter rejection reason');
                if (!rejectionReason) return;
            }

            await partnerAPI.updateDocumentStatus(
                partner._id,
                docId,
                status,
                rejectionReason
            );

            showToast("Document status updated", "success");

            await fetchPartnerDetails();

            await fetchNotifications();

        } catch (error) {
            console.error(error.message);
            showToast("Failed to update document status", "error");
        }
    };

    const handleApprovalChange = async (serviceId, newStatus) => {
        try {
            let rejectionReason = "";

            if (newStatus === "rejected") {
                rejectionReason = prompt("Reason for rejection?");
                if (!rejectionReason) return;
            }

            await userAPI.updateServiceApprovalStatus(
                partner._id,
                serviceId,
                newStatus,
                rejectionReason
            );

            showToast("Service status updated", "success");

            setPartner(prev => ({
                ...prev,
                services: prev.services.map(service =>
                    service._id === serviceId
                        ? {
                            ...service,
                            approvalStatus: newStatus,
                            rejectionReason
                        }
                        : service
                )
            }));

        } catch (err) {
            console.error(err.message);
            showToast("Failed to update service status", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="h-14 w-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto mb-5" />
                    <p className="text-gray-500 text-sm font-medium">Loading partner details…</p>
                </div>
            </div>
        );
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (isActive, verified) => {
        if (!isActive) return { bg: "bg-red-100", text: "text-red-700", label: "Inactive" };
        if (!verified) return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Unverified" };
        return { bg: "bg-green-100", text: "text-green-700", label: "Active & Verified" };
    };

    const isVerified = partner?.verification?.status === 'approved';
    const statusInfo = getStatusColor(partner?.isActive, isVerified);

    const openDocument = (fileUrl) => {
        if (!fileUrl) return;

        if (fileUrl.startsWith('data:')) {
            const newWindow = window.open('', '_blank');

            if (!newWindow) {
                alert('Popup blocked. Please allow popups.');
                return;
            }

            newWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Document Preview</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #111;
        }
        iframe, img {
            width: 100%;
            height: 100%;
            border: none;
            object-fit: contain;
        }
    </style>
</head>
<body>
    ${fileUrl.includes('pdf')
                    ? `<iframe src="${fileUrl}"></iframe>`
                    : `<img src="${fileUrl}" alt="Document" />`
                }
</body>
</html>
        `);

            newWindow.document.close();
        } else {
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const totalBookings = partner?.services?.reduce((total, service) => total + (service.totalBookings || 0), 0) || 0;
    const totalRatings = partner?.services?.reduce((total, service) => total + (service.totalRatings || 0), 0) || 0;

    const InfoRow = ({ label, value, accent }) => (
        <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className={`text-sm font-semibold ${accent || "text-gray-800"}`}>{value || "N/A"}</p>
        </div>
    );

    const MiniTile = ({ label, value, accent }) => (
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-sm font-extrabold ${accent || "text-gray-800"}`}>{value}</p>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Partner Details</h1>
                    <p className="text-xs text-gray-400 mt-1 font-mono">ID: {partner?._id}</p>
                </div>
                <span className={`self-start sm:self-auto px-4 py-2 rounded-2xl text-sm font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                    {statusInfo.label}
                </span>
            </div>

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative opacity-20">
                    <div className="absolute inset-0 opacity-40"
                        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
                    />
                </div>

                <div className="px-6 sm:px-8 pb-8">
                    <div className="-mt-12 mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div className={`h-24 w-24 z-10 rounded-2xl ${partner?.profileImage ? '' : 'shadow-xl border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-600'} flex items-center justify-center text-white text-4xl font-extrabold overflow-hidden flex-shrink-0`}>
                            {partner?.profileImage
                                ? <img src={partner.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                : (partner?.name || "?").charAt(0).toUpperCase()
                            }
                        </div>

                        {/* Quick stats on right */}
                        <div className="flex gap-3 flex-wrap z-10">
                            {[
                                { label: "Rating", value: <span className="flex items-center gap-1"><FaStar className="text-amber-400" />{partner?.rating || 0}</span>, sub: `${totalRatings} ratings` },
                                { label: "Bookings", value: totalBookings, sub: "Total" },
                                { label: "Services", value: partner?.services?.length || 0, sub: "Listed" },
                            ].map((s, i) => (
                                <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 min-w-[90px] text-center">
                                    <p className="text-xs text-gray-400 font-medium mb-0.5">{s.label}</p>
                                    <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
                                    <p className="text-[10px] text-gray-400">{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Name + business */}
                    <h2 className="text-2xl font-extrabold text-gray-900">{partner?.name || "Partner"}</h2>
                    {partner?.business?.name && (
                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                            <FaTools className="text-indigo-400" size={12} />
                            {partner.business.name}
                        </p>
                    )}

                    {/* Verification badge */}
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${isVerified ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                            {isVerified ? <FaCheckCircle size={11} /> : <FaClock size={11} />}
                            {isVerified ? "Verified Partner" : "Pending Verification"}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${partner?.isActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            {partner?.isActive ? <FaCheckCircle size={11} /> : <FaBan size={11} />}
                            {partner?.isActive ? "Account Active" : "Account Inactive"}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Contact Information ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-base font-extrabold text-gray-900 mb-5 flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FaPhoneAlt size={14} />
                    </span>
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Email Address", value: partner?.email },
                        { label: "Phone Number", value: partner?.phone },
                        { label: "Business Name", value: partner?.business?.name },
                        { label: "Business Contact", value: partner?.business?.phone },
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-800 break-all">{item.value || "N/A"}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Address ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-base font-extrabold text-gray-900 mb-5 flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                        <FaMapMarkerAlt size={14} />
                    </span>
                    Address &amp; Location
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[
                        { label: "Street", value: partner?.address?.street },
                        { label: "City", value: partner?.address?.city },
                        { label: "State", value: partner?.address?.state },
                        { label: "Pincode", value: partner?.address?.pincode },
                        { label: "Country", value: partner?.address?.country },
                    ].map((item, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-800">{item.value || "N/A"}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Account Information ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-base font-extrabold text-gray-900 mb-5 flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <FaShieldAlt size={14} />
                    </span>
                    Account Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Account Status */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Account Status</p>
                        <p className={`text-sm font-bold flex items-center gap-1.5 ${partner?.isActive ? "text-green-600" : "text-red-600"}`}>
                            {partner?.isActive ? <><FaCheckCircle />Active</> : <><FaBan />Inactive</>}
                        </p>
                    </div>
                    {/* Verification */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Verification</p>
                        <p className={`text-sm font-bold flex items-center gap-1.5 ${partner?.verification?.status === 'approved' ? "text-emerald-600" : "text-amber-600"}`}>
                            {partner?.verification?.status === 'approved'
                                ? <><FaCertificate />Verified</>
                                : <><FaClock />Pending</>}
                        </p>
                    </div>
                    {/* Role */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Role</p>
                        <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">{partner?.role || "N/A"}</p>
                    </div>
                    {/* Joined */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Joined Date</p>
                        <p className="text-sm font-semibold text-gray-800">{formatDate(partner?.createdAt)}</p>
                    </div>
                    {/* Last Login */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Last Login</p>
                        <p className="text-sm font-semibold text-gray-800">{partner?.lastLogin ? formatDate(partner.lastLogin) : "Never"}</p>
                    </div>
                    {/* Payment Methods */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Payment Methods</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {partner?.paymentMethods?.length > 0 ? `${partner.paymentMethods.length} Method(s)` : "None Added"}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Services ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-base font-extrabold text-gray-900 mb-5 flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <FaTools size={14} />
                    </span>
                    Services Provided
                    <span className="ml-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                        {partner?.services?.length || 0}
                    </span>
                </h3>

                {partner?.services && partner.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {partner.services.map((service) => (
                            <div
                                key={service?._id}
                                className="rounded-2xl border border-gray-100 bg-gray-50/60 hover:shadow-md transition-shadow overflow-hidden"
                            >
                                {/* Service card header */}
                                <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
                                    <div className="min-w-0">
                                        <h4 className="font-extrabold text-gray-900 text-sm leading-tight">
                                            {service?.name || 'Unnamed Service'}
                                        </h4>
                                        <p className="text-xs text-indigo-500 font-semibold mt-0.5">
                                            {service?.category?.name || 'Uncategorized'}
                                        </p>
                                    </div>
                                    <select
                                        value={service.approvalStatus}
                                        onChange={(e) => handleApprovalChange(service._id, e.target.value)}
                                        className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 transition
                                            ${service.approvalStatus === "approved"
                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                : service.approvalStatus === "pending"
                                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                                    : "bg-red-100 text-red-700 border-red-200"
                                            }`}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="px-5 py-4 space-y-4">
                                    {/* Rejection reason */}
                                    {service.approvalStatus === "rejected" && service.rejectionReason && (
                                        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                                            ❌ <span className="font-bold">Rejected:</span> {service.rejectionReason}
                                        </div>
                                    )}

                                    {/* Description */}
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                        {service?.description || "No description"}
                                    </p>

                                    {/* Pricing grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <MiniTile label="Base Price" value={`₹${service?.basePrice || 0}`} />
                                        <MiniTile label="Final Price" value={`₹${service?.finalPrice || 0}`} accent="text-emerald-600" />
                                        <MiniTile label="Visiting Fee" value={`₹${service?.visitingFees || 0}`} />
                                        <MiniTile label="Discount" value={`${service?.discount || 0}%`} accent="text-indigo-600" />
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <MiniTile label="Duration" value={`${service?.durationInMinutes || 0} mins`} />
                                        <MiniTile label="Bookings/Day" value={service?.maxBookingsPerDay || 0} />
                                        <MiniTile label="Rating" value={
                                            <span className="flex items-center gap-1">
                                                <FaStar className="text-amber-400" size={10} />
                                                {service?.rating || 0}
                                            </span>
                                        } />
                                        <MiniTile label="Total Bookings" value={service?.totalBookings || 0} />
                                    </div>

                                    {/* Active + Cancellation */}
                                    <div className="flex gap-3 pt-1 border-t border-gray-100">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Active</p>
                                            <p className={`text-xs font-bold ${service?.isActive ? "text-green-600" : "text-red-500"}`}>
                                                {service?.isActive ? "Yes" : "No"}
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Cancellation</p>
                                            <p className={`text-xs font-bold ${service?.cancellationAllowed ? "text-green-600" : "text-red-500"}`}>
                                                {service?.cancellationAllowed ? `${service?.cancellationWindowHours}h window` : "Not Allowed"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Available Days */}
                                    <div className="pt-1 border-t border-gray-100">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Available Days</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {service?.availableDays && service.availableDays.length > 0 ? (
                                                service.availableDays.map((day, idx) => (
                                                    <span key={idx} className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                                        {day.slice(0, 3)}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 text-xs">No days set</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Available Time */}
                                    {service?.availableTime && (
                                        <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Available Hours</p>
                                            <p className="text-xs font-bold text-gray-800">
                                                {service.availableTime.from || "N/A"} – {service.availableTime.to || "N/A"}
                                            </p>
                                        </div>
                                    )}

                                    {/* Service Area */}
                                    {service?.serviceArea && (
                                        <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Service Radius</p>
                                            <p className="text-xs font-bold text-gray-800">{service.serviceArea.radiusKm || 0} km</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-10 text-center">
                        <FaTools className="text-gray-200 text-4xl mx-auto mb-3" />
                        <p className="text-sm text-gray-400 font-medium">No services listed yet</p>
                    </div>
                )}
            </div>

            {/* ── Documents Section ── */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-base font-extrabold text-gray-900 mb-5 flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <FaClipboardList size={14} />
                    </span>
                    Documents &amp; Verification
                </h3>

                {partner?.documents?.length > 0 ? (
                    <div className="space-y-3">
                        {partner.documents.map((doc) => (
                            <div
                                key={doc._id}
                                className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 hover:shadow-md transition-all"
                            >
                                {/* Left */}
                                <div className="flex items-start gap-4">
                                    <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <FaCertificate className="text-indigo-500 text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 capitalize text-sm">{doc.type}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                                        </p>
                                        <button
                                            onClick={() => openDocument(doc.fileUrl)}
                                            className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 transition px-2.5 py-1 rounded-lg"
                                        >
                                            View Document ↗
                                        </button>
                                        {doc.status === 'rejected' && doc.rejectionReason && (
                                            <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
                                                <strong>Reason:</strong> {doc.rejectionReason}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize
                                        ${doc.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : ''}
                                        ${doc.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                                        ${doc.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                                    `}>
                                        {doc.status}
                                    </span>
                                    <div className="relative">
                                        <select
                                            value={doc.status}
                                            onChange={(e) => handleDocumentStatusChange(doc._id, e.target.value)}
                                            className="appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 pr-8 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer transition"
                                        >
                                            <option value="pending">Set Action</option>
                                            <option value="approved">Approve</option>
                                            <option value="rejected">Reject</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <ChevronDown size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-10 text-center">
                        <FaClipboardList className="text-gray-200 text-4xl mx-auto mb-3" />
                        <p className="text-sm text-gray-400 font-medium">No documents uploaded</p>
                    </div>
                )}

                {/* Final Verification Summary */}
                <div className="mt-5 rounded-2xl border border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50/30 p-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Final Verification Status</p>
                        <p className="text-base font-extrabold text-gray-900 capitalize">{partner?.verification?.status}</p>
                    </div>
                    <span className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold capitalize
                        ${partner?.verification?.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${partner?.verification?.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                        ${partner?.verification?.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                        {partner?.verification?.status}
                    </span>
                </div>
            </div>

        </div>
    );
}
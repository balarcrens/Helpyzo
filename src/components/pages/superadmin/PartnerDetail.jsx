/* eslint-disable react-hooks/exhaustive-deps */
import {
    FaUserTie,
    FaPhoneAlt,
    FaCheckCircle,
    FaClock,
    FaBan,
    FaStar,
    FaTools,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaClipboardList,
    FaCertificate,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { partnerAPI, userAPI } from "../../../services/api";
import { ChevronDown } from "lucide-react";
import { useNotifications } from "../../../hooks/useData";

export default function PartnerDetail() {
    const { id } = useParams();
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load partner details");
            console.error("Error fetching partner:", err);
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

            await fetchPartnerDetails();

            await fetchNotifications();

        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || 'Failed to update document');
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
            console.error(err);
            alert("Failed to update service status");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading partner details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center bg-red-50 p-6 rounded-lg">
                    <p className="text-red-600 font-medium">Error</p>
                    <p className="text-red-500 text-sm mt-2">{error}</p>
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Partner Details
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        ID: {partner?._id}
                    </p>
                </div>
            </div>

            {/* Partner Hero Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="flex flex-col md:flex-row justify-center sm:justify-start items-center sm:items-start text-center sm:text-left gap-4 sm:gap-8">
                    <div className="flex flex-col items-center sm:items-start gap-4">
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-6xl font-bold text-gray-600">
                            {(partner?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{partner?.name || "Partner"}</h2>
                                <p className="text-gray-600 text-lg mt-1">{partner?.business?.name || "N/A"}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusInfo.bg} ${statusInfo.text} w-fit`}>
                                {statusInfo.label}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Rating</p>
                                <p className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                                    <FaStar className="text-yellow-500" />
                                    {partner?.rating || 0}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">({totalRatings || 0} ratings)</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{totalBookings || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Completed</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Services</p>
                                <p className="text-2xl font-bold text-gray-900">{partner?.services?.length || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Active</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Verification</p>
                                <p className="text-2xl font-bold justify-center sm:justify-start flex items-center gap-2 text-gray-900">
                                    {partner?.verification?.status === 'approved' ? (
                                        <FaCheckCircle className="text-green-600" />
                                    ) : (
                                        <FaClock className="text-yellow-600" />
                                    )}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{partner?.verification?.status === 'approved' ? "Verified" : "Pending"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <FaPhoneAlt className="text-gray-600" />
                    Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Email Address</p>
                        <p className="text-base font-semibold text-gray-900">{partner?.email || "N/A"}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Phone Number</p>
                        <p className="text-base font-semibold text-gray-900">{partner?.phone || "N/A"}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Business Name</p>
                        <p className="text-base font-semibold text-gray-900">{partner?.business?.name || "N/A"}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Business Contact</p>
                        <p className="text-base font-semibold text-gray-900">{partner?.business?.phone || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <FaMapMarkerAlt className="text-gray-600" />
                    Address & Location
                </h3>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Street</p>
                            <p className="text-base font-semibold text-gray-900">{partner?.address?.street || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1">City</p>
                            <p className="text-base font-semibold text-gray-900">{partner?.address?.city || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1">State</p>
                            <p className="text-base font-semibold text-gray-900">{partner?.address?.state || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Pincode</p>
                            <p className="text-base font-semibold text-gray-900">{partner?.address?.pincode || "N/A"}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-gray-500 text-sm mb-1">Country</p>
                            <p className="text-base font-semibold text-gray-900">{partner?.address?.country || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <FaShieldAlt className="text-gray-600" />
                    Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Account Status</p>
                        <p className={`text-base font-semibold flex items-center gap-2 ${partner?.isActive ? "text-green-600" : "text-red-600"}`}>
                            {partner?.isActive ? (
                                <>
                                    <FaCheckCircle />
                                    Active
                                </>
                            ) : (
                                <>
                                    <FaBan />
                                    Inactive
                                </>
                            )}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Verification Status</p>
                        <p className={`text-base font-semibold flex items-center gap-2 ${partner?.verification?.status === 'approved' ? "text-green-600" : "text-yellow-600"}`}>
                            {partner?.verification?.status === 'approved' ? (
                                <>
                                    <FaCertificate />
                                    Verified
                                </>
                            ) : (
                                <>
                                    <FaClock />
                                    Pending Verification
                                </>
                            )}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Joined Date</p>
                        <p className="text-base font-semibold text-gray-900">
                            {formatDate(partner?.createdAt)}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Last Login</p>
                        <p className="text-base font-semibold text-gray-900">
                            {partner?.lastLogin ? formatDate(partner.lastLogin) : "Never"}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Role</p>
                        <p className="text-base font-semibold text-gray-900 uppercase tracking-wider">
                            {partner?.role || "N/A"}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">Payment Methods</p>
                        <p className="text-base font-semibold text-gray-900">
                            {partner?.paymentMethods?.length > 0 ? `${partner.paymentMethods.length} Method(s)` : "None Added"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <FaTools className="text-gray-600" />
                    Services Provided ({partner?.services?.length || 0})
                </h3>

                {partner?.services && partner.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {partner.services.map((service) => (
                            <div
                                key={service?._id}
                                className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-base text-gray-900">
                                            {service?.name || 'Unnamed Service'}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {service?.category?.name || 'Uncategorized'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={service.approvalStatus}
                                            onChange={(e) =>
                                                handleApprovalChange(service._id, e.target.value)
                                            }
                                            className={`text-xs font-semibold px-3 py-1 rounded-lg border cursor-pointer focus:outline-none
                                                ${service.approvalStatus === "approved"
                                                    ? "bg-green-100 text-green-700 border-green-300"
                                                    : service.approvalStatus === "pending"
                                                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                                        : "bg-red-100 text-red-700 border-red-300"
                                                }`}
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {service.approvalStatus === "rejected" && service.rejectionReason && (
                                    <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                        ❌ <span className="font-semibold">Rejected:</span>{" "}
                                        {service.rejectionReason}
                                    </div>
                                )}

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {service?.description || "No description"}
                                </p>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded p-3 border border-gray-200">
                                            <p className="text-gray-500 text-xs mb-1">Base Price</p>
                                            <p className="font-semibold text-gray-900">₹{service?.basePrice || 0}</p>
                                        </div>
                                        <div className="bg-white rounded p-3 border border-gray-200">
                                            <p className="text-gray-500 text-xs mb-1">Final Price</p>
                                            <p className="font-semibold text-green-600">₹{service?.finalPrice || 0}</p>
                                        </div>
                                        <div className="bg-white rounded p-3 border border-gray-200">
                                            <p className="text-gray-500 text-xs mb-1">Visiting Fee</p>
                                            <p className="font-semibold text-gray-900">₹{service?.visitingFees || 0}</p>
                                        </div>
                                        <div className="bg-white rounded p-3 border border-gray-200">
                                            <p className="text-gray-500 text-xs mb-1">Discount</p>
                                            <p className="font-semibold text-gray-900">{service?.discount || 0}%</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded p-3 border border-gray-200">
                                            <p className="text-gray-500 text-xs mb-1">Duration</p>
                                            <p className="font-semibold text-gray-900">{service?.durationInMinutes || 0} mins</p>
                                        </div>
                                        <div className="bg-white rounded p-3 border border-gray-200">
                                            <p className="text-gray-500 text-xs mb-1">Bookings/Day</p>
                                            <p className="font-semibold text-gray-900">{service?.maxBookingsPerDay || 0}</p>
                                        </div>
                                        <div className="bg-white rounded p-3 border border-gray-200">
                                            <p className="text-gray-500 text-xs mb-1">Rating</p>
                                            <p className="font-semibold flex items-center gap-1 text-gray-900">
                                                <FaStar className="text-yellow-500 text-xs" />
                                                {service?.rating || 0}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded p-3 border border-gray-200">
                                            <p className="text-gray-500 text-xs mb-1">Total Bookings</p>
                                            <p className="font-semibold text-gray-900">{service?.totalBookings || 0}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t">
                                        <div className="flex-1">
                                            <p className="text-gray-500 text-xs mb-1">Active</p>
                                            <p className={`font-semibold text-sm ${service?.isActive ? "text-green-600" : "text-red-600"}`}>
                                                {service?.isActive ? "Yes" : "No"}
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-500 text-xs mb-1">Cancellation</p>
                                            <p className={`font-semibold text-xs ${service?.cancellationAllowed ? "text-green-600" : "text-red-600"}`}>
                                                {service?.cancellationAllowed ? `${service?.cancellationWindowHours}h` : "Not Allowed"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t">
                                        <p className="text-gray-500 text-xs mb-2">Available Days</p>
                                        <div className="flex flex-wrap gap-1">
                                            {service?.availableDays && service.availableDays.length > 0 ? (
                                                service.availableDays.map((day, idx) => (
                                                    <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                                                        {day.slice(0, 3)}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-xs">No days available</p>
                                            )}
                                        </div>
                                    </div>

                                    {service?.availableTime && (
                                        <div className="pt-3 border-t">
                                            <p className="text-gray-500 text-xs mb-2">Available Hours</p>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {service.availableTime.from || "N/A"} - {service.availableTime.to || "N/A"}
                                            </p>
                                        </div>
                                    )}

                                    {service?.serviceArea && (
                                        <div className="pt-3 border-t">
                                            <p className="text-gray-500 text-xs mb-2">Service Area</p>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                Radius: {service.serviceArea.radiusKm || 0} km
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                        <FaTools className="text-3xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No services available</p>
                    </div>
                )}
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                    <FaClipboardList className="text-gray-600" />
                    Documents & Verification
                </h3>

                {partner?.documents?.length > 0 ? (
                    <div className="space-y-4">
                        {partner.documents.map((doc) => (
                            <div
                                key={doc._id}
                                className="group rounded-xl border border-gray-200 bg-white p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6
                               hover:shadow-md transition-all"
                            >
                                {/* Left: Document Info */}
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-indigo-50">
                                        <FaCertificate className="text-indigo-600 text-lg" />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900 capitalize">
                                            {doc.type}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                                        </p>

                                        <button
                                            onClick={() => openDocument(doc.fileUrl)}
                                            className="inline-flex items-center gap-1 mt-2 text-sm text-indigo-600 font-medium hover:underline"
                                        >
                                            View Document
                                        </button>

                                        {doc.status === 'rejected' && doc.rejectionReason && (
                                            <p className="mt-2 text-xs text-red-600">
                                                <strong>Rejection Reason:</strong> {doc.rejectionReason}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                                ${doc.status === 'approved' && 'bg-green-100 text-green-700'}
                                ${doc.status === 'pending' && 'bg-yellow-100 text-yellow-700'}
                                ${doc.status === 'rejected' && 'bg-red-100 text-red-700'}
                            `}
                                    >
                                        {doc.status}
                                    </span>

                                    {/* Action Dropdown */}
                                    <div className="relative">
                                        <select
                                            value={doc.status}
                                            onChange={(e) =>
                                                handleDocumentStatusChange(doc._id, e.target.value)
                                            }
                                            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm font-medium
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="pending">Set Action</option>
                                            <option value="approved">Approve</option>
                                            <option value="rejected">Reject</option>
                                        </select>

                                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <ChevronDown size={16} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No documents uploaded</p>
                )}

                {/* Partner Verification Summary */}
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Final Verification Status</p>
                        <p className="text-lg font-semibold capitalize text-gray-900">
                            {partner?.verification?.status}
                        </p>
                    </div>

                    <span
                        className={`px-5 py-2 rounded-full text-sm font-semibold
                ${partner?.verification?.status === 'approved' && 'bg-green-100 text-green-700'}
                ${partner?.verification?.status === 'pending' && 'bg-yellow-100 text-yellow-700'}
                ${partner?.verification?.status === 'rejected' && 'bg-red-100 text-red-700'}
            `}
                    >
                        {partner?.verification?.status}
                    </span>
                </div>
            </div>

        </div>
    );
}
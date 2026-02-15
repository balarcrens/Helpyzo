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
    FaBuilding,
    FaEnvelope,
    FaShieldAlt,
    FaCalendarAlt,
    FaSignInAlt,
    FaClipboardList,
    FaCreditCard,
    FaCertificate,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { partnerAPI } from "../../../services/api";

export default function PartnerDetail() {
    const { id } = useParams();
    const [partner, setPartner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        fetchPartnerDetails();
    }, []);

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

    const statusInfo = getStatusColor(partner?.isActive, partner?.verified);

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
                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-6xl font-bold text-gray-600">
                        {(partner?.name || "?").charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{partner?.name || "Partner"}</h2>
                                <p className="text-gray-600 text-lg mt-1">{partner?.business?.name || "N/A"}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusInfo.bg} ${statusInfo.text} w-fit`}>
                                {statusInfo.label}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Rating</p>
                                <p className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                                    <FaStar className="text-yellow-500" />
                                    {partner?.rating || 0}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">({partner?.totalRatings || 0} ratings)</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{partner?.completedBookings || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Completed</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Services</p>
                                <p className="text-2xl font-bold text-gray-900">{partner?.services?.length || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Active</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-600 text-sm mb-2">Verification</p>
                                <p className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                                    {partner?.verified ? (
                                        <FaCheckCircle className="text-green-600" />
                                    ) : (
                                        <FaClock className="text-yellow-600" />
                                    )}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{partner?.verified ? "Verified" : "Pending"}</p>
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
                        <p className={`text-base font-semibold flex items-center gap-2 ${partner?.verified ? "text-green-600" : "text-yellow-600"}`}>
                            {partner?.verified ? (
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
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${service?.approvalStatus === "approved"
                                        ? "bg-green-100 text-green-700"
                                        : service?.approvalStatus === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                        {service?.approvalStatus || "unknown"}
                                    </span>
                                </div>

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
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <FaClipboardList className="text-gray-600" />
                    Documents & Verification
                </h3>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    {partner?.documents && partner.documents.length > 0 ? (
                        <div className="space-y-3">
                            {partner.documents.map((doc, idx) => (
                                <div key={idx} className="bg-white rounded p-4 flex items-center justify-between border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <FaCertificate className="text-gray-600" />
                                        <div>
                                            <p className="font-semibold text-gray-900">{doc?.type || "Document"}</p>
                                            <p className="text-sm text-gray-500">{doc?.name || "Unnamed"}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                                        {doc?.status || "Verified"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No documents uploaded</p>
                    )}
                </div>
            </div>
        </div>
    );
}
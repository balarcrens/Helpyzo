/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
    AiFillStar,
    AiOutlinePhone,
    AiOutlineMail,
    AiOutlineUpload
} from "react-icons/ai";
import { HiBadgeCheck } from "react-icons/hi";
import {
    FiCalendar,
    FiMapPin,
    FiChevronLeft,
    FiChevronRight,
    FiClock,
    FiChevronDown,
    FiSearch,
    FiShield,
    FiTag,
    FiArrowLeft,
    FiZap,
    FiTool
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/Auth/AuthContext";
import { partnerAPI, bookingAPI, userAPI } from "../../services/api";
import ToastContext from "../../context/Toast/ToastContext";

export default function ServiceDetail() {
    const { slug } = useParams();
    const { isLoggedIn, user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn && !user) {
            navigate('/register');
        }
    }, [isLoggedIn, navigate]);

    const [issue, setIssue] = useState("");
    const [issueLabel, setIssueLabel] = useState("");
    const [issueOpen, setIssueOpen] = useState(false);
    const [customIssue, setCustomIssue] = useState("");
    const [serviceType, setServiceType] = useState("normal");
    const [selectedDate, setSelectedDate] = useState(null);

    const [serviceData, setServiceData] = useState(null);
    const [partnerData, setPartnerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataError, setDataError] = useState(null);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const [selectedTime, setSelectedTime] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setDataError(null);

                const partnersRes = await partnerAPI.getAllPartners();
                const allPartners = partnersRes?.data?.partners || [];

                let foundService = null;
                let foundPartner = null;

                for (const partner of allPartners) {
                    if (partner.services && Array.isArray(partner.services)) {
                        const service = partner.services.find(s => s._id === slug);
                        if (service) {
                            foundService = service;
                            foundPartner = partner;
                            break;
                        }
                    }
                }

                if (!foundService || !foundPartner) {
                    showToast("Service not found", "error");
                    setLoading(false);
                    return;
                }

                setServiceData(foundService);
                setPartnerData(foundPartner);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                showToast("Failed to load service details", "error");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    const userAddressData = user?.address || {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"
    };

    const calendarDays = [
        ...Array(firstDayOfMonth).fill(null),
        ...Array(daysInMonth)
            .fill(0)
            .map((_, i) => {
                const date = new Date(currentYear, currentMonth, i + 1);
                return {
                    dayNum: i + 1,
                    day: date.toLocaleDateString("en-US", { weekday: "short" }),
                    fullDate: date.toDateString(),
                    isPast: date < today.setHours(0, 0, 0, 0),
                };
            }),
    ];

    const generateBookingNumber = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `BK${timestamp}${random}`.slice(0, 16);
    };

    const handleBooking = async () => {
        if (!isLoggedIn) {
            showToast("Please login to book a service", "info");
            navigate("/login");
            return;
        }

        if (!issue || !selectedDate || !selectedTime) {
            showToast("Please select date and time", "info");
            return;
        }

        if (!userAddressData?.street || !userAddressData?.city || !userAddressData?.state || !userAddressData?.pincode) {
            showToast("Please update your address in profile before booking", "info");
            navigate("/profile");
            return;
        }

        if (!serviceData || !partnerData) {
            showToast("Service data not loaded. Please try again.", "error");
            return;
        }

        const categoryId = typeof serviceData.category === "object"
            ? serviceData.category._id
            : serviceData.categoryId || null;

        const durationMinutes =
            serviceData.durationInMinutes || serviceData.durationMinutes || null;

        const bookingNumber = generateBookingNumber();

        try {
            setBookingLoading(true);

            const bookingPayload = {
                bookingNumber,
                serviceId: serviceData._id,
                partner: partnerData._id,
                user: user._id,
                categoryId,
                durationMinutes,
                status: "pending",
                notes: issue === "other" ? customIssue : `${issueLabel} (${serviceType} priority)`,
                paymentMethod: "online",
                amount: serviceType === "normal"
                    ? serviceData.finalPrice
                    : serviceType === "urgent"
                        ? serviceData.finalPrice + 200
                        : serviceData.finalPrice + 500,
                bookedDate: new Date(selectedDate),
                scheduledTime: selectedTime,
                serviceName: serviceData.name,
                userAddress: {
                    street: userAddressData.street || "",
                    city: userAddressData.city || "",
                    state: userAddressData.state || "",
                    pincode: userAddressData.pincode || "",
                    country: userAddressData.country || "India",
                },
                serviceImage: serviceData.image,
                createdBy: "user",
            };

            const res = await bookingAPI.createBooking(bookingPayload);

            if (res.data.success) {
                showToast("Service Book successfully!", "success");
                navigate("/my-bookings");
            }
        } catch (err) {
            console.error("Booking error:", err);
            showToast(err.response?.data?.message || "Failed to book service", "error");
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <Layout>
            <Header />

            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center bg-stone-900">
                    {/* Animated background blobs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9fe870]/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9fe870]/5 rounded-full blur-3xl" />
                    </div>
                    <div className="relative mb-8">
                        <motion.div
                            animate={{ scale: [1, 1.15, 1] }}
                            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                            className="w-28 h-28 rounded-full bg-[#9fe870]/10 flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="w-16 h-16 rounded-full text-white bg-[#9fe870]/20 flex items-center justify-center text-4xl"
                            >
                                <FiSearch />
                            </motion.div>
                        </motion.div>
                        {/* Orbiting dot */}
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            style={{ transformOrigin: "56px 56px" }}
                            className="absolute top-0 left-0 w-28 h-28 flex items-start justify-center"
                        >
                            <span className="w-3 h-3 rounded-full bg-[#9fe870] mt-1 shadow-[0_0_8px_#9fe870]" />
                        </motion.span>
                    </div>
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="text-stone-300 font-medium tracking-widest text-sm uppercase mb-4"
                    >
                        Loading <span className="text-[#9fe870]">service details</span>
                    </motion.p>
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: "easeInOut" }}
                                className="w-1.5 h-1.5 rounded-full bg-[#9fe870]"
                            />
                        ))}
                    </div>
                </div>
            ) : dataError ? (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen flex items-center justify-center bg-stone-900"
                >
                    <div className="max-w-md w-full mx-4 bg-stone-800 border border-stone-700 rounded-3xl p-10 flex flex-col items-center text-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6"
                        >
                            <span className="text-4xl">⚠️</span>
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">Something Went Wrong</h3>
                        <p className="text-stone-300 text-sm mb-8 leading-relaxed">{dataError}</p>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#9fe870] text-stone-900 font-semibold shadow-lg shadow-[#9fe870]/20"
                        >
                            <FiArrowLeft /> Go Back
                        </motion.button>
                    </div>
                </motion.div>
            ) : !serviceData || !partnerData ? (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="min-h-screen flex items-center justify-center bg-stone-900"
                >
                    <div className="max-w-md w-full mx-4 flex flex-col items-center text-center">
                        <div className="relative mb-10">
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                                className="w-28 h-28 rounded-full bg-[#9fe870]/10 border border-[#9fe870]/20 flex items-center justify-center"
                            >
                                <FiSearch className="text-[#9fe870] text-4xl" />
                            </motion.div>
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                style={{ transformOrigin: "56px 56px" }}
                                className="absolute top-0 left-0 w-28 h-28 flex items-start justify-center"
                            >
                                <span className="w-3 h-3 rounded-full bg-[#9fe870] mt-1 shadow-[0_0_8px_#9fe870]" />
                            </motion.span>
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-3">
                            Service{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9fe870] to-emerald-500">
                                Not Found
                            </span>
                        </h3>
                        <p className="text-stone-300 text-base mb-8 max-w-sm leading-relaxed">
                            We couldn&apos;t find the service you&apos;re looking for. It may have been removed or is no longer available.
                        </p>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#9fe870] text-stone-900 font-semibold shadow-lg shadow-[#9fe870]/20"
                            >
                                <FiArrowLeft /> Go Back
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/category")}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-stone-600 text-stone-300 font-semibold hover:border-[#9fe870] hover:text-[#9fe870] transition-colors"
                            >
                                Browse Services
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="min-h-screen bg-stone-900 selection:bg-[#9fe870] selection:text-black">
                    {/* HERO BANNER */}
                    <div className="relative h-[500px] w-full overflow-hidden">
                        <img
                            src={serviceData?.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952"}
                            className="h-full w-full object-cover scale-105"
                            alt={serviceData?.name}
                        />
                        {/* Multi-layer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-stone-900/20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 to-transparent" />

                        {/* Hero content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-semibold tracking-widest text-[#9fe870] uppercase">
                                        {serviceData?.category?.name || "Service"}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-stone-500" />
                                    <span className="text-xs text-stone-300 uppercase tracking-widest">Professional Service</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 max-w-2xl">
                                    {serviceData?.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <AiFillStar key={i} className={i < Math.floor(partnerData?.rating || 0) ? "text-yellow-400 text-sm" : "text-stone-600 text-sm"} />
                                        ))}
                                        <span className="text-white text-sm font-medium ml-1">{partnerData?.rating || 0}.0</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
                                        <FiClock className="text-[#9fe870] text-sm" />
                                        <span className="text-stone-300 text-sm">{serviceData?.durationInMinutes} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#9fe870]/10 backdrop-blur-sm border border-[#9fe870]/30 rounded-full px-4 py-1.5">
                                        <FiTag className="text-[#9fe870] text-sm" />
                                        <span className="text-[#9fe870] text-sm font-semibold">₹{serviceData?.finalPrice}</span>
                                    </div>
                                    {partnerData?.verified && (
                                        <div className="flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-1.5">
                                            <FiShield className="text-blue-400 text-sm" />
                                            <span className="text-blue-300 text-sm">Verified Provider</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="max-w-7xl mx-auto px-4 py-10 pb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* LEFT CONTENT */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* PROVIDER CARD */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-stone-800 border border-stone-700 rounded-3xl p-6 sm:p-8"
                                >
                                    <div className="flex flex-wrap gap-6 items-start">
                                        <div className="relative">
                                            <img
                                                src={partnerData?.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
                                                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-stone-700"
                                                alt={partnerData?.name}
                                            />
                                            {partnerData?.isActive && (
                                                <span className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-[#9fe870] border-2 border-stone-800" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h2 className="text-2xl font-bold text-white">{partnerData?.name || "Partner"}</h2>
                                                {partnerData?.verified && <HiBadgeCheck className="text-blue-400 text-xl shrink-0" />}
                                            </div>
                                            <p className="text-stone-300 text-sm leading-relaxed max-w-xl mb-4">
                                                {partnerData?.business?.name || "Professional service provider"} — {serviceData?.description || "Quality service guaranteed"}
                                            </p>
                                            <div className="flex items-center gap-2 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <AiFillStar key={i} className={i < Math.floor(partnerData?.rating || 0) ? "text-yellow-400" : "text-stone-600"} />
                                                ))}
                                                <span className="font-semibold text-white text-sm">{partnerData?.rating || 0}.0</span>
                                                <span className="text-stone-500 text-sm">({partnerData?.totalRatings || 0} verified reviews)</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {partnerData?.verified && (
                                                    <span className="inline-flex items-center gap-1.5 bg-[#9fe870]/10 border border-[#9fe870]/20 text-[#9fe870] px-3 py-1 rounded-full text-xs font-semibold">
                                                        <FiShield className="text-xs" /> Verified
                                                    </span>
                                                )}
                                                {partnerData?.isActive && (
                                                    <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Active
                                                    </span>
                                                )}
                                                {partnerData?.completedBookings > 0 && (
                                                    <span className="inline-flex items-center gap-1.5 bg-stone-700 text-stone-300 px-3 py-1 rounded-full text-xs font-semibold">
                                                        {partnerData.completedBookings}+ Jobs Done
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* SERVICE DETAILS */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-stone-800 border border-stone-700 rounded-3xl p-6 sm:p-8"
                                >
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <FiTool className="text-[#9fe870]" /> Service Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { label: "Service Name", value: serviceData?.name },
                                            { label: "Category", value: serviceData?.category?.name || serviceData?.category },
                                            { label: "Duration", value: `${serviceData?.durationInMinutes} minutes` },
                                            { label: "Base Price", value: `₹${serviceData?.basePrice}` },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-stone-700/50 rounded-2xl p-4 border border-stone-600/50">
                                                <p className="text-stone-300 text-xs uppercase tracking-widest mb-1">{item.label}</p>
                                                <p className="text-white font-semibold">{item.value}</p>
                                            </div>
                                        ))}
                                        <div className="sm:col-span-2 bg-gradient-to-r from-[#9fe870]/10 to-emerald-500/5 border border-[#9fe870]/20 rounded-2xl p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-stone-300 text-xs uppercase tracking-widest mb-1">Final Price</p>
                                                <p className="text-[#9fe870] text-3xl font-bold">₹{serviceData?.finalPrice}</p>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-[#9fe870]/10 border border-[#9fe870]/20 flex items-center justify-center">
                                                <FiTag className="text-[#9fe870] text-2xl" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ABOUT PROFESSIONAL */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-stone-800 border border-stone-700 rounded-3xl p-6 sm:p-8"
                                >
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <HiBadgeCheck className="text-[#9fe870]" /> About the Professional
                                    </h3>
                                    <p className="text-stone-300 leading-relaxed">
                                        {partnerData?.name} is a verified service provider with{" "}
                                        <span className="text-[#9fe870] font-semibold">{partnerData?.completedBookings || 0}</span> completed bookings
                                        and a rating of{" "}
                                        <span className="text-[#9fe870] font-semibold">{partnerData?.rating || 0}/5</span>.
                                        Specialized in <span className="text-white font-medium">{serviceData?.category?.name || "professional"}</span> services.
                                    </p>

                                    {/* Contact info inside About */}
                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <a href={`tel:${partnerData?.phone}`} className="flex items-center gap-3 bg-stone-700/50 border border-stone-600/50 rounded-2xl px-4 py-3 hover:border-[#9fe870]/30 transition-colors group">
                                            <div className="w-9 h-9 rounded-xl bg-[#9fe870]/10 flex items-center justify-center group-hover:bg-[#9fe870]/20 transition-colors">
                                                <AiOutlinePhone className="text-[#9fe870]" />
                                            </div>
                                            <span className="text-stone-300 text-sm">{partnerData?.phone || "+91 XXXXX XXXXX"}</span>
                                        </a>
                                        <a href={`mailto:${partnerData?.email}`} className="flex items-center gap-3 bg-stone-700/50 border border-stone-600/50 rounded-2xl px-4 py-3 hover:border-[#9fe870]/30 transition-colors group">
                                            <div className="w-9 h-9 rounded-xl bg-[#9fe870]/10 flex items-center justify-center group-hover:bg-[#9fe870]/20 transition-colors">
                                                <AiOutlineMail className="text-[#9fe870]" />
                                            </div>
                                            <span className="text-stone-300 text-sm truncate">{partnerData?.email || "support@service.com"}</span>
                                        </a>
                                    </div>
                                </motion.div>

                                {/* CLIENT REVIEWS CAROUSEL */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-stone-800 border border-stone-700 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                                >
                                    {/* Decorative blob */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#9fe870]/5 rounded-full blur-3xl pointer-events-none" />

                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <AiFillStar className="text-yellow-400" /> Client Experiences
                                    </h3>

                                    <Swiper
                                        modules={[Autoplay, Navigation]}
                                        autoplay={{ delay: 2500 }}
                                        navigation={{
                                            prevEl: ".prev-review",
                                            nextEl: ".next-review",
                                        }}
                                    >
                                        {[
                                            { text: "Prompt service and exceptional workmanship. Highly reliable and professional.", author: "Rahul M.", role: "Homeowner" },
                                            { text: "Explained the issue clearly and fixed it the same day. Absolutely fantastic experience!", author: "Priya K.", role: "Apartment Resident" },
                                            { text: "Professional, respectful, and worth every penny. Will definitely book again.", author: "Amit S.", role: "Business Owner" },
                                        ].map((review, i) => (
                                            <SwiperSlide key={i}>
                                                <div className="bg-stone-700/50 border border-stone-600/50 rounded-2xl p-6">
                                                    <div className="flex gap-1 mb-4">
                                                        {[...Array(5)].map((_, j) => (
                                                            <AiFillStar key={j} className="text-yellow-400 text-sm" />
                                                        ))}
                                                    </div>
                                                    <p className="text-stone-300 text-sm leading-relaxed mb-5 italic">
                                                        &ldquo;{review.text}&rdquo;
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#9fe870]/20 flex items-center justify-center text-[#9fe870] text-sm font-bold">
                                                            {review.author[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-white text-sm font-semibold">{review.author}</p>
                                                            <p className="text-stone-500 text-xs">{review.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    <div className="flex gap-2 mt-4 justify-end">
                                        <button className="prev-review w-9 h-9 rounded-full bg-stone-700 hover:bg-[#9fe870] hover:text-stone-900 text-stone-300 flex items-center justify-center transition-colors">
                                            <FiChevronLeft />
                                        </button>
                                        <button className="next-review w-9 h-9 rounded-full bg-stone-700 hover:bg-[#9fe870] hover:text-stone-900 text-stone-300 flex items-center justify-center transition-colors">
                                            <FiChevronRight />
                                        </button>
                                    </div>
                                </motion.div>

                                {/* SERVICE COVERAGE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-stone-800 border border-stone-700 rounded-3xl p-6 sm:p-8"
                                >
                                    <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                        <FiMapPin className="text-[#9fe870]" /> Service Coverage
                                    </h3>

                                    <div className="rounded-2xl overflow-hidden mb-5 border border-stone-600">
                                        <iframe
                                            title="map"
                                            src="https://maps.google.com/maps?q=Surat&output=embed"
                                            className="w-full h-52"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {["Central Zone", "South City", "West End", "North District"].map(area => (
                                            <div key={area} className="flex items-center gap-2 bg-stone-700/50 border border-stone-600/50 rounded-xl px-3 py-2 text-sm text-stone-300">
                                                <FiMapPin className="text-[#9fe870] text-xs shrink-0" />
                                                {area}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* WRITE REVIEW - DESKTOP */}
                                <div className="hidden lg:block">
                                    <WriteReview />
                                </div>
                            </div>

                            {/* BOOKING SIDEBAR */}
                            <BookingSidebar
                                issue={issue}
                                issueLabel={issueLabel}
                                setIssue={setIssue}
                                setIssueLabel={setIssueLabel}
                                issueOpen={issueOpen}
                                setIssueOpen={setIssueOpen}
                                customIssue={customIssue}
                                setCustomIssue={setCustomIssue}
                                serviceType={serviceType}
                                setServiceType={setServiceType}
                                calendarDays={calendarDays}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                                handleBooking={handleBooking}
                                bookingLoading={bookingLoading}
                                serviceData={serviceData}
                                partnerData={partnerData}
                            />
                        </div>

                        {/* REVIEWS ON MOBILE */}
                        <div className="lg:hidden mt-6">
                            <WriteReview />
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

/* ─── BOOKING SIDEBAR ──── */
const BookingSidebar = ({
    issue, issueLabel, setIssue, setIssueLabel,
    issueOpen, setIssueOpen,
    customIssue, setCustomIssue,
    serviceType, setServiceType,
    calendarDays, selectedDate, setSelectedDate,
    selectedTime, setSelectedTime, handleBooking, bookingLoading, serviceData, partnerData
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-stone-800 border border-stone-700 rounded-3xl p-5 sm:p-6 sticky top-24 space-y-6 self-start"
        >
            {/* Price header */}
            <div className="bg-gradient-to-br from-[#9fe870]/15 to-emerald-500/5 border border-[#9fe870]/20 rounded-2xl p-5">
                <p className="text-stone-300 text-xs uppercase tracking-widest mb-1">Starting from</p>
                <p className="text-[#9fe870] text-4xl font-bold">
                    {serviceData?.finalPrice ? `₹${serviceData.finalPrice}` : "—"}
                </p>
                <p className="text-stone-300 text-sm mt-1">
                    {serviceType === "urgent" ? `+ ₹200 urgent surcharge` : serviceType === "emergency" ? `+ ₹500 emergency surcharge` : "Standard priority"}
                </p>
            </div>

            {/* ISSUE SELECT */}
            <div className="relative">
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-300 mb-2 block">
                    What issue are you facing?
                </label>
                <button
                    onClick={() => setIssueOpen(!issueOpen)}
                    className="w-full flex items-center justify-between bg-stone-700/70 hover:bg-stone-700 border border-stone-600 hover:border-[#9fe870]/30 transition-all rounded-2xl px-4 py-3 text-sm font-medium text-stone-300"
                >
                    <span className={issueLabel ? "text-white" : "text-stone-500"}>{issueLabel || "Select a common issue"}</span>
                    <FiChevronDown className={`transition text-stone-300 ${issueOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                    {issueOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute z-20 mt-2 w-full rounded-2xl bg-stone-900 border border-stone-700 shadow-2xl p-2"
                        >
                            {[
                                { id: "leak", label: "Pipe Leakage" },
                                { id: "clog", label: "Drain Blockage" },
                                { id: "heater", label: "Water Heater Issue" },
                                { id: "pressure", label: "Low Water Pressure" },
                                { id: "other", label: "Other Issue" },
                            ].map(opt => (
                                <div
                                    key={opt.id}
                                    onClick={() => {
                                        setIssue(opt.id);
                                        setIssueLabel(opt.label);
                                        setIssueOpen(false);
                                    }}
                                    className="px-4 py-2.5 text-sm text-stone-300 hover:text-[#9fe870] hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {issue === "other" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 bg-stone-700/50 border border-stone-600 rounded-2xl p-4"
                    >
                        <textarea
                            value={customIssue}
                            onChange={e => setCustomIssue(e.target.value)}
                            placeholder="Describe your issue briefly..."
                            rows={3}
                            className="w-full bg-transparent outline-none resize-none text-sm text-stone-300 placeholder-stone-500"
                        />
                    </motion.div>
                )}
            </div>

            {/* SERVICE TYPE TABS */}
            <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-300 mb-3 block">
                    Service Priority
                </label>
                <div className="relative bg-stone-700/50 border border-stone-600 rounded-2xl p-1 grid grid-cols-3">
                    <motion.div
                        layout
                        className="absolute top-1 bottom-1 w-1/3 bg-[#9fe870] rounded-xl"
                        style={{
                            left: serviceType === "normal" ? "0%" :
                                serviceType === "urgent" ? "33.33%" : "66.66%",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                    {[
                        { id: "normal", label: "Normal" },
                        { id: "urgent", label: "Urgent" },
                        { id: "emergency", label: "Emergency" },
                    ].map(type => (
                        <button
                            key={type.id}
                            onClick={() => setServiceType(type.id)}
                            className={`relative z-10 py-2.5 text-xs font-bold rounded-xl transition ${serviceType === type.id ? "text-stone-900" : "text-stone-300 hover:text-stone-300"}`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CALENDAR */}
            <Calendar calendarDays={calendarDays} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            {/* TIME INPUT */}
            <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-stone-300 mb-3 flex items-center gap-1.5">
                    <FiClock className="text-[#9fe870]" /> Preferred Time
                </label>
                <div className="bg-stone-700/50 border border-stone-600 hover:border-[#9fe870]/30 transition-colors rounded-2xl p-4">
                    <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-transparent outline-none text-lg font-semibold text-white [color-scheme:dark]"
                    />
                </div>
                <p className="text-xs text-stone-500 mt-1.5">Confirmed after provider approval</p>
            </div>

            {/* BOOK BUTTON */}
            <motion.button
                onClick={handleBooking}
                disabled={bookingLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#9fe870] text-stone-900 py-4 rounded-2xl font-bold tracking-wide hover:bg-[#8fd960] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#9fe870]/20 text-sm"
            >
                {bookingLoading ? (
                    <>
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full"
                        />
                        Scheduling...
                    </>
                ) : (
                    <>
                        <FiZap /> Schedule Service
                    </>
                )}
            </motion.button>
        </motion.div>
    );
};

/* ─── CALENDAR ──── */
const Calendar = ({ calendarDays, selectedDate, setSelectedDate }) => {
    return (
        <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-stone-300 mb-3 flex items-center gap-1.5">
                <FiCalendar className="text-[#9fe870]" /> Select Date
            </label>
            <div className="grid grid-cols-7 gap-1 text-center">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="text-[10px] font-bold text-stone-500 py-1">{d}</div>
                ))}
                {calendarDays.map((d, idx) =>
                    d ? (
                        <motion.button
                            key={idx}
                            onClick={() => !d.isPast && setSelectedDate(d.fullDate)}
                            whileTap={{ scale: d.isPast ? 1 : 0.9 }}
                            className={`relative py-2.5 rounded-xl transition-all text-xs font-semibold
                            ${d.isPast
                                    ? "bg-stone-700/30 text-stone-600 cursor-not-allowed"
                                    : selectedDate === d.fullDate
                                        ? "bg-[#9fe870] text-stone-900 shadow-md shadow-[#9fe870]/30"
                                        : "bg-stone-700/50 text-stone-300 hover:bg-stone-600 hover:text-white"
                                }`}
                        >
                            <div className="text-[9px] leading-none mb-0.5 opacity-70">{d.day}</div>
                            <div className="text-sm font-bold leading-none">{d.dayNum}</div>
                            {selectedDate === d.fullDate && (
                                <motion.div layoutId="dateGlow" className="absolute inset-0 rounded-xl ring-2 ring-[#9fe870]/60" />
                            )}
                        </motion.button>
                    ) : <div key={idx} />
                )}
            </div>
        </div>
    );
};

/* ─── WRITE REVIEW ──── */
const WriteReview = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [beforeImage, setBeforeImage] = useState(null);
    const [afterImage, setAfterImage] = useState(null);

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            type === "before" ? setBeforeImage(url) : setAfterImage(url);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-stone-800 border border-stone-700 rounded-3xl p-6 sm:p-8 w-full relative overflow-hidden"
        >
            {/* Decorative */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#9fe870]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold tracking-widest text-[#9fe870] uppercase">Your Feedback</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                    Share Your Experience
                </h3>

                {/* Star Rating */}
                <div className="flex gap-2 mb-6">
                    {[...Array(5)].map((_, i) => {
                        const value = i + 1;
                        return (
                            <motion.div
                                key={i}
                                whileTap={{ scale: 0.85 }}
                                whileHover={{ scale: 1.2 }}
                                onClick={() => setRating(value)}
                                onMouseEnter={() => setHover(value)}
                                onMouseLeave={() => setHover(null)}
                                className="cursor-pointer"
                            >
                                <AiFillStar
                                    className={`text-3xl transition-colors ${value <= (hover || rating) ? "text-yellow-400" : "text-stone-600"}`}
                                />
                            </motion.div>
                        );
                    })}
                    {(hover || rating) > 0 && (
                        <span className="text-stone-300 text-sm self-center ml-1">
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hover || rating]}
                        </span>
                    )}
                </div>

                <textarea
                    rows="4"
                    placeholder="Write an honest review that helps others choose confidently..."
                    className="w-full bg-stone-700/50 border border-stone-600 focus:border-[#9fe870]/50 rounded-2xl p-4 resize-none outline-none text-sm text-stone-300 placeholder-stone-500 transition-colors mb-5"
                />

                {/* Before / After Image Upload */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {["before", "after"].map((type) => {
                        const img = type === "before" ? beforeImage : afterImage;
                        return (
                            <label
                                key={type}
                                className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-600 hover:border-[#9fe870]/50 rounded-2xl cursor-pointer transition-colors relative overflow-hidden h-36 group"
                            >
                                {img ? (
                                    <img src={img} alt={type} className="h-full w-full object-cover rounded-xl" />
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-xl bg-stone-700 group-hover:bg-[#9fe870]/10 flex items-center justify-center mb-2 transition-colors">
                                            <AiOutlineUpload className="text-xl text-stone-300 group-hover:text-[#9fe870] transition-colors" />
                                        </div>
                                        <span className="text-stone-500 text-xs text-center group-hover:text-stone-300 transition-colors">
                                            Upload {type.charAt(0).toUpperCase() + type.slice(1)} Image
                                        </span>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, type)} />
                            </label>
                        );
                    })}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#9fe870] text-stone-900 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#9fe870]/20 hover:bg-[#8fd960] transition-colors"
                >
                    Submit Review
                </motion.button>
            </div>
        </motion.div>
    );
};
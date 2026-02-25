/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useMemo, useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiChevronDown,
    FiSearch,
    FiMapPin,
    FiClock,
    FiSliders,
    FiRefreshCw,
    FiArrowLeft,
    FiPackage,
    FiStar,
} from "react-icons/fi";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import ServiceCard from "../Cards/ServiceCard";
import { partnerAPI } from "../../services/api";
import ToastContext from "../../context/Toast/ToastContext";

export default function ServicePage() {
    const { showToast } = useContext(ToastContext);
    const { category } = useParams();
    const navigate = useNavigate();
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [onlyNearby, setOnlyNearby] = useState(false);
    const [availableToday, setAvailableToday] = useState(false);
    const [minRating, setMinRating] = useState(0);
    const [openRating, setOpenRating] = useState(false);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);

            // Fetch all partners with services populated with category details
            const res = await partnerAPI.getApprovedServices();

            setPartners(res.data.partners || []);
        } catch (err) {
            console.error("Failed to fetch partners:", err);
            showToast("Failed to fetch partners", "error");
            setPartners([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = useMemo(() => {
        return partners.flatMap(partner =>
            partner.services
                .filter(service => {
                    const categoryMatch =
                        service.category?.name?.toLowerCase() === category?.toLowerCase();

                    const searchMatch =
                        service.name.toLowerCase().includes(search.toLowerCase());

                    const ratingMatch =
                        (partner.rating || 0) >= minRating;

                    return categoryMatch && searchMatch && ratingMatch;
                })
                .map(service => ({
                    ...service,
                    partner: {
                        _id: partner._id,
                        name: partner.name,
                        phone: partner.phone,
                        rating: partner.rating || 0,
                        totalRatings: partner.totalRatings || 0,
                        address: partner.address,
                        business: partner.business,
                    }
                }))
        );
    }, [partners, category, search, minRating]);

    if (!category) {
        return (
            <Layout>
                <div className="min-h-[50vh] flex items-center justify-center">
                    <p className="text-stone-500">Category not found</p>
                </div>
            </Layout>
        );
    }

    const sections = [
        {
            title: `${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Available'} Services`,
            filter: (s) => true, // Show all filtered services
        },
    ];

    return (
        <Layout>
            <section className="relative min-h-[45vh] bg-stone-900">
                <Header />

                <div className="absolute inset-0">
                    <img
                        src="/hero.png"
                        className="w-full h-full object-cover opacity-30"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-black/70" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">
                    <span className="text-sm tracking-widest text-[#9fe870] uppercase font-medium">
                        Services
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
                        {category && (category.charAt(0).toUpperCase() + category.slice(1))} Services<br />Near You
                    </h1>

                    <p className="text-gray-300 mt-6 max-w-xl text-lg">
                        Find verified professionals for your {category} needs.
                    </p>
                </div>
            </section>

            {/* ================= SEARCH & FILTER ================= */}
            <section className="relative -mt-20 z-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_auto] gap-3">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search services"
                                    className="h-12 w-full pl-12 pr-4 rounded-2xl bg-stone-50 ring-1 ring-stone-200 focus:ring-2 focus:ring-[#9fe870] outline-none"
                                />
                            </div>

                            <div
                                className="relative"
                                onMouseEnter={() => setOpenRating(true)}
                                onMouseLeave={() => setOpenRating(false)}
                            >
                                <button className="h-12 px-4 rounded-2xl bg-stone-50 ring-1 ring-stone-200 flex items-center gap-3 w-[170px]">
                                    <FiSliders />
                                    {minRating === 0 ? "All Ratings" : `${minRating}+ Rating`}
                                    <FiChevronDown />
                                </button>

                                <AnimatePresence>
                                    {openRating && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full mt-2 w-full bg-stone-900 text-white rounded-2xl p-2 shadow-xl"
                                        >
                                            {[0, 4, 4.5].map((val) => (
                                                <div
                                                    key={val}
                                                    onClick={() => {
                                                        setMinRating(val);
                                                        setOpenRating(false);
                                                    }}
                                                    className="px-4 py-2 rounded-xl cursor-pointer hover:bg-white/10"
                                                >
                                                    {val === 0 ? "All Ratings" : `${val}+ Rating`}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setOnlyNearby(!onlyNearby)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl ring-1 ${onlyNearby
                                    ? "bg-stone-900 text-white"
                                    : "bg-white ring-stone-200"
                                    }`}
                            >
                                <FiMapPin /> Nearby
                            </button>

                            <button
                                onClick={() => setAvailableToday(!availableToday)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl ring-1 ${availableToday
                                    ? "bg-stone-900 text-white"
                                    : "bg-white ring-stone-200"
                                    }`}
                            >
                                <FiClock /> Available Today
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION WISE SERVICES ================= */}
            <section className="pt-32 pb-20 space-y-14 bg-white">
                {loading ? (
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col items-center mb-12">
                            <div className="relative mb-8">
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                                    className="w-28 h-28 rounded-full bg-[#9fe870]/10 flex items-center justify-center"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        className="w-16 h-16 rounded-full bg-[#9fe870]/20 flex items-center justify-center text-4xl"
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
                                className="text-stone-500 font-medium tracking-wide"
                            >
                                Finding the best{" "}
                                <span className="text-[#9fe870] font-semibold">
                                    {category && category.charAt(0).toUpperCase() + category.slice(1)}
                                </span>{" "}
                                services
                            </motion.p>
                        </div>
                    </div>
                ) : filteredServices.length > 0 ? (
                    sections.map((section) => {
                        const items = filteredServices.filter(section.filter);
                        if (!items.length) return null;

                        return (
                            <div key={section.title} className="max-w-7xl mx-auto px-4">
                                <h2 className="text-2xl font-semibold mb-5">
                                    {section.title}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items.map((item) => (
                                        <div key={item._id} className="w-full">
                                            <ServiceCard
                                                partner={item.partner}
                                                item={item}
                                                onClick={() =>
                                                    navigate(`/category/${category}/${item._id}`)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-2xl mx-auto px-4 py-24 flex flex-col items-center text-center"
                    >
                        {/* Animated icon ring */}
                        <div className="relative mb-8">
                            <motion.div
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                                className="w-28 h-28 rounded-full bg-[#9fe870]/10 flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{ rotate: [0, -8, 8, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="w-16 h-16 rounded-full bg-[#9fe870]/20 flex items-center justify-center"
                                >
                                    <FiPackage className="text-[#9fe870]" size={34} />
                                </motion.div>
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

                        {/* Headline */}
                        <h3 className="text-3xl font-bold text-stone-800 mb-3">
                            No{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9fe870] to-emerald-500">
                                {category && category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>{" "}
                            Services Found
                        </h3>
                        <p className="text-stone-500 text-base mb-8 max-w-sm leading-relaxed">
                            We couldn&apos;t find any matching services right now. Try adjusting your filters or explore what&apos;s available.
                        </p>

                        {/* Tips */}
                        <div className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-5 mb-8 text-left space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Quick Tips</p>
                            {[
                                { icon: <FiSearch />, text: "Clear the search box and try again" },
                                { icon: <FiStar />, text: "Lower the minimum rating filter" },
                                { icon: <FiMapPin />, text: "Disable the Nearby filter" },
                            ].map((tip, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.12 }}
                                    className="flex items-center gap-3 text-sm text-stone-600"
                                >
                                    <span className="text-lg">{tip.icon}</span>
                                    {tip.text}
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { setSearch(""); setMinRating(0); setOnlyNearby(false); setAvailableToday(false); }}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 text-white font-semibold shadow-lg hover:bg-stone-800 transition-colors"
                            >
                                <FiRefreshCw size={16} /> Reset Filters
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/category")}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#9fe870] text-stone-800 font-semibold hover:bg-[#9fe870]/10 transition-colors"
                            >
                                <FiArrowLeft size={16} /> Browse Categories
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </section>
        </Layout>
    );
}
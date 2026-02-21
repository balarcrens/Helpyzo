/* eslint-disable no-unused-vars */
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiChevronDown,
    FiSearch,
    FiMapPin,
    FiClock,
    FiSliders,
} from "react-icons/fi";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import ServiceCard from "../Cards/ServiceCard";
import { partnerAPI } from "../../services/api";

export default function ServicePage() {
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
    }, [category, minRating, search]);

    const fetchPartners = async () => {
        try {
            setLoading(true);

            // Fetch all partners with services populated with category details
            const res = await partnerAPI.getApprovedServices();

            console.log(res?.data?.partners?.services);


            setPartners(res.data.partners || []);
        } catch (err) {
            console.error("Failed to fetch partners:", err);
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
            {/* ================= HERO ================= */}
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
                    <div className="max-w-7xl mx-auto px-4 text-center text-stone-500">
                        Loading services...
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
                                                    navigate(
                                                        `/category/${category}/${item._id}`
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="max-w-7xl mx-auto px-4 text-center py-20">
                        <p className="text-stone-500 text-lg">
                            No services found for {category}
                        </p>
                    </div>
                )}
            </section>
        </Layout>
    );
}
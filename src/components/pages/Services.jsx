/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
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
import { SERVICES_DATA } from "../data/services.data";

export default function ServicePage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const data = useMemo(
        () => SERVICES_DATA.find((c) => c.slug === category),
        [category]
    );

    const [search, setSearch] = useState("");
    const [onlyNearby, setOnlyNearby] = useState(false);
    const [availableToday, setAvailableToday] = useState(false);
    const [minRating, setMinRating] = useState(0);
    const [openRating, setOpenRating] = useState(false);

    const filteredServices = useMemo(() => {
        if (!data) return [];

        return data.services.filter((s) => {
            const matchSearch = s.title
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchNearby = !onlyNearby || s.distance <= 5;
            const matchAvailable = !availableToday || s.availableToday;
            const matchRating = s.rating >= minRating;
            return matchSearch && matchNearby && matchAvailable && matchRating;
        });
    }, [data, search, onlyNearby, availableToday, minRating]);

    if (!data) {
        return (
            <Layout>
                <div className="min-h-[50vh] flex items-center justify-center">
                    <p className="text-stone-500">Category not found</p>
                </div>
            </Layout>
        );
    }

    /* ==================================================
       SECTION FILTERS
    ================================================== */
    const sections = [
        {
            title: "Nearby Services",
            filter: (s) => s.distance <= 5,
        },
        {
            title: "Services in Your City",
            filter: (s) => s.city === "city",
        },
        {
            title: "Available Today",
            filter: (s) => s.availableToday,
        },
        {
            title: "Nearest in State",
            filter: (s) => s.city === "state",
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
                        {data.title}
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4">
                        Professional Services<br />Near You
                    </h1>

                    <p className="text-gray-300 mt-6 max-w-xl text-lg">
                        {data.heroDesc}
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
                {sections.map((section) => {
                    const items = filteredServices.filter(section.filter);
                    if (!items.length) return null;

                    return (
                        <div key={section.title} className="max-w-7xl mx-auto px-4">
                            <h2 className="text-2xl font-semibold mb-5">
                                {section.title}
                            </h2>

                            <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-hide">
                                {items.map((item) => (
                                    <div key={item.id} className="min-w-[280px]">
                                        <ServiceCard
                                            item={item}
                                            onClick={() =>
                                                navigate(
                                                    `/category/${category}/${item.slug}`
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>
        </Layout>
    );
}
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiChevronDown,
    FiSearch,
    FiMapPin,
    FiClock,
    FiSliders,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import ServiceCard from "../Cards/ServiceCard";

const ServicesPage = () => {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState("All Categories");
    const [openCategory, setOpenCategory] = useState(false);
    const [openRating, setOpenRating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [onlyNearby, setOnlyNearby] = useState(false);
    const [availableToday, setAvailableToday] = useState(false);
    const [minRating, setMinRating] = useState(0);

    const serviceData = [
        {
            category: "Cleaning Services",
            services: [
                {
                    id: "clean-001",
                    title: "Cleaning & Maid Service",
                    rating: 5.0,
                    reviews: 84,
                    price: 80,
                    duration: "2-3 hrs",
                    badge: "Popular",
                    isVerified: true,
                    distance: 2.3,
                    availableToday: true,
                    slug: "cleaning-service",
                    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
                },
                {
                    id: "clean-002",
                    title: "Pest Control",
                    rating: 4.9,
                    reviews: 152,
                    price: 65,
                    badge: "Top Rated",
                    isVerified: true,
                    distance: 6.4,
                    availableToday: false,
                    slug: "pest-control",
                    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
                },
                {
                    id: "clean-003",
                    title: "Bathroom Deep Cleaning",
                    rating: 4.4,
                    reviews: 98,
                    price: 70,
                    isVerified: true,
                    distance: 3.1,
                    availableToday: true,
                    slug: "bathroom-cleaning",
                    img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop",
                },
            ],
        },
        {
            category: "Repair Services",
            services: [
                {
                    id: "repair-001",
                    title: "Handyman",
                    rating: 4.9,
                    reviews: 592,
                    price: 40,
                    isVerified: true,
                    distance: 1.9,
                    availableToday: true,
                    slug: "handyman",
                    img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
                },
                {
                    id: "repair-002",
                    title: "Electrician & Wiring",
                    rating: 4.8,
                    reviews: 268,
                    price: 55,
                    badge: "Verified",
                    isVerified: true,
                    distance: 5.6,
                    availableToday: false,
                    slug: "electrical-wiring-service",
                    img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
                },
                {
                    id: "repair-003",
                    title: "Plumbing Service",
                    rating: 4.2,
                    reviews: 214,
                    price: 60,
                    isVerified: true,
                    distance: 4.2,
                    availableToday: true,
                    slug: "plumbing-service",
                    img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
                },
            ],
        },
        {
            category: "Installation Services",
            services: [
                {
                    id: "install-001",
                    title: "LED Lighting Installation",
                    rating: 4.7,
                    reviews: 103,
                    price: 70,
                    isVerified: true,
                    distance: 2.8,
                    availableToday: true,
                    slug: "led-installation",
                    img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=800&auto=format&fit=crop",
                },
                {
                    id: "install-002",
                    title: "Smart Thermostat Setup",
                    rating: 4.8,
                    reviews: 91,
                    price: 90,
                    badge: "Top Rated",
                    isVerified: true,
                    distance: 7.2,
                    availableToday: false,
                    slug: "thermostat-installation",
                    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
                },
                {
                    id: "install-003",
                    title: "Wall Shelving Installation",
                    rating: 4.6,
                    reviews: 67,
                    price: 50,
                    isVerified: true,
                    distance: 3.9,
                    availableToday: true,
                    slug: "shelving-installation",
                    img: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?q=80&w=800&auto=format&fit=crop",
                },
            ],
        },
    ];

    const categories = [
        "All Categories",
        "Cleaning Services",
        "Repair Services",
        "Installation Services",
    ];

    const filteredData = useMemo(() => {
        return serviceData
            .filter(section =>
                activeCategory === "All Categories"
                    ? true
                    : section.category === activeCategory
            )
            .map(section => ({
                ...section,
                services: section.services.filter(service => {
                    const matchSearch = service.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());
                    const matchNearby = !onlyNearby || service.distance <= 5;
                    const matchAvailable =
                        !availableToday || service.availableToday;
                    const matchRating = service.rating >= minRating;
                    return (
                        matchSearch &&
                        matchNearby &&
                        matchAvailable &&
                        matchRating
                    );
                }),
            }))
            .filter(section => section.services.length > 0);
    }, [activeCategory, searchQuery, onlyNearby, availableToday, minRating]);

    return (
        <Layout>
            <section className="relative z-20 min-h-[65vh] bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900">
                <Header />

                <div className="absolute inset-0">
                    <img
                        src="/hero.png"
                        className="w-full h-full object-cover opacity-30"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-30">
                    <span className="text-sm tracking-widest text-[#9fe870] uppercase font-medium">
                        Trusted Professionals
                    </span>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-4">
                        All <span className="text-[#9fe870]">Services</span>
                        <br /> In One Place
                    </h1>

                    <p className="text-gray-300 mt-6 max-w-xl text-lg">
                        Compare verified experts, transparent pricing, and instant booking.
                    </p>
                </div>

                {/* SEARCH + FILTER */}
                <div className="absolute left-0 right-0 -bottom-30 sm:-bottom-24 z-30">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-black/5 p-2.5 py-3.5 space-y-2">

                            {/* SEARCH ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_auto] gap-2">
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search for services or professionals"
                                        className="h-11 sm:h-13 w-full pl-12 pr-4 rounded-2xl bg-stone-50 ring-1 ring-stone-200 focus:ring-2 focus:ring-[#9fe870] outline-none transition"
                                    />
                                </div>

                                <div className="relative"
                                    onMouseEnter={() => setOpenCategory(true)}
                                    onMouseLeave={() => setOpenCategory(false)}
                                >
                                    <button className="h-11 sm:h-13 w-full px-4 rounded-2xl bg-stone-50 ring-1 ring-stone-200 flex justify-between items-center hover:ring-[#9fe870]/40 transition">
                                        {activeCategory}
                                        <FiChevronDown />
                                    </button>

                                    <AnimatePresence>
                                        {openCategory && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full mt-2 w-full bg-stone-900/95 text-white rounded-2xl p-2 shadow-xl z-40"
                                            >
                                                {categories.map(cat => (
                                                    <div key={cat}
                                                        onClick={() => {
                                                            setActiveCategory(cat);
                                                            setOpenCategory(false);
                                                        }}
                                                        className="px-4 py-2 rounded-xl text-gray-300 hover:text-[#9fe870] hover:bg-white/5 cursor-pointer transition"
                                                    >
                                                        {cat}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button className="h-12 px-10 rounded-2xl bg-stone-900 text-white font-semibold shadow-lg hover:shadow-xl transition">
                                    Search
                                </button>
                            </div>

                            {/* FILTERS */}
                            <div className="flex flex-wrap gap-1 sm:gap-3">
                                <button onClick={() => setOnlyNearby(!onlyNearby)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ring-1 transition ${onlyNearby
                                        ? "bg-stone-900 text-white ring-stone-900"
                                        : "bg-white ring-stone-200 hover:ring-stone-300"
                                        }`}
                                >
                                    <FiMapPin /> Nearby
                                </button>

                                <button onClick={() => setAvailableToday(!availableToday)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ring-1 transition ${availableToday
                                        ? "bg-stone-900 text-white ring-stone-900"
                                        : "bg-white ring-stone-200 hover:ring-stone-300"
                                        }`}
                                >
                                    <FiClock /> Available Today
                                </button>

                                <div className="relative"
                                    onMouseEnter={() => setOpenRating(true)}
                                    onMouseLeave={() => setOpenRating(false)}
                                >
                                    <button className="h-11 px-4 rounded-2xl bg-stone-50 ring-1 ring-stone-200 flex items-center justify-between gap-3 hover:ring-[#9fe870]/40 transition w-[170px]">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <FiSliders />
                                            {minRating === 0 ? "All Ratings" : `${minRating}+ Rating`}
                                        </div>
                                        <FiChevronDown />
                                    </button>

                                    <AnimatePresence>
                                        {openRating && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full mt-2 w-full bg-stone-900/95 text-white rounded-2xl p-2 shadow-xl z-40"
                                            >
                                                {[0, 4, 4.5].map(val => (
                                                    <div
                                                        key={val}
                                                        onClick={() => {
                                                            setMinRating(val);
                                                            setOpenRating(false);
                                                        }}
                                                        className={`px-4 py-2 rounded-xl cursor-pointer transition
                            ${minRating === val
                                                                ? "bg-white/10 text-[#9fe870]"
                                                                : "text-gray-300 hover:text-[#9fe870] hover:bg-white/5"
                                                            }
                        `}
                                                    >
                                                        {val === 0 ? "All Ratings" : `${val}+ Rating`}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* RESULTS */}
            <section className="pt-40 pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 space-y-20">
                    {filteredData.map((section, index) => (
                        <CategorySection key={index} section={section} navigate={navigate} />
                    ))}
                </div>
            </section>
        </Layout>
    );
};

const CategorySection = ({ section, navigate }) => {
    const sliderRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const dragged = useRef(false);

    const startDrag = (e) => {
        isDown.current = true;
        dragged.current = false;
        sliderRef.current.classList.add("cursor-grabbing");
        startX.current = e.pageX || e.touches[0].pageX;
        scrollLeft.current = sliderRef.current.scrollLeft;
    };

    const stopDrag = () => {
        isDown.current = false;
        sliderRef.current.classList.remove("cursor-grabbing");
    };

    const onDrag = (e) => {
        if (!isDown.current) return;
        const x = e.pageX || e.touches[0].pageX;
        const walk = (x - startX.current) * 1.1;
        if (Math.abs(walk) > 5) dragged.current = true;
        sliderRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleClick = (slug) => {
        if (dragged.current) return;
        navigate(`/service/${slug}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end border-b pb-3">
                <div>
                    <h2 className="text-3xl font-semibold">{section.category}</h2>
                    <p className="text-sm text-stone-500">
                        Hand-picked professionals near you
                    </p>
                </div>
            </div>

            <div ref={sliderRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-2 cursor-grab select-none scroll-smooth snap-x snap-mandatory"
                onMouseDown={startDrag}
                onMouseMove={onDrag}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                onTouchStart={startDrag}
                onTouchMove={onDrag}
                onTouchEnd={stopDrag}
            >
                {section.services.map(item => (
                    <ServiceCard
                        key={item.id}
                        item={item}
                        onClick={() => handleClick(item.slug)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
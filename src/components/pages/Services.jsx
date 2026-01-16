/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useRef, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { HiBadgeCheck } from "react-icons/hi";

const badgeStyles = {
    Popular: "bg-orange-100 text-orange-700",
    "Top Rated": "bg-green-100 text-green-700",
    Verified: "bg-blue-100 text-blue-700",
};

const ServicesPage = () => {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState("All Categories");
    const [openCategory, setOpenCategory] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
                    slug: "pest-control",
                    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
                },
                {
                    id: "clean-003",
                    title: "Bathroom Deep Cleaning",
                    rating: 4.8,
                    reviews: 98,
                    price: 70,
                    isVerified: true,
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
                    slug: "electrical-wiring-service",
                    img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
                },
                {
                    id: "repair-003",
                    title: "Plumbing Service",
                    rating: 4.7,
                    reviews: 214,
                    price: 60,
                    isVerified: true,
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
                services: section.services.filter(service =>
                    service.title.toLowerCase().includes(searchQuery.toLowerCase())
                ),
            }))
            .filter(section => section.services.length > 0);
    }, [activeCategory, searchQuery]);

    return (
        <Layout>
            <section className="relative z-20 min-h-[65vh] sm:min-h-[50vh] bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900">
                <Header />

                <div className="absolute inset-0">
                    <img
                        src="/hero.png"
                        alt="Professional Services"
                        className="w-full h-full object-cover opacity-30"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/40" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-30">
                    <span className="text-sm tracking-widest text-[#9fe870] font-medium uppercase">
                        Trusted Professionals
                    </span>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mt-3">
                        All <span className="text-[#9fe870]">Services</span><br />In One Place
                    </h1>

                    <p className="text-gray-300 mt-6 max-w-xl text-lg">
                        Compare verified experts, transparent pricing, and instant booking.
                    </p>

                    <div className="flex gap-2 sm:gap-6 mt-6 text-sm text-gray-300 flex-wrap">
                        <span>✔ 10,000+ Bookings</span>
                        <span>✔ Background Verified</span>
                        <span>✔ 24/7 Support</span>
                    </div>
                </div>

                <div className="absolute left-0 right-0 -bottom-23 md:-bottom-10 z-30">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="bg-white rounded-2xl shadow-xl p-4">
                            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_auto] gap-3">

                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search services..."
                                        className="h-12 w-full pl-11 pr-4 rounded-xl outline-0 border-1 border-gray-200 focus:ring-2 focus:ring-[#9fe870]"
                                    />
                                </div>

                                <div
                                    className="relative"
                                    onMouseEnter={() => setOpenCategory(true)}
                                    onMouseLeave={() => setOpenCategory(false)}
                                >
                                    <button className="h-12 w-full px-4 rounded-xl border-1 focus:ring-2 focus:ring-[#9fe870] border-gray-100 flex justify-between items-center">
                                        {activeCategory}
                                        <FiChevronDown />
                                    </button>

                                    <AnimatePresence>
                                        {openCategory && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                className="absolute top-full mt-2 w-full bg-stone-900 text-white rounded-xl p-2 z-40"
                                            >
                                                {categories.map(cat => (
                                                    <div
                                                        key={cat}
                                                        onClick={() => {
                                                            setActiveCategory(cat);
                                                            setOpenCategory(false);
                                                        }}
                                                        className="px-4 py-2 hover:bg-white/10 rounded-lg cursor-pointer"
                                                    >
                                                        {cat}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button className="h-12 px-8 bg-stone-900 text-white rounded-xl">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------- RESULTS ---------------- */}
            <section className="pt-30 pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 space-y-16">
                    {filteredData.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-stone-500 text-lg">No services found</p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setActiveCategory("All Categories");
                                }}
                                className="mt-4 text-blue-600 font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    {filteredData.map((section, index) => (
                        <CategorySection
                            key={index}
                            section={section}
                            navigate={navigate}
                        />
                    ))}
                </div>
            </section>
        </Layout>
    );
};

const CategorySection = ({ section, navigate }) => {
    const sliderRef = useRef(null);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const hasDragged = useRef(false);

    const startDrag = (e) => {
        isDragging.current = true;
        hasDragged.current = false;

        sliderRef.current.classList.add("dragging");

        startX.current = e.pageX || e.touches[0].pageX;
        scrollLeft.current = sliderRef.current.scrollLeft;
    };

    const stopDrag = () => {
        isDragging.current = false;
        sliderRef.current.classList.remove("dragging");
    };

    const onDrag = (e) => {
        if (!isDragging.current) return;

        e.preventDefault();

        const x = e.pageX || e.touches[0].pageX;
        const walk = (x - startX.current) * 1.3;

        if (Math.abs(walk) > 6) {
            hasDragged.current = true;
        }

        sliderRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleCardClick = (slug) => {
        if (hasDragged.current) return;
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
                <span className="text-sm text-stone-600">
                    {section.services.length}+ services
                </span>
            </div>

            {/* SLIDER */}
            <div
                ref={sliderRef}
                className="flex gap-4 overflow-x-auto no-scrollbar pb-2 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={startDrag}
                onMouseMove={onDrag}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                onTouchStart={startDrag}
                onTouchMove={onDrag}
                onTouchEnd={stopDrag}
            >
                {section.services.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleCardClick(item.slug)}
                        className="group flex-shrink-0 w-[340px] bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    >
                        {/* IMAGE */}
                        <div className="relative h-56 rounded-t-3xl overflow-hidden">
                            <img
                                src={item.img}
                                alt={item.title}
                                draggable={false}
                                loading="lazy"
                                className="h-full w-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                            {/* BADGE */}
                            {item.badge && (
                                <span
                                    className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${badgeStyles[item.badge]}`}
                                >
                                    {item.badge}
                                </span>
                            )}

                            {/* RATING FLOAT */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium shadow">
                                <AiFillStar className="text-yellow-400" />
                                {item.rating}
                                <span className="text-stone-500 text-xs">
                                    ({item.reviews})
                                </span>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-5 space-y-3">
                            <h3 className="font-semibold text-lg leading-snug text-stone-800">
                                {item.title}
                            </h3>

                            {/* TRUST LINE */}
                            <div className="flex items-center gap-2 text-sm text-stone-600">
                                <HiBadgeCheck className="text-blue-600" />
                                Background verified professional
                            </div>

                            {/* PRICE */}
                            <div className="flex items-end justify-between pt-2">
                                <div>
                                    <p className="text-xs text-stone-500">Starting from</p>
                                    <p className="text-xl font-bold text-stone-800">
                                        ${item.price}
                                    </p>
                                </div>
                                <span className="text-xs text-stone-500">
                                    ⏱ {item.duration || "2–3 hrs"}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-5 flex gap-3">
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 border border-stone-300 hover:border-stone-400 text-stone-700 py-2 rounded-xl text-sm font-medium transition"
                            >
                                Details
                            </button>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-semibold transition shadow-md hover:shadow-lg"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
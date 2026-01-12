/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { HiBadgeCheck } from "react-icons/hi";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ServicesPage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState("All Categories");
    const [openCategory, setOpenCategory] = useState(false);

    const serviceData = [
        {
            category: "Cleaning Services",
            services: [
                {
                    title: "Cleaning & Maid Service",
                    rating: "5.0",
                    reviews: "84",
                    price: "$80",
                    badge: "Popular",
                    slug: "cleaning-service",
                    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Pest Control",
                    rating: "4.9",
                    reviews: "152",
                    price: "$65",
                    badge: "Top Rated",
                    slug: "pest-control",
                    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Bathroom Deep Cleaning",
                    rating: "4.8",
                    reviews: "98",
                    price: "$70",
                    slug: "bathroom-cleaning",
                    img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Bathroom Deep Cleaning",
                    rating: "4.8",
                    reviews: "98",
                    price: "$70",
                    slug: "bathroom-cleaning",
                    img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Bathroom Deep Cleaning",
                    rating: "4.8",
                    reviews: "98",
                    price: "$70",
                    slug: "bathroom-cleaning",
                    img: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop",
                },
            ],
        },
        {
            category: "Repair Services",
            services: [
                {
                    title: "Handyman",
                    rating: "4.9",
                    reviews: "592",
                    price: "$40",
                    slug: "handyman",
                    img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Electrician & Wiring",
                    rating: "4.8",
                    reviews: "268",
                    price: "$55",
                    badge: "Verified",
                    slug: "electrical-wiring-service",
                    img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
                },
                {
                    title: "Plumbing Service",
                    rating: "4.7",
                    reviews: "214",
                    price: "$60",
                    slug: "plumbing-service",
                    img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Plumbing Service",
                    rating: "4.7",
                    reviews: "214",
                    price: "$60",
                    slug: "plumbing-service",
                    img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Plumbing Service",
                    rating: "4.7",
                    reviews: "214",
                    price: "$60",
                    slug: "plumbing-service",
                    img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
                },
            ],
        },
        {
            category: "Installation Services",
            services: [
                {
                    title: "LED Lighting Installation",
                    rating: "4.7",
                    reviews: "103",
                    price: "$70",
                    slug: "led-installation",
                    img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Smart Thermostat Setup",
                    rating: "4.8",
                    reviews: "91",
                    price: "$90",
                    slug: "thermostat-installation",
                    img: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Wall Shelving Installation",
                    rating: "4.6",
                    reviews: "67",
                    price: "$50",
                    slug: "shelving-installation",
                    img: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Wall Shelving Installation",
                    rating: "4.6",
                    reviews: "67",
                    price: "$50",
                    slug: "shelving-installation",
                    img: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?q=80&w=800&auto=format&fit=crop",
                },
                {
                    title: "Wall Shelving Installation",
                    rating: "4.6",
                    reviews: "67",
                    price: "$50",
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

    return (
        <Layout>
            {/* HERO */}
            <section className="relative z-20 min-h-[42vh] overflow-visible bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900">
                <Header />

                <div className="absolute inset-0">
                    <img
                        src="/hero.png"
                        alt="Services"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/40" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col justify-center min-h-[60vh]">
                    <span className="text-sm tracking-widest text-[#9fe870] font-medium uppercase">
                        Professional Services
                    </span>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mt-3 leading-tight">
                        All <span className="text-[#9fe870]">Services</span><br />
                        In One Place
                    </h1>

                    <p className="text-gray-300 mt-6 max-w-xl text-lg">
                        Browse category-wise services, compare professionals, and book trusted experts instantly.
                    </p>
                </div>

                {/* SEARCH BAR – ATTACHED TO HERO */}
                <div className="absolute left-0 right-0 -bottom-23 sm:-bottom-10 z-30">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className=" bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-3 md:p-4 ">
                            <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_auto] gap-3 items-center">

                                {/* SEARCH */}
                                <input
                                    type="text"
                                    placeholder="Search services"
                                    className=" h-12 px-4 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                />

                                {/* CATEGORY DROPDOWN */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setOpenCategory(true)}
                                    onMouseLeave={() => setOpenCategory(false)}
                                >
                                    <button
                                        type="button"
                                        className=" w-full h-12 px-4 rounded-xl border border-stone-200 bg-white flex items-center justify-between text-sm font-medium text-stone-800 hover:border-stone-300 focus:outline-none">
                                        <span className="truncate">{activeCategory}</span>
                                        <FiChevronDown
                                            className={`text-xs transition-transform ${openCategory ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {openCategory && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                transition={{ duration: 0.18, ease: "easeOut" }}
                                                className=" absolute top-full left-0 mt-2 w-full rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-40">
                                                {categories.map((item) => (
                                                    <div
                                                        key={item}
                                                        onClick={() => {
                                                            setActiveCategory(item);
                                                            setOpenCategory(false);
                                                        }}
                                                        className=" px-4 py-2 text-sm text-gray-300 rounded-lg cursor-pointer hover:text-[#9fe870] hover:bg-white/5 transition">
                                                        {item}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* ACTION */}
                                <button
                                    className=" h-12 px-8 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800 transition"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORY SECTIONS (VERTICAL) */}
            <section className="relative z-10 pt-28 pb-14 bg-white">
                <div className="max-w-7xl mx-auto px-4 space-y-28">
                    {serviceData.map((section, index) => (
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

    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const moved = useRef(false);

    const CARD_SCROLL = 360; // px scroll per arrow click

    const onMouseDown = (e) => {
        isDown.current = true;
        moved.current = false;
        startX.current = e.pageX;
        scrollLeft.current = sliderRef.current.scrollLeft;
    };

    const onMouseMove = (e) => {
        if (!isDown.current) return;
        const x = e.pageX;
        const walk = x - startX.current;
        if (Math.abs(walk) > 6) moved.current = true;
        sliderRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const stopDrag = () => {
        isDown.current = false;
    };

    const scrollLeftBtn = () => {
        sliderRef.current.scrollBy({
            left: -CARD_SCROLL,
            behavior: "smooth",
        });
    };

    const scrollRightBtn = () => {
        sliderRef.current.scrollBy({
            left: CARD_SCROLL,
            behavior: "smooth",
        });
    };

    return (
        <div className="space-y-6 group relative">
            {/* CATEGORY HEADER */}
            <div className="flex items-end justify-between border-b border-stone-200 pb-3">
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">
                        {section.category}
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                        Hand-picked professionals near you
                    </p>
                </div>

                <span className="text-sm font-medium text-stone-600">
                    {section.services.length}+ services
                </span>
            </div>

            {/* ARROWS */}
            <button
                onClick={scrollLeftBtn}
                className="hidden md:flex absolute left-[-18px] top-[55%] -translate-y-1/2 z-10
                w-10 h-10 rounded-full bg-white shadow-md border border-stone-200
                items-center justify-center text-stone-700
                opacity-0 group-hover:opacity-100 hover:scale-105 hover:shadow-lg transition-all"
            >
                <span className="text-xl font-bold">←</span>
            </button>

            <button
                onClick={scrollRightBtn}
                className="hidden md:flex absolute right-[-18px] top-[55%] -translate-y-1/2 z-10
                w-10 h-10 rounded-full bg-white hover:scale-105 hover:shadow-lg transition-all shadow-md border border-stone-200
                items-center justify-center text-stone-700
                opacity-0 group-hover:opacity-100"
            >
                <span className="text-xl font-bold">→</span>
            </button>

            {/* CAROUSEL */}
            <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing pb-6 pt-2
    bg-gradient-to-r from-stone-50 via-white to-stone-50 rounded-2xl px-2"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDrag}
                onMouseLeave={stopDrag}
                onTouchStart={(e) => onMouseDown(e.touches[0])}
                onTouchMove={(e) => onMouseMove(e.touches[0])}
                onTouchEnd={stopDrag}
            >
                {section.services.map((item, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            if (!moved.current) {
                                navigate(`/service/${item.slug}`);
                            }
                        }}
                        className="snap-start select-none cursor-grab hover:cursor-pointer active:cursor-grabbing bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition flex-shrink-0 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[360px]"
                    >
                        {/* IMAGE */}
                        <div className="relative h-56 rounded-t-2xl overflow-hidden">
                            <img
                                src={item.img}
                                alt={item.title}
                                draggable={false}
                                className="h-full w-full object-cover pointer-events-none"
                            />

                            {/* GRADIENT */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                            {/* VERIFIED ICON */}
                            <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
                                <HiBadgeCheck className="text-blue-600 text-lg" />
                            </div>

                            {/* BADGE */}
                            {item.badge && (
                                <span className="absolute top-4 left-4 bg-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                    {item.badge}
                                </span>
                            )}

                            {/* AVATAR */}
                            <div className="absolute bottom-2 left-4">
                                <img
                                    src="https://i.pravatar.cc/60"
                                    alt="provider"
                                    className="w-12 h-12 rounded-full border-2 border-white shadow"
                                />
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="pt-10 px-5 pb-5">
                            <h3 className="text-lg font-semibold text-stone-900">
                                {item.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm mt-1">
                                <AiFillStar className="text-yellow-400" />
                                <span className="font-medium">{item.rating}</span>
                                <span className="text-stone-400">
                                    ({item.reviews} reviews)
                                </span>
                            </div>

                            {/* TAGS */}
                            <div className="flex gap-2 mt-3 flex-wrap">
                                <span className="px-3 py-1 bg-stone-100 rounded-full text-xs">
                                    Professional
                                </span>
                                <span className="px-3 py-1 bg-stone-100 rounded-full text-xs">
                                    Verified
                                </span>
                                <span className="px-3 py-1 bg-stone-100 rounded-full text-xs">
                                    Fast Service
                                </span>
                            </div>

                            {/* FOOTER */}
                            <div className="flex items-center justify-between mt-5">
                                <p className="text-sm text-stone-600">
                                    Starting at{" "}
                                    <span className="font-semibold">{item.price}</span>
                                </p>

                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { HiBadgeCheck } from "react-icons/hi";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";

const ServicesPage = () => {
    const navigate = useNavigate();

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

    return (
        <Layout>
            {/* HERO */}
            <section className="relative min-h-[45vh] bg-stone-900 overflow-hidden">
                <Header />
                <div className="absolute inset-0">
                    <img
                        src="/hero.png"
                        alt="Services"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col justify-center min-h-[45vh]">
                    <h1 className="text-5xl md:text-6xl font-bold text-white">
                        All <span className="text-[#9fe870]">Services</span>
                    </h1>
                    <p className="text-gray-300 mt-4 max-w-xl text-lg">
                        Browse services category-wise and book trusted professionals.
                    </p>
                </div>
            </section>

            {/* CATEGORY SECTIONS (VERTICAL) */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 space-y-20">
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
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">
                    {section.category}
                </h2>
                <span className="text-sm text-stone-500">
                    {section.services.length}+ services
                </span>
            </div>

            {/* ARROWS */}
            <button
                onClick={scrollLeftBtn}
                className="hidden md:flex absolute left-[-18px] top-[55%] -translate-y-1/2 z-10
                w-10 h-10 rounded-full bg-white shadow-md border border-stone-200
                items-center justify-center text-stone-700
                opacity-0 group-hover:opacity-100 transition"
            >
                ‹
            </button>

            <button
                onClick={scrollRightBtn}
                className="hidden md:flex absolute right-[-18px] top-[55%] -translate-y-1/2 z-10
                w-10 h-10 rounded-full bg-white shadow-md border border-stone-200
                items-center justify-center text-stone-700
                opacity-0 group-hover:opacity-100 transition"
            >
                ›
            </button>

            {/* CAROUSEL */}
            <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing pb-4"
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
                        className="snap-start select-none cursor-grab hover:cursor-pointer active:cursor-grabbing bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition flex-shrink-0 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[360px]"
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
                                    className="bg-blue-600 hover:bg-blue-700 text-white
                px-5 py-2 rounded-xl text-sm font-medium transition"
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
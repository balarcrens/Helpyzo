import {
    AiFillStar,
    AiOutlinePhone,
    AiOutlineMail
} from "react-icons/ai";
import { HiBadgeCheck } from "react-icons/hi";
import {
    FiCalendar,
    FiMapPin,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { useParams } from "react-router-dom";

export default function ServiceDetail() {
    const { slug } = useParams();
    console.log(slug);

    return (
        <Layout>
            <Header />

            <div className="bg-gradient-to-b from-stone-100 to-white min-h-screen">

                {/* HERO */}
                <div className="h-[420px] w-full relative">
                    <img
                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
                        className="h-full w-full object-cover"
                        alt="Service"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="max-w-7xl mx-auto px-4 -mt-32 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-2 z-1 space-y-8">
                            {/* PROVIDER CARD */}
                            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-7 flex flex-wrap gap-6">
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    className="w-28 h-28 rounded-2xl object-cover"
                                    alt="Provider"
                                />

                                <div className="flex-1 flex-wrap">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-2xl font-semibold text-stone-900">
                                            John Smith
                                        </h2>
                                        <HiBadgeCheck className="text-blue-600 text-xl" />
                                    </div>

                                    <p className="text-stone-600 mt-2 leading-relaxed">
                                        Trusted residential plumbing specialist delivering
                                        precision repairs, modern solutions, and clear pricing —
                                        without surprises.
                                    </p>

                                    <div className="flex items-center gap-2 mt-4 text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <AiFillStar key={i} className="text-yellow-400" />
                                        ))}
                                        <span className="font-medium text-stone-900">5.0</span>
                                        <span className="text-stone-400">(84 verified jobs)</span>
                                    </div>
                                </div>
                            </div>

                            {/* SERVICES OFFERED */}
                            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-7">
                                <h3 className="text-xl font-semibold mb-5">
                                    What’s Included
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        "Advanced Leak Detection",
                                        "Water Heater Setup & Repair",
                                        "Pipeline Restoration",
                                        "High-Pressure Drain Cleaning",
                                    ].map(service => (
                                        <div
                                            key={service}
                                            className="bg-stone-50 rounded-xl px-4 py-3 text-sm font-medium text-stone-700 shadow-sm"
                                        >
                                            {service}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ABOUT */}
                            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-7">
                                <h3 className="text-xl font-semibold mb-3">
                                    About the Professional
                                </h3>
                                <p className="text-stone-600 leading-relaxed">
                                    With over a decade of hands-on experience, John focuses on
                                    long-term fixes rather than temporary solutions. Every service
                                    is handled with care, cleanliness, and attention to detail —
                                    ensuring peace of mind for homeowners.
                                </p>
                            </div>

                            {/* PORTFOLIO */}
                            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-7">
                                <h3 className="text-xl font-semibold mb-5">
                                    Recent Work
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {[1, 2].map(i => (
                                        <div key={i} className="rounded-2xl overflow-hidden shadow">
                                            <div className="grid grid-cols-2">
                                                <img
                                                    src="https://images.unsplash.com/photo-1600585152915-d208bec867a1"
                                                    className="h-40 w-full object-cover"
                                                    alt="Before"
                                                />
                                                <img
                                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                                                    className="h-40 w-full object-cover"
                                                    alt="After"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* REVIEWS */}
                            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-7 relative">
                                <h3 className="text-xl font-semibold mb-5">
                                    Client Experiences
                                </h3>

                                <Swiper
                                    modules={[Autoplay, Navigation]}
                                    autoplay={{ delay: 4000 }}
                                    navigation={{
                                        prevEl: ".prev-review",
                                        nextEl: ".next-review",
                                    }}
                                >
                                    {[
                                        "Prompt service and exceptional workmanship. Highly reliable.",
                                        "Explained the issue clearly and fixed it the same day.",
                                        "Professional, respectful, and worth every penny.",
                                    ].map((review, i) => (
                                        <SwiperSlide key={i}>
                                            <div className="bg-stone-50 rounded-2xl p-6 shadow-sm">
                                                <div className="flex gap-1 mb-3">
                                                    {[...Array(5)].map((_, j) => (
                                                        <AiFillStar key={j} className="text-yellow-400" />
                                                    ))}
                                                </div>
                                                <p className="text-stone-600 text-sm leading-relaxed">
                                                    {review}
                                                </p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <button className="prev-review absolute -left-4 top-1/2 bg-white shadow-lg rounded-full p-2">
                                    <FiChevronLeft />
                                </button>
                                <button className="next-review absolute -right-4 top-1/2 bg-white shadow-lg rounded-full p-2">
                                    <FiChevronRight />
                                </button>
                            </div>

                            {/* SERVICE AREA */}
                            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-7">
                                <h3 className="text-xl font-semibold mb-4">
                                    Service Coverage
                                </h3>

                                <div className="rounded-2xl overflow-hidden shadow mb-5">
                                    <iframe
                                        title="map"
                                        src="https://maps.google.com/maps?q=Surat&output=embed"
                                        className="w-full h-60"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm text-stone-600">
                                    {["Central Zone", "South City", "West End", "North District"].map(area => (
                                        <div key={area} className="flex items-center gap-2">
                                            <FiMapPin className="text-blue-600" />
                                            {area}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BOOKING SIDEBAR */}
                        <div className="bg-white rounded-3xl max-h-fit shadow-xl p-4 sm:p-7 sticky top-24 space-y-7">
                            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold tracking-wide hover:opacity-95">
                                Schedule Service
                            </button>

                            {/* DATE */}
                            <div>
                                <div className="flex items-center gap-2 font-semibold mb-3">
                                    <FiCalendar />
                                    Choose a Date
                                </div>

                                <div className="bg-stone-50 rounded-2xl p-4">
                                    <div className="grid grid-cols-7 text-xs text-center gap-2">
                                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                            <span key={d} className="font-semibold text-stone-400">{d}</span>
                                        ))}
                                        {[...Array(31)].map((_, i) => (
                                            <span
                                                key={i}
                                                className="py-2 rounded-xl cursor-pointer hover:bg-blue-100 transition"
                                            >
                                                {i + 1}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* TIME */}
                            <div>
                                <h4 className="font-semibold mb-3">Available Slots</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {["9:00 AM", "11:30 AM", "2:00 PM", "5:00 PM"].map(time => (
                                        <button
                                            key={time}
                                            className="py-2 rounded-xl bg-stone-100 hover:bg-blue-100 transition text-sm"
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PRICE */}
                            <div className="bg-blue-50 rounded-2xl p-5">
                                <h4 className="font-semibold mb-1">
                                    Initial Visit Fee
                                </h4>
                                <p className="text-3xl font-bold text-blue-600">$49</p>
                                <p className="text-xs text-stone-600 mt-1">
                                    Final pricing confirmed after inspection.
                                </p>
                            </div>

                            {/* CONTACT */}
                            <div className="space-y-3 text-sm text-stone-600">
                                <div className="flex items-center gap-3">
                                    <AiOutlinePhone className="text-blue-600" />
                                    (300) 365-7729
                                </div>
                                <div className="flex items-center gap-3">
                                    <AiOutlineMail className="text-blue-600" />
                                    support@homefixpro.com
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
import { useState, useRef } from "react";
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

/* ---------------- MOCK DATA (API READY) ---------------- */

const SERVICES = {
    "cleaning-service": {
        provider: "John Smith",
        price: 49,
        rating: 5,
        jobs: 84,
        areas: ["Central Zone", "South City", "West End", "North District"],
        slots: ["9:00 AM", "11:30 AM", "2:00 PM", "5:00 PM"],
        includes: [
            "Advanced Leak Detection",
            "Water Heater Setup & Repair",
            "Pipeline Restoration",
            "High-Pressure Drain Cleaning",
        ],
    },

    "plumbing-service": {
        provider: "Mike Johnson",
        price: 59,
        rating: 4.8,
        jobs: 112,
        areas: ["East Zone", "Downtown"],
        slots: ["10:00 AM", "1:00 PM", "4:00 PM"],
        includes: [
            "Pipe Fixing",
            "Drain Cleaning",
            "Bathroom Fittings",
        ],
    }
};

export default function ServiceDetail() {
    const { slug } = useParams();
    const service = SERVICES[slug];

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [loading, setLoading] = useState(false);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    /* ---------------- BOOKING HANDLER ---------------- */

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) {
            alert("Please select date and time");
            return;
        }

        setLoading(true);

        // Simulated API call
        setTimeout(() => {
            setLoading(false);
            alert(
                `Service booked successfully!\nDate: ${selectedDate}\nTime: ${selectedTime}`
            );
        }, 1500);
    };

    if (!service) {
        return <div className="p-10 text-center">Service not found</div>;
    }

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
                        <div className="lg:col-span-2 z-10   space-y-8">

                            {/* PROVIDER CARD */}
                            <div className="bg-white rounded-3xl shadow-xl p-7 flex gap-6">
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    className="w-28 h-28 rounded-2xl object-cover"
                                    alt="Provider"
                                />

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-semibold">
                                            {service.provider}
                                        </h2>
                                        <HiBadgeCheck className="text-blue-600 text-xl" />
                                    </div>

                                    <p className="text-stone-600 mt-2">
                                        Trusted residential plumbing specialist delivering
                                        precision repairs and transparent pricing.
                                    </p>

                                    <div className="flex items-center gap-2 mt-4 text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <AiFillStar key={i} className="text-yellow-400" />
                                        ))}
                                        <span className="font-medium">{service.rating}.0</span>
                                        <span className="text-stone-400">
                                            ({service.jobs} verified jobs)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SERVICES */}
                            <div className="bg-white rounded-3xl shadow-lg p-7">
                                <h3 className="text-xl font-semibold mb-5">
                                    What’s Included
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {service.includes.map(item => (
                                        <div
                                            key={item}
                                            className="bg-stone-50 rounded-xl px-4 py-3 text-sm font-medium shadow-sm"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* REVIEWS */}
                            <div className="bg-white rounded-3xl shadow-lg p-7 relative">
                                <h3 className="text-xl font-semibold mb-5">
                                    Client Experiences
                                </h3>

                                <Swiper
                                    modules={[Autoplay, Navigation]}
                                    autoplay={{ delay: 2500 }}
                                    navigation={{
                                        prevEl: prevRef.current,
                                        nextEl: nextRef.current,
                                    }}
                                    onBeforeInit={(swiper) => {
                                        swiper.params.navigation.prevEl = prevRef.current;
                                        swiper.params.navigation.nextEl = nextRef.current;
                                    }}
                                >
                                    {[
                                        "Prompt service and excellent work.",
                                        "Explained everything clearly.",
                                        "Professional and reliable service.",
                                    ].map((review, i) => (
                                        <SwiperSlide key={i}>
                                            <div className="bg-stone-50 rounded-2xl p-6">
                                                <div className="flex gap-1 mb-3">
                                                    {[...Array(5)].map((_, j) => (
                                                        <AiFillStar key={j} className="text-yellow-400" />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-stone-600">{review}</p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <button
                                    ref={prevRef}
                                    className="absolute -left-4 top-1/2 bg-white shadow rounded-full p-2"
                                >
                                    <FiChevronLeft />
                                </button>

                                <button
                                    ref={nextRef}
                                    className="absolute -right-4 top-1/2 bg-white shadow rounded-full p-2"
                                >
                                    <FiChevronRight />
                                </button>
                            </div>

                            {/* SERVICE AREA */}
                            <div className="bg-white rounded-3xl shadow-lg p-7">
                                <h3 className="text-xl font-semibold mb-4">
                                    Service Coverage
                                </h3>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {service.areas.map(area => (
                                        <div key={area} className="flex items-center gap-2">
                                            <FiMapPin className="text-blue-600" />
                                            {area}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BOOKING SIDEBAR */}
                        <div className="bg-white rounded-3xl shadow-xl max-h-fit     p-7 sticky top-24 space-y-7">

                            <button
                                onClick={handleBooking}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold disabled:opacity-60"
                            >
                                {loading ? "Booking..." : "Schedule Service"}
                            </button>

                            {/* DATE */}
                            <div>
                                <div className="flex items-center gap-2 font-semibold mb-3">
                                    <FiCalendar /> Choose a Date
                                </div>

                                <div className="grid grid-cols-7 text-xs gap-2 text-center">
                                    {[...Array(31)].map((_, i) => {
                                        const day = i + 1;
                                        const active = selectedDate === day;
                                        return (
                                            <span
                                                key={day}
                                                onClick={() => setSelectedDate(day)}
                                                className={`py-2 rounded-xl cursor-pointer
                                                    ${active ? "bg-blue-600 text-white" : "hover:bg-blue-100"}`}
                                            >
                                                {day}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* TIME */}
                            <div>
                                <h4 className="font-semibold mb-3">Available Slots</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {service.slots.map(time => {
                                        const active = selectedTime === time;
                                        return (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-2 rounded-xl text-sm
                                                    ${active ? "bg-blue-600 text-white" : "bg-stone-100 hover:bg-blue-100"}`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* PRICE */}
                            <div className="bg-blue-50 rounded-2xl p-5">
                                <h4 className="font-semibold">Initial Visit Fee</h4>
                                <p className="text-3xl font-bold text-blue-600">
                                    ${service.price}
                                </p>
                            </div>

                            {/* CONTACT */}
                            <div className="text-sm space-y-2">
                                <div className="flex items-center gap-2">
                                    <AiOutlinePhone className="text-blue-600" />
                                    +91 1234567890
                                </div>
                                <div className="flex items-center gap-2">
                                    <AiOutlineMail className="text-blue-600" />
                                    helpyzo@gmail.com
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
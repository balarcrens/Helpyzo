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
    FiChevronDown
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function ServiceDetail() {
    const { slug } = useParams();

    const [issue, setIssue] = useState("");
    const [issueLabel, setIssueLabel] = useState("");
    const [issueOpen, setIssueOpen] = useState(false);
    const [customIssue, setCustomIssue] = useState("");
    const [serviceType, setServiceType] = useState("normal");
    const [selectedDate, setSelectedDate] = useState(null);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

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

    return (
        <Layout>
            <Header />
            <div className="bg-gradient-to-b from-stone-100 via-stone-50 to-white min-h-screen">
                {/* HERO */}
                <div className="h-[440px] w-full relative">
                    <img
                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
                        className="h-full w-full object-cover"
                        alt="Service"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                </div>

                <div className="max-w-7xl mx-auto px-4 -mt-36 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-2 space-y-10 z-30">
                            {/* PROVIDER CARD */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-[28px] p-5 sm:p-8 flex flex-wrap gap-6 border border-stone-100"
                            >
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow"
                                    alt="Provider"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-semibold text-stone-900">John Smith</h2>
                                        <HiBadgeCheck className="text-blue-600 text-xl" />
                                    </div>
                                    <p className="text-stone-600 mt-2 leading-relaxed max-w-xl">
                                        Trusted residential plumbing specialist delivering precision repairs, modern solutions, and clear pricing — without surprises.
                                    </p>
                                    <div className="flex items-center gap-2 mt-4 text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <AiFillStar key={i} className="text-yellow-400" />
                                        ))}
                                        <span className="font-medium text-stone-900">5.0</span>
                                        <span className="text-stone-400">(84 verified jobs)</span>
                                    </div>
                                    <div className="flex gap-3 mt-4 text-xs">
                                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">Background Verified</span>
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">On-time Guarantee</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* SERVICES OFFERED */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[28px] shadow-sm p-5 sm:p-8 border border-stone-100"
                            >
                                <h3 className="text-xl font-semibold mb-6">What’s Included</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[
                                        "Advanced Leak Detection",
                                        "Water Heater Setup & Repair",
                                        "Pipeline Restoration",
                                        "High-Pressure Drain Cleaning",
                                    ].map(service => (
                                        <motion.div
                                            key={service}
                                            whileHover={{ scale: 1.03 }}
                                            className="flex items-center gap-3 bg-stone-50 hover:bg-stone-100 transition rounded-xl px-4 py-3 text-sm font-medium text-stone-700 shadow-sm"
                                        >
                                            <HiBadgeCheck className="text-blue-600" />
                                            {service}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* ABOUT */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[28px] shadow-sm p-5 sm:p-8 border border-stone-100"
                            >
                                <h3 className="text-xl font-semibold mb-3">About the Professional</h3>
                                <p className="text-stone-600 leading-relaxed">
                                    With over a decade of hands-on experience, John focuses on long-term fixes rather than temporary solutions. Every service is handled with care, cleanliness, and attention to detail — ensuring peace of mind for homeowners.
                                </p>
                            </motion.div>

                            {/* PORTFOLIO */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[28px] shadow-sm p-5 sm:p-8 border border-stone-100"
                            >
                                <h3 className="text-xl font-semibold mb-6">Recent Work</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.02 }}
                                            className="relative rounded-2xl overflow-hidden shadow-sm bg-white group"
                                        >
                                            <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">Before</div>
                                            <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white">After</div>
                                            <div className="grid grid-cols-2">
                                                <img
                                                    src="https://images.unsplash.com/photo-1600585152915-d208bec867a1"
                                                    className="h-44 w-full object-cover"
                                                    alt="Before"
                                                />
                                                <img
                                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                                                    className="h-44 w-full object-cover"
                                                    alt="After"
                                                />
                                            </div>
                                            <div className="absolute inset-y-0 left-1/2 w-px bg-white/70" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* CLIENT EXPERIENCES CAROUSEL */}
                            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-7 relative">
                                <h3 className="text-xl font-semibold mb-5">
                                    Client Experiences
                                </h3>

                                <Swiper modules={[Autoplay, Navigation]} autoplay={{ delay: 2000 }}
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

                            {/* SERVICE COVERAGE */}
                            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-7">
                                <h3 className="text-xl font-semibold mb-4">
                                    Service Coverage
                                </h3>

                                <div className="rounded-2xl overflow-hidden shadow mb-5">
                                    <iframe title="map" src="https://maps.google.com/maps?q=Surat&output=embed"
                                        className="w-full h-60" loading="lazy"
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

                            {/* WRITE REVIEW - DESKTOP ONLY */}
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
                        />
                    </div>

                    {/* REVIEWS ON MOBILE */}
                    <div className="lg:hidden">
                        <WriteReview />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const BookingSidebar = ({
    issue, issueLabel, setIssue, setIssueLabel,
    issueOpen, setIssueOpen,
    customIssue, setCustomIssue,
    serviceType, setServiceType,
    calendarDays, selectedDate, setSelectedDate
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[28px] p-4 sm:p-8 sticky top-24 space-y-6 border-t border-stone-100"
        >
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold tracking-wide hover:opacity-95 transition"
            >
                Schedule Service
            </motion.button>

            {/* ISSUE SELECT */}
            <div className="relative">
                <label className="text-sm font-semibold mb-2 block">What issue are you facing?</label>
                <button
                    onClick={() => setIssueOpen(!issueOpen)}
                    className="w-full flex items-center justify-between bg-stone-100 hover:bg-stone-200 transition rounded-2xl px-4 py-3 text-sm font-medium"
                >
                    {issueLabel || "Select a common issue"}
                    <FiChevronDown className={`transition ${issueOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                    {issueOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-20 mt-2 w-full rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2"
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
                                    className="px-4 py-2 text-sm text-gray-300 hover:text-[#9fe870] hover:bg-white/5 rounded-xl cursor-pointer"
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
                        className="mt-3 bg-stone-100 rounded-2xl p-4"
                    >
                        <textarea
                            value={customIssue}
                            onChange={e => setCustomIssue(e.target.value)}
                            placeholder="Describe your issue briefly"
                            rows={3}
                            className="w-full bg-transparent outline-none resize-none text-sm"
                        />
                    </motion.div>
                )}
            </div>

            {/* SERVICE TYPE TABS */}
            <div className="mt-4">
                <h4 className="font-semibold mb-3">Service Priority</h4>
                <div className="relative bg-stone-100 rounded-2xl p-1 grid grid-cols-3">
                    <motion.div
                        layout
                        className="absolute top-1 bottom-1 w-1/3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow"
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
                            className={`relative z-10 py-3 text-sm font-semibold rounded-xl transition ${serviceType === type.id ? "text-white" : "text-stone-600"}`}
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
                <h4 className="font-semibold mb-2 flex items-center gap-2"><FiClock /> Preferred Time</h4>
                <motion.div whileFocus={{ scale: 1.02 }} className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl p-4 shadow-inner">
                    <input type="time" className="w-full bg-transparent outline-none text-lg font-semibold" />
                </motion.div>
                <p className="text-xs text-stone-500 mt-1">Availability confirmed after provider approval</p>
            </div>

            {/* PRICE & CONTACT */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="bg-blue-50 rounded-2xl p-4 mt-4">
                    <h4 className="font-semibold mb-1">Initial Visit Fee</h4>
                    <p className="text-3xl font-bold text-blue-600">$49</p>
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 space-y-3 mt-4 text-sm">
                    <div className="flex items-center gap-3">
                        <AiOutlinePhone className="text-blue-600" /> +91 1234567890
                    </div>
                    <div className="flex items-center gap-3">
                        <AiOutlineMail className="text-blue-600" /> helpyzo@gmail.com
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Calendar = ({ calendarDays, selectedDate, setSelectedDate }) => {
    return (
        <div className="mt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><FiCalendar /> Select Date</h4>
            <div className="grid grid-cols-7 gap-2 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="text-xs font-semibold text-stone-500">{d}</div>
                ))}
                {calendarDays.map((d, idx) =>
                    d ? (
                        <motion.button
                            key={idx}
                            onClick={() => !d.isPast && setSelectedDate(d.fullDate)}
                            whileTap={{ scale: d.isPast ? 1 : 0.95 }}
                            whileHover={{ y: d.isPast ? 0 : -2 }}
                            className={`relative py-1.5 rounded-xl transition-all
                            ${d.isPast
                                    ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                                    : selectedDate === d.fullDate
                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
                                        : "bg-stone-100 text-stone-700 hover:bg-blue-600 hover:text-white"
                                }`}
                        >
                            <div className="text-xs font-semibold">{d.day}</div>
                            <div className="text-lg font-bold">{d.dayNum}</div>
                            {selectedDate === d.fullDate && (
                                <motion.div layoutId="dateGlow" className="absolute inset-0 rounded-xl ring-2 ring-blue-400/50" />
                            )}
                        </motion.button>
                    ) : <div key={idx} />
                )}
            </div>
        </div>
    )
};

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
            className="mt-16 bg-white rounded-[32px] p-4 sm:p-8 w-full mx-auto border border-stone-100"
        >
            <h3 className="text-2xl font-semibold mb-8 text-center text-stone-900">
                Share Your Experience
            </h3>

            <div className="flex justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => {
                    const value = i + 1;
                    return (
                        <motion.div
                            key={i}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setRating(value)}
                            onMouseEnter={() => setHover(value)}
                            onMouseLeave={() => setHover(null)}
                        >
                            <AiFillStar
                                className={`text-3xl cursor-pointer ${value <= (hover || rating) ? "text-yellow-400" : "text-stone-300"} transition-colors`}
                            />
                        </motion.div>
                    );
                })}
            </div>

            <textarea
                rows="4"
                placeholder="Write an honest review that helps others choose confidently..."
                className="w-full rounded-2xl border-stone-200 p-4 resize-none focus:ring-2 focus:ring-blue-300 transition mb-6 shadow-sm"
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {["before", "after"].map((type) => {
                    const img = type === "before" ? beforeImage : afterImage;
                    return (
                        <label
                            key={type}
                            className="flex-1 flex flex-col items-center justify-center p-2 border-2 border-dashed border-stone-300 rounded-2xl cursor-pointer hover:border-blue-400 transition relative overflow-hidden h-40"
                        >
                            {img ? <img src={img} alt={type} className="h-full w-full object-cover rounded-2xl" /> :
                                <>
                                    <AiOutlineUpload className="text-3xl text-stone-400 mb-2" />
                                    <span className="text-stone-500 text-sm text-center">Upload {type.charAt(0).toUpperCase() + type.slice(1)} Image</span>
                                </>}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, type)} />
                        </label>
                    )
                })}
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:opacity-95 transition"
            >
                Submit Review
            </motion.button>
        </motion.div>
    );
};
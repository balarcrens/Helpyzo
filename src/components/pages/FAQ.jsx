/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["General", "Booking", "Pricing", "Safety"];

const FAQS = [
    // GENERAL
    {
        category: "General",
        q: "What services do you provide?",
        a: "We offer plumbing, electrical, cleaning, carpentry, painting, appliance repair, and many other home services."
    },
    {
        category: "General",
        q: "Where are your services available?",
        a: "Our services are currently available in major cities and we are expanding rapidly."
    },
    {
        category: "General",
        q: "Do I need to create an account?",
        a: "Yes, creating an account helps you manage bookings, payments, and service history easily."
    },

    // BOOKING
    {
        category: "Booking",
        q: "How do I book a service?",
        a: "Choose a service, select your preferred date and time, and confirm the booking in just a few steps."
    },
    {
        category: "Booking",
        q: "Can I reschedule or cancel my booking?",
        a: "Yes, you can reschedule or cancel from your dashboard before the service begins."
    },
    {
        category: "Booking",
        q: "How long does it take to assign a professional?",
        a: "Most bookings are assigned within minutes depending on availability in your area."
    },

    // PRICING
    {
        category: "Pricing",
        q: "Are prices transparent?",
        a: "Yes, you see the full price before booking. There are no hidden charges."
    },
    {
        category: "Pricing",
        q: "Do you offer refunds?",
        a: "Refunds are available if a service is not delivered as promised, based on our refund policy."
    },
    {
        category: "Pricing",
        q: "Are there any extra charges?",
        a: "Extra charges apply only if additional work is requested and approved by you."
    },

    // SAFETY
    {
        category: "Safety",
        q: "Are professionals verified?",
        a: "All professionals go through background checks, ID verification, and skill assessments."
    },
    {
        category: "Safety",
        q: "Is my payment secure?",
        a: "Yes, all payments are processed through secure and encrypted payment gateways."
    },
    {
        category: "Safety",
        q: "What if I am not satisfied with the service?",
        a: "You can raise a complaint and our support team will resolve it quickly."
    }
];

const FaqPage = () => {
    const [activeCategory, setActiveCategory] = useState("General");

    return (
        <Layout>
            <FaqHero />
            <FaqContent activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            <FaqCTA />
        </Layout>
    );
};

export default FaqPage;

const FaqHero = () => (
    <section className="relative min-h-[60vh] bg-stone-900 overflow-hidden">
        <img
            src="https://images.unsplash.com/photo-1587560699334-cc4ff634909a?q=80&w=1600&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover scale-110"
            alt="FAQ"
        />
        <div className="absolute inset-0 bg-black/70" />
        <Header />

        <div className="relative z-10 min-h-[60vh] flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-3xl"
            >
                <span className="uppercase tracking-widest text-[#9fe870] text-sm font-semibold">
                    Help Center
                </span>

                <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-white">
                    Frequently Asked
                    <span className="block text-[#9fe870]">Questions</span>
                </h1>

                <p className="mt-6 text-gray-300 text-lg">
                    Everything you need to know before booking a service.
                </p>
            </motion.div>
        </div>
    </section>
);

const FaqContent = ({ activeCategory, setActiveCategory }) => {
    const [search, setSearch] = useState("");

    const filteredFaqs = FAQS.filter(f =>
        f.category === activeCategory &&
        (f.q.toLowerCase().includes(search.toLowerCase()) ||
            f.a.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <section className="py-28 bg-gradient-to-b from-white to-stone-50">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <input
                        type="text"
                        placeholder="Search your question..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-stone-200 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]/50"
                    />
                </motion.div>

                <div className="relative flex justify-center gap-2 bg-stone-100 rounded-full p-2 mb-14">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="relative px-6 py-2 font-semibold text-sm z-10"
                        >
                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-[#9fe870] rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className={`relative ${activeCategory === cat ? "text-stone-900" : "text-stone-600"}`}>
                                {cat}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {filteredFaqs.length ? (
                        filteredFaqs.map((item, i) => (
                            <FaqItem key={i} {...item} />
                        ))
                    ) : (
                        <p className="text-center text-stone-500 text-lg">
                            No questions found for "{search}"
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-stone-100 shadow-md hover:shadow-xl transition overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <div className="flex items-center gap-4">
                    <FiHelpCircle className="text-[#9fe870] text-xl" />
                    <h3 className="font-semibold text-stone-900 text-lg">
                        {q}
                    </h3>
                </div>

                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                    <FiChevronDown className="text-xl text-stone-500" />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="px-6 pb-6"
                    >
                        <p className="text-stone-600 leading-relaxed">
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FaqCTA = () => {
    const navigate = useNavigate();
    const [isHovering, setIsHovering] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 120, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 120, damping: 30 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <section
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="py-32 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-center relative overflow-hidden"
        >
            <motion.div
                className="pointer-events-none absolute w-64 h-64 rounded-full bg-[#9fe870]/30 blur-3xl"
                style={{
                    left: smoothX,
                    top: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isHovering ? 1 : 0,
                }}
            />

            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#9fe870]/10 blur-3xl rounded-full animate-pulse-slow" />
            <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-[#9fe870]/5 blur-3xl rounded-full animate-pulse-slow" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 max-w-3xl mx-auto px-6 space-y-6"
            >
                <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                    Still have questions?
                    <span className="block text-[#9fe870]">
                        We’re here to help
                    </span>
                </h2>

                <p className="text-gray-300 text-lg">
                    Talk to our support team anytime — fast, friendly, and reliable.
                </p>

                <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 px-12 py-4 bg-[#9fe870] text-stone-900 font-bold rounded-full shadow-lg hover:shadow-xl transition"
                    onClick={() => navigate("/contact")}
                >
                    Contact Support
                </motion.button>
            </motion.div>
        </section>
    );
};
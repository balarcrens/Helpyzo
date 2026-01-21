/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { FiCheckCircle } from "react-icons/fi";
import { FaUsers, FaTools, FaSmile } from "react-icons/fa";
import { motion, animate, useInView, useMotionValue, useSpring } from "framer-motion";

const STATS = [
    { icon: <FaUsers />, value: 10000, suffix: "+", label: "Happy Customers" },
    { icon: <FaTools />, value: 500, suffix: "+", label: "Verified Experts" },
    { icon: <FaSmile />, value: 98, suffix: "%", label: "Satisfaction Rate" },
];

const VALUES = [
    "Verified & Skilled Professionals",
    "Transparent Pricing",
    "On-time Service Guarantee",
    "Customer-First Approach",
];

const SERVICES = [
    "Plumbing", "Electrical", "Cleaning",
    "Carpentry", "Painting", "Repair",
];

const AboutUs = () => {
    return (
        <Layout>
            <AboutHero />
            <WhoWeAre />
            <WhyChooseUs />
            <AboutStatsShowcase />
            <OurValues />
            <AboutCTA />
        </Layout>
    );
};

export default AboutUs;

/* ---------- Hero Section ---------- */
const AboutHero = () => (
    <section className="relative min-h-[80vh] overflow-hidden bg-stone-900">
        {/* Background Image */}
        <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
            alt="Home services"
            className="absolute inset-0 h-full w-full object-cover scale-110"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

        <Header />

        {/* Hero Content */}
        <div className="relative z-10 flex min-h-[80vh] items-center max-w-7xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-3xl space-y-6"
            >
                <span className="text-sm tracking-widest text-[#9fe870] font-semibold uppercase">
                    About Us
                </span>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
                    Building trust through
                    <span className="block text-gradient bg-gradient-to-r from-[#9fe870] via-[#70ffac] to-[#9fe870] bg-clip-text text-transparent">
                        quality home services
                    </span>
                </h1>

                <p className="text-lg text-gray-200 max-w-xl">
                    We connect homeowners with skilled, verified professionals—
                    making home care simple, reliable, and stress-free.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-12 py-4 bg-[#9fe870] font-bold text-black rounded-full shadow-lg hover:shadow-xl transition"
                >
                    Get Started
                </motion.button>
            </motion.div>
        </div>
    </section>
);

/* ---------- Who We Are ---------- */
const WhoWeAre = () => (
    <section className="py-28 bg-gradient-to-b from-stone-50 to-white relative overflow-hidden">
        {/* Optional floating shapes for depth */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-[#9fe870]/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -right-10 w-80 h-80 bg-[#9fe870]/5 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* Image */}
            <motion.img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
                alt="Our team"
                className="rounded-[1.5rem] lg:rounded-tl-[3rem] lg:rounded-br-[3rem] shadow-2xl hover:scale-105 hover:rotate-1 transition-transform duration-500 object-cover w-full"
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            />

            {/* Text */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
            >
                <span className="text-xs font-bold tracking-widest text-[#9fe870] uppercase">
                    Who We Are
                </span>

                <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 leading-snug">
                    A smarter way to manage your home
                </h2>

                <p className="text-stone-700 leading-relaxed text-lg md:text-xl">
                    Our platform bridges the gap between homeowners and trusted
                    service experts—ensuring quality, safety, and transparency
                    in every job.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-8 py-3 bg-[#9fe870] text-stone-900 font-bold rounded-full shadow-lg hover:shadow-2xl transition"
                >
                    Learn More
                </motion.button>
            </motion.div>
        </div>
    </section>
);

/* ---------- Animated Counter ---------- */
const AnimatedCounter = ({ value, suffix = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        const controls = animate(0, value, {
            duration: 2,
            ease: "easeOut",
            onUpdate(latest) {
                setCount(Math.floor(latest));
            },
        });
        return () => controls.stop();
    }, [isInView, value]);

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="block text-3xl font-mono font-bold tracking-tight text-stone-900"
        >
            {count.toLocaleString()}{suffix}
        </motion.span>
    );
};

/* ---------- Why Choose Us ---------- */
const WhyChooseUs = () => (
    <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-stone-900 mb-16">
                Why homeowners trust us
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
                {STATS.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="bg-white rounded-3xl p-10 text-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#9fe870]/20 flex items-center justify-center text-3xl text-[#9fe870]">
                            {item.icon}
                        </div>

                        <AnimatedCounter value={item.value} suffix={item.suffix} />

                        <p className="mt-2 text-stone-500 font-medium">{item.label}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ---------- Our Values ---------- */
const OurValues = () => (
    <section className="py-28 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-stone-900 mb-14 text-center">
                Our core values
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                {VALUES.map((value, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="flex items-center gap-5 bg-white/80 p-6 rounded-2xl border border-stone-100 shadow-md hover:shadow-xl hover:border-[#9fe870]/40 transition transform hover:-translate-y-1"
                    >
                        <FiCheckCircle className="text-[#9fe870] text-2xl" />
                        <span className="text-stone-700 font-semibold text-lg">
                            {value}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ---------- Stats Showcase ---------- */
const AboutStatsShowcase = () => (
    <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
            <StatCard title="260k+" subtitle="Active Users" desc="Homeowners trust our services every month." />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#f8f8f8] rounded-3xl p-10 shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
            >
                <h3 className="text-2xl font-bold text-stone-900 mb-6">Popular Services</h3>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    {SERVICES.map((item, i) => (
                        <span key={i} className="rounded-full px-4 py-2 bg-stone-100 text-center font-medium text-stone-700 hover:bg-[#9fe870] hover:text-black transition transform hover:scale-105">
                            {item}
                        </span>
                    ))}
                </div>
            </motion.div>

            <StatCard title="4.9 ★" subtitle="Average Rating" desc="From 100k+ verified customers" />
        </div>
    </section>
);

/* ---------- Call to Action ---------- */
const AboutCTA = () => {
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth movement
    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 25 });
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 25 });

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

            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#9fe870]/10 blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-[#9fe870]/5 blur-3xl animate-pulse-slow" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-3xl mx-auto px-6 space-y-6"
            >
                <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                    Ready to experience
                    <span className="block text-[#9fe870]">
                        stress-free home services?
                    </span>
                </h2>

                <p className="text-gray-300 text-lg">
                    Book trusted professionals in minutes.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 px-12 py-4 bg-[#9fe870] text-stone-900 font-bold rounded-full shadow-lg hover:shadow-xl transition"
                >
                    Get Started
                </motion.button>
            </motion.div>
        </section>
    );
};

/* ---------- Stat Card ---------- */
const StatCard = ({ title, subtitle, desc }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
    >
        <h3 className="text-5xl font-extrabold text-[#9fe870]">{title}</h3>
        <p className="mt-2 font-semibold text-stone-700">{subtitle}</p>
        <p className="mt-4 text-stone-500">{desc}</p>
    </motion.div>
);
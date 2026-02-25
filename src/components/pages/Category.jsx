/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { BsArrowRight } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
import { FiRefreshCw, FiGrid, FiSearch } from "react-icons/fi";
import { categoryAPI } from "../../services/api";

export default function Category() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getAllCategories();
            setCategories(res.data.categories || []);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            {/* ================= HERO ================= */}
            <section className="relative min-h-[45vh] bg-stone-900 overflow-hidden">
                <Header />

                <div className="absolute inset-0">
                    <img
                        src="/hero.png"
                        className="w-full h-full object-cover opacity-30"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
                    <span className="text-sm tracking-widest text-[#9fe870] uppercase font-semibold">
                        Our Categories
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
                        Professional Home Services
                    </h1>

                    <p className="text-gray-300 mt-6 max-w-xl text-lg">
                        Choose from expertly managed service categories for your home and business.
                    </p>
                </div>
            </section>

            {/* ================= CATEGORY GRID ================= */}
            <section className="bg-stone-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                className="flex flex-col items-center justify-center py-32"
                            >
                                <div className="relative mb-8">
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                                        className="w-28 h-28 rounded-full bg-[#9fe870]/10 flex items-center justify-center"
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, -10, 10, 0] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                            className="w-16 h-16 rounded-full bg-[#9fe870]/20 flex items-center justify-center text-4xl"
                                        >
                                            <FiSearch />
                                        </motion.div>
                                    </motion.div>
                                    {/* Orbiting dot */}
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                        style={{ transformOrigin: "56px 56px" }}
                                        className="absolute top-0 left-0 w-28 h-28 flex items-start justify-center"
                                    >
                                        <span className="w-3 h-3 rounded-full bg-[#9fe870] mt-1 shadow-[0_0_8px_#9fe870]" />
                                    </motion.span>
                                </div>

                                {/* Label */}
                                <motion.p
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                    className="text-stone-500 font-medium tracking-wide text-base"
                                >
                                    Discovering{" "}
                                    <span className="text-[#9fe870] font-semibold">service categories</span>
                                    {" "}for you
                                </motion.p>

                                {/* Animated dots */}
                                <div className="flex gap-1.5 mt-4">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: "easeInOut" }}
                                            className="w-1.5 h-1.5 rounded-full bg-[#9fe870]"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* CATEGORIES LIST */}
                        {!loading && categories.length > 0 && (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
                            >
                                {categories.map((category) => (
                                    <motion.div
                                        key={category._id}
                                        whileHover={{ y: -8 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        onClick={() =>
                                            navigate(`/category/${category.name.toLowerCase()}`)
                                        }
                                        className="group cursor-pointer bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all"
                                    >
                                        {/* Image */}
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-[#9fe870]/20 flex items-center justify-center text-emerald-700">
                                                    <FaTools size={22} />
                                                </div>

                                                <h3 className="text-xl font-semibold text-stone-900">
                                                    {category.name}
                                                </h3>
                                            </div>

                                            <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                                                {category.description}
                                            </p>

                                            {/* CTA */}
                                            <div className="pt-4 flex items-center justify-between">
                                                <span className="text-sm font-medium text-emerald-700">
                                                    Explore services
                                                </span>

                                                <BsArrowRight className="text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* ────── EMPTY STATE ────── */}
                        {!loading && categories.length === 0 && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="max-w-xl mx-auto py-16 flex flex-col items-center text-center"
                            >
                                {/* Animated icon ring */}
                                <div className="relative mb-8">
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                                        className="w-28 h-28 rounded-full bg-[#9fe870]/10 flex items-center justify-center"
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, -10, 10, 0] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                            className="w-16 h-16 rounded-full bg-[#9fe870]/20 flex items-center justify-center"
                                        >
                                            <FiGrid className="text-[#9fe870]" size={30} />
                                        </motion.div>
                                    </motion.div>

                                    {/* Orbiting glowing dot */}
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                        style={{ transformOrigin: "56px 56px" }}
                                        className="absolute top-0 left-0 w-28 h-28 flex items-start justify-center"
                                    >
                                        <span className="w-3 h-3 rounded-full bg-[#9fe870] mt-1 shadow-[0_0_8px_#9fe870]" />
                                    </motion.span>
                                </div>

                                {/* Headline */}
                                <h3 className="text-3xl font-bold text-stone-800 mb-3">
                                    No{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9fe870] to-emerald-500">
                                        Categories
                                    </span>{" "}
                                    Available
                                </h3>
                                <p className="text-stone-500 text-base mb-8 max-w-sm leading-relaxed">
                                    It looks like no service categories have been set up yet. Please check back soon or contact support.
                                </p>

                                {/* Info card */}
                                <div className="w-full bg-white border border-stone-100 rounded-2xl p-5 mb-8 text-left shadow-sm space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">What you can do</p>
                                    {[
                                        { icon: "🔄", text: "Refresh the page to try again" },
                                        { icon: "🏠", text: "Go back to the home page" },
                                        { icon: "📞", text: "Contact our support team for help" },
                                    ].map((tip, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.12 }}
                                            className="flex items-center gap-3 text-sm text-stone-600"
                                        >
                                            <span className="text-lg">{tip.icon}</span>
                                            {tip.text}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => fetchCategories()}
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 text-white font-semibold shadow-lg hover:bg-stone-800 transition-colors"
                                    >
                                        <FiRefreshCw size={15} /> Retry
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate("/")}
                                        className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#9fe870] text-stone-800 font-semibold hover:bg-[#9fe870]/10 transition-colors"
                                    >
                                        Go to Home
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </section>
        </Layout>
    );
}

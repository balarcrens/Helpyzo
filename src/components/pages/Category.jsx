/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { BsArrowRight } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
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
                    {loading ? (
                        <div className="text-center text-stone-500 text-lg">
                            Loading categories...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {categories.map((category) => (
                                <motion.div
                                    key={category._id}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
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
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

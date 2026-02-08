/* eslint-disable no-unused-vars */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { BsArrowRight } from "react-icons/bs";
import {
    FaSink,
    FaBolt,
    FaFire,
    FaSnowflake,
    FaLightbulb,
    FaTools,
    FaClock,
    FaRupeeSign,
} from "react-icons/fa";
import { SERVICES_DATA } from "../data/services.data";

const CATEGORY_ICONS = {
    "plumbing-sanitary": FaSink,
    "electrical-repair": FaBolt,
    "gas-burner-repair": FaFire,
    "ac-cleaning": FaSnowflake,
    "led-lighting-installation": FaLightbulb,
};

export default function Category() {
    const navigate = useNavigate();

    const grouped = useMemo(() => {
        return SERVICES_DATA.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
        }, {});
    }, []);

    return (
        <Layout>
            {/* ================= HERO ================= */}
            <section className="relative min-h-[45vh] bg-stone-900 overflow-hidden">
                <Header />

                <div className="absolute inset-0">
                    <img
                        src="/hero.png"
                        className="w-full h-full object-cover opacity-25"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
                    <span className="text-sm tracking-widest text-[#9fe870] uppercase font-medium">
                        Our Services
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
                        Professional Home Services
                        <br /> You Can <span className="text-[#9fe870]">Trust</span>
                    </h1>

                    <p className="text-gray-300 mt-6 max-w-xl text-lg">
                        Choose from verified experts for repairs, installations, and maintenance.
                    </p>
                </div>
            </section>

            {/* ================= CATEGORIES ================= */}
            <section className="bg-stone-50 py-24">
                <div className="max-w-7xl mx-auto px-6 space-y-28">
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category} className="space-y-10">
                            {/* Category Heading */}
                            <div>
                                <h2 className="text-3xl font-semibold text-stone-900">
                                    {category}
                                </h2>
                                <p className="text-sm text-stone-500 mt-1">
                                    Trusted professionals • Transparent pricing • Fast service
                                </p>
                            </div>

                            {/* Services Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {items.map((service) => {
                                    const Icon =
                                        CATEGORY_ICONS[service.slug] || FaTools;

                                    const serviceTitles = service.services
                                        ?.slice(0, 3)
                                        .map((s) => s.title)
                                        .join(" • ");

                                    return (
                                        <motion.div
                                            key={service.slug}
                                            whileHover={{ y: -6 }}
                                            transition={{ duration: 0.25 }}
                                            onClick={() =>
                                                navigate(`/category/${service.slug}`)
                                            }
                                            className="group cursor-pointer bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-xl transition-all"
                                        >
                                            {/* Top */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 group-hover:bg-[#9fe870] transition">
                                                    <Icon size={26} />
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-stone-900">
                                                        {service.name}
                                                    </h3>

                                                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                                                        {serviceTitles}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Meta Info */}
                                            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-stone-600">
                                                    <FaClock />
                                                    <span>{service.avgTime}</span>
                                                </div>

                                                <div className="flex items-center text-stone-600">
                                                    <FaRupeeSign />
                                                    <span>{service.startingFrom}</span>
                                                </div>

                                                <div className="text-emerald-600 font-medium">
                                                    {service.services.length}+ services
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="mt-6 flex items-center justify-between">
                                                <span className="text-sm font-medium text-stone-600">
                                                    View services
                                                </span>
                                                <BsArrowRight className="text-stone-400 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
}
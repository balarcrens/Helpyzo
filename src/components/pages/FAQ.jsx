import { useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const faqData = [
    {
        category: "Booking",
        questions: [
            {
                q: "How do I book a service?",
                a: "Choose a service, select your preferred date & time, describe your issue, and confirm the booking. A professional will be assigned shortly."
            },
            {
                q: "Can I reschedule my booking?",
                a: "Yes, bookings can be rescheduled from your dashboard up to 2 hours before the scheduled time."
            }
        ]
    },
    {
        category: "Pricing",
        questions: [
            {
                q: "Are there any hidden charges?",
                a: "No. All prices are transparent. Any additional cost will be discussed before work begins."
            },
            {
                q: "How is the service fee calculated?",
                a: "The initial visit fee covers inspection. Final pricing depends on service complexity and materials used."
            }
        ]
    },
    {
        category: "Professionals",
        questions: [
            {
                q: "Are professionals verified?",
                a: "Yes. Every professional undergoes ID verification, background checks, and skill assessment."
            },
            {
                q: "Can I choose my service provider?",
                a: "Currently, we auto-assign the best available professional based on your location and issue."
            }
        ]
    },
    {
        category: "Support",
        questions: [
            {
                q: "What if I'm not satisfied with the service?",
                a: "Your satisfaction is our priority. Contact support within 24 hours and we'll resolve it immediately."
            },
            {
                q: "How can I contact customer support?",
                a: "You can reach us via email, phone, or live chat from the Help section."
            }
        ]
    }
];

export default function FAQ() {
    const [isHovering, setIsHovering] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 120, damping: 25 });
    const smoothY = useSpring(mouseY, { stiffness: 120, damping: 25 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const [activeIndex, setActiveIndex] = useState(null);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", ...faqData.map(f => f.category)];

    const filteredFaqs = faqData
        .filter(f => activeCategory === "All" || f.category === activeCategory)
        .map(f => ({
            ...f,
            questions: f.questions.filter(q =>
                q.q.toLowerCase().includes(search.toLowerCase())
            )
        }))
        .filter(f => f.questions.length > 0);

    return (
        <Layout>
            <Header />

            <div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                    setIsHovering(false);
                    setHoveredCard(null);
                }}
                className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 px-4 pt-32 pb-24 relative overflow-hidden"
            >
                {/* CURSOR FOLLOW GLOW */}
                <motion.div
                    className="pointer-events-none absolute w-40 h-40 rounded-full bg-[#9fe870]/25 blur-3xl"
                    style={{
                        left: smoothX,
                        top: smoothY,
                        translateX: "-50%",
                        translateY: "-50%",
                        opacity: isHovering && hoveredCard === null ? 1 : 0,
                    }}
                />

                <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#9fe870]/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-40 -right-24 w-[30rem] h-[30rem] bg-[#9fe870]/5 blur-3xl rounded-full" />

                <div className="relative z-10 max-w-4xl mx-auto">

                    {/* HEADER */}
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-widest text-[#9fe870] font-bold uppercase">
                            Help Center
                        </span>
                        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-white">
                            Frequently Asked Questions
                        </h1>
                        <p className="mt-4 text-gray-300 max-w-xl mx-auto">
                            Everything you need to know before booking a service.
                        </p>
                    </div>

                    {/* SEARCH */}
                    <div className="relative mb-12">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search a question..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#9fe870] outline-none transition"
                        />
                    </div>

                    {/* FAQ LIST */}
                    <div className="space-y-10">
                        {filteredFaqs.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                                <h3 className="text-lg font-semibold text-[#9fe870] mb-6">
                                    {section.category}
                                </h3>

                                <div className="space-y-4">
                                    {section.questions.map((item, i) => {
                                        const index = `${sectionIndex}-${i}`;
                                        const isOpen = activeIndex === index;
                                        const isHovered = hoveredCard === index;

                                        return (
                                            <motion.div
                                                key={index}
                                                layout
                                                onMouseEnter={() => setHoveredCard(index)}
                                                onMouseLeave={() => setHoveredCard(null)}
                                                transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
                                                className={`rounded-2xl overflow-hidden border backdrop-blur transition-all
                          ${isOpen
                                                        ? "bg-white/15 border-[#9fe870]/50 shadow-xl"
                                                        : isHovered
                                                            ? "bg-white/10 border-[#9fe870] shadow-lg"
                                                            : "bg-white/10 border-white/10 shadow-md"
                                                    }`}
                                            >
                                                <button
                                                    onClick={() =>
                                                        setActiveIndex(isOpen ? null : index)
                                                    }
                                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/10 transition"
                                                >
                                                    <span className="font-medium text-white">
                                                        {item.q}
                                                    </span>

                                                    <motion.span
                                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="text-[#9fe870]"
                                                    >
                                                        <FiChevronDown />
                                                    </motion.span>
                                                </button>

                                                <AnimatePresence mode="wait">
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -6 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            className="px-6 pb-4 pt-4 text-gray-300 text-sm leading-relaxed"
                                                        >
                                                            {item.a}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </Layout>
    );
}

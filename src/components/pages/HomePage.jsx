/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react';
import { FiMapPin, FiSearch, FiPhoneCall, FiThumbsUp, FiArrowUpRight } from 'react-icons/fi';
import Header from '../Layout/Header.jsx';
import Layout from '../Layout/Layout.jsx';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaThermometerHalf, FaTools } from 'react-icons/fa'
import { FaDroplet, FaLightbulb } from 'react-icons/fa6';
import { HiArrowLongRight } from 'react-icons/hi2';
import { AiFillStar } from 'react-icons/ai';
import { HiBadgeCheck } from "react-icons/hi";
import { BsArrowRightCircleFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    return (
        <>
            <Layout>
                <HeroSection />
                <HowitWorks />
                <CheckoutTop />
                <ServiceGallery />
                <ServicesList />
                <PopularProjects />
            </Layout>
        </>
    )
}

export default HomePage


const HeroSection = () => {
    // Parallax Effect Logic
    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 800], [0, 120])
    const textOpacity = useTransform(scrollY, [0, 250], [1, 0])
    const textY = useTransform(scrollY, [0, 250], [0, -40])

    return (
        <div className="relative w-full min-h-screen bg-stone-900 font-sans overflow-hidden selection:bg-[#9fe870] selection:text-black">
            <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 overflow-hidden">
                <img src="/hero.png" alt="Home Service Expert" className=" w-full h-full object-cover scale-[1.12] will-change-transform"
                />

                <div className=" absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent lg:from-black/70 lg:via-black/20 lg:to-transparent"
                />
            </motion.div>

            <Header />
            <main className="relative z-10 flex flex-col justify-center min-h-screen px-6 lg:px-12">
                <motion.div style={{ opacity: textOpacity, y: textY }} className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center pt-20" >
                    <div className="flex flex-col space-y-10">
                        {/* Staggered Text Entry */}
                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
                            >
                                Find Home Service <br className="hidden md:block" />
                                <span className="text-[#9fe870]">Experts Near You</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="text-lg md:text-xl text-gray-200/80 font-normal max-w-xl leading-relaxed"
                            >
                                Browse verified professionals, compare services, and hire with confidence.
                                Every expert is certified, vetted, and ready to help.
                            </motion.p>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }} className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 md:p-2 flex flex-col md:flex-row gap-3 md:gap-0 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all focus-within:border-[#9fe870]/50"
                        >
                            <div className="flex items-center px-2 h-10 rounded-2xl md:rounded-none md:border-r border-white/10 w-full">
                                <input
                                    type="text"
                                    placeholder="What service do you need?"
                                    className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-base"
                                />
                            </div>

                            <div className="flex items-center px-2 h-10 rounded-2xl md:rounded-none w-full">
                                <FiMapPin className="text-gray-400 mr-3 shrink-0" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter ZIP code"
                                    className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-base"
                                />
                            </div>

                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="bg-[#9fe870] px-2 text-stone-900 h-10 w-full md:w-14 rounded-2xl md:rounded-full flex items-center justify-center shadow-lg shadow-[#9fe870]/30"
                            >
                                <FiSearch size={22} strokeWidth={3} />
                            </motion.button>

                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap items-center gap-8 pt-4"
                        >
                            {['Verified Pros', 'Free Quotes'].map((text, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                                        className="w-2.5 h-2.5 rounded-full bg-[#9fe870]"
                                    />
                                    <span className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="hidden lg:block h-full"></div>
                </motion.div>
            </main>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
            >
                <span className="text-[10px] text-white uppercase tracking-[0.3em]">Scroll</span>
                <div className="w-px h-12 bg-linear-to-b from-[#9fe870] to-transparent"></div>
            </motion.div>
        </div>
    );
}


const HowitWorks = () => {
    const steps = [
        {
            id: "01",
            title: "Search for Services",
            description:
                "Enter your location and select the service you need, from plumbing to complete home maintenance.",
            icon: <FiSearch size={20} />,
        },
        {
            id: "02",
            title: "Browse Local Experts",
            description:
                "Compare verified professionals, view profiles, ratings, and real customer reviews.",
            icon: <FiMapPin size={20} />,
        },
        {
            id: "03",
            title: "Book Your Service",
            description:
                "Choose a time that works for you and confirm your booking in just a few clicks.",
            icon: <FiPhoneCall size={20} />,
        },
        {
            id: "04",
            title: "Relax & Get It Done",
            description:
                "A trusted expert arrives on time and completes the job efficiently.",
            icon: <FiThumbsUp size={20} />,
        },
    ]

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 32 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    }

    return (
        <section className="relative w-full bg-linear-to-b from-white to-stone-50 py-20 selection:bg-[#9fe870]">
            <div className="max-w-7xl mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
                >
                    <div className="space-y-3">
                        <span className="text-xs font-semibold tracking-widest text-[#7ccf52]">
                            HOW IT WORKS
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
                            Simple steps.{" "}
                            <span className="text-stone-500">Powerful results.</span>
                        </h2>
                    </div>

                    <p className="max-w-sm text-base leading-relaxed text-stone-600">
                        A fast, reliable way to connect with verified professionals and get work done.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-stone-200" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative bg-white rounded-2xl p-6 border border-stone-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <span className="absolute -top-4 right-5 text-5xl font-black text-stone-300 group-hover:text-[#9fe870]/70 transition-colors duration-300">
                                {step.id}
                            </span>

                            <div className="relative w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 mb-8 group-hover:bg-[#9fe870] group-hover:text-stone-900 transition-all duration-300">
                                {step.icon}
                                <div className="absolute inset-0 rounded-xl bg-[#9fe870] blur-lg opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold tracking-tight text-stone-900">
                                    {step.title}
                                </h3>

                                <div className="h-0.5 w-8 bg-stone-300 group-hover:w-12 group-hover:bg-[#9fe870] transition-all duration-300" />

                                <p className="text-sm leading-6 text-stone-600">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}


const CheckoutTop = () => {
    const [hoveredId, setHoveredId] = useState(null);
    const services = [
        {
            id: 1,
            title: "Shelving",
            description: "Transform your home with custom shelving solutions tailored for you!",
            icon: <FaTools />,
            color: "bg-[#420a1c]", // Deep Wine/Burgundy
            img: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            title: "Thermostat",
            description: "Stay smart & save energy with expert smart thermostat installation!",
            icon: <FaThermometerHalf />,
            color: "bg-[#f1abb9]", // Soft Pink
            img: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 3,
            title: "Leak Detection",
            description: "Promptly address and fix leaks with expert detection and repair services!",
            icon: <FaDroplet />,
            color: "bg-[#3e4fb2]", // Royal Blue
            img: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 4,
            title: "Lighting Retrofit",
            description: "Upgrade to energy efficiency with our LED lighting retrofit services!",
            icon: <FaLightbulb />,
            color: "bg-[#96e4bc]", // Mint Green
            img: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

    return (
        <section className="relative font-sans max-w-full mx-auto px-6 py-24 bg-white">
            {/* Header Section */}
            <div className="grid max-w-7xl mx-auto lg:grid-cols-2 gap-12 items-start mb-10">
                <div className="space-y-8">
                    <div className="flex gap-2">
                        {['Popular', 'Now'].map(tag => (
                            <span key={tag} className="px-5 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-800 tracking-tight">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05] text-gray-900">
                        Check out our top<br />
                        <span className="text-gray-900/40">services for you.</span>
                    </h2>
                </div>

                <div className="lg:pt-12">
                    <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-md">
                        Discover top on-demand services: custom shelving, leak repair, LED retrofits, and smart thermostat installation.
                    </p>
                    <button className="group relative overflow-hidden bg-black text-white px-10 py-4 font-bold flex items-center gap-3 transition-all hover:pr-12">
                        <span className="relative z-10">Explore Now</span>
                        <HiArrowLongRight className="relative z-10 text-2xl group-hover:translate-x-2 transition-transform duration-200" />
                        <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Interactive Accordion Grid */}
            <div className="flex flex-col lg:flex-row gap-4 h-200 sm:h-150 w-full">
                {services.map((service) => (
                    <div key={service.id} onMouseEnter={() => setHoveredId(service.id)} onMouseLeave={() => setHoveredId(null)}
                        className={`relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] min-w-[220px] ${hoveredId === service.id ? 'flex-[3.5]' : 'flex-[1.4]'} `} >
                        {/* Base Image with Parallax-lite effect */}
                        <img src={service.img} alt={service.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ${hoveredId === service.id ? 'scale-110' : 'scale-100'} `}
                        />

                        {/* Solid Color Overlay (Original Style) */}
                        <div className={`absolute inset-0 transition-opacity duration-500 ${service.color}  ${hoveredId === service.id ? 'opacity-85' : 'opacity-90'}`}
                        />

                        {/* Content Layer */}
                        <div className="absolute inset-0 p-10 flex flex-col justify-between">
                            {/* Icon Badge */}
                            <div className={`w-14 h-14 shrink-0 bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl text-white shadow-xl transition-transform duration-500 ${hoveredId === service.id ? 'scale-110' : 'scale-100'}`} >
                                {service.icon}
                            </div>

                            <div className="space-y-4 min-w-0">
                                <h3 className={`font-bold tracking-tighter text-white transition-all duration-500 ${hoveredId === service.id ? 'text-4xl' : 'text-2xl lg:-rotate-90 lg:origin-left lg:translate-x-8 lg:-translate-y-5 whitespace-nowrap'} `}>
                                    {service.title}
                                </h3>

                                <div className={`transition-all duration-700 delay-100 ${hoveredId === service.id ? 'opacity-100 translate-y-0 max-h-40' : 'opacity-0 translate-y-10 max-h-0'} `}>
                                    <p className="text-lg text-white/80 max-w-xs mb-6">
                                        {service.description}
                                    </p>
                                    <div className="w-12 h-12 border border-white/30 flex items-center justify-center group-hover:bg-white transition-colors">
                                        <FaArrowRight className="text-white group-hover:text-black transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};


const ServiceGallery = () => {
    return (
        <div className="bg-linear-to-b from-white to-stone-50 max-w-7xl mx-auto p-4 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-112.5">

                {/* Left Card: Large Feature */}
                <div className="md:col-span-2 relative group overflow-hidden rounded-3xl">
                    <img
                        src="https://images.unsplash.com/photo-1615856210162-9ae33390b1a2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Carpenter working"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8">
                        <h3 className="text-white text-3xl font-semibold leading-tight">
                            Skilled Experts,<br />Reliable Service
                        </h3>
                    </div>
                    <div className="absolute bottom-8 right-8 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <FiArrowUpRight className="text-2xl text-black" />
                    </div>
                </div>

                {/* Middle Column: Two Stacked Cards */}
                <div className="md:col-span-1 flex flex-col gap-4">
                    {/* Top Middle Card */}
                    <div className="relative flex-2 overflow-hidden rounded-3xl group">
                        <img
                            src="https://images.unsplash.com/photo-1615856210162-9ae33390b1a2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Booking service"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-6 left-6">
                            <h3 className="text-white text-xl font-semibold leading-tight">
                                Fast Booking,<br />Instant Help
                            </h3>
                        </div>
                        <div className="absolute bottom-6 right-6 bg-white p-2 rounded-full shadow-lg">
                            <FiArrowUpRight className="text-xl text-black" />
                        </div>
                    </div>

                    {/* Bottom Middle Card: Stats */}
                    <div className="flex-1 bg-indigo-500 rounded-3xl flex items-center justify-between px-6 py-4">
                        <div className="flex -space-x-3">
                            <img className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover" src="https://i.pravatar.cc/150?u=a" alt="User 1" />
                            <img className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover" src="https://i.pravatar.cc/150?u=b" alt="User 2" />
                        </div>
                        <div className="text-white text-right">
                            <div className="text-4xl font-bold">98%</div>
                            <div className="flex items-center justify-end text-[10px] uppercase tracking-wider opacity-90">
                                <AiFillStar className="mr-1" /> Customer satisfaction
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Card: Portrait Feature */}
                <div className="md:col-span-1 relative group overflow-hidden rounded-3xl">
                    <img
                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400"
                        alt="Technician"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-6">
                        <h3 className="text-white text-xl font-semibold leading-tight">
                            Safe, Easy,<br />On-Demand
                        </h3>
                    </div>
                    <div className="absolute bottom-8 right-6 bg-white p-2 rounded-full shadow-lg">
                        <FiArrowUpRight className="text-xl text-black" />
                    </div>
                </div>

            </div>
        </div>
    );
};


const ServicesList = () => {
    const categories = ["All", "Cleaning", "Repair", "Installation"];
    const [activeCategory, setActiveCategory] = useState("All");

    const services = [
        {
            name: "Plumbing & Sanitary Services",
            category: "Repair",
            img: "https://cdn-icons-png.flaticon.com/512/12029/12029477.png",
        },
        {
            name: "Electrical Repair",
            category: "Repair",
            img: "https://cdn-icons-png.flaticon.com/512/4514/4514764.png",
        },
        {
            name: "Gas Burner Repair",
            category: "Repair",
            img: "https://cdn-icons-png.flaticon.com/512/11355/11355459.png",
        },
        {
            name: "Drywall Repair",
            category: "Repair",
            img: "https://cdn-icons-png.flaticon.com/512/11034/11034182.png",
        },
        {
            name: "AC Cleaning",
            category: "Cleaning",
            img: "https://cdn-icons-png.flaticon.com/512/5361/5361406.png",
        },
        {
            name: "Bathroom Sanitization",
            category: "Cleaning",
            img: "https://cdn-icons-png.flaticon.com/512/11444/11444712.png",
        },
        {
            name: "Kitchen Deep Cleaning",
            category: "Cleaning",
            img: "https://cdn-icons-png.flaticon.com/512/1999/1999182.png",
        },
        {
            name: "Carpet & Sofa Cleaning",
            category: "Cleaning",
            img: "https://cdn-icons-png.flaticon.com/512/11058/11058843.png",
        },
        {
            name: "LED Lighting Installation",
            category: "Installation",
            img: "https://cdn-icons-png.flaticon.com/512/18571/18571591.png",
        },
        {
            name: "Smart Thermostat Installation",
            category: "Installation",
            img: "https://cdn-icons-png.flaticon.com/512/2258/2258946.png",
        },
        {
            name: "Wall Shelving Installation",
            category: "Installation",
            img: "https://cdn-icons-png.flaticon.com/512/4219/4219714.png",
        },
        {
            name: "Water Purifier Installation",
            category: "Installation",
            img: "https://cdn-icons-png.flaticon.com/512/5401/5401708.png",
        },
    ];

    const filtered =
        activeCategory === "All"
            ? services
            : services.filter(s => s.category === activeCategory);

    return (
        <section className="bg-white py-20 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-14 flex flex-wrap flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div className="space-y-3">
                        <span className="text-xs font-semibold tracking-widest text-[#7ccf52]">
                            SERVICES
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
                            Popular services. <span className="text-stone-400">One place.</span>
                        </h2>
                    </div>

                    <p className="max-w-sm text-base leading-relaxed text-stone-600">
                        Filter by category to quickly find the service you need.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {categories.map((cat) => {
                        const active = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-colors ${active
                                    ? "text-stone-900"
                                    : "text-stone-500 hover:text-stone-900"
                                    }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="active-pill"
                                        className="absolute inset-0 rounded-full bg-[#9fe870] shadow-md"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Services Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((service) => (
                            <motion.div
                                key={service.name}
                                layout
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 24 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                whileHover={{ y: -4 }}
                                className="group relative bg-white rounded-2xl border border-stone-100 p-6 flex items-center justify-between cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Accent Line */}
                                <div className="absolute left-0 top-0 h-full w-1 bg-[#9fe870] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

                                <div className="flex items-center gap-5">
                                    <div className="relative w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center transition-transform group-hover:scale-105">
                                        <img
                                            src={service.img}
                                            alt={service.name}
                                            className="w-9 h-9"
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-[#9fe870] blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-stone-900">
                                            {service.name}
                                        </h3>
                                        <span className="text-sm text-stone-500">
                                            {service.category}
                                        </span>
                                    </div>
                                </div>

                                <BsArrowRightCircleFill className="text-2xl text-stone-400 group-hover:text-stone-900 transition-colors" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};


const PopularProjects = () => {
    const navigate = useNavigate();
    const services = [
        {
            title: "Cleaning & Maid Service",
            rating: "5.0",
            reviews: "84",
            price: "$80",
            img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
            badge: "Popular",
            slug: 'cleaning-service'
        },
        {
            title: "Pest Control",
            rating: "4.9",
            reviews: "152",
            price: "$65",
            img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
            badge: "Top Rated",
            slug: 'pest-control'
        },
        {
            title: "Everything Moving",
            rating: "4.8",
            reviews: "91",
            price: "$65",
            img: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?q=80&w=800&auto=format&fit=crop",
            slug: 'everything-moving'
        },
        {
            title: "Handyman",
            rating: "4.9",
            reviews: "592",
            price: "$40",
            img: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
            slug: 'handyman'
        },
        {
            title: "Electrician & Wiring Service",
            rating: "4.8",
            reviews: "268",
            price: "$55",
            img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
            badge: "Verified",
            slug: 'electrical-wiring-service'
        }
    ];

    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const startDrag = (e) => {
        isDragging.current = true;
        sliderRef.current.classList.add("dragging");
        startX.current = e.pageX || e.touches[0].pageX;
        scrollLeft.current = sliderRef.current.scrollLeft;
    };

    const stopDrag = () => {
        isDragging.current = false;
        sliderRef.current.classList.remove("dragging");
    };

    const onDrag = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();

        const x = e.pageX || e.touches[0].pageX;
        const walk = (x - startX.current) * 1.5; // smooth speed
        sliderRef.current.scrollLeft = scrollLeft.current - walk;
    };

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-stone-900">
                        Top Rated Services Near You
                    </h2>
                    <p className="text-stone-500 mt-2">
                        Trusted professionals for every service
                    </p>
                </div>

                <div ref={sliderRef} className=" flex gap-6 overflow-x-auto no-scrollbar pb-6 cursor-grab active:cursor-grabbing scroll-smooth snap-x snap-mandatory"
                    onMouseDown={startDrag} onMouseLeave={stopDrag} onMouseUp={stopDrag} onMouseMove={onDrag}
                    onTouchStart={startDrag} onTouchEnd={stopDrag} onTouchMove={onDrag} >
                    {services.map((item, i) => (
                        <div key={i} onClick={() => navigate(`/service/${item.slug}`)} onMouseDown={startDrag}
                            className="snap-start select-none cursor-grab hover:cursor-pointer active:cursor-grabbing bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition flex-shrink-0 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[360px]"
                        >
                            {/* IMAGE */}
                            <div className="relative h-56 rounded-t-2xl overflow-hidden">
                                <img src={item.img} alt={item.title} draggable={false}
                                    className="h-full w-full object-cover pointer-events-none"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                                <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
                                    <HiBadgeCheck className="text-blue-600 text-lg" />
                                </div>

                                {item.badge && (
                                    <span className="absolute top-4 left-4 bg-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                        {item.badge}
                                    </span>
                                )}

                                {/* Avatar */}
                                <div className="absolute bottom-2 left-4">
                                    <img src="https://i.pravatar.cc/60" alt="provider"
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
                                    <span className="font-medium">
                                        {item.rating}
                                    </span>
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
                                        <span className="font-semibold">
                                            {item.price}
                                        </span>
                                    </p>

                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

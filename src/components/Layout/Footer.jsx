import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
    const popularCities = [
        "Surat", "Ahemadabad", "Bharuch", "Vadodara", "Mumbai",
        "San Diego", "Seattle", "Chicago", "Miami", "Dallas",
        "Austin", "Boston", "Houston", "Los Angeles", "Phoenix"
    ];

    const footerLinks = [
        {
            title: "Quick Links",
            links: [
                { label: "About Us", path: "/about" },
                { label: "Careers", path: "/careers" },
                { label: "FAQ", path: "/faq" },
            ],
        },
        {
            title: "Support",
            links: [
                { label: "Help Center", path: "/help-center" },
                { label: "Safety", path: "/safety" },
                { label: "Terms of Use", path: "/terms" },
                { label: "Privacy Policy", path: "/privacy-policy" },
            ],
        },
        {
            title: "Services",
            links: [
                { label: "Kitchen Cleaning", path: "/services/kitchen-cleaning" },
                { label: "Bathroom Plumbing", path: "/services/rathroom-plumbing" },
                { label: "Appliance Reparing", path: "/services/appliance-reparing" },
                { label: "More", path: "/services" },
            ],
        },
    ];

    return (
        <footer className="w-full font-serif bg-white pt-24">
            <div className="mx-auto">
                <div className="mb-24 max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-stone-900">
                            Popular Cities
                        </h2>
                        <div className="h-px flex-1 bg-stone-300"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-x-8">
                        {popularCities.map(city => (
                            <Link key={city} to={`/city/${city.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-lg text-stone-500 hover:text-[#97c77a] transition-colors duration-200 flex items-center group" >
                                <span className="w-0 group-hover:w-2 h-px bg-[#9ab987] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                {city}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-[#111111] text-white rounded-tl-[3rem] rounded-tr-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9fe870]/10 blur-[100px] -mr-32 -mt-32"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-2 text-2xl font-bold mb-6">
                                <div className="bg-[#9fe870] p-1.5 rounded-lg">
                                    <HiHome className="text-black" />
                                </div>
                                <span>HavenWorks</span>
                            </div>

                            <p className="text-stone-400 max-w-xs text-sm mb-8">
                                The most trusted platform for professional home services.
                                Verified experts, transparent pricing, and quality guaranteed.
                            </p>

                            <div className="flex gap-4">
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn">
                                    <FaFacebookF size={16} />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn">
                                    <FaTwitter size={16} />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn">
                                    <FaInstagram size={16} />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-btn">
                                    <FaLinkedinIn size={16} />
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-8">
                            {footerLinks.map(col => (
                                <div key={col.title}>
                                    <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
                                        {col.title}
                                    </h4>
                                    <ul className="space-y-4">
                                        {col.links.map(link => (
                                            <li key={link.label}>
                                                <Link
                                                    to={link.path}
                                                    className="text-stone-400 hover:text-white text-sm transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                <h4 className="font-bold text-lg mb-2">Join our Newsletter</h4>
                                <p className="text-stone-400 text-sm mb-6">
                                    Stay updated with the latest home maintenance tips and offers.
                                </p>

                                <div className="relative">
                                    <input
                                        className="w-full bg-white/5 rounded-2xl px-5 py-4 border border-white/10 outline-none focus:border-[#9fe870]/50"
                                        placeholder="Enter your email"
                                    />
                                    <button className="absolute right-2 top-2 bottom-2 bg-[#9fe870] text-black px-4 rounded-xl font-bold flex items-center gap-2">
                                        Join <FiArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
                        <p>© 2026 HavenWorks. All rights reserved.</p>
                        <div className="flex gap-8">
                            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
                            <Link to="/cookies" className="hover:text-white">Cookie Settings</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
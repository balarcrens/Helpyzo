/* eslint-disable no-unused-vars */
import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Header({ role, onMenuClick }) {
    const location = useLocation().pathname;
    const currentPage = location.split("/")[2] || "home";

    return (
        <motion.header
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 py-2"
        >
            <div className="flex items-center flex-wrap justify-between">
                {/* LEFT */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition"
                    >
                        <Menu size={20} className="text-gray-700" />
                    </button>

                    <div className="flex items-center gap-2 text-sm text-gray-500 capitalize">
                        <span>Dashboard</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-gray-900">
                            {currentPage}
                        </span>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center ml-auto sm:ml-0 gap-3 sm:gap-4">
                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#9fe870] focus-within:ring-2 focus-within:ring-[#9fe870]/30 transition">
                        <Search size={16} className="text-gray-400" />
                        <input
                            placeholder="Search..."
                            className="bg-transparent outline-none text-sm w-44"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-xl hover:bg-gray-100 active:scale-95 transition">
                        <Bell size={20} className="text-gray-700" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#9fe870] rounded-full ring-2 ring-white" />
                    </button>

                    {/* Profile */}
                    <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-100 cursor-pointer transition">
                        <div className="relative">
                            <img
                                src="https://i.pravatar.cc/40"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="absolute inset-0 rounded-full ring-2 ring-[#9fe870]/40" />
                        </div>

                        <div className="hidden sm:block leading-tight">
                            <p className="text-sm font-medium text-gray-900">
                                John Doe
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {role}
                            </p>
                        </div>

                        <ChevronDown size={16} className="text-gray-400" />
                    </div>
                </div>
            </div>
        </motion.header>
    );
}

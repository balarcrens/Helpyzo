/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { LifeBuoy, Settings, Shield } from "lucide-react";

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-xl border-t border-gray-200 px-6 py-2"
        >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-evenly sm:justify-between gap-3 text-sm text-gray-500">
                {/* Left */}
                <p className="flex items-center gap-1">
                    © {new Date().getFullYear()}
                    <span className="font-semibold text-gray-900">
                        HelpyZo
                    </span>
                </p>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {[LifeBuoy, Settings, Shield].map((Icon, i) => (
                        <button
                            key={i}
                            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition"
                        >
                            <Icon size={16} />
                        </button>
                    ))}
                </div>
            </div>
        </motion.footer>
    );
}

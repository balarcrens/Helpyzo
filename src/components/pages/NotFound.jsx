/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-md w-full text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
            >
                {/* Icon */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-[#9fe870]/30 mb-6"
                >
                    <SearchX size={32} className="text-gray-900" />
                </motion.div>


                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Page not found
                </h1>

                <p className="text-gray-500 mb-8">
                    Sorry, the page you’re looking for doesn’t exist or was moved.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition transform"
                    >
                        <Home size={16} />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 hover:scale-105 hover:shadow-lg transition transform"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </div>

                {/* Footer hint */}
                <p className="mt-6 text-xs text-gray-400">
                    Error code: 404
                </p>
            </motion.div>
        </div>
    );
}

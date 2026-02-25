/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FiCheckCircle,
    FiAlertCircle,
    FiInfo,
    FiAlertTriangle,
    FiX,
} from "react-icons/fi";

const CONFIG = {
    success: {
        icon: FiCheckCircle,
        accent: "#9fe870",
        bg: "rgba(10, 10, 10, 0.72)",
        border: "rgba(159,232,112,0.25)",
        iconColor: "#9fe870",
        label: "Success",
    },
    error: {
        icon: FiAlertCircle,
        accent: "#f87171",
        bg: "rgba(10, 10, 10, 0.72)",
        border: "rgba(248,113,113,0.25)",
        iconColor: "#f87171",
        label: "Error",
    },
    info: {
        icon: FiInfo,
        accent: "#60a5fa",
        bg: "rgba(10, 10, 10, 0.72)",
        border: "rgba(96,165,250,0.25)",
        iconColor: "#60a5fa",
        label: "Info",
    },
    warning: {
        icon: FiAlertTriangle,
        accent: "#fbbf24",
        bg: "rgba(10, 10, 10, 0.72)",
        border: "rgba(251,191,36,0.25)",
        iconColor: "#fbbf24",
        label: "Warning",
    },
};

export default function Toast({ message, type = "success", duration = 3000, onDismiss }) {
    const [progress, setProgress] = useState(100);
    const cfg = CONFIG[type] || CONFIG.info;
    const Icon = cfg.icon;

    useEffect(() => {
        const steps = 60;
        const interval = duration / steps;
        let current = 100;
        const timer = setInterval(() => {
            current -= 100 / steps;
            setProgress(current);
            if (current <= 0) clearInterval(timer);
        }, interval);
        return () => clearInterval(timer);
    }, [duration]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{
                background: cfg.bg,
                borderColor: cfg.border,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
            }}
            className="relative w-80 rounded-2xl border overflow-hidden shadow-2xl"
        >
            {/* Glowing top accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)` }}
            />

            {/* Main content */}
            <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                {/* Icon with subtle glow ring */}
                <div
                    className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center mt-0.5"
                    style={{
                        background: `rgba(${cfg.iconColor === "#9fe870" ? "159,232,112" : cfg.iconColor === "#f87171" ? "248,113,113" : cfg.iconColor === "#60a5fa" ? "96,165,250" : "251,191,36"},0.12)`,
                        boxShadow: `0 0 12px 0 ${cfg.accent}33`,
                    }}
                >
                    <Icon size={17} style={{ color: cfg.iconColor }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                        style={{ color: cfg.accent }}
                    >
                        {cfg.label}
                    </p>
                    <p className="text-sm text-white/80 leading-snug break-words">{message}</p>
                </div>

                {/* Dismiss button */}
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="flex-shrink-0 mt-0.5 text-white hover:text-white/70 transition-colors cursor-pointer"
                    >
                        <FiX size={15} />
                    </button>
                )}
            </div>

            {/* Progress bar */}
            <div className="h-[3px] bg-white/5 mx-3 mb-3 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: cfg.accent }}
                    initial={{ width: "100%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                />
            </div>
        </motion.div>
    );
}
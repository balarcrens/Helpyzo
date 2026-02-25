/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import {
    FiAlertTriangle,
    FiAlertCircle,
    FiHelpCircle,
    FiTrash2,
    FiX,
    FiCheck,
} from "react-icons/fi";

const CONFIG = {
    danger: {
        icon: FiTrash2,
        accent: "#f87171",
        bg: "rgba(248,113,113,0.06)",
        border: "rgba(248,113,113,0.2)",
        iconBg: "rgba(248,113,113,0.12)",
        iconShadow: "#f8717133",
        confirmBg: "linear-gradient(135deg,#ef4444,#dc2626)",
        confirmShadow: "0 8px 24px -6px rgba(239,68,68,0.5)",
        confirmLabel: "Delete",
    },
    warning: {
        icon: FiAlertTriangle,
        accent: "#fbbf24",
        bg: "rgba(251,191,36,0.06)",
        border: "rgba(251,191,36,0.2)",
        iconBg: "rgba(251,191,36,0.12)",
        iconShadow: "#fbbf2433",
        confirmBg: "linear-gradient(135deg,#f59e0b,#d97706)",
        confirmShadow: "0 8px 24px -6px rgba(245,158,11,0.5)",
        confirmLabel: "Confirm",
    },
    info: {
        icon: FiHelpCircle,
        accent: "#9fe870",
        bg: "rgba(159,232,112,0.06)",
        border: "rgba(159,232,112,0.2)",
        iconBg: "rgba(159,232,112,0.12)",
        iconShadow: "#9fe87033",
        confirmBg: "linear-gradient(135deg,#9fe870,#78c84a)",
        confirmShadow: "0 8px 24px -6px rgba(159,232,112,0.5)",
        confirmLabel: "Confirm",
    },
};

export default function ConfirmDialog({ message, subMessage, type = "danger", confirmLabel, onConfirm, onCancel }) {
    const cfg = CONFIG[type] || CONFIG.danger;
    const Icon = cfg.icon;
    const label = confirmLabel || cfg.confirmLabel;

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onCancel}
                className="fixed inset-0 z-[9998] flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            >
                {/* Dialog Card */}
                <motion.div
                    key="dialog"
                    initial={{ opacity: 0, scale: 0.88, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.88, y: 24 }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "rgba(18,18,18,0.95)",
                        borderColor: cfg.border,
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                    }}
                    className="relative w-full max-w-sm mx-4 rounded-3xl border overflow-hidden shadow-2xl"
                >
                    {/* Top glowing gradient line */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)`,
                        }}
                    />

                    {/* Content */}
                    <div className="px-8 pt-8 pb-6 flex flex-col items-center text-center gap-4">
                        {/* Icon */}
                        <div
                            className="h-16 w-16 rounded-2xl flex items-center justify-center"
                            style={{
                                background: cfg.iconBg,
                                boxShadow: `0 0 24px 0 ${cfg.iconShadow}`,
                            }}
                        >
                            <Icon size={28} style={{ color: cfg.accent }} />
                        </div>

                        {/* Text */}
                        <div className="space-y-1.5">
                            <p className="text-base font-bold text-white leading-snug">{message}</p>
                            {subMessage && (
                                <p className="text-sm text-white/40 leading-relaxed">{subMessage}</p>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/5" />

                        {/* Buttons */}
                        <div className="flex gap-3 w-full">
                            {/* Cancel */}
                            <button
                                onClick={onCancel}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-bold transition-all cursor-pointer active:scale-95"
                            >
                                <FiX size={15} />
                                Cancel
                            </button>

                            {/* Confirm */}
                            <button
                                onClick={onConfirm}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-black transition-all cursor-pointer active:scale-95"
                                style={{
                                    background: cfg.confirmBg,
                                    boxShadow: cfg.confirmShadow,
                                    color: type === "info" ? "#000" : "#fff",
                                }}
                            >
                                <FiCheck size={15} />
                                {label}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

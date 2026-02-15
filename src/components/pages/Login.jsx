/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff, FiLock, FiMail, FiX, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import AuthContext from "../../context/Auth/AuthContext";
import { partnerAPI, userAPI } from "../../services/api";

const Login = ({ onClose }) => {
    const { login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPartner, setIsPartner] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            const payloadEmail = email.toLowerCase().trim();

            const res = isPartner
                ? await partnerAPI.login(payloadEmail, password)
                : await userAPI.login(payloadEmail, password);

            if (!res?.data?.success) {
                throw new Error("Login failed");
            }

            login(
                res.data.token,
                isPartner ? res.data.partner : res.data.user
            );

            onClose();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

                <motion.div
                    initial={{ y: 30, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-stone-900/95 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute inset-0 bg-linear-to-br from-[#9fe870]/10 via-transparent to-white/10" />

                    <div className="relative px-6 py-7 sm:px-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-[#9fe870]">
                                    WELCOME BACK
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-white">
                                    Log in to continue
                                </h2>
                                <p className="mt-1 text-sm text-white/60">
                                    Access your account with email and password.
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="rounded-full cursor-pointer border border-white/10 p-2 text-white/70 transition hover:text-white hover:bg-white/10"
                            >
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="mt-6 space-y-4">
                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                    <FiAlertCircle /> {error}
                                </div>
                            )}

                            {/* Email */}
                            <label className="block text-sm text-white/70">
                                Email
                                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-[#9fe870]/50">
                                    <FiMail className="text-white/50" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-transparent text-white placeholder-white/40 outline-none"
                                    />
                                </div>
                            </label>

                            {/* Password */}
                            <label className="block text-sm text-white/70">
                                Password
                                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-[#9fe870]/50">
                                    <FiLock className="text-white/50" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full bg-transparent text-white placeholder-white/40 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="text-white/50 cursor-pointer hover:text-white"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 cursor-pointer transition hover:border-[#9fe870]/40">
                                <input
                                    type="checkbox"
                                    checked={isPartner}
                                    onChange={(e) => setIsPartner(e.target.checked)}
                                    className="peer hidden"
                                />

                                {/* Custom checkbox */}
                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-white/30 peer-checked:border-[#9fe870] peer-checked:bg-[#9fe870] transition">
                                    {isPartner && (
                                        <span className="h-2.5 w-2.5 rounded-sm bg-stone-900" />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">
                                        Business Partner <span className="text-xs text-white/50">
                                            ( Login as service provider )
                                        </span>
                                    </span>

                                </div>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl cursor-pointer bg-[#9fe870] py-3 text-sm font-bold text-stone-900 shadow-lg shadow-[#9fe870]/30 transition hover:scale-[1.01] active:scale-95 disabled:opacity-60"
                            >
                                {loading ? "LOGGING IN..." : "Log in"}
                            </button>


                            <div className="text-center text-sm text-white/50">
                                New here?{" "}
                                <Link
                                    to="/register?role=customer&step=1"
                                    onClick={onClose}
                                    className="text-[#9fe870] hover:underline"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Login;
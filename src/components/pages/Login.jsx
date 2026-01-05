import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion,AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff, FiLock, FiMail, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Login = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

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
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-stone-900/95 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute inset-0 bg-linear-to-br from-[#9fe870]/10 via-transparent to-white/10" />

          <div className="relative px-6 py-7 sm:px-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#9fe870]">
                  WELCOME BACK
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">Log in to continue</h2>
                <p className="mt-1 text-sm text-white/60">
                  Access your account with email and password.
                </p>
              </div>
              <button
                aria-label="Close login modal"
                onClick={onClose}
                className="rounded-full cursor-pointer border border-white/10 p-2 text-white/70 transition hover:text-white hover:bg-white/10"
              >
                <FiX />
              </button>
            </div>

            <form className="mt-6 space-y-4">
              <label className="block text-sm text-white/70">
                Email
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-[#9fe870]/50">
                  <FiMail className="text-white/50" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-white placeholder-white/40 outline-none"
                  />
                </div>
              </label>

              <label className="block text-sm text-white/70">
                Password
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-[#9fe870]/50">
                  <FiLock className="text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-white placeholder-white/40 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-white/50 cursor-pointer transition hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm text-white/60">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#9fe870]" />
                  Remember me
                </label>
                <button type="button" className="text-[#9fe870] cursor-pointer hover:text-[#b4f481]">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl cursor-pointer bg-[#9fe870] py-3 text-sm font-bold text-stone-900 shadow-lg shadow-[#9fe870]/30 transition hover:scale-[1.01] active:scale-95"
              >
                Log in
              </button>

              <div className="text-center text-sm text-white/50">
                New here?{' '}
                <Link
                  to="/register?role=customer&step=1"
                  onClick={onClose}
                  className="text-[#9fe870] cursor-pointer hover:text-[#b4f481] hover:underline"
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

/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMapPin, FiMail, FiPhone, FiCheckCircle } from "react-icons/fi";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { motion } from "framer-motion";

const ContactUs = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
        setIsSubmitting(true);
        console.log("Form Data:", data);

        setTimeout(() => {
            setIsSubmitting(false);
            alert("Thank you! We will contact you shortly.");
            reset();
        }, 2000);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white">
                <Header />

                {/* Hero Section */}
                <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900">
                    {/* Floating Blobs */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#9fe870]/20 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#9fe870]/10 rounded-full blur-3xl animate-pulse-slow" />
                    <div className="absolute top-1/3 right-10 w-60 h-60 bg-[#9fe870]/15 rounded-full blur-2xl animate-pulse-slow" />

                    <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center min-h-[70vh]">
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-6xl font-extrabold leading-tight text-white"
                        >
                            Get in <span className="text-[#9fe870]">Touch</span> with Us
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mt-6 text-lg md:text-xl text-stone-200 max-w-3xl"
                        >
                            We connect you with verified professionals for fast, reliable, and stress-free home services.
                        </motion.p>
                    </div>
                </section>

                {/* Contact Form & Info */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16">

                        {/* Contact Info */}
                        <div className="lg:col-span-5 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="bg-stone-900/50 p-10 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-md"
                            >
                                <h2 className="text-3xl font-bold mb-6 text-[#9fe870]">Contact Info</h2>
                                <div className="space-y-6 text-stone-200">
                                    <div className="flex items-center gap-4">
                                        <FiMapPin size={22} className="text-[#9fe870]" />
                                        <p>123 Green St, New Delhi, India</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FiMail size={22} className="text-[#9fe870]" />
                                        <p>support@homelyservices.com</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FiPhone size={22} className="text-[#9fe870]" />
                                        <p>+91 9876543210</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Map Embed */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14084.379996188796!2d77.2167218!3d28.64480095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3e09bff94d1%3A0xf83ff6a1bfa2998!2sIndia!5e0!3m2!1sen!2sin!4v1697104041668!5m2!1sen!2sin"
                                    className="w-full h-64 lg:h-full"
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Our Location"
                                ></iframe>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="bg-stone-900/50 p-10 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-md"
                            >
                                <h2 className="text-3xl font-bold text-[#9fe870] mb-8">Send a Message</h2>

                                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <InputField label="Full Name" name="fullName" placeholder="Your Name" register={register} errors={errors} validation={{ required: "Name is required" }} />
                                        <InputField label="Email" name="email" placeholder="email@example.com" type="email" register={register} errors={errors} validation={{ required: "Email required", pattern: /^\S+@\S+$/i }} />
                                    </div>

                                    <InputField label="Subject" name="subject" placeholder="Your Subject" register={register} errors={errors} />
                                    <InputField label="Message" name="message" placeholder="Your Message" register={register} errors={errors} type="textarea" />

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#9fe870] text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-102 transition transform flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                        <FiCheckCircle size={20} />
                                    </button>
                                </form>
                            </motion.div>
                        </div>

                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default ContactUs;

// Input Field Component
const InputField = ({ label, name, type = "text", placeholder, register, errors, validation }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-white/70">{label}</label>
        {type === "textarea" ? (
            <textarea
                {...register(name, validation)}
                placeholder={placeholder}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border border-white/10 bg-stone-900 text-white placeholder-white/30 focus:outline-none focus:border-[#9fe870]/50 focus:ring-1 focus:ring-[#9fe870]/30 transition`}
            />
        ) : (
            <input
                {...register(name, validation)}
                type={type}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-xl border border-white/10 bg-stone-900 text-white placeholder-white/30 focus:outline-none focus:border-[#9fe870]/50 focus:ring-1 focus:ring-[#9fe870]/30 transition`}
            />
        )}
        {errors[name] && <span className="text-red-400 text-xs mt-1">{errors[name].message}</span>}
    </div>
);

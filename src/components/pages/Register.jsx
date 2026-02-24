/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    FiCheckCircle, FiChevronLeft, FiChevronRight, FiMapPin,
    FiBriefcase, FiUser, FiSmartphone, FiShield, FiAlertCircle,
    FiLock, FiCamera
} from "react-icons/fi";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { userAPI, partnerAPI, categoryAPI } from "../../services/api";
import AuthContext from "../../context/Auth/AuthContext";

const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "UAE", "Singapore"];

const partnerSteps = [
    { id: 1, title: "Personal", description: "Identity details" },
    { id: 2, title: "Business", description: "Service info" },
    { id: 3, title: "Documents", description: "Verification" },
];

const Register = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [openCountry, setOpenCountry] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("India");
    const [documents, setDocuments] = useState({});
    const [isReadingFile, setIsReadingFile] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const profileInputRef = React.useRef(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const roleParam = (searchParams.get("role") || "customer").toLowerCase();
    const stepParam = Number(searchParams.get("step") || 1);
    const normalizedRole = roleParam === "partner" ? "partner" : "customer";
    const normalizedStep = normalizedRole === "partner" ? Math.min(Math.max(stepParam, 1), 3) : 1;
    const isPartner = normalizedRole === "partner";
    const { register, handleSubmit, trigger, setValue, formState: { errors }, reset } = useForm({
        mode: "onTouched",
        defaultValues: { country: "India" }
    });

    useEffect(() => {
        setSearchParams({ role: normalizedRole, step: String(normalizedStep) }, { replace: true });
        // Fetch categories for partners
        if (isPartner) {
            fetchCategories();
        }
    }, [normalizedRole, normalizedStep, setSearchParams, isPartner]);

    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getAllCategories();
            // console.log(res.data.categories);
            setCategories(res.data.categories);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const handleRoleChange = (role) => {
        reset();
        setSearchParams({ role, step: "1" });
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDocumentChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsReadingFile(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setDocuments(prev => ({
                ...prev,
                [type]: {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    dataUrl: reader.result
                }
            }));
            setIsReadingFile(false);
        };

        reader.readAsDataURL(file);
    };

    const onFinalSubmit = async (data) => {
        if (isReadingFile) {
            setError("Please wait, documents are still loading");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            if (isPartner) {
                const partnerData = {
                    name: data.fullName.trim(),
                    email: data.email.toLowerCase().trim(),
                    phone: data.phone,
                    password: data.password,
                    address: {
                        street: data.addressLine || "",
                        city: data.city || "",
                        state: data.state || "",
                        pincode: data.pincode || "",
                        country: selectedCountry,
                    },
                    business: {
                        name: data.businessName?.trim() || "",
                        phone: data.phone,
                        contact: data.businessName?.trim() || "",
                    },
                    services: data.serviceName ? [
                        {
                            name: data.serviceName.trim(),
                            category: data.category,
                            description: data.serviceDescription || "",
                            price: Number(data.price || 0),
                            duration: data.duration || "1 hour",
                        },
                    ] : [],
                    workingHours: {
                        days: data.workingDays || [],
                        fromTime: data.fromTime || "09:00",
                        toTime: data.toTime || "18:00",
                    },
                    paymentMethods: data.paymentMethods || ["cash"],
                    profileImage: profileImage || undefined,
                    documents: Object.entries(documents).map(([key, doc]) => ({
                        type: key,
                        name: doc.name,
                        mimeType: doc.type,
                        size: doc.size,
                        dataUrl: doc.dataUrl
                    }))
                };

                // console.log(documents);

                const res = await partnerAPI.register(partnerData);
                login(res.data.token, res.data.partner);
            } else {
                const userData = {
                    name: data.fullName.trim(),
                    email: data.email.toLowerCase().trim(),
                    phone: data.phone,
                    password: data.password,
                    address: {
                        street: data.addressLine || "",
                        city: data.city || "",
                        state: data.state || "",
                        pincode: data.pincode || "",
                        country: selectedCountry,
                    },
                    profileImage: profileImage || undefined,
                };

                const res = await userAPI.register(userData);
                login(res.data.token, res.data.user);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
            navigate("/");
        }
    };

    // Custom UI Components
    const InputGroup = ({ label, name, type = "text", placeholder, validation, icon: Icon }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">{label}</label>
            <div className="relative group">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#9fe870] transition-colors" />}
                <input
                    type={type}
                    {...register(name, validation)}
                    className={`w-full rounded-xl border border-white/5 bg-white/3 ${Icon ? 'pl-11' : 'px-4'} py-3 text-sm text-white transition-all placeholder-white/30 focus:border-[#9fe870]/40 focus:bg-white/[0.07] outline-none`}
                    placeholder={placeholder}
                />
            </div>
            {errors[name] && <span className="text-[12px] text-red-400 mt-1 ml-1 flex items-center gap-1"><FiAlertCircle /> {errors[name].message}</span>}
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen font-sans bg-[#050505] text-stone-200">
                <Header />

                <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20">
                    {/* Abstract background decor */}
                    <div className="absolute top-0 right-0 -z-10 h-150 w-150 bg-[#9fe870]/5 blur-[120px] rounded-full" />

                    <div className="grid lg:grid-cols-12 gap-12 items-start">

                        {/* Sidebar info */}
                        <div className="lg:col-span-4 space-y-8 sticky top-32">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                    {normalizedRole === "customer" ? (
                                        <>Experience the <br /><span className="text-[#9fe870]">Gold Standard.</span></>
                                    ) : (
                                        <>Join our <br /><span className="text-[#9fe870]">Premium Network.</span></>
                                    )}
                                </h1>
                                <p className="text-stone-400 text-sm leading-relaxed">
                                    {normalizedRole === "customer"
                                        ? "Connect with verified professionals and get your home services done with a 100% satisfaction guarantee."
                                        : "Complete the form to get started. We use these details to verify your identity and ensure a safe community."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {normalizedRole === "partner" ? (
                                    // SHOW STEPS FOR PARTNER
                                    partnerSteps.map((s, i) => (
                                        <div key={i} className={`flex gap-4 p-4 rounded-2xl border transition-all ${normalizedStep === s.id ? 'bg-white/5 border-white/10' : 'opacity-40 border-transparent'}`}>
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${normalizedStep === s.id ? 'bg-[#9fe870] text-black' : 'bg-white/10'}`}>{s.id}</div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{s.title}</p>
                                                <p className="text-xs text-stone-500">{s.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // SHOW BENEFITS FOR CUSTOMER
                                    [
                                        { icon: <FiShield />, title: "Verified Experts", desc: "Every pro is background checked." },
                                        { icon: <FiCheckCircle />, title: "Quality Assured", desc: "Only the top 1% service providers." },
                                        { icon: <FiSmartphone />, title: "Instant Booking", desc: "Manage everything from your phone." },
                                        { icon: <FiMapPin />, title: "Local Presence", desc: "Service providers in your neighborhood." }
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                                            <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#9fe870]/10 text-[#9fe870] group-hover:scale-110 transition-transform">
                                                {benefit.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{benefit.title}</p>
                                                <p className="text-xs text-stone-500">{benefit.desc}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Trust Badge for Customer */}
                            {normalizedRole === "customer" && (
                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-[#9fe870]">
                                        <FiCheckCircle size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">No. 1 Service Network</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Form Card */}
                        <div className="lg:col-span-8 bg-stone-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">

                            {/* Role Switcher */}
                            <div className="flex p-3 bg-black/40 border-b border-white/5">
                                <button onClick={() => handleRoleChange("customer")} className={`flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${normalizedRole === "customer" ? "bg-[#9fe870] text-black shadow-lg" : "text-white/40 hover:text-white"}`}>
                                    <FiUser size={16} /> CUSTOMER
                                </button>
                                <button onClick={() => handleRoleChange("partner")} className={`flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${normalizedRole === "partner" ? "bg-[#9fe870] text-black shadow-lg" : "text-white/40 hover:text-white"}`}>
                                    <FiBriefcase size={16} /> PARTNER
                                </button>
                            </div>

                            <div className="p-8 lg:p-12">
                                <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-8">

                                    {/* Step 1: Basic & Address (Shared for Customer or Partner Step 1) */}
                                    {(normalizedRole === "customer" || (normalizedRole === "partner" && normalizedStep === 1)) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">

                                            {/* Profile Picture Upload */}
                                            <div className="md:col-span-2 flex flex-col items-center gap-3 mb-2">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Profile Picture</p>
                                                <div
                                                    onClick={() => profileInputRef.current?.click()}
                                                    className="relative group cursor-pointer h-24 w-24 rounded-full border-2 border-dashed border-white/20 hover:border-[#9fe870]/60 transition-all flex items-center justify-center overflow-hidden bg-white/5"
                                                >
                                                    {profileImage ? (
                                                        <img
                                                            src={profileImage}
                                                            alt="Profile Preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1 text-white/30 group-hover:text-[#9fe870] transition-colors">
                                                            <FiUser size={28} />
                                                        </div>
                                                    )}
                                                    {/* Camera overlay on hover */}
                                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                        <FiCamera size={18} className="text-[#9fe870]" />
                                                        <span className="text-[9px] font-bold text-[#9fe870] uppercase tracking-wide">{profileImage ? "Change" : "Upload"}</span>
                                                    </div>
                                                </div>
                                                <input
                                                    ref={profileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleProfileImageChange}
                                                />
                                                {profileImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setProfileImage(null)}
                                                        className="text-[10px] cursor-pointer text-red-400/70 hover:text-red-400 transition-colors"
                                                    >
                                                        Remove photo
                                                    </button>
                                                )}
                                            </div>

                                            <InputGroup label="Full Name" name="fullName" icon={FiUser} placeholder="Enter your full name" validation={{ required: "Name is required" }} />
                                            <InputGroup label="Email Address" name="email" type="email" icon={FiShield} placeholder="name@domain.com" validation={{ required: "Valid email required", pattern: /^\S+@\S+$/i }} />
                                            <InputGroup label="Phone Number" name="phone" icon={FiSmartphone} placeholder="Enter your contact No" validation={{ required: "Phone required" }} />
                                            <InputGroup label="Password" name="password" icon={FiLock} placeholder="Enter your password" validation={{ required: "Password required" }} />

                                            {/* Address Sub-Section */}
                                            <div className="md:col-span-2 mt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/2 p-6 rounded-3xl border border-white/5">
                                                    <div className="md:col-span-2">
                                                        <InputGroup label="Address Line" name="addressLine" placeholder="House/Flat No, Street Name" validation={{ required: "Address is required" }} />
                                                    </div>
                                                    <InputGroup label="Landmark" name="landmark" placeholder="Near Apollo Hospital, etc." />
                                                    <InputGroup label="City" name="city" placeholder="City" validation={{ required: "City required" }} />
                                                    <InputGroup label="State" name="state" placeholder="State" validation={{ required: "State required" }} />
                                                    <InputGroup label="Pincode / ZIP" placeholder="Pincode" name="pincode" validation={{ required: "Required" }} />
                                                    <div className="flex flex-col gap-1.5 relative">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1"> Country </label>

                                                        <button type="button" onClick={() => setOpenCountry(prev => !prev)}
                                                            className="flex items-center justify-between w-full rounded-xl border border-white/5 bg-white/3 px-4 py-3 text-sm text-white hover:border-[#9fe870]/40 transition"
                                                        >
                                                            <span className={selectedCountry === "Select country" ? "text-white/40" : ""}>
                                                                {selectedCountry}
                                                            </span>
                                                            <FiChevronDown
                                                                className={`text-xs transition-transform ${openCountry ? "rotate-180" : ""}`}
                                                            />
                                                        </button>
                                                        <AnimatePresence>
                                                            {openCountry && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: 10 }}
                                                                    transition={{ duration: 0.15 }}
                                                                    className="absolute overflow-y-auto custom-scrollbar-minimal top-full left-0 mt-2 w-full max-h-40 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50"
                                                                >
                                                                    {countries.map((country) => (
                                                                        <div key={country}
                                                                            onClick={() => {
                                                                                setSelectedCountry(country);
                                                                                setValue("country", country);
                                                                                setOpenCountry(false);
                                                                            }}
                                                                            className="px-4 py-2 text-sm text-gray-300 hover:text-[#9fe870] hover:bg-white/5 rounded-lg cursor-pointer transition"
                                                                        >
                                                                            {country}
                                                                        </div>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        <input type="hidden" {...register("country")} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Business (Partner Only) */}
                                    {normalizedRole === "partner" && normalizedStep === 2 && (
                                        <div className="grid grid-cols-1 gap-6">

                                            <InputGroup label="Business / Shop Name" name="businessName" validation={{ required: "Business Name is Required" }}
                                            />

                                            <InputGroup label="Years of Experience" name="yearsOfExperience" type="number" placeholder="e.g. 5" validation={{ required: "Years of Experience is Required" }}
                                            />

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                    Service Category
                                                </label>
                                                <select
                                                    {...register("category", { required: "Select category" })}
                                                    className="w-full rounded-xl border border-white/5 bg-stone-800 px-4 py-3 text-sm text-white"
                                                >
                                                    <option value="">Select</option>
                                                    {categories?.map((category) => {
                                                        return (
                                                            <option key={category._id} value={category._id}>
                                                                {category.name}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>

                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    {...register("whatsapp")}
                                                    className="accent-[#9fe870]"
                                                />
                                                <span className="text-xs text-stone-400">
                                                    Available on WhatsApp
                                                </span>
                                            </label>

                                            <div className="space-y-2">
                                                <label className="text-xs text-white/40 uppercase tracking-widest">
                                                    Payment Methods
                                                </label>

                                                {["cash", "card", "upi", "online"].map(method => (
                                                    <label key={method} className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            value={method}
                                                            {...register("paymentMethods")}
                                                            className="accent-[#9fe870]"
                                                        />
                                                        <span className="text-sm capitalize text-stone-400">
                                                            {method}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Document Upload (Partner Only) */}
                                    {normalizedRole === "partner" && normalizedStep === 3 && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

                                            <div className="bg-white/2 border border-white/5 rounded-3xl p-6 space-y-5">
                                                <h3 className="text-sm font-bold text-white tracking-wide">
                                                    Verification Documents
                                                </h3>
                                                <p className="text-xs text-stone-400">
                                                    Upload clear images for faster verification.
                                                </p>

                                                {/* Aadhaar */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs text-white/50">Aadhaar Card</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleDocumentChange(e, "aadhaar")}
                                                        className="text-xs text-white/70 border border-dashed border-white/40 rounded-lg px-3 py-4"
                                                    />
                                                </div>

                                                {/* PAN */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs text-white/50">PAN Card</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleDocumentChange(e, "pan")}
                                                        className="text-xs text-white/70 border border-dashed border-white/40 rounded-lg px-3 py-4"
                                                    />
                                                </div>

                                                {/* GST (Optional) */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs text-white/50">GST Certificate (Optional)</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleDocumentChange(e, "gst")}
                                                        className="text-xs text-white/70 border border-dashed border-white/40 rounded-lg px-3 py-4"
                                                    />
                                                </div>
                                            </div>

                                            {Object.keys(documents).length > 0 && (
                                                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4">
                                                    <p className="text-xs text-green-400 font-semibold">
                                                        {Object.keys(documents).length} document(s) uploaded successfully
                                                    </p>
                                                </div>
                                            )}

                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                        {normalizedRole === "partner" && normalizedStep > 1 ? (
                                            <button type="button" onClick={() => setSearchParams({ role: "partner", step: String(normalizedStep - 1) })} className="px-6 cursor-pointer py-3 text-sm font-bold text-white/40 hover:text-white transition-colors flex items-center gap-2">
                                                <FiChevronLeft /> PREVIOUS
                                            </button>
                                        ) : <div />}

                                        {normalizedRole === "partner" && normalizedStep < 3 ? (
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const fields = normalizedStep === 1 ? ["fullName", "email", "phone", "addressLine", "city", "pincode"] : normalizedStep === 2 ? ["businessName", "category", "experience"] : ["documents"];
                                                    const ok = await trigger(fields);
                                                    if (ok) setSearchParams({ role: "partner", step: String(normalizedStep + 1) });
                                                }}
                                                className="bg-[#9fe870] cursor-pointer hover:brightness-110 text-black px-10 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-[0_10px_30px_-10px_rgba(159,232,112,0.5)] active:scale-95"
                                            >
                                                NEXT STEP <FiChevronRight />
                                            </button>
                                        ) : (
                                            <button
                                                disabled={isLoading}
                                                type="submit"
                                                className="bg-[#9fe870] cursor-pointer hover:brightness-110 disabled:opacity-50 text-black px-10 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-[0_10px_30px_-10px_rgba(159,232,112,0.5)] active:scale-95"
                                            >
                                                {isLoading ? "NORMALIZING..." : "FINISH REGISTRATION"} <FiCheckCircle />
                                            </button>
                                        )}
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
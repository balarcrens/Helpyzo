/* eslint-disable react-hooks/static-components */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiCheckCircle, FiChevronLeft, FiChevronRight, FiMapPin,
  FiBriefcase, FiUser, FiSmartphone, FiShield, FiAlertCircle
} from "react-icons/fi";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";

const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "UAE", "Singapore"];

const partnerSteps = [
  { id: 1, title: "Personal", description: "Identity details" },
  { id: 2, title: "Business", description: "Service info" },
  { id: 3, title: "Verification", description: "Document upload" },
];

const Register = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const roleParam = (searchParams.get("role") || "customer").toLowerCase();
  const stepParam = Number(searchParams.get("step") || 1);
  const normalizedRole = roleParam === "partner" ? "partner" : "customer";
  const normalizedStep = normalizedRole === "partner" ? Math.min(Math.max(stepParam, 1), 3) : 1;

  const { register, handleSubmit, trigger, setValue, formState: { errors }, reset } = useForm({
    mode: "onTouched",
    defaultValues: { country: "India" }
  });

  // Sync Params
  useEffect(() => {
    setSearchParams({ role: normalizedRole, step: String(normalizedStep) }, { replace: true });
  }, [normalizedRole, normalizedStep, setSearchParams]);

  const handleRoleChange = (role) => {
    reset();
    setSearchParams({ role, step: "1" });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setValue("latitude", latitude);
      setValue("longitude", longitude);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        const addr = data.address;
        setValue("city", addr.city || addr.town || addr.suburb || "");
        setValue("pincode", addr.postcode || "");
        setValue("addressLine", `${addr.house_number || ''} ${addr.road || ''}`.trim());
        setValue("landmark", addr.neighbourhood || addr.suburb || "");
      } catch (err) {
        console.log("Geocode Error:", err);
        alert("Could not fetch address details automatically.");
      }
    });
  };

  const onFinalSubmit = (data) => {
    setIsLoading(true);
    const normalizedData = {
      ...data,
      fullName: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      role: normalizedRole,
      submittedAt: new Date().toISOString(),
    };

    console.log("SENDING TO API:", normalizedData);
    setTimeout(() => {
      setIsLoading(false);
      alert("Registration Successful!");
    }, 2000);
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
          className={`w-full rounded-xl border border-white/5 bg-white/3 ${Icon ? 'pl-11' : 'px-4'} py-3 text-sm text-white transition-all placeholder:text-white/10 focus:border-[#9fe870]/40 focus:bg-white/[0.07] outline-none`}
          placeholder={placeholder}
        />
      </div>
      {errors[name] && <span className="text-[10px] text-red-400 mt-1 ml-1 flex items-center gap-1"><FiAlertCircle /> {errors[name].message}</span>}
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
                      <div className="md:col-span-2">
                        <InputGroup label="Full Name" name="fullName" icon={FiUser} placeholder="Enter your full name" validation={{ required: "Name is required" }} />
                      </div>
                      <InputGroup label="Email Address" name="email" type="email" icon={FiShield} placeholder="name@domain.com" validation={{ required: "Valid email required", pattern: /^\S+@\S+$/i }} />
                      <InputGroup label="Phone Number" name="phone" icon={FiSmartphone} placeholder="Enter your contact No" validation={{ required: "Phone required" }} />

                      {/* Address Sub-Section */}
                      <div className="md:col-span-2 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xs font-black tracking-widest text-[#9fe870]">LOCATION DETAILS</h3>
                          <button type="button" onClick={handleUseLocation} className="text-[10px] cursor-pointer font-bold text-white/60 hover:text-[#9fe870] underline flex items-center gap-1"><FiMapPin /> AUTO-DETECT</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/2 p-6 rounded-3xl border border-white/5">
                          <div className="md:col-span-2">
                            <InputGroup label="Address Line" name="addressLine" placeholder="House/Flat No, Street Name" validation={{ required: "Address is required" }} />
                          </div>
                          <InputGroup label="Landmark" name="landmark" placeholder="Near Apollo Hospital, etc." />
                          <InputGroup label="City" name="city" validation={{ required: "City required" }} />
                          <InputGroup label="Pincode / ZIP" name="pincode" validation={{ required: "Required" }} />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Country</label>
                            <select {...register("country")} className="w-full rounded-xl border border-white/5 bg-stone-800 px-4 py-3 text-sm text-white focus:border-[#9fe870]/40 outline-none">
                              {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Business (Partner Only) */}
                  {normalizedRole === "partner" && normalizedStep === 2 && (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4">
                      <InputGroup label="Business / Shop Name" name="businessName" placeholder="Elite Plumbing Services" validation={{ required: "Required" }} />
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Category</label>
                          <select {...register("category", { required: "Select category" })} className="w-full rounded-xl border border-white/5 bg-stone-800 px-4 py-3 text-sm text-white focus:border-[#9fe870]/40 outline-none">
                            <option value="">Select Service</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="cleaning">Home Cleaning</option>
                          </select>
                        </div>
                        <InputGroup label="Years of Experience" name="experience" type="number" placeholder="e.g. 5" validation={{ required: "Required" }} />
                      </div>
                      <InputGroup label="Service Radius (km)" name="serviceArea" placeholder="How far can you travel?" validation={{ required: "Required" }} />
                      <InputGroup label="Website / Portfolio URL" name="website" placeholder="https://..." />
                    </div>
                  )}

                  {/* Step 3: Verification (Partner Only) */}
                  {normalizedRole === "partner" && normalizedStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                      <div className="bg-[#9fe870]/5 border border-[#9fe870]/20 p-6 rounded-3xl">
                        <h4 className="text-[#9fe870] text-sm font-bold mb-2">Identity Check</h4>
                        <p className="text-stone-400 text-xs leading-relaxed">Please provide your government ID details. This info is encrypted and never shared publicly.</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">ID Document Type</label>
                          <select {...register("idType", { required: "Required" })} className="w-full rounded-xl border border-white/5 bg-stone-800 px-4 py-3 text-sm text-white focus:border-[#9fe870]/40 outline-none">
                            <option value="">Select Type</option>
                            <option value="aadhaar">Aadhaar Card</option>
                            <option value="passport">Passport</option>
                            <option value="license">Driving License</option>
                          </select>
                        </div>
                        <InputGroup label="Document ID Number" name="idNumber" placeholder="Enter ID number" validation={{ required: "Required" }} />
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer group mt-4">
                        <input type="checkbox" {...register("agree", { required: "You must agree" })} className="mt-1 accent-[#9fe870]" />
                        <span className="text-xs text-stone-500 group-hover:text-white transition-colors">I certify that all provided information is accurate and I agree to the service partner terms.</span>
                      </label>
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
                          const fields = normalizedStep === 1 ? ["fullName", "email", "phone", "addressLine", "city", "pincode"] : ["businessName", "category", "experience"];
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
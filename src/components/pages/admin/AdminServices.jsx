/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
    FiEdit, FiTrash2, FiPlus, FiX, FiCheck,
    FiClock, FiDollarSign, FiCalendar, FiSettings,
    FiTag, FiPackage, FiImage, FiToggleLeft, FiToggleRight,
    FiLock, FiAlertCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePartner } from "../../../hooks/useAuth";
import { useCategories } from "../../../hooks/useData";

const TABS = ["basic", "pricing", "availability", "settings"];
const TAB_ICONS = { basic: FiPackage, pricing: FiDollarSign, availability: FiCalendar, settings: FiSettings };
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const inputCls =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition bg-gray-50 placeholder:text-gray-400";
const labelCls = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5";

export default function AdminServices() {
    const { user, addService, updateService, deleteService, loading } = usePartner();
    const { categories } = useCategories();
    const [services, setServices] = useState(user?.services || []);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [activeTab, setActiveTab] = useState("basic");
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        image: "",
        basePrice: "",
        visitingFees: 0,
        discount: "0",
        durationInMinutes: "",
        isActive: true,
        availableDays: [],
        availableTime: { from: "09:00", to: "18:00" },
        maxBookingsPerDay: "10",
        serviceArea: { cities: [], radiusKm: "10" },
        cancellationAllowed: true,
        cancellationWindowHours: "2",
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDayToggle = (day) => {
        setFormData((prev) => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter((d) => d !== day)
                : [...prev.availableDays, day],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) { alert("Please select an image"); return; }
        if (!formData.name || !formData.category || !formData.basePrice || !formData.durationInMinutes) {
            alert("Please fill in all required fields (marked with *)"); return;
        }
        try {
            const submitData = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                visitingFees: parseFloat(formData.visitingFees) || 0,
                discount: parseFloat(formData.discount) || 0,
                finalPrice,
                durationInMinutes: parseInt(formData.durationInMinutes),
                maxBookingsPerDay: parseInt(formData.maxBookingsPerDay),
                cancellationWindowHours: parseInt(formData.cancellationWindowHours),
                serviceArea: { ...formData.serviceArea, radiusKm: parseInt(formData.serviceArea.radiusKm) },
            };
            if (editingId) {
                const updated = await updateService(editingId, submitData);
                setServices(updated.services);
            } else {
                const updated = await addService(submitData);
                setServices(updated.services);
            }
            handleCancel();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (serviceId) => {
        if (confirm("Are you sure you want to delete this service?")) {
            try {
                const updated = await deleteService(serviceId);
                setServices(updated.services);
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleEdit = (service) => {
        setEditingId(service._id);
        setFormData({
            name: service.name,
            category: service.category._id || service.category,
            description: service.description || "",
            image: service.image,
            basePrice: service.basePrice,
            visitingFees: service.visitingFees || 0,
            discount: service.discount || 0,
            durationInMinutes: service.durationInMinutes,
            isActive: service.isActive !== false,
            availableDays: service.availableDays || [],
            availableTime: service.availableTime || { from: "09:00", to: "18:00" },
            maxBookingsPerDay: service.maxBookingsPerDay || 10,
            serviceArea: service.serviceArea || { cities: [], radiusKm: 10 },
            cancellationAllowed: service.cancellationAllowed !== false,
            cancellationWindowHours: service.cancellationWindowHours || 2,
        });
        setImagePreview(service.image);
        setShowForm(true);
        setActiveTab("basic");
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            name: "", category: "", description: "", image: "",
            basePrice: "", visitingFees: "0", discount: "0",
            durationInMinutes: "", isActive: true, availableDays: [],
            availableTime: { from: "09:00", to: "18:00" },
            maxBookingsPerDay: "10",
            serviceArea: { cities: [], radiusKm: "10" },
            cancellationAllowed: true, cancellationWindowHours: "2",
        });
        setImagePreview("");
        setActiveTab("basic");
    };

    const basePrice = Number(formData.basePrice) || 0;
    const discountPercent = Number(formData.discount) || 0;
    const visitingFees = Number(formData.visitingFees) || 0;
    const discountAmount = basePrice * (discountPercent / 100);
    const finalPrice = Math.max(Math.round(basePrice - discountAmount + visitingFees), 0);

    const isVerified = user?.verification?.status === "approved";

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">My Services</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {services.length > 0 ? `${services.length} service${services.length > 1 ? "s" : ""} listed` : "No services yet — create your first!"}
                    </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2">
                    <button
                        onClick={() => setShowForm(true)}
                        disabled={!isVerified}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95 shadow-sm"
                    >
                        <FiPlus size={16} /> Add Service
                    </button>

                    {!isVerified && (
                        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 max-w-xs">
                            <FiLock size={13} className="mt-0.5 flex-shrink-0" />
                            <span><span className="font-bold">Locked.</span> Complete document verification to add services.</span>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 24 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 24 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <FiPackage size={16} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-gray-900">
                                            {editingId ? "Edit Service" : "Add New Service"}
                                        </h3>
                                        <p className="text-[11px] text-gray-400">Fill in all required fields (*)</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="h-8 w-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition active:scale-90"
                                >
                                    <FiX size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
                                    {TABS.map((tab) => {
                                        const Icon = TAB_ICONS[tab];
                                        return (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setActiveTab(tab)}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab
                                                    ? "bg-white text-indigo-600 shadow-sm"
                                                    : "text-gray-500 hover:text-gray-700"
                                                    }`}
                                            >
                                                <Icon size={13} />
                                                <span className="hidden sm:inline">{tab}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* ── BASIC TAB ── */}
                                {activeTab === "basic" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelCls}>Service Name *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Home Cleaning, Plumbing..."
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className={inputCls}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelCls}>Category *</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className={inputCls}
                                                    required
                                                >
                                                    <option value="">Select a category</option>
                                                    {categories?.map((cat) => (
                                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Duration (minutes) *</label>
                                                <input
                                                    type="number"
                                                    placeholder="Min 15 minutes"
                                                    value={formData.durationInMinutes}
                                                    onChange={(e) => setFormData({ ...formData, durationInMinutes: e.target.value })}
                                                    className={inputCls}
                                                    min="15"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelCls}>Description</label>
                                            <textarea
                                                placeholder="Describe your service in detail..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className={`${inputCls} resize-none`}
                                                rows="3"
                                                maxLength="500"
                                            />
                                            <p className="text-[11px] text-gray-400 mt-1 text-right">{formData.description.length}/500</p>
                                        </div>

                                        {/* Image Upload */}
                                        <div>
                                            <label className={labelCls}>Service Image *</label>
                                            <label
                                                htmlFor="image-input"
                                                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl py-6 cursor-pointer transition bg-gray-50 hover:bg-indigo-50/30"
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400">
                                                    <FiImage size={18} />
                                                </div>
                                                <p className="text-sm font-semibold text-gray-600">Click to upload image</p>
                                                <p className="text-xs text-gray-400">PNG, JPG, JPEG — up to 5MB</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="image-input"
                                                />
                                            </label>
                                            {imagePreview && (
                                                <div className="mt-3 relative rounded-2xl overflow-hidden border border-gray-100">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                                                    <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                                        ✓ Preview
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ── PRICING TAB ── */}
                                {activeTab === "pricing" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelCls}>Base Price (₹) *</label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={formData.basePrice}
                                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                                    className={inputCls}
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Visiting Fees (₹)</label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={formData.visitingFees}
                                                    onChange={(e) => setFormData({ ...formData, visitingFees: e.target.value })}
                                                    className={inputCls}
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className={labelCls}>Discount</label>
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{formData.discount}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={formData.discount}
                                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                            />
                                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                                <span>0%</span><span>50%</span><span>100%</span>
                                            </div>
                                        </div>

                                        {/* Price summary */}
                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>Base Price</span><span>₹{basePrice}</span>
                                            </div>
                                            {discountAmount > 0 && (
                                                <div className="flex justify-between text-sm text-emerald-600">
                                                    <span>Discount ({discountPercent}%)</span><span>-₹{Math.round(discountAmount)}</span>
                                                </div>
                                            )}
                                            {visitingFees > 0 && (
                                                <div className="flex justify-between text-sm text-gray-500">
                                                    <span>Visiting Fees</span><span>+₹{visitingFees}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                                <span className="text-sm font-bold text-gray-700">Final Price</span>
                                                <span className="text-2xl font-extrabold text-indigo-600">₹{finalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── AVAILABILITY TAB ── */}
                                {activeTab === "availability" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelCls}>Available Days</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {DAYS.map((day) => {
                                                    const on = formData.availableDays.includes(day);
                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => handleDayToggle(day)}
                                                            className={`py-2 rounded-xl text-xs font-bold transition-all ${on
                                                                ? "bg-indigo-600 text-white shadow-sm"
                                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                                }`}
                                                        >
                                                            {day.slice(0, 3)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelCls}>From Time</label>
                                                <input
                                                    type="time"
                                                    value={formData.availableTime.from}
                                                    onChange={(e) => setFormData({ ...formData, availableTime: { ...formData.availableTime, from: e.target.value } })}
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelCls}>To Time</label>
                                                <input
                                                    type="time"
                                                    value={formData.availableTime.to}
                                                    onChange={(e) => setFormData({ ...formData, availableTime: { ...formData.availableTime, to: e.target.value } })}
                                                    className={inputCls}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelCls}>Service Radius (km)</label>
                                            <input
                                                type="number"
                                                value={formData.serviceArea.radiusKm}
                                                onChange={(e) => setFormData({ ...formData, serviceArea: { ...formData.serviceArea, radiusKm: e.target.value } })}
                                                className={inputCls}
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ── SETTINGS TAB ── */}
                                {activeTab === "settings" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelCls}>Max Bookings Per Day</label>
                                            <input
                                                type="number"
                                                value={formData.maxBookingsPerDay}
                                                onChange={(e) => setFormData({ ...formData, maxBookingsPerDay: e.target.value })}
                                                className={inputCls}
                                                min="1"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            {[
                                                { key: "isActive", label: "Service Active", desc: "Visible and bookable by customers" },
                                                { key: "cancellationAllowed", label: "Allow Cancellations", desc: "Customers can cancel before window" },
                                            ].map(({ key, label, desc }) => (
                                                <label
                                                    key={key}
                                                    className="flex items-center justify-between gap-3 cursor-pointer bg-gray-50 border border-gray-100 hover:bg-gray-100 p-4 rounded-2xl transition"
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{label}</p>
                                                        <p className="text-xs text-gray-400">{desc}</p>
                                                    </div>
                                                    <div className={`relative w-10 h-5 rounded-full transition-colors ${formData[key] ? "bg-indigo-500" : "bg-gray-300"}`}>
                                                        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${formData[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                                                        <input
                                                            type="checkbox"
                                                            checked={formData[key]}
                                                            onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                                                            className="sr-only"
                                                        />
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        {formData.cancellationAllowed && (
                                            <div>
                                                <label className={labelCls}>Cancellation Window (hours)</label>
                                                <input
                                                    type="number"
                                                    value={formData.cancellationWindowHours}
                                                    onChange={(e) => setFormData({ ...formData, cancellationWindowHours: e.target.value })}
                                                    className={inputCls}
                                                    min="0"
                                                />
                                                <p className="text-xs text-gray-400 mt-1">Hours before booking start to allow cancellation</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-2xl text-sm font-bold transition active:scale-95"
                                    >
                                        <FiCheck size={15} />
                                        {loading ? "Saving..." : editingId ? "Update Service" : "Add Service"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {services && services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((service, idx) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                        >
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden bg-gray-100">
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                                        <FiImage size={32} className="text-gray-300" />
                                    </div>
                                )}

                                {!service.isActive && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">Inactive</span>
                                    </div>
                                )}

                                <div className="absolute top-3 left-3 flex gap-1.5">
                                    {service.approvalStatus === "pending" && (
                                        <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">Pending Review</span>
                                    )}
                                    {service.approvalStatus === "approved" && (
                                        <span className="bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">Approved</span>
                                    )}
                                </div>

                                {service.discount > 0 && (
                                    <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                        -{service.discount}%
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-extrabold text-gray-900 line-clamp-1 flex-1">{service.name}</h3>
                                    {service.isActive
                                        ? <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" title="Active" />
                                        : <span className="h-2 w-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" title="Inactive" />
                                    }
                                </div>

                                {service.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                        {service.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-3 mt-3">
                                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</p>
                                        <div className="flex items-center justify-center gap-1 mt-0.5">
                                            {service.discount > 0 && (
                                                <span className="text-[10px] line-through text-gray-400">₹{service.basePrice}</span>
                                            )}
                                            <span className="text-sm font-extrabold text-indigo-600">₹{service.finalPrice || service.basePrice}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Duration</p>
                                        <p className="text-sm font-extrabold text-gray-800 mt-0.5">{service.durationInMinutes}m</p>
                                    </div>
                                </div>

                                {service.availableDays?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {service.availableDays.map((day) => (
                                            <span key={day} className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg">
                                                {day.slice(0, 3)}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition active:scale-95"
                                    >
                                        <FiEdit size={13} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service._id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition active:scale-95"
                                    >
                                        <FiTrash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                        <FiPackage size={26} className="text-indigo-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">No services yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first service offering to start getting bookings</p>
                    {isVerified && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition"
                        >
                            <FiPlus size={13} /> Add your first service
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

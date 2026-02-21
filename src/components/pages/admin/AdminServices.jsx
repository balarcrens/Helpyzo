/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePartner } from "../../../hooks/useAuth";
import { useCategories } from "../../../hooks/useData";

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
        setFormData(prev => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter(d => d !== day)
                : [...prev.availableDays, day]
        }));
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            alert("Please select an image");
            return;
        }
        if (!formData.name || !formData.category || !formData.basePrice || !formData.durationInMinutes) {
            alert("Please fill in all required fields (marked with *)");
            return;
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
                serviceArea: {
                    ...formData.serviceArea,
                    radiusKm: parseInt(formData.serviceArea.radiusKm),
                }
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
            name: "",
            category: "",
            description: "",
            image: "",
            basePrice: "",
            visitingFees: "0",
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
        setImagePreview("");
        setActiveTab("basic");
    };

    const basePrice = Number(formData.basePrice) || 0;
    const discountPercent = Number(formData.discount) || 0;
    const visitingFees = Number(formData.visitingFees) || 0;

    const discountAmount = basePrice * (discountPercent / 100);
    const finalPrice = Math.max(
        Math.round(basePrice - discountAmount + visitingFees),
        0
    );

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* LEFT: TITLE */}
                <div>
                    <h2 className="text-3xl font-bold text-stone-900">Services</h2>
                    <p className="text-gray-600 mt-1">
                        Manage and create service offerings
                    </p>
                </div>

                {/* RIGHT: ACTION */}
                <div className="flex flex-col items-end gap-2 max-w-md">
                    <button
                        onClick={() => setShowForm(true)}
                        disabled={user?.verification?.status !== "approved"}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#9fe870] to-[#8ed65f]
                       text-stone-900 px-6 py-3 rounded-xl font-semibold
                       hover:scale-105 transition shadow-lg
                       disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FiPlus size={20} /> Add Service
                    </button>

                    {user?.verification?.status !== "approved" && (
                        <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-right">
                            🔒 <span className="font-medium">Service upload locked.</span>
                            <br />
                            Complete document verification to unlock this feature.
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    // onClick={handleCancel}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                                <h3 className="text-2xl font-bold text-stone-900">
                                    {editingId ? "Edit Service" : "Add New Service"}
                                </h3>
                                <button
                                    onClick={handleCancel}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Tabs */}
                                <div className="flex gap-2 mb-6 border-b border-gray-200">
                                    {["basic", "pricing", "availability", "settings"].map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-2 font-semibold capitalize transition ${activeTab === tab
                                                ? "text-[#9fe870] border-b-2 border-[#9fe870]"
                                                : "text-gray-600 hover:text-gray-900"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* BASIC TAB */}
                                {activeTab === "basic" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                Service Name *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Home Cleaning, Plumbing, etc."
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories?.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                Duration (minutes) *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Minimum 15 minutes"
                                                value={formData.durationInMinutes}
                                                onChange={(e) => setFormData({ ...formData, durationInMinutes: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                min="15"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                placeholder="Describe your service in detail..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870] resize-none"
                                                rows="3"
                                                maxLength="500"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                Service Image *
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#9fe870] transition">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="image-input"
                                                />
                                                <label htmlFor="image-input" className="cursor-pointer">
                                                    <p className="text-gray-600 font-semibold">Click to upload image</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                                </label>
                                            </div>
                                            {imagePreview && (
                                                <div className="mt-3 relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-2">✓ Image Preview</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* PRICING TAB */}
                                {activeTab === "pricing" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                    Base Price (₹) *
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={formData.basePrice}
                                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                    min="0"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                    Visiting Fees (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={formData.visitingFees}
                                                    onChange={(e) => setFormData({ ...formData, visitingFees: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                Discount (%) - Current: {formData.discount}%
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={formData.discount}
                                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9fe870]"
                                            />
                                        </div>

                                        <div className="bg-gradient-to-r from-[#f0f9ff] to-[#f0fdf4] p-4 rounded-lg border border-[#9fe870]/20">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-semibold">Final Price:</span>
                                                <span className="text-2xl font-bold text-[#9fe870]">₹{finalPrice}</span>
                                            </div>
                                            {formData.discount > 0 && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Save ₹{Math.round(discountAmount)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* AVAILABILITY TAB */}
                                {activeTab === "availability" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-3">
                                                Available Days
                                            </label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {days.map(day => (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => handleDayToggle(day)}
                                                        className={`p-3 rounded-lg font-semibold transition ${formData.availableDays.includes(day)
                                                            ? 'bg-[#9fe870] text-stone-900 shadow-md'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {day.slice(0, 3)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                    From Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={formData.availableTime.from}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        availableTime: { ...formData.availableTime, from: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                    To Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={formData.availableTime.to}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        availableTime: { ...formData.availableTime, to: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                Service Radius (km)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.serviceArea.radiusKm}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    serviceArea: { ...formData.serviceArea, radiusKm: e.target.value }
                                                })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* SETTINGS TAB */}
                                {activeTab === "settings" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                Max Bookings Per Day
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.maxBookingsPerDay}
                                                onChange={(e) => setFormData({ ...formData, maxBookingsPerDay: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                min="1"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    className="w-5 h-5 rounded accent-[#9fe870]"
                                                />
                                                <span className="font-semibold text-stone-900">Service Active</span>
                                            </label>

                                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.cancellationAllowed}
                                                    onChange={(e) => setFormData({ ...formData, cancellationAllowed: e.target.checked })}
                                                    className="w-5 h-5 rounded accent-[#9fe870]"
                                                />
                                                <span className="font-semibold text-stone-900">Allow Cancellations</span>
                                            </label>
                                        </div>

                                        {formData.cancellationAllowed && (
                                            <div>
                                                <label className="block text-sm font-semibold text-stone-900 mb-2">
                                                    Cancellation Window (hours)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.cancellationWindowHours}
                                                    onChange={(e) => setFormData({ ...formData, cancellationWindowHours: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870]"
                                                    min="0"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Hours before booking to allow cancellation</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-[#9fe870] to-[#8ed65f] text-stone-900 py-3 rounded-lg font-semibold hover:scale-105 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                    >
                                        <FiCheck /> {editingId ? "Update Service" : "Add Service"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services && services.length > 0 ? (
                    services.map((service) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group"
                        >
                            {service.image && (
                                <div className="relative h-40 overflow-hidden bg-gray-100">
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                    />
                                    {!service.isActive && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Inactive</span>
                                        </div>
                                    )}
                                    {service.approvalStatus === 'pending' && (
                                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            Pending
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-stone-900 line-clamp-2">{service.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">{service.description?.substring(0, 50)}...</p>

                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Price:</span>
                                        <div className="flex items-center gap-2">
                                            {service.discount > 0 && (
                                                <span className="text-xs line-through text-gray-500">₹{service.basePrice}</span>
                                            )}
                                            <span className="text-lg font-bold text-[#9fe870]">₹{service.finalPrice || service.basePrice}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="font-semibold">{service.durationInMinutes} mins</span>
                                    </div>
                                    {service.availableDays && service.availableDays.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {service.availableDays.map(day => (
                                                <span key={day} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                    {day.slice(0, 3)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="flex-1 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold flex items-center justify-center gap-2"
                                    >
                                        <FiEdit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service._id)}
                                        className="flex-1 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold flex items-center justify-center gap-2"
                                    >
                                        <FiTrash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-600 text-lg">No services yet. Create your first service!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

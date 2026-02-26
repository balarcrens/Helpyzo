/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import {
    FiEdit, FiTrash2, FiPlus, FiX, FiCheck,
    FiTag, FiImage, FiFileText, FiGrid,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "../../../hooks/useData";
import ToastContext from "../../../context/Toast/ToastContext"

const inputCls =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-gray-50 placeholder:text-gray-400";
const labelCls = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5";

const cardPalette = [
    "from-violet-400 to-indigo-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-400",
    "from-pink-400 to-rose-500",
    "from-cyan-400 to-sky-500",
    "from-lime-400 to-green-500",
];

export default function Categories() {
    const { showToast } = useContext(ToastContext);
    const { categories, createCategory, updateCategory, deleteCategory, loading } = useCategories();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [formData, setFormData] = useState({ name: "", description: "", image: "" });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) { showToast("Please select an image", "info"); return; }
        if (!formData.name) { showToast("Please fill in category name", "info"); return; }
        try {
            if (editingId) {
                await updateCategory(editingId, formData);
            } else {
                await createCategory(formData);
            }
            handleCancel();
        } catch (error) {
            showToast(error.message || "Failed to create / update category", "error");
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setFormData(category);
        setImagePreview(category.image);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: "", description: "", image: "" });
        setImagePreview("");
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Categories</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {categories?.length
                            ? `${categories.length} categor${categories.length > 1 ? "ies" : "y"} configured`
                            : "No categories yet — add your first"}
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="self-start sm:self-auto flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition cursor-pointer active:scale-95 shadow-sm"
                >
                    <FiPlus size={16} /> Add Category
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={handleCancel}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 24 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 24 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal header */}
                            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                                        <FiTag size={16} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-gray-900">
                                            {editingId ? "Edit Category" : "Add New Category"}
                                        </h3>
                                        <p className="text-[11px] text-gray-400">Fields marked * are required</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="h-8 w-8 cursor-pointer rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition active:scale-90"
                                >
                                    <FiX size={15} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Name */}
                                <div>
                                    <label className={labelCls}>Category Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Home Cleaning, Plumbing…"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={inputCls}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={labelCls}>Description</label>
                                    <textarea
                                        placeholder="Describe this category…"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className={`${inputCls} resize-none`}
                                        rows="3"
                                        maxLength="300"
                                    />
                                    <p className="text-[11px] text-gray-400 mt-1 text-right">{formData.description?.length || 0}/300</p>
                                </div>

                                {/* Image upload */}
                                <div>
                                    <label className={labelCls}>Category Image *</label>
                                    <label
                                        htmlFor="category-image-input"
                                        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-violet-400 rounded-2xl py-7 cursor-pointer transition bg-gray-50 hover:bg-violet-50/20"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-400">
                                            <FiImage size={18} />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-600">Click to upload image</p>
                                        <p className="text-xs text-gray-400">PNG, JPG, JPEG — up to 5MB</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="category-image-input"
                                        />
                                    </label>

                                    {imagePreview && (
                                        <div className="mt-3 relative rounded-2xl overflow-hidden border border-gray-100">
                                            <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                                            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                                ✓ Preview
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-2.5 rounded-2xl text-sm font-bold transition active:scale-95"
                                    >
                                        <FiCheck size={15} />
                                        {loading ? "Saving…" : editingId ? "Update Category" : "Add Category"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 py-2.5 rounded-2xl text-sm font-bold transition active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Content ── */}
            {loading ? (
                /* Skeleton */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
                            <div className="h-40 bg-gray-100" />
                            <div className="p-4 space-y-2">
                                <div className="h-3.5 w-2/3 bg-gray-100 rounded-full" />
                                <div className="h-2.5 w-full bg-gray-100 rounded-full" />
                                <div className="h-2.5 w-4/5 bg-gray-100 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : categories && Array.isArray(categories) && categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {categories.map((category, idx) => (
                        <motion.div
                            key={category?._id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                        >
                            {/* Image or gradient fallback */}
                            <div className="relative h-40 overflow-hidden bg-gray-100">
                                {category?.image ? (
                                    <img
                                        src={category.image}
                                        alt={category?.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${cardPalette[idx % cardPalette.length]} flex items-center justify-center`}>
                                        <FiTag size={32} className="text-white/70" />
                                    </div>
                                )}
                                {/* Category index badge */}
                                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    #{idx + 1}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                <h3 className="text-sm font-extrabold text-gray-900 line-clamp-1">{category?.name || "Unnamed"}</h3>
                                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                                    {category?.description || "No description provided"}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition active:scale-95"
                                    >
                                        <FiEdit size={13} /> Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category?._id)}
                                        className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition active:scale-95"
                                    >
                                        <FiTrash2 size={13} /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* Empty state */
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                        <FiGrid size={26} className="text-violet-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">No categories yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first category to organise services</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-xl transition"
                    >
                        <FiPlus size={13} /> Add your first category
                    </button>
                </div>
            )}
        </div>
    );
}

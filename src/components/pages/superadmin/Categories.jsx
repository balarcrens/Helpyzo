/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories } from "../../../hooks/useData";

export default function Categories() {
    const { categories, createCategory, updateCategory, deleteCategory, loading } = useCategories();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) {
            alert("Please select an image");
            return;
        }
        if (!formData.name) {
            alert("Please fill in category name");
            return;
        }
        try {
            if (editingId) {
                await updateCategory(editingId, formData);
            } else {
                await createCategory(formData);
            }
            handleCancel();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (categoryId) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(categoryId);
            } catch (error) {
                alert(error.message);
            }
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-stone-900">Categories</h2>
                    <p className="text-gray-600 mt-1">Manage service categories</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#9fe870] to-[#8ed65f] text-stone-900 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
                >
                    <FiPlus size={20} /> Add Category
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                        onClick={handleCancel}
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
                                    {editingId ? "Edit Category" : "Add New Category"}
                                </h3>
                                <button
                                    onClick={handleCancel}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                                        Category Name *
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
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Describe this category..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9fe870] resize-none"
                                        rows="3"
                                        maxLength="300"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/300</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-stone-900 mb-2">
                                        Category Image *
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#9fe870] transition">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="category-image-input"
                                        />
                                        <label htmlFor="category-image-input" className="cursor-pointer">
                                            <div className="text-center">
                                                <p className="text-gray-600 font-semibold">Click to upload image</p>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                                            </div>
                                        </label>
                                    </div>
                                    {imagePreview && (
                                        <div className="mt-4 relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">✓ Image Preview</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-[#9fe870] to-[#8ed65f] text-stone-900 py-3 rounded-lg font-semibold hover:scale-105 disabled:opacity-50 transition flex items-center justify-center gap-2"
                                    >
                                        <FiCheck /> {editingId ? "Update Category" : "Add Category"}
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

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(categories && Array.isArray(categories) && categories.length > 0) ? (
                        categories.map((category) => (
                            <motion.div
                                key={category?._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition group"
                            >
                                {category?.image && (
                                    <div className="relative h-40 overflow-hidden bg-gray-100">
                                        <img
                                            src={category.image}
                                            alt={category?.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-stone-900 line-clamp-2">{category?.name || 'Unnamed'}</h3>
                                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{category?.description || 'No description'}</p>

                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="flex-1 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold flex items-center justify-center gap-2"
                                        >
                                            <FiEdit size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category?._id)}
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
                            <p className="text-gray-600 text-lg">No categories yet. Create your first category!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

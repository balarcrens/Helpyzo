import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookings } from "../hooks/useData";

const RatingModal = ({ isOpen, bookingId, partnerName, serviceName, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { rateBooking } = useBookings();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await rateBooking(bookingId, rating, review);

            // Reset form
            setRating(0);
            setReview("");

            // Notify parent component
            if (onSuccess) {
                onSuccess();
            }

            // Close modal
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit rating");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-50"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Rate This Service</h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    {partnerName} - {serviceName}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Star Rating */}
                                <div className="flex justify-center gap-2 py-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="focus:outline-none"
                                        >
                                            <svg
                                                className={`w-10 h-10 transition-colors duration-200 ${(hoverRating || rating) >= star
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        </motion.button>
                                    ))}
                                </div>

                                {rating > 0 && (
                                    <p className="text-center text-sm font-semibold text-blue-600">
                                        You selected {rating} star{rating !== 1 ? "s" : ""}
                                    </p>
                                )}

                                {/* Review Text */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Add a review (optional)
                                    </label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Share your experience with this service..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        rows="4"
                                        maxLength="500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {review.length}/500 characters
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        type="submit"
                                        disabled={loading || rating === 0}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : (
                                            "Submit Rating"
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RatingModal;

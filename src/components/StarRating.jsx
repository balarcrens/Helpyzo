/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const StarRating = ({ rating = 0, totalRatings = 0, size = "md", showLabel = true }) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    const renderStars = () => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.svg
                        key={star}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: star * 0.05 }}
                        className={`${sizeClasses[size]} ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </motion.svg>
                ))}
            </div>
        );
    };

    return (
        <div className="flex items-center gap-2">
            {renderStars()}
            {showLabel && (
                <span className="text-xs font-medium text-gray-700">
                    {Number(rating) > 0 ? (
                        <>
                            <span className="text-yellow-600">{Number(rating).toFixed(1)}</span>
                            {totalRatings > 0 && (
                                <span className="text-gray-500"> ({totalRatings})</span>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-500">No ratings</span>
                    )}
                </span>
            )}
        </div>
    );
};

export const RatingBadge = ({ rating = 0, totalRatings = 0 }) => {
    if (Number(rating) === 0) {
        return (
            <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                No ratings yet
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full"
        >
            <span className="text-yellow-600 font-bold text-sm">{Number(rating).toFixed(1)}</span>
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-yellow-400" : "text-yellow-200"
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                ))}
            </div>
            {totalRatings > 0 && (
                <span className="text-xs text-gray-600">({totalRatings})</span>
            )}
        </motion.div>
    );
};

export const VerificationBadge = ({ verified = false, completedBookings = 0 }) => {
    if (!verified && completedBookings < 5) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${verified
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-blue-50 border border-blue-200 text-blue-700"
                }`}
        >
            {verified ? (
                <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Verified Partner
                </>
            ) : (
                <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M6.707 6.707a1 1 0 010 1.414L5.414 9l1.293 1.293a1 1 0 01-1.414 1.414L4 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L2.586 9 1.293 7.707a1 1 0 011.414-1.414L4 7.586l1.293-1.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {completedBookings} Completed
                </>
            )}
        </motion.div>
    );
};

export default StarRating;

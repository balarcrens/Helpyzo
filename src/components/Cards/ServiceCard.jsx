/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { AiFillStar } from "react-icons/ai";
import { HiBadgeCheck } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
import StarRating from "../StarRating";

const ServiceCard = ({ item, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className=" snap-start w-[300px] flex-shrink-0 rounded-3xl bg-white ring-1 ring-stone-200 shadow-sm hover:shadow-xl transition cursor-pointer">
            {/* IMAGE */}
            <div className="relative h-56 overflow-hidden rounded-t-3xl">
                <img
                    src={item.image || item.img}
                    alt={item.name || item.title}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Badge */}
                {item.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-[#9fe870] text-black">
                        {item.badge}
                    </span>
                )}

                {/* Rating */}
                {(item.partnerRating || item.rating) && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-black/70 text-white">
                        <AiFillStar className="text-yellow-400 text-sm" />
                        {Number(item.partnerRating || item.rating).toFixed(1)}
                    </span>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg leading-tight">
                        {item.name || item.title}
                    </h3>
                    {item.partnerName && (
                        <p className="text-sm text-stone-600">{item.partnerName}</p>
                    )}
                </div>

                {/* Star Rating */}
                {(item.partnerRating || item.rating !== 0) && (
                    <StarRating
                        rating={item.partnerRating || item.rating}
                        totalRatings={item.partnerRatings || item.totalRatings}
                        size="sm"
                    />
                )}

                <div className="flex items-center gap-2 text-sm text-stone-600">
                    <HiBadgeCheck className="text-blue-600" />
                    Verified professional
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div>
                        <p className="text-lg font-bold">₹{item.finalPrice || item.visitingFees || 0}</p>
                        {item?.serviceArea?.radiusKm && (
                            <p className="flex items-center gap-1 text-xs text-stone-500">
                                <FiMapPin className="text-[11px]" />
                                {item?.serviceArea?.radiusKm} km radius area
                            </p>
                        )}
                    </div>

                    <button
                        onClick={(e) => e.stopPropagation()}
                        className=" px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition"
                    >
                        Book
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
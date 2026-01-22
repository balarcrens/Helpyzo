/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { AiFillStar } from "react-icons/ai";
import { HiBadgeCheck } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";

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
                    src={item.img}
                    alt={item.title}
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
                {item.rating && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-black/70 text-white">
                        <AiFillStar className="text-yellow-400 text-sm" />
                        {item.rating}
                    </span>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg leading-tight">
                    {item.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-stone-600">
                    <HiBadgeCheck className="text-blue-600" />
                    Verified professional
                </div>

                <div className="flex justify-between items-center pt-2">
                    <div>
                        <p className="text-lg font-bold">${item.price}</p>
                        {item.distance && (
                            <p className="flex items-center gap-1 text-xs text-stone-500">
                                <FiMapPin className="text-[11px]" />
                                {item.distance} km away
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
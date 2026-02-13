import {
    FaUserTie,
    FaPhoneAlt,
    FaCheckCircle,
    FaClock,
    FaBan,
    FaStar,
    FaTools,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function PartnerDetail() {
    const { id } = useParams();

    // 🔹 Mock Partner Data (replace with API later)
    const partner = {
        id,
        name: "Amit Electricals",
        owner: "Amit Patel",
        phone: "+91 98765 43210",
        status: "Active",
        joined: "12 Jan 2024",
        services: [
            {
                id: 1,
                name: "AC Repair",
                price: "₹499",
                totalBookings: 120,
                rating: 4.6,
            },
            {
                id: 2,
                name: "Wiring Installation",
                price: "₹899",
                totalBookings: 78,
                rating: 4.4,
            },
        ],
        reviews: [
            {
                user: "Rahul Sharma",
                rating: 5,
                comment: "Very professional service. Quick response!",
            },
            {
                user: "Neha Singh",
                rating: 4,
                comment: "Good work but arrived a bit late.",
            },
            {
                user: "Amit Verma",
                rating: 5,
                comment: "Highly recommended electrician.",
            },
        ],
    };

    const statusStyle = {
        Active: "bg-green-100 text-green-700",
        Pending: "bg-yellow-100 text-yellow-700",
        Blocked: "bg-red-100 text-red-700",
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Partner Details
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Complete overview of partner & services
                </p>
            </div>

            {/* Partner Info */}
            <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col md:flex-row gap-8">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                    {partner.name.charAt(0)}
                </div>

                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {partner.name}
                        </h2>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[partner.status]}`}
                        >
                            {partner.status}
                        </span>
                    </div>

                    <p className="text-gray-600">
                        <FaUserTie className="inline mr-2 text-gray-400" />
                        Owner: <span className="font-medium">{partner.owner}</span>
                    </p>

                    <p className="text-gray-600">
                        <FaPhoneAlt className="inline mr-2 text-gray-400" />
                        {partner.phone}
                    </p>

                    <p className="text-sm text-gray-500">
                        Joined on {partner.joined}
                    </p>
                </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <FaTools className="text-indigo-600" />
                    Services Provided
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partner.services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition"
                        >
                            <h4 className="font-semibold text-lg text-gray-900">
                                {service.name}
                            </h4>

                            <div className="mt-3 space-y-2 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium text-gray-900">
                                        Price:
                                    </span>{" "}
                                    {service.price}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-900">
                                        Bookings:
                                    </span>{" "}
                                    {service.totalBookings}
                                </p>
                                <p className="flex items-center gap-1">
                                    <FaStar className="text-yellow-400" />
                                    {service.rating} / 5
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Responses / Reviews */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <h3 className="text-xl font-semibold mb-6">
                    User Responses
                </h3>

                <div className="space-y-5">
                    {partner.reviews.map((review, i) => (
                        <div
                            key={i}
                            className="bg-gray-50 rounded-2xl p-5"
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-900">
                                    {review.user}
                                </p>
                                <div className="flex items-center gap-1 text-sm">
                                    <FaStar className="text-yellow-400" />
                                    {review.rating}
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mt-2">
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
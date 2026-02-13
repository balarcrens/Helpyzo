import {
    FaUserTie,
    FaCheckCircle,
    FaClock,
    FaBan,
    FaEye,
    FaUserSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Partners() {
    const navigate = useNavigate();

    const stats = [
        { label: "Total Partners", value: 26, icon: <FaUserTie />, color: "text-indigo-600" },
        { label: "Active", value: 18, icon: <FaCheckCircle />, color: "text-green-600" },
        { label: "Pending", value: 6, icon: <FaClock />, color: "text-yellow-600" },
        { label: "Blocked", value: 2, icon: <FaBan />, color: "text-red-600" },
    ];

    const partners = [
        {
            id: 1,
            name: "Amit Electricals",
            owner: "Amit Patel",
            phone: "+91 98765 43210",
            service: "Electrician",
            status: "Active",
        },
        {
            id: 2,
            name: "CleanPro Services",
            owner: "Neha Singh",
            phone: "+91 91234 56789",
            service: "Cleaning",
            status: "Pending",
        },
        {
            id: 3,
            name: "CoolCare AC",
            owner: "Rahul Sharma",
            phone: "+91 99887 66554",
            service: "AC Repair",
            status: "Blocked",
        },
    ];

    const statusStyle = {
        Active: "bg-green-100 text-green-700",
        Pending: "bg-yellow-100 text-yellow-700",
        Blocked: "bg-red-100 text-red-700",
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                    Service Partners
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Manage vendors, approvals & service partners
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((item, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-4 hover:shadow-lg transition"
                    >
                        <div className={`text-3xl ${item.color}`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{item.label}</p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {item.value}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Partner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {partners.map((partner) => (
                    <div
                        key={partner.id}
                        className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600">
                                {partner.name.charAt(0)}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900">
                                    {partner.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {partner.service}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[partner.status]}`}
                            >
                                {partner.status}
                            </span>
                        </div>

                        <div className="mt-5 space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="font-medium text-gray-900">Owner:</span>{" "}
                                {partner.owner}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Phone:</span>{" "}
                                {partner.phone}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => navigate(`/superadmin/partners/${partner.id}`)}
                                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                            >
                                <FaEye /> View
                            </button>

                            <button className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-xl text-sm font-semibold hover:bg-red-200 transition">
                                <FaUserSlash /> Disable
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

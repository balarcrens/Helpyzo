/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiUser,
    FiShield,
    FiCalendar,
    FiEdit,
    FiLock,
    FiCamera,
    FiTrash2,
    FiX,
    FiStar,
} from "react-icons/fi";
import { useContext, useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import AuthContext from "../../context/Auth/AuthContext.jsx";
import { useUser } from "../../hooks/useAuth";
import { useBookings } from "../../hooks/useData";
import RatingModal from "../RatingModal";


const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const { updateProfile, changePassword } = useUser();

    return (
        <Layout>
            <Header />
            <Profile
                user={user}
                updateProfile={updateProfile}
                changePassword={changePassword}
            />
        </Layout>
    );
};

export default ProfilePage;

const Profile = ({ user, updateProfile, changePassword }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const { fetchUserBookings } = useBookings();

    useEffect(() => {
        if (user?.role === "client") {
            getBookings();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-stone-500 text-lg">
                Loading profile...
            </div>
        );
    }

    const getBookings = async () => {
        try {
            const data = await fetchUserBookings();
            setBookings(data);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        }
    };

    return (
        <>
            <section className="bg-gradient-to-r from-stone-900 to-stone-800 text-white pt-26 pb-14">
                <div className="max-w-7xl mx-auto px-4 flex justify-center sm:justify-start items-center gap-6">
                    <img
                        src={
                            user.avatar?.url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.name
                            )}&background=111827&color=fff`
                        }
                        className="w-24 h-24 rounded-full ring-4 ring-white/20"
                    />

                    <div>
                        <h1 className="text-3xl font-bold text-center">{user.name}</h1>
                        <p className="text-sm text-stone-300 text-center capitalize">
                            {user.role}
                        </p>

                        <span
                            className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-semibold ${user.isActive
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                                }`}
                        >
                            {user.isActive ? "Active Account" : "Inactive"}
                        </span>
                    </div>
                </div>
            </section>

            <div className="lg:hidden bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-3 gap-4 text-center">
                    <button
                        onClick={() => setEditOpen(true)}
                        className="flex flex-col items-center gap-2 bg-slate-50 rounded-2xl py-4 shadow-sm hover:bg-slate-100 transition"
                    >
                        <FiEdit className="text-xl text-stone-900" />
                        <span className="text-xs font-semibold text-stone-800">
                            Edit
                        </span>
                    </button>

                    <button
                        onClick={() => setPasswordOpen(true)}
                        className="flex flex-col items-center gap-2 bg-slate-50 rounded-2xl py-4 shadow-sm hover:bg-slate-100 transition"
                    >
                        <FiLock className="text-xl text-stone-900" />
                        <span className="text-xs font-semibold text-stone-800">
                            Password
                        </span>
                    </button>

                    <button
                        className="flex flex-col items-center gap-2 bg-red-50 rounded-2xl py-4 shadow-sm hover:bg-red-100 transition"
                    >
                        <FiTrash2 className="text-xl text-red-600" />
                        <span className="text-xs font-semibold text-red-700">
                            Deactivate
                        </span>
                    </button>
                </div>
            </div>

            <section className="bg-slate-100 min-h-screen py-7">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-4">

                    {/* ===== RIGHT CONTENT ===== */}
                    <div className="lg:col-span-3 space-y-8">

                        <GlassCard title="Personal Information" icon={<FiUser />}>
                            <Info label="Email" value={user.email} icon={<FiMail />} />
                            <Info label="Phone" value={user.phone} icon={<FiPhone />} />
                            <Info label="Role" value={user.role} icon={<FiShield />} />
                            <Info
                                label="Joined"
                                value={new Date(user.createdAt).toDateString()}
                                icon={<FiCalendar />}
                            />
                        </GlassCard>

                        <GlassCard title="Address Details" icon={<FiMapPin />}>
                            <AddressLine value={user.address?.street} />
                            <AddressLine
                                value={`${user.address?.city}, ${user.address?.state}`}
                            />
                            <AddressLine
                                value={`${user.address?.pincode}, ${user.address?.country}`}
                            />
                            <ProfileMap address={user.address} />
                        </GlassCard>

                        {user.role === "client" && (
                            <GlassCard title="My Bookings" icon={<FiCalendar />}>
                                <UserBookingsList
                                    bookings={bookings}
                                    onRate={(booking) => {
                                        setSelectedBooking(booking);
                                        setShowRatingModal(true);
                                    }}
                                />
                            </GlassCard>
                        )}
                    </div>
                    <div className="sticky top-24 space-y-4 hidden lg:flex flex-col">
                        <button
                            onClick={() => setEditOpen(true)}
                            className="flex flex-col w-full items-center gap-2 bg-slate-50 rounded-2xl py-4 shadow-sm hover:bg-slate-100 transition"
                        >
                            <FiEdit className="text-xl text-stone-900" />
                            <span className="text-xs font-semibold text-stone-800">
                                Edit
                            </span>
                        </button>

                        <button
                            onClick={() => setPasswordOpen(true)}
                            className="flex flex-col w-full items-center gap-2 bg-slate-50 rounded-2xl py-4 shadow-sm hover:bg-slate-100 transition"
                        >
                            <FiLock className="text-xl text-stone-900" />
                            <span className="text-xs font-semibold text-stone-800">
                                Password
                            </span>
                        </button>

                        <button
                            className="flex flex-col w-full  items-center gap-2 bg-red-50 rounded-2xl py-4 shadow-sm hover:bg-red-100 transition"
                        >
                            <FiTrash2 className="text-xl text-red-600" />
                            <span className="text-xs font-semibold text-red-700">
                                Deactivate
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            <EditProfileModal
                open={editOpen}
                setOpen={setEditOpen}
                user={user}
                updateProfile={updateProfile}
            />

            <ChangePasswordModal
                open={passwordOpen}
                setOpen={setPasswordOpen}
                changePassword={changePassword}
            />

            {selectedBooking && (
                <RatingModal
                    isOpen={showRatingModal}
                    bookingId={selectedBooking._id}
                    partnerName={selectedBooking.partner?.name}
                    serviceName={selectedBooking.serviceName}
                    onClose={() => {
                        setShowRatingModal(false);
                        setSelectedBooking(null);
                    }}
                    onSuccess={() => fetchUserBookings()}
                />
            )}
        </>
    );
};

const EditProfileModal = ({ open, setOpen, user, updateProfile }) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: user.name || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "India",
        pincode: user.address?.pincode || "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const payload = {
                name: form.name,
                phone: form.phone,
                address: {
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    country: form.country || "India",
                    pincode: form.pincode,
                },
            };

            await updateProfile(payload);

            setOpen(false);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)} title="Edit Profile">
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                        {error}
                    </p>
                )}

                <GlassInput
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <GlassInput
                    label="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <GlassInput
                    label="Street"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                />

                <GlassInput
                    label="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                />

                <GlassInput
                    label="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                />

                <GlassInput
                    label="Country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
                <GlassInput
                    label="Pin Code"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />

                <PrimaryBtn label={loading ? "Saving..." : "Save Changes"} />
            </form>
        </Modal>
    );
};

const ChangePasswordModal = ({ open, setOpen }) => (
    <Modal open={open} onClose={() => setOpen(false)} title="Change Password">
        <GlassInput type="password" label="Current Password" />
        <GlassInput type="password" label="New Password" />
        <PrimaryBtn label="Update Password" />
    </Modal>
);

const Modal = ({ open, onClose, title, children }) => (
    <AnimatePresence>
        {open && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50"
            >
                <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-8 w-full max-w-md shadow-2xl border border-white/40"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <FiX className="cursor-pointer text-xl" onClick={onClose} />
                    </div>
                    <div className="space-y-5">{children}</div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const GlassCard = ({ title, icon, children }) => (
    <motion.div className="bg-white rounded-3xl shadow-md p-3 sm:p-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            {icon} {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </motion.div>
);

const Info = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
        <div className="text-xl text-stone-700">{icon}</div>
        <div>
            <p className="text-xs uppercase text-stone-500">{label}</p>
            <p className="font-semibold text-stone-900">{value || "—"}</p>
        </div>
    </div>
);

const AddressLine = ({ value }) => (
    <p className="bg-slate-50 rounded-xl px-4 py-2 text-sm">{value || "—"}</p>
);

const GlassInput = ({ label, type = "text", ...props }) => (
    <div className="relative">
        <input type={type} placeholder=" " {...props}
            className="peer w-full bg-white/60 backdrop-blur rounded-2xl px-4 pt-6 pb-2 outline-none border border-white/40 focus:ring-2 focus:ring-emerald-400 transition"
        />
        <label className="absolute left-4 top-2 text-xs text-stone-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
            {label}
        </label>
    </div>
);

const PrimaryBtn = ({ label }) => (
    <button className="w-full bg-stone-900 text-white rounded-xl py-3 font-semibold hover:bg-stone-800 transition">
        {label}
    </button>
);

const ProfileMap = ({ address }) => {
    if (!address) return null;

    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
        `${address.street}, ${address.city}, ${address.state}, ${address.country}`
    )}&t=k&z=18&output=embed`;

    return (
        <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-white/40 shadow-md">
            <iframe
                title="User Location"
                src={mapSrc}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );
};

const UserBookingsList = ({ bookings, onRate }) => {
    if (!bookings || bookings.length === 0) {
        return (
            <div className="text-center py-10 text-stone-500">
                <p className="text-sm">No bookings yet</p>
            </div>
        );
    }

    const statusStyles = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        confirmed: "bg-blue-50 text-blue-700 border-blue-200",
        "in-progress": "bg-purple-50 text-purple-700 border-purple-200",
        completed: "bg-green-50 text-green-700 border-green-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
    };

    return (
        <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory no-scrollbar">
                {bookings.map((booking) => (
                    <div
                        key={booking._id}
                        className="min-w-[300px] sm:min-w-[340px] snap-start 
                                   bg-white rounded-2xl border border-slate-200 
                                   shadow-sm hover:shadow-md transition"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100">
                            <div className="flex justify-between items-start gap-3">
                                <h5 className="font-semibold text-stone-900 leading-snug">
                                    {booking.serviceName}
                                </h5>

                                <span
                                    className={`text-[11px] px-3 py-1 rounded-full font-semibold border 
                                    ${statusStyles[booking.status]}`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            <p className="text-xs text-stone-500 mt-1">
                                Booking ID •{" "}
                                <span className="font-medium text-stone-700">
                                    {booking.bookingNumber}
                                </span>
                            </p>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4 space-y-2 text-sm text-stone-700">
                            <p className="flex justify-between">
                                <span className="text-stone-500">Partner</span>
                                <span className="font-medium">
                                    {booking.partner?.name || "—"}
                                </span>
                            </p>

                            <p className="flex justify-between">
                                <span className="text-stone-500">Date</span>
                                <span className="font-medium">
                                    {new Date(booking.bookedDate).toLocaleDateString()}
                                </span>
                            </p>

                            <p className="flex justify-between">
                                <span className="text-stone-500">Time</span>
                                <span className="font-medium">
                                    {booking.scheduledTime}
                                </span>
                            </p>

                            <p className="flex justify-between">
                                <span className="text-stone-500">Payment</span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-semibold
                                    ${booking.paymentStatus === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-orange-100 text-orange-700"
                                        }`}
                                >
                                    {booking.paymentStatus}
                                </span>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-lg font-bold text-stone-900">
                                ₹{booking.amount}
                            </p>

                            {booking.status === "completed" && !booking.rating && (
                                <button
                                    onClick={() => onRate?.(booking)}
                                    className="text-xs font-semibold px-4 py-2 rounded-full 
                                               bg-yellow-500/10 text-yellow-700 
                                               hover:bg-yellow-500/20 transition"
                                >
                                    Rate Service
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
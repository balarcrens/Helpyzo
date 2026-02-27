/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import {
    FiMail, FiPhone, FiMapPin, FiUser, FiShield,
    FiCalendar, FiEdit, FiLock, FiCamera, FiTrash2,
    FiX, FiStar, FiCheckCircle, FiActivity,
} from "react-icons/fi";
import { useContext, useState, useEffect, useRef } from "react";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import AuthContext from "../../context/Auth/AuthContext.jsx";
import { useUser, usePartner } from "../../hooks/useAuth";
import { useBookings } from "../../hooks/useData";
import RatingModal from "../RatingModal";
import { partnerAPI, userAPI } from "../../services/api.js";
import ToastContext from "../../context/Toast/ToastContext.jsx";

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const userAuth = useUser();
    const partnerAuth = usePartner();
    const { updateProfile, changePassword } = user?.role === "client" || user?.role === "superadmin" ? userAuth : partnerAuth;
    return (
        <Layout>
            <Header />
            <Profile user={user} setUser={setUser} updateProfile={updateProfile} changePassword={changePassword} />
        </Layout>
    );
};
export default ProfilePage;

const Profile = ({ user, setUser, updateProfile, changePassword }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const { fetchUserBookings } = useBookings();

    useEffect(() => { if (user?.role) getBookings(); }, []);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await userAPI.getProfile();
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user));
            } catch (err) {
                logout();
            }
        };

        if (user) {
            loadProfile();
        }
    }, []);

    if (!user) return (
        <div className="min-h-[60vh] flex items-center justify-center text-stone-500 text-lg">
            Loading profile...
        </div>
    );

    const getBookings = async () => {
        try { const data = await fetchUserBookings(); setBookings(data); }
        catch (err) { console.error("Failed to fetch bookings", err); }
    };

    const avatar =
        user?.profileImage ||
        user?.avatar?.url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=111827&color=fff`;

    const completedCount = bookings.filter((b) => b.status === "completed").length;
    const pendingCount = bookings.filter((b) => b.status === "pending" || b.status === "confirmed").length;
    const totalSpent = bookings.reduce((sum, b) => sum + (b.status === "completed" ? b.amount : 0), 0);

    const handleChangeStatus = async () => {
        try {
            const nextStatus = !user.isActive;
            await userAPI.changeStatus(user._id, nextStatus);

            const { data } = await userAPI.getProfile();
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <section className="relative bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 text-white pt-28 pb-20 overflow-hidden">
                <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#9fe870]/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    <div className="relative flex-shrink-0">
                        <div className="h-28 w-28 rounded-3xl ring-4 ring-[#9fe870]/30 overflow-hidden shadow-2xl">
                            <img src={avatar} alt={user.name} className="h-full w-full object-cover" />
                        </div>
                        {user.isActive && (
                            <span className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#9fe870] border-2 border-stone-900 shadow" title="Active" />
                        )}
                    </div>

                    <div className="text-center sm:text-left flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#9fe870]/70 mb-1">
                            {user.role}
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{user.name}</h1>
                        <p className="mt-1 text-sm text-stone-400">{user.email}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${user.isActive ? "bg-[#9fe870]/15 text-[#9fe870]" : "bg-red-500/15 text-red-400"
                                }`}>
                                <span className={`h-1.5 w-1.5 rounded-full inline-block ${user.isActive ? "bg-[#9fe870]" : "bg-red-400"}`} />
                                {user.isActive ? "Active Account" : "Inactive"}
                            </span>
                            <span className="text-xs text-stone-500">
                                Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                            </span>
                        </div>
                    </div>

                    <div className="hidden sm:flex gap-2 flex-shrink-0">
                        <button onClick={() => setEditOpen(true)}
                            className="flex items-center gap-2 bg-white/10 cursor-pointer hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition active:scale-95 backdrop-blur-sm">
                            <FiEdit size={14} /> Edit Profile
                        </button>
                        <button onClick={() => setPasswordOpen(true)}
                            className="flex items-center gap-2 bg-[#9fe870]/15 cursor-pointer hover:bg-[#9fe870]/25 text-[#9fe870] text-xs font-bold px-4 py-2.5 rounded-2xl transition active:scale-95">
                            <FiLock size={14} /> Password
                        </button>
                    </div>
                </div>

                <div className="sm:hidden mt-6 max-w-5xl mx-auto px-4 grid grid-cols-3 gap-2">
                    {[
                        { label: "Edit", icon: FiEdit, onClick: () => setEditOpen(true), style: "bg-white/10 text-white" },
                        { label: "Password", icon: FiLock, onClick: () => setPasswordOpen(true), style: "bg-[#9fe870]/15 text-[#9fe870]" },
                        { label: "Deactivate", icon: FiTrash2, onClick: () => { }, style: "bg-red-500/15 text-red-400" },
                    ].map(({ label, icon: Icon, onClick, style }) => (
                        <button key={label} onClick={onClick}
                            className={`flex flex-col items-center gap-1.5 cursor-pointer py-3 rounded-2xl text-xs font-bold transition active:scale-95 ${style}`}>
                            <Icon size={16} />{label}
                        </button>
                    ))}
                </div>
            </section>

            {(user.role === "client" || user.role === "superadmin") && (
                <section className="bg-white border-b border-slate-100 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-3 gap-3">
                        {[
                            { label: "Total Bookings", value: bookings.length, color: "text-indigo-600", bg: "bg-indigo-50" },
                            { label: "Completed", value: completedCount, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Total Spent", value: `₹${totalSpent}`, color: "text-[#7abf50]", bg: "bg-[#9fe870]/10" },
                        ].map(({ label, value, color, bg }) => (
                            <div key={label} className={`flex flex-col items-center py-3 rounded-2xl ${bg}`}>
                                <p className={`text-xl sm:text-2xl font-extrabold ${color}`}>{value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="bg-slate-50 min-h-screen py-8">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="space-y-5">

                        {/* Personal info card */}
                        <InfoCard title="Personal Information" icon={FiUser} accent="#9fe870">
                            <InfoRow icon={FiMail} label="Email" value={user.email} />
                            <InfoRow icon={FiPhone} label="Phone" value={user.phone} />
                            <InfoRow icon={FiShield} label="Role" value={user.role} titleCase />
                            <InfoRow icon={FiCalendar} label="Joined" value={new Date(user.createdAt).toDateString()} />
                        </InfoCard>

                        {/* Address card */}
                        <InfoCard title="Address" icon={FiMapPin} accent="#9fe870">
                            {user.address ? (
                                <div className="space-y-1.5">
                                    {[
                                        user?.address?.street,
                                        `${user?.address?.landmark}, ${user?.address?.city}, ${user?.address?.state}`,
                                        `${user?.address?.pincode}, ${user?.address?.country}`,
                                    ].map((line, i) => (
                                        <p key={i} className="text-sm text-stone-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                                            {line || "—"}
                                        </p>
                                    ))}
                                    <ProfileMap address={user.address} />
                                </div>
                            ) : (
                                <p className="text-sm text-stone-400">No address saved</p>
                            )}
                        </InfoCard>

                        <button onClick={handleChangeStatus} className={`hidden sm:flex w-full items-center justify-center gap-2 py-3 rounded-2xl ${user?.isActive ? 'bg-red-50 hover:bg-red-100 text-red-600' : 'bg-green-50 hover:bg-green-100 text-green-600'} text-xs font-bold border border-red-100 cursor-pointer transition active:scale-95`}>
                            {user?.isActive ? <FiTrash2 size={14} /> : <FiActivity size={14} />}
                            {user?.isActive ? 'Deactivate Account' : 'Activate Account'}
                        </button>
                    </div>

                    <div className="lg:col-span-2 space-y-5">
                        {user?.role === "client" || user?.role === "superadmin" && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-xl bg-[#9fe870]/15 flex items-center justify-center text-[#7abf50]">
                                            <FiCalendar size={14} />
                                        </div>
                                        <span className="text-sm font-extrabold text-stone-900">My Bookings</span>
                                    </div>
                                    {pendingCount > 0 && (
                                        <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
                                            {pendingCount} upcoming
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <UserBookingsList
                                        bookings={bookings}
                                        onRate={(booking) => { setSelectedBooking(booking); setShowRatingModal(true); }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modals */}
            <EditProfileModal open={editOpen} setOpen={setEditOpen} user={user} updateProfile={updateProfile} />
            <ChangePasswordModal open={passwordOpen} setOpen={setPasswordOpen} changePassword={changePassword} />

            {selectedBooking && (
                <RatingModal
                    isOpen={showRatingModal}
                    bookingId={selectedBooking._id}
                    partnerName={selectedBooking.partner?.name}
                    serviceName={selectedBooking.serviceName}
                    onClose={() => { setShowRatingModal(false); setSelectedBooking(null); }}
                    onSuccess={() => fetchUserBookings()}
                />
            )}
        </>
    );
};

const InfoCard = ({ title, icon: Icon, accent, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: `${accent}20`, color: accent }}>
                <Icon size={14} />
            </div>
            <h3 className="text-sm font-extrabold text-stone-900">{title}</h3>
        </div>
        <div className="p-4 space-y-2">{children}</div>
    </motion.div>
);

const InfoRow = ({ icon: Icon, label, value, titleCase }) => (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
        <Icon size={13} className="text-stone-400 flex-shrink-0" />
        <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">{label}</p>
            <p className={`text-sm font-semibold text-stone-800 truncate ${titleCase ? "capitalize" : ""}`}>{value || "—"}</p>
        </div>
    </div>
);

const EditProfileModal = ({ open, setOpen, user, updateProfile }) => {
    const { showToast } = useContext(ToastContext);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(user.profileImage || null);
    const profileInputRef = useRef(null);
    const [form, setForm] = useState({
        name: user.name || "", phone: user.phone || "",
        street: user.address?.street || "", landmark: user.address?.landmark || "", city: user.address?.city || "",
        state: user.address?.state || "", country: user.address?.country || "India",
        pincode: user.address?.pincode || "",
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError("");
        try {
            setLoading(true);
            const payload = {
                name: form.name, phone: form.phone,
                address: { street: form.street, landmark: form.landmark, city: form.city, state: form.state, country: form.country || "India", pincode: form.pincode },
                profileImage: profileImage || undefined,
            };

            if (user?.role === "client" || user?.role === "superadmin") await updateProfile(payload);
            else if (user?.role === "partner") await partnerAPI.updateProfile(payload);
            showToast("Profile updated successfully", "success");
            setOpen(false);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to update profile", "error");
            setError(err?.response?.data?.message || "Failed to update profile");
        } finally { setLoading(false); }
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)} title="Edit Profile">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar changer */}
                <div className="flex flex-col items-center gap-3">
                    <div onClick={() => profileInputRef.current?.click()}
                        className="relative group cursor-pointer h-24 w-24 rounded-3xl overflow-hidden border-2 border-dashed border-white/20 hover:border-[#9fe870]/70 transition-all">
                        <img
                            src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1c1c1c&color=fff`}
                            alt="Profile" className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiCamera size={18} className="text-[#9fe870]" />
                            <span className="text-[9px] font-bold text-[#9fe870] uppercase tracking-wide">Change</span>
                        </div>
                    </div>
                    <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Profile Photo</p>
                </div>

                {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">{error}</p>}

                <div className="grid grid-cols-2 gap-3">
                    <DarkInput label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="col-span-2" />
                    <DarkInput label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="col-span-2" />
                    <DarkInput label="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="col-span-2" />
                    <DarkInput label="Landmark" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} />
                    <DarkInput label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <DarkInput label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                    <DarkInput label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                    <DarkInput label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                </div>

                <button type="submit" disabled={loading}
                    className="w-full cursor-pointer bg-[#9fe870] hover:brightness-110 disabled:opacity-50 text-black py-3.5 rounded-2xl text-sm font-black tracking-wide transition-all shadow-[0_10px_30px_-10px_rgba(159,232,112,0.5)] active:scale-95">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </Modal>
    );
};

const ChangePasswordModal = ({ open, setOpen, changePassword }) => {
    const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(""); setSuccess("");
        if (form.newPassword !== form.confirm) { setError("New passwords do not match"); return; }
        if (form.newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
        try {
            setLoading(true);
            await changePassword(form.oldPassword, form.newPassword);
            setSuccess("Password updated successfully!");
            setForm({ oldPassword: "", newPassword: "", confirm: "" });
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to update password");
        } finally { setLoading(false); }
    };

    return (
        <Modal open={open} onClose={() => { setOpen(false); setError(""); setSuccess(""); }} title="Change Password">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">{error}</p>}
                {success && <p className="text-xs text-[#9fe870] bg-[#9fe870]/10 border border-[#9fe870]/20 px-4 py-2 rounded-xl">{success}</p>}
                <DarkInput type="password" label="Current Password" value={form.oldPassword} onChange={(e) => setForm({ ...form, oldPassword: e.target.value })} />
                <DarkInput type="password" label="New Password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
                <DarkInput type="password" label="Confirm New Password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
                <button type="submit" disabled={loading}
                    className="w-full cursor-pointer bg-[#9fe870] hover:brightness-110 disabled:opacity-50 text-black py-3.5 rounded-2xl text-sm font-black tracking-wide transition-all shadow-[0_10px_30px_-10px_rgba(159,232,112,0.5)] active:scale-95">
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </Modal>
    );
};

const Modal = ({ open, onClose, title, children }) => (
    <AnimatePresence>
        {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}>
                <motion.div
                    initial={{ scale: 0.92, y: 32, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.92, y: 32, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-[#0e0e0e] border border-white/10 rounded-[2rem] w-full max-w-lg shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
                    <div className="flex justify-between items-center px-7 pt-6 pb-4 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <button onClick={onClose}
                            className="h-8 w-8 cursor-pointer rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all">
                            <FiX size={15} />
                        </button>
                    </div>
                    <div className="px-7 py-6 max-h-[80vh] overflow-y-auto custom-scrollbar-minimal">{children}</div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const DarkInput = ({ label, type = "text", className = "", ...props }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 pl-1">{label}</label>
        <input type={type} {...props}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#9fe870]/40 focus:bg-white/[0.08] outline-none transition-all" />
    </div>
);

const ProfileMap = ({ address }) => {
    if (!address) return null;
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
        `${address.street}, ${address.city}, ${address.state}, ${address.country}`
    )}&t=k&z=18&output=embed`;
    return (
        <div className="mt-3 w-full h-48 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <iframe title="User Location" src={mapSrc} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
    );
};

const STATUS_CFG = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
    confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Confirmed" },
    "in-progress": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", label: "In Progress" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
    cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400", label: "Cancelled" },
};

const UserBookingsList = ({ bookings, onRate }) => {
    if (!bookings || bookings.length === 0) return (
        <div className="text-center py-12">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <FiCalendar size={22} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold text-stone-600">No bookings yet</p>
            <p className="text-xs text-stone-400 mt-1">Your booking history will appear here</p>
        </div>
    );

    return (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory no-scrollbar">
            {bookings.map((booking, idx) => {
                const sc = STATUS_CFG[booking.status] || { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400", label: booking.status };
                return (
                    <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="min-w-[300px] sm:min-w-[320px] snap-start bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex-shrink-0"
                    >
                        {/* Card header */}
                        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                            <div className="flex items-start justify-between gap-1.5">
                                <div className="min-w-0">
                                    <h5 className="font-bold text-stone-900 text-sm leading-snug truncate">{booking.serviceName}</h5>
                                    <p className="text-[11px] text-stone-400 mt-0.5 font-mono">#{booking.bookingNumber}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-xl flex-shrink-0 ${sc.bg} ${sc.text}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                                    {sc.label}
                                </span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-4 space-y-2 text-sm">
                            {[
                                { label: "Partner", value: booking.partner?.name || "—" },
                                { label: "Date", value: new Date(booking.bookedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                                { label: "Time", value: booking.scheduledTime || "—" },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center">
                                    <span className="text-stone-400 text-xs">{label}</span>
                                    <span className="font-semibold text-stone-800 text-xs">{value}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center">
                                <span className="text-stone-400 text-xs">Payment</span>
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${booking.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                    }`}>
                                    {booking.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-base font-extrabold text-stone-900">₹{booking.amount}</p>
                            {booking.status === "completed" && !booking.rating && (
                                <button onClick={() => onRate?.(booking)}
                                    className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#9fe870]/15 text-[#5a9a30] hover:bg-[#9fe870]/25 transition active:scale-95">
                                    <FiStar size={11} /> Rate Service
                                </button>
                            )}
                            {booking.status === "completed" && booking.rating && (
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                    <FiCheckCircle size={12} /> Rated
                                </span>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
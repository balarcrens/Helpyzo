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
} from "react-icons/fi";
import { useContext, useState } from "react";
import Layout from "../Layout/Layout";
import Header from "../Layout/Header";
import AuthContext from "../../context/Auth/AuthContext.jsx";

const ProfilePage = () => {
    const { user, setUser, logout } = useContext(AuthContext);

    return (
        <Layout>
            <Header />
            <Profile user={user} setUser={setUser} logout={logout} />
        </Layout>
    );
};

export default ProfilePage;

const Profile = ({ user }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-stone-500 text-lg animate-pulse">
                Loading profile...
            </div>
        );
    }

    return (
        <>
            <section className="bg-gradient-to-br from-slate-100 via-white to-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* LEFT CARD */}
                    <motion.aside
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 border border-white/40 lg:sticky lg:top-28"
                    >
                        <div className="flex flex-col items-center text-center">
                            <label className="relative group cursor-pointer">
                                <img src={
                                    user.avatar?.url ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        user.name
                                    )}&background=111827&color=fff`
                                }
                                    className="w-36 h-36 rounded-full object-cover ring-4 ring-white shadow-lg transition group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <FiCamera className="text-white text-2xl" />
                                </div>
                                <input type="file" hidden />
                            </label>

                            <h2 className="text-2xl font-bold mt-5">{user.name}</h2>
                            <p className="text-xs uppercase tracking-widest text-stone-500">
                                {user.role}
                            </p>

                            <span
                                className={`mt-4 px-5 py-1 rounded-full text-xs font-semibold ${user.isActive
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {user.isActive ? "Active Account" : "Inactive"}
                            </span>

                            <div className="w-full mt-8 space-y-3">
                                <ActionBtn
                                    icon={<FiEdit />}
                                    label="Edit Profile"
                                    onClick={() => setEditOpen(true)}
                                />
                                <ActionBtn
                                    icon={<FiLock />}
                                    label="Change Password"
                                    onClick={() => setPasswordOpen(true)}
                                />
                                <ActionBtn icon={<FiTrash2 />} label="Deactivate" danger />
                            </div>
                        </div>
                    </motion.aside>

                    {/* RIGHT */}
                    <div className="lg:col-span-2 space-y-10">
                        <GlassCard title="Personal Information" icon={<FiUser />}>
                            <Info label="Email" value={user.email} icon={<FiMail />} />
                            <Info label="Phone" value={user.phone} icon={<FiPhone />} />
                            <Info label="Role" value={user.role} icon={<FiShield />} />
                            <Info label="Joined" value={new Date(user.createdAt).toDateString()}
                                icon={<FiCalendar />}
                            />
                        </GlassCard>

                        <GlassCard title="Address Details" icon={<FiMapPin />}>
                            <AddressLine value={user.address?.street} />
                            <AddressLine value={`${user.address?.city}, ${user.address?.state}`} />
                            <AddressLine value={`${user.address?.zipCode}, ${user.address?.country}`} />

                            <ProfileMap address={user.address} />
                        </GlassCard>
                    </div>
                </div>
            </section>

            <EditProfileModal open={editOpen} setOpen={setEditOpen} user={user} />
            <ChangePasswordModal open={passwordOpen} setOpen={setPasswordOpen} />
        </>
    );
};

const EditProfileModal = ({ open, setOpen, user }) => {
    const [form, setForm] = useState({
        name: user.name,
        phone: user.phone,
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
    });

    return (
        <Modal open={open} onClose={() => setOpen(false)} title="Edit Profile">
            <GlassInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <GlassInput label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <GlassInput label="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            <GlassInput label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <GlassInput label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <GlassInput label="Zip Code" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
            <PrimaryBtn label="Save Changes" />
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
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/40"
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
    <motion.div className="bg-white/70 backdrop-blur-md rounded-[32px] p-8 border border-white/40">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            {icon} {title}
        </h3>
        <div className="space-y-4">{children}</div>
    </motion.div>
);

const Info = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 bg-white/60 rounded-2xl border-b border-gray-200 p-2.5 hover:bg-white/80 transition">
        <div className="text-lg">{icon}</div>
        <div>
            <p className="text-xs uppercase text-stone-500">{label}</p>
            <p className="font-semibold">{value || "—"}</p>
        </div>
    </div>
);

const AddressLine = ({ value }) => (
    <p className="bg-white/60 rounded-xl text-sm">{value || "—"}</p>
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

const ActionBtn = ({ icon, label, danger, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${danger
        ? "bg-red-100 text-red-700 hover:bg-red-200"
        : "bg-stone-900 text-white hover:bg-stone-800"
        }`}>
        {icon} {label}
    </button>
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
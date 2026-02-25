/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Phone,
    User,
    MessageSquare,
    Trash2,
    Search,
    X,
    Inbox,
    Clock,
    ChevronDown,
    ChevronUp,
    ExternalLink,
} from "lucide-react";
import { contactAPI, userAPI } from "../../../services/api";
import ToastContext from "../../../context/Toast/ToastContext";

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" },
    }),
    exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function Contact() {
    const { showConfirm, showToast } = useContext(ToastContext);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(null); // id of expanded card
    const [deleting, setDeleting] = useState(null); // id being deleted
    const [users, setUsers] = useState([]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await contactAPI.getAllContact();
            const data = res?.data?.contacts ?? res?.data ?? [];
            setContacts(Array.isArray(data) ? data : []);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to load contact messages.", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await userAPI.getAllUsers();
            const data = res?.data?.users ?? res?.data ?? [];
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to load users.", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchContacts(); fetchUsers(); }, []);

    const handleDelete = async (id) => {
        const confirmed = await showConfirm({
            message: "Are you sure want to delete this contact message?",
            subMessage: "This action cannot be undone.",
            type: "danger",
            confirmLabel: "Delete",
        })

        if (!confirmed) return;
        try {
            setDeleting(id);
            await contactAPI.deleteContact(id);
            setContacts((prev) => prev.filter((c) => c._id !== id));
            if (expanded === id) setExpanded(null);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete.");
        } finally {
            setDeleting(null);
        }
    };

    const filtered = contacts.filter((c) => {
        const q = search.toLowerCase();
        const user = users.find((u) => u._id === c.user);
        return (
            user?.name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.phone?.toLowerCase().includes(q) ||
            c.subject?.toLowerCase().includes(q) ||
            c.message?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 pb-10">
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        All enquiries submitted via the contact form
                    </p>
                </div>

                {/* Stats pill */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm text-gray-600 w-fit">
                    <Inbox size={14} className="text-gray-400" />
                    <span><span className="font-semibold text-gray-900">{contacts.length}</span> total</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3 }}
                className="relative"
            >
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by name, email, subject…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9fe870]/60 transition"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition"
                    >
                        <X size={14} className="text-gray-400" />
                    </button>
                )}
            </motion.div>

            {loading && (
                <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 rounded-full border-2 border-[#9fe870] border-t-transparent animate-spin" />
                </div>
            )}

            {!loading && error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-sm text-red-600">
                    {error}
                    <button
                        onClick={fetchContacts}
                        className="ml-3 underline font-semibold hover:text-red-800"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-gray-400"
                >
                    <MessageSquare size={40} className="mb-4 opacity-30" />
                    <p className="text-sm font-medium">
                        {search ? "No messages match your search." : "No contact messages yet."}
                    </p>
                </motion.div>
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filtered.map((contact, i) => {
                            const user = users.find((u) => u._id === contact.user);
                            const isExpanded = expanded === contact._id;
                            return (
                                <motion.div
                                    key={contact._id}
                                    custom={i}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
                                >
                                    {/* Card Header */}
                                    <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
                                        {/* Avatar + name */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-[#9fe870]/20 flex items-center justify-center shrink-0">
                                                <span className="text-[#5fb53a] font-bold text-sm">
                                                    {user?.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {user?.name || "Unknown"}
                                                </p>
                                                {contact.subject && (
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                        {contact.subject}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => setExpanded(isExpanded ? null : contact._id)}
                                                className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-400 hover:text-gray-700"
                                                title={isExpanded ? "Collapse" : "Expand"}
                                            >
                                                {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact._id)}
                                                disabled={deleting === contact._id}
                                                className="p-2 rounded-xl hover:bg-red-50 transition text-gray-400 hover:text-red-600 disabled:opacity-40"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-gray-100 mx-5" />

                                    {/* Contact Info */}
                                    <div className="px-5 py-4 space-y-2.5">
                                        {contact.email && (
                                            <a
                                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-indigo-600 transition group"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition">
                                                    <Mail size={13} className="text-indigo-500" />
                                                </div>
                                                <span className="truncate">{contact.email}</span>
                                                <ExternalLink size={11} className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition" />
                                            </a>
                                        )}
                                        {contact.phone && (
                                            <a
                                                href={`tel:${contact.phone}`}
                                                className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-emerald-600 transition group"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition">
                                                    <Phone size={13} className="text-emerald-500" />
                                                </div>
                                                <span className="truncate">{contact.phone}</span>
                                            </a>
                                        )}
                                        {contact.createdAt && (
                                            <div className="flex items-center gap-2.5 text-xs text-gray-400">
                                                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                                    <Clock size={13} className="text-gray-400" />
                                                </div>
                                                <span>{formatDate(contact.createdAt)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Expandable Message */}
                                    <AnimatePresence initial={false}>
                                        {isExpanded && contact.message && (
                                            <motion.div
                                                key="msg"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mx-5 mb-5 mt-1 bg-gray-50 border border-gray-100 rounded-xl p-4">
                                                    <p className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                                        <MessageSquare size={11} /> Message
                                                    </p>
                                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                        {contact.message}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Collapsed message preview */}
                                    {!isExpanded && contact.message && (
                                        <div className="px-5 pb-5 mt-auto">
                                            <p className="text-xs text-gray-400 line-clamp-2 italic">
                                                "{contact.message}"
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
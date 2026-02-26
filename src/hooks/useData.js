/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext, useRef } from "react";
import { categoryAPI, partnerAPI, bookingAPI, notificationAPI, userAPI, contactAPI } from "../services/api";
import ToastContext from "../context/Toast/ToastContext";
import { usePartner } from "./useAuth";

// Custom hook for categories
export const useCategories = () => {
    const fetched = useRef(false);
    const { showToast, showConfirm } = useContext(ToastContext);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await categoryAPI.getAllCategories();
            setCategories(res.data.categories);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        fetchCategories();
    }, []);

    const createCategory = async (categoryData) => {
        try {
            setLoading(true);
            const res = await categoryAPI.createCategory(categoryData);
            setCategories([...categories, res.data.category]);
            showToast("Category created successfully", "success");
            return res.data.category;
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to create category", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (categoryId, categoryData) => {
        try {
            setLoading(true);
            const res = await categoryAPI.updateCategory(categoryId, categoryData);
            showToast("Category updated successfully", "success");
            setCategories(
                categories.map((c) => (c._id === categoryId ? res.data.category : c))
            );
            return res.data.category;
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to update category", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (categoryId) => {
        const confirmed = await showConfirm({
            message: "Are you sure you want to delete this category?",
            subMessage: "This action cannot be undone.",
            type: "danger",
            confirmLabel: "Delete",
        })

        if (!confirmed) return
        try {
            setLoading(true);
            await categoryAPI.deleteCategory(categoryId);
            setCategories(categories.filter((c) => c._id !== categoryId));
            showToast("Category deleted successfully", "success");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to delete category", "error");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { categories, loading, error, createCategory, updateCategory, deleteCategory, fetchCategories };
};

// Custom hook for users
export const useUsers = () => {
    const { showToast, showConfirm } = useContext(ToastContext)
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const fetched = useRef(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await userAPI.getAllUsers();
            setUsers(res.data.users);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        fetchUsers();
    }, []);

    const userDelete = async (userId) => {
        const confirmed = await showConfirm({
            message: "Are you sure you want to delete this user?",
            subMessage: "This action cannot be undone.",
            type: "danger",
            confirmLabel: "Delete",
        });

        if (!confirmed) return;
        try {
            setDeletingId(userId);
            await userAPI.deleteUser(userId);
            showToast("User deleted successfully", "success");
            setUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to delete user", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const userRoleChange = async (userId, userRole) => {
        const confirmed = await showConfirm({
            message: "Are you sure you want to change this user's role?",
            subMessage: "The user will have new permissions based on the selected role.",
            type: "warning",
            confirmLabel: "Change Role",
        });

        if (!confirmed) return;
        try {
            await userAPI.updateRole(userId, userRole);
            showToast("User role updated successfully", "success");
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: userRole } : u));
        } catch (error) {
            showToast(error?.message || "Failed to update user role", "error");
        }
    }

    return { fetchUsers, users, setUsers, loading, userDelete, deletingId, userRoleChange }
}

// Custom hook for partners
export const usePartners = () => {
    const fetched = useRef(false);
    const { showToast, showConfirm } = useContext(ToastContext);
    const [partners, setPartners] = useState([]);
    const [partner, setPartner] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const res = await partnerAPI.getAllPartners();
            setPartners(res.data.partners);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch partners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        fetchPartners();
    }, []);

    const handleDelete = async (partnerId) => {
        const confirmed = await showConfirm({
            message: "Are you sure you want to delete this partner?",
            subMessage: "This action cannot be undone.",
            type: "danger",
            confirmLabel: "Delete",
        });
        if (!confirmed) return;
        try {
            setDeletingId(partnerId);
            await partnerAPI.deletePartner(partnerId);
            showToast("Partner deleted successfully", "success");
            setPartners((prev) => prev.filter((p) => p._id !== partnerId));
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to delete partner", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const fetchPartnerDetails = async (partnerId) => {
        try {
            setLoading(true);
            const response = await partnerAPI.getPartnerById(partnerId);
            setPartner(response?.data?.partner);
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to load partner details", "error");
            console.error("Error fetching partner:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return { partners, setPartners, partner, setPartner, loading, error, fetchPartnerDetails, fetchPartners, handleDelete, deletingId };
};

// Custom hook for bookings
export const useBookings = () => {
    const fetchedAll = useRef(false);
    const fetchedPartner = useRef(false);
    const { showToast, showConfirm } = useContext(ToastContext)
    const [bookings, setBookings] = useState([]);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const { user } = usePartner();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await bookingAPI.getAllBookings();
            setBookings(res.data.bookings || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load bookings.");
        } finally { setLoading(false); }
    };
    useEffect(() => {
        if (fetchedAll.current) return;
        fetchedAll.current = true;
        fetchBookings();
    }, []);

    const fetchUserBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingAPI.getUserBookings();
            return res.data.bookings;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchPartnerBookings = async () => {
        try {
            const res = await bookingAPI.getPartnerBookings(user._id);
            setBookings(res.data.bookings);
        } catch (error) {
            console.error("Failed to load bookings", error.message);
            showToast("Failed to load bookings", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchedPartner.current) return;
        fetchedPartner.current = true;
        fetchPartnerBookings();
    }, []);

    const fetchBookingById = async (bookingId) => {
        try {
            const res = await bookingAPI.getBookingById(bookingId);
            setBooking(res.data.booking);
        } catch (err) {
            console.error("Failed to load booking", err.message);
            showToast("Failed to load booking", "error");
        } finally {
            setLoading(false);
        }
    };

    const createBooking = async (bookingData) => {
        try {
            setLoading(true);
            const res = await bookingAPI.createBooking(bookingData);
            setBookings([...bookings, res.data.booking]);
            return res.data.booking;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            setUpdatingId(bookingId);
            const res = await bookingAPI.updateBookingStatus(bookingId, newStatus);
            const updatedBooking = res.data.booking;
            showToast("Booking status updated successfully", "success");
            setBookings(prev =>
                prev.map(b => b._id === bookingId ? updatedBooking : b)
            );
            setBooking(prev =>
                prev?._id === bookingId ? updatedBooking : prev
            );
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to update status.", "error");
        } finally { setUpdatingId(null); }
    };

    const updateBookingPaymentStatus = async (bookingId, newStatus) => {
        try {
            await bookingAPI.updateBookingPaymentStatus(bookingId, newStatus);
            showToast("Payment status updated successfully", "success");
            fetchBookingById(bookingId);
        } catch (error) {
            showToast("Failed to update payment status", "error");
            console.error("Failed to update payment status", error.message);
        }
    };

    const deleteBooking = async (bookingId) => {
        const confirmed = await showConfirm({
            message: "Are you sure you want to delete this booking?",
            subMessage: "This action cannot be undone.",
            type: "danger",
            confirmLabel: "Delete Booking",
        });

        if (!confirmed) return;
        try {
            setDeletingId(bookingId);
            await bookingAPI.deleteBooking(bookingId);
            showToast("Booking deleted successfully", "success");
            setBookings(prev => prev.filter(b => b._id !== bookingId));
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to delete booking.", "error");
        } finally { setDeletingId(null); }
    };

    const rateBooking = async (bookingId, rating, review = "") => {
        try {
            setLoading(true);

            // Validation
            if (rating < 1 || rating > 5) {
                throw new Error("Rating must be between 1 and 5");
            }

            const res = await bookingAPI.rateBooking(bookingId, rating, review);

            // Update the booking in local state
            setBookings(
                bookings.map((b) => (b._id === bookingId ? res.data.booking : b))
            );

            setError(null);
            return res.data.booking;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to rate booking";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { bookings, booking, loading, error, deletingId, updatingId, fetchBookings, fetchUserBookings, fetchPartnerBookings, fetchBookingById, createBooking, updateBookingStatus, updateBookingPaymentStatus, deleteBooking, rateBooking, };
};

// Custom hook for notifications
export const useNotifications = () => {
    const fetched = useRef(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationAPI.getNotifications();

            setNotifications(res.data.notifications);
            setUnreadCount(
                res.data.notifications.filter(n => !n.isRead).length
            );
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        fetchNotifications();
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                )
            );
            setUnreadCount((c) => Math.max(c - 1, 0));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await notificationAPI.deleteNotification(notificationId);
            setNotifications((prev) =>
                prev.filter((n) => n._id !== notificationId)
            );
        } catch (err) {
            console.error(err);
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
};

// Custom hook for contacts
export const useContact = () => {
    const fetched = useRef(false);
    const { showConfirm, showToast } = useContext(ToastContext);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [deleting, setDeleting] = useState(null);
    const [expanded, setExpanded] = useState(null);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await contactAPI.getAllContact();
            const data = res?.data?.contacts ?? res?.data ?? [];
            setContacts(Array.isArray(data) ? data : []);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to load contact messages.", "error");
            setError(err?.message);
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
            setError(err?.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;
        fetchContacts();
        fetchUsers();
    }, []);

    const deleteContact = async (id) => {
        const confirmed = await showConfirm({
            message: "Are you sure you want to delete this contact message?",
            subMessage: "This action cannot be undone.",
            type: "danger",
            confirmLabel: "Delete",
        })

        if (!confirmed) return;
        try {
            setDeleting(id);
            await contactAPI.deleteContact(id);
            setContacts((prev) => prev.filter((c) => c._id !== id));
            showToast("Contact deleted successfully", "success");
            if (expanded === id) setExpanded(null);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete.");
        } finally {
            setDeleting(null);
        }
    };

    return { contacts, users, loading, fetchContacts, error, deleting, expanded, setExpanded, deleteContact }
}
import { useState, useEffect, useContext } from "react";
import { categoryAPI, partnerAPI, bookingAPI, notificationAPI } from "../services/api";
import ToastContext from "../context/Toast/ToastContext";

// Custom hook for categories
export const useCategories = () => {
    const { showToast } = useContext(ToastContext);
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
            showToast("Category Updated successfully", "success");
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
        try {
            setLoading(true);
            await categoryAPI.deleteCategory(categoryId);
            setCategories(categories.filter((c) => c._id !== categoryId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete category");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { categories, loading, error, createCategory, updateCategory, deleteCategory, refetch: fetchCategories };
};

// Custom hook for partners
export const usePartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        fetchPartners();
    }, []);

    const getPartnerById = async (partnerId) => {
        try {
            setLoading(true);
            const res = await partnerAPI.getPartnerById(partnerId);
            return res.data.partner;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch partner");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { partners, loading, error, getPartnerById, refetch: fetchPartners };
};

// Custom hook for bookings
export const useBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBookings = async (filters = {}) => {
        try {
            setLoading(true);
            const res = await bookingAPI.getAllBookings(filters);
            setBookings(res.data.bookings);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

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

    const fetchPartnerBookings = async (partnerId) => {
        try {
            setLoading(true);
            const res = await bookingAPI.getPartnerBookings(partnerId);
            setBookings(res.data.bookings);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
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

    const updateBookingStatus = async (bookingId, status) => {
        try {
            setLoading(true);
            const res = await bookingAPI.updateBookingStatus(bookingId, status);
            setBookings(
                bookings.map((b) => (b._id === bookingId ? res.data.booking : b))
            );
            return res.data.booking;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update booking");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteBooking = async (bookingId) => {
        try {
            setLoading(true);
            await bookingAPI.deleteBooking(bookingId);
            setBookings(bookings.filter((b) => b._id !== bookingId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete booking");
            throw err;
        } finally {
            setLoading(false);
        }
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

    return {
        bookings,
        loading,
        error,
        fetchBookings,
        fetchUserBookings,
        fetchPartnerBookings,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        rateBooking,
    };
};

export const useNotifications = () => {
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
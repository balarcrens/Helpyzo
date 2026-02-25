import apiClient from './apiClient';

// ========== USER APIs ==========
export const userAPI = {
    register: (userData) => apiClient.post('/users/register', userData),
    login: (email, password) => apiClient.post('/users/login', { email, password }),
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (userData) => apiClient.put('/users/profile', { userData }),
    changePassword: (oldPassword, newPassword) =>
        apiClient.put('/users/change-password', { oldPassword, newPassword }),
    getAllUsers: () => apiClient.get('/users/all'),
    deleteUser: (userId) => apiClient.delete(`/users/${userId}`),
    updateRole: (userId, userRole) => apiClient.put(`/users/change-role/${userId}/${userRole}`),
    updateServiceApprovalStatus: (partnerId, serviceId, status, rejectionReason = '') =>
        apiClient.put(`/users/service-approval/${partnerId}/${serviceId}`, { approvalStatus: status, rejectionReason }),
    changeStatus: (userId, status) => apiClient.put(`/users/change-status/${userId}/${status}`),
};

// ========== PARTNER APIs ==========
export const partnerAPI = {
    register: (partnerData) => apiClient.post('/partners/register', partnerData),
    login: (email, password) => apiClient.post('/partners/login', { email, password }),
    getAllPartners: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiClient.get(`/partners?${params}`);
    },
    getApprovedServices: () => apiClient.get('/partners/approvedservices'),
    getPartnerById: (partnerId) => apiClient.get(`/partners/${partnerId}`),
    getProfile: () => apiClient.get('/partners/profile'),
    updateProfile: (partnerData) => apiClient.put('/partners/profile', partnerData),

    // Services
    addService: (serviceData) => apiClient.post('/partners/service', serviceData),
    getServiceById: (serviceId) => apiClient.get(`/partners/service/${serviceId}`),
    updateService: (serviceId, serviceData) => apiClient.put(`/partners/service/${serviceId}`, serviceData),
    deleteService: (serviceId) => apiClient.delete(`/partners/service/${serviceId}`),

    // Super Admin operations
    deletePartner: (partnerId) => apiClient.delete(`/partners/${partnerId}`),
    updateDocumentStatus: (partnerId, docId, status, rejectionReason = '') =>
        apiClient.patch(`/partners/${partnerId}/documents/${docId}`, { status, rejectionReason }),
};

// ========== CATEGORY APIs ==========
export const categoryAPI = {
    getAllCategories: () => apiClient.get('/categories'),
    getCategoryById: (categoryId) => apiClient.get(`/categories/${categoryId}`),
    createCategory: (categoryData) => apiClient.post('/categories', categoryData),
    updateCategory: (categoryId, categoryData) => apiClient.put(`/categories/${categoryId}`, categoryData),
    deleteCategory: (categoryId) => apiClient.delete(`/categories/${categoryId}`),
};

// ========== BOOKING APIs ==========
export const bookingAPI = {
    createBooking: (bookingData) => apiClient.post('/bookings', bookingData),
    getAllBookings: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiClient.get(`/bookings?${params}`);
    },
    getBookingById: (bookingId) => apiClient.get(`/bookings/${bookingId}`),
    getUserBookings: () => apiClient.get('/bookings/my-bookings'),
    getPartnerBookings: (partnerId) => apiClient.get(`/bookings/partner/${partnerId}/bookings`),
    updateBooking: (bookingId, bookingData) => apiClient.put(`/bookings/${bookingId}`, bookingData),
    updateBookingStatus: (bookingId, status) => apiClient.put(`/bookings/${bookingId}/status`, { status }),
    updateBookingPaymentStatus: (bookingId, paymentStatus) => apiClient.put(`/bookings/payment-status/${bookingId}`, { paymentStatus }),
    rateBooking: (bookingId, rating, review) => apiClient.put(`/bookings/${bookingId}/rate`, { rating, review }),
    deleteBooking: (bookingId) => apiClient.delete(`/bookings/${bookingId}`),
};

export const contactAPI = {
    createContact: (contactData) => apiClient.post('/contact/', contactData),
    getAllContact: () => apiClient.get('/contact/all'),
    getContactById: (contactId) => apiClient.get(`/contact/${contactId}`),
    deleteContact: (contactId) => apiClient.delete(`/contact/${contactId}`),
}

export const notificationAPI = {
    getNotifications: () => apiClient.get('/notifications'),
    markAsRead: (notificationId) => apiClient.patch(`/notifications/${notificationId}/read`),
    markAllAsRead: () => apiClient.patch('/notifications/readall'),
    deleteNotification: (notificationId) => apiClient.delete(`/notifications/${notificationId}`),
};
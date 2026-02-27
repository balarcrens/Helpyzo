import { useContext, useState } from "react";
import AuthContext from "../context/Auth/AuthContext";
import { userAPI, partnerAPI } from "../services/api";

// Custom hook for user operations
export const useUser = () => {
    const { user, login, isLoggedIn } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProfile = async () => {
        try {
            setLoading(true);
            const res = await userAPI.getProfile();
            login(localStorage.getItem("auth-token"), res.data.user);
            return res.data.user;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch profile");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data) => {
        try {
            setLoading(true);
            const res = await userAPI.updateProfile(data);
            await getProfile();
            return res.data.user;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        try {
            setLoading(true);
            await userAPI.changePassword(oldPassword, newPassword);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { user, isLoggedIn, loading, error, getProfile, updateProfile, changePassword };
};

// Custom hook for partner operations
export const usePartner = () => {
    const { user, login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProfile = async () => {
        try {
            setLoading(true);
            const res = await partnerAPI.getProfile();
            login(localStorage.getItem("auth-token"), res.data.partner);
            return res.data.partner;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch profile");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data) => {
        try {
            setLoading(true);
            const res = await partnerAPI.updateProfile(data);
            login(localStorage.getItem("auth-token"), res.data.partner);
            return res.data.partner;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addService = async (serviceData) => {
        try {
            setLoading(true);
            const res = await partnerAPI.addService(serviceData);
            // Update context and localStorage with updated partner data
            login(localStorage.getItem("auth-token"), res.data.partner);
            return res.data.partner;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add service");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateService = async (serviceId, serviceData) => {
        try {
            setLoading(true);
            const res = await partnerAPI.updateService(serviceId, serviceData);
            // Update context and localStorage with updated partner data
            login(localStorage.getItem("auth-token"), res.data.partner);
            return res.data.partner;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update service");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteService = async (serviceId) => {
        try {
            setLoading(true);
            const res = await partnerAPI.deleteService(serviceId);
            // Update context and localStorage with updated partner data
            login(localStorage.getItem("auth-token"), res.data.partner);
            return res.data.partner;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete service");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        getProfile,
        updateProfile,
        addService,
        updateService,
        deleteService,
    };
};

import { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import ToastContext from "../Toast/ToastContext";

const AuthProvider = ({ children }) => {
    const { showToast } = useContext(ToastContext);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedToken = localStorage.getItem("auth-token");
            const storedUser = localStorage.getItem("userInfo");

            if (savedToken && storedUser && storedUser !== "undefined") {
                const parsedUser = JSON.parse(storedUser);
                setToken(savedToken);
                setUser(parsedUser);
            } else {
                setUser(null);
                setToken(null);
            }
        } catch (error) {
            console.error("Auth data corrupted, clearing storage", error);
            localStorage.removeItem("auth-token");
            localStorage.removeItem("userInfo");
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (authToken, userData) => {
        // Prevent LocalStorage Quota Exceeded by removing huge base64 fields 
        // from the object we save to localStorage, while keeping them in memory.
        const storageData = { ...userData };

        if (storageData.profileImage && storageData.profileImage.length > 50000) {
            storageData.profileImage = null;
        }

        if (Array.isArray(storageData.documents)) {
            storageData.documents = storageData.documents.map(doc => ({
                ...doc,
                fileUrl: doc.fileUrl && doc.fileUrl.length > 50000 ? null : doc.fileUrl
            }));
        }

        if (Array.isArray(storageData.services)) {
            storageData.services = storageData.services.map(srv => ({
                ...srv,
                image: srv.image && srv.image.length > 50000 ? null : srv.image
            }));
        }

        localStorage.setItem("auth-token", authToken);
        try {
            localStorage.setItem("userInfo", JSON.stringify(storageData));
        } catch (e) {
            console.error("Failed to save userInfo to localStorage", e);
        }
        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("userInfo");
        setToken(null);
        setUser(null);
        showToast("Logout successfully", "success")
    };

    const role = user?.role || null;
    const isPartner = role === "partner";
    const isSuperAdmin = role === "superadmin";

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                isLoggedIn: Boolean(user),
                loading,
                role,
                isPartner,
                isSuperAdmin,
                login,
                logout,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
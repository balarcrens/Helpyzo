import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
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
        localStorage.setItem("auth-token", authToken);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("userInfo");
        setToken(null);
        setUser(null);
    };

    const role = user?.role || null;
    const isPartner = role === "partner";
    const isSuperAdmin = role === "superadmin";

    return (
        <AuthContext.Provider
            value={{
                user,
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
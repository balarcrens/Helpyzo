import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem("auth-token");
            const storedUser = localStorage.getItem("userInfo");

            if (token && storedUser && storedUser !== "undefined") {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth data corrupted, clearing storage", error);
            localStorage.removeItem("auth-token");
            localStorage.removeItem("userInfo");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // useEffect(() => {
    //     console.log("AuthProvider user changed:", user);
    // }, [user]);

    const login = (token, userData) => {
        localStorage.setItem("auth-token", token);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("userInfo");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: Boolean(user), loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
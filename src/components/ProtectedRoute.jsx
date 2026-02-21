import { Navigate } from "react-router-dom";
import AuthContext from "../context/Auth/AuthContext";
import { useContext } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/register" />;

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
}

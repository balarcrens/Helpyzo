import AuthContext from "../context/Auth/AuthContext";
import { useContext } from "react";
import NotFound from "./pages/NotFound";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <NotFound />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <NotFound />;
    }

    return children;
}

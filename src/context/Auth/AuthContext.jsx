import { createContext } from "react";

const AuthContext = createContext({
    user: null,
    token: null,
    isLoggedIn: false,
    loading: true,
    role: null,
    login: () => { },
    logout: () => { },
    isPartner: false,
    isSuperAdmin: false,
});

export default AuthContext;
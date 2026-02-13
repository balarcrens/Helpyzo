import { createContext } from "react";

const AuthContext = createContext({
    user: null,
    isLoggedIn: false,
    loading: true,
    login: () => { },
    logout: () => { },
});

export default AuthContext;
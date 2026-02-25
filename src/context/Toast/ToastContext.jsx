import { createContext } from "react";

const ToastContext = createContext({
    showToast: () => { },
    showConfirm: () => { },
});

export default ToastContext;
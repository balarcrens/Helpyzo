import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ToastContext from "./ToastContext";
import Toast from "../../components/Toast";
import ConfirmDialog from "../../components/ConfirmDialog";

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirm, setConfirm] = useState(null); // { message, subMessage, type, confirmLabel, resolve }

    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = "success", duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
        setTimeout(() => dismiss(id), duration);
    }, [dismiss]);

    const showConfirm = useCallback(({ message, subMessage, type = "danger", confirmLabel }) => {
        return new Promise((resolve) => {
            setConfirm({ message, subMessage, type, confirmLabel, resolve });
        });
    }, []);

    const handleConfirm = () => {
        confirm?.resolve(true);
        setConfirm(null);
    };

    const handleCancel = () => {
        confirm?.resolve(false);
        setConfirm(null);
    };

    return (
        <ToastContext.Provider value={{ showToast, showConfirm }}>
            {children}

            <div className="fixed top-5 right-5 flex flex-col gap-3 z-[9999] pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <div key={toast.id} className="pointer-events-auto">
                            <Toast
                                {...toast}
                                onDismiss={() => dismiss(toast.id)}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {confirm && (
                <ConfirmDialog
                    message={confirm.message}
                    subMessage={confirm.subMessage}
                    type={confirm.type}
                    confirmLabel={confirm.confirmLabel}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ToastContext.Provider>
    );
};
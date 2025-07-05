import Toast from "@/components/Toast";
import { ToastData, ToastParams } from "@/types/toast";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react";

interface ToastContextType {
    toast: (params: ToastParams) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        ({
            message,
            type = "default",
            duration = 3000,
            position = "top",
        }: ToastParams) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: ToastData = {
                id,
                message,
                type,
                duration,
                position,
            };

            setToasts((prev) => [...prev, newToast]);

            setTimeout(() => {
                removeToast(id);
            }, duration);
        },
        [removeToast]
    );

    const toast = useCallback(
        (params: ToastParams) => {
            addToast(params);
        },
        [addToast]
    );

    const success = useCallback(
        (message: string) => {
            addToast({ message, type: "success" });
        },
        [addToast]
    );

    const error = useCallback(
        (message: string) => {
            addToast({ message, type: "error" });
        },
        [addToast]
    );

    const warning = useCallback(
        (message: string) => {
            addToast({ message, type: "warning" });
        },
        [addToast]
    );

    const info = useCallback(
        (message: string) => {
            addToast({ message, type: "info" });
        },
        [addToast]
    );

    return (
        <ToastContext.Provider value={{ toast, success, error, warning, info }}>
            {children}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    position={toast.position}
                    onDismiss={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

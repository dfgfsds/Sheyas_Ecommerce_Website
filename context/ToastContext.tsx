"use client";

import React, { createContext, useContext, useCallback, ReactNode } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    
    const showToast = useCallback((message: string, type: ToastType = "info") => {
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "error":
                toast.error(message);
                break;
            case "warning":
                toast.warning(message, {
                    style: {
                        background: '#000000',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                    icon: "⚠️",
                });
                break;
            default:
                toast.info(message);
        }
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

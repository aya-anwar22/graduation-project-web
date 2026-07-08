// src/providers/ToastProvider.tsx
import React, { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
    children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={20}
                containerStyle={{
                    top: 20,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                }}
                toastOptions={{
                    // Default options applied to all toasts
                    className: 'font-arabic',
                    duration: 4000,
                    style: {
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        padding: '14px 18px',
                        direction: 'rtl',
                        textAlign: 'right',
                    },
                }}
            />
            {children}
        </>
    );
};

export default ToastProvider;
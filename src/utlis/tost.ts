// utils/toast.ts

import toast, { type ToastOptions, type Toast } from 'react-hot-toast';
// أنواع الرسائل
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

// خيارات الـ Toast الافتراضية
const defaultOptions: ToastOptions = {
    duration: 4000,
    position: 'top-center',
    style: {
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        padding: '14px 18px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        direction: 'rtl',
        textAlign: 'right',
    },
};

// خيارات خاصة بكل نوع
const typeOptions: Record<ToastType, Partial<ToastOptions>> = {
    success: {
        duration: 3000,
        icon: '✅',
        style: {
            ...defaultOptions.style,
            background: '#10b981',
            color: 'white',
            border: '1px solid #047857',
        },
    },
    error: {
        duration: 5000,
        icon: '❌',
        style: {
            ...defaultOptions.style,
            background: '#ef4444',
            color: 'white',
            border: '1px solid #dc2626',
        },
    },
    info: {
        duration: 4000,
        icon: 'ℹ️',
        style: {
            ...defaultOptions.style,
            background: '#3b82f6',
            color: 'white',
            border: '1px solid #1d4ed8',
        },
    },
    warning: {
        duration: 4000,
        icon: '⚠️',
        style: {
            ...defaultOptions.style,
            background: '#f59e0b',
            color: 'white',
            border: '1px solid #d97706',
        },
    },
    loading: {
        duration: Infinity,
        icon: '⏳',
        style: {
            ...defaultOptions.style,
            background: '#6b7280',
            color: 'white',
            border: '1px solid #4b5563',
        },
    },
};

// الدالة الرئيسية لإظهار الـ Toast
export const showToast = (
    message: string,
    type: ToastType = 'info',
    options?: ToastOptions
): string => {
    const mergedOptions = {
        ...defaultOptions,
        ...typeOptions[type],
        ...options,
    };

    switch (type) {
        case 'success':
            return toast.success(message, mergedOptions);
        case 'error':
            return toast.error(message, mergedOptions);
        case 'warning':
            return toast(message, { ...mergedOptions, icon: '⚠️' });
        case 'loading':
            return toast.loading(message, mergedOptions);
        case 'info':
        default:
            return toast(message, mergedOptions);
    }
};

// دالة مساعدة لإخفاء Toast محدد
export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

// دالة لإخفاء جميع الـ Toasts
export const dismissAllToasts = () => {
    toast.dismiss();
};

// دوال سريعة لكل نوع (Shortcuts)
export const toastSuccess = (message: string, options?: ToastOptions) =>
    showToast(message, 'success', options);

export const toastError = (message: string, options?: ToastOptions) =>
    showToast(message, 'error', options);

export const toastInfo = (message: string, options?: ToastOptions) =>
    showToast(message, 'info', options);

export const toastWarning = (message: string, options?: ToastOptions) =>
    showToast(message, 'warning', options);

export const toastLoading = (message: string, options?: ToastOptions) =>
    showToast(message, 'loading', options);

// دالة لتحديث Toast موجود
export const updateToast = (
    toastId: string,
    message: string,
    type: ToastType = 'info',
    options?: ToastOptions
) => {
    const mergedOptions = {
        ...defaultOptions,
        ...typeOptions[type],
        ...options,
    };

    toast.dismiss(toastId);
    return showToast(message, type, mergedOptions);
};

// دالة لـ Promise مع Toast
export const toastPromise = <T>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error: string;
    },
    options?: ToastOptions
): Promise<T> => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: (err) => messages.error || err.message || 'حدث خطأ',
        },
        {
            ...defaultOptions,
            ...options,
        }
    );
};

// Export the original toast for advanced usage
export { toast };
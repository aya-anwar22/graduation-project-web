// src/components/common/Alert.tsx
import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, type LucideIcon } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    message: string;
    onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    if (!message) return null;

    const config: Record<AlertType, { icon: LucideIcon; bgColor: string; textColor: string; borderColor: string }> = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50 dark:bg-green-900/30',
            textColor: 'text-green-800 dark:text-green-200',
            borderColor: 'border-green-200 dark:border-green-800',
        },
        error: {
            icon: AlertCircle,
            bgColor: 'bg-red-50 dark:bg-red-900/30',
            textColor: 'text-red-800 dark:text-red-200',
            borderColor: 'border-red-200 dark:border-red-800',
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
            textColor: 'text-yellow-800 dark:text-yellow-200',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50 dark:bg-blue-900/30',
            textColor: 'text-blue-800 dark:text-blue-200',
            borderColor: 'border-blue-200 dark:border-blue-800',
        },
    };

    const { icon: Icon, bgColor, textColor, borderColor } = config[type];

    return (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn ${bgColor} ${textColor} border ${borderColor} max-w-md`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-sm">{message}</span>
            <button onClick={onClose} className="hover:opacity-70 transition-opacity">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
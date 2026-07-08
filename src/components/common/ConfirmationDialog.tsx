import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    onCancel?: () => void;
}

export const ConfirmationDialog: React.FC<Props> = ({ isOpen, onClose, onConfirm, message, title = 'تأكيد', confirmText = 'تأكيد', cancelText = 'إلغاء', isLoading = false, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'جاري...' : confirmText}
                    </button>
                    <button
                        onClick={() => {
                            if (onCancel) onCancel();
                            else onClose();
                        }}
                        className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};
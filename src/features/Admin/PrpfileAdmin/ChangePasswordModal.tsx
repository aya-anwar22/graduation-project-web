// src/components/admin/ChangePasswordModal.tsx
import React, { useState } from 'react';
import { X, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
// import { ChangePasswordData } from '../../AdminTypes/Profile.interface';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<any>;
    loading: boolean;
}

export const ChangePasswordModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
}) => {
    const [formData, setFormData] = useState<any>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { newPassword: '', confirmPassword: '' };

        if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
            isValid = false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            await onSubmit(formData);
            if (!errors.newPassword && !errors.confirmPassword) {
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full shadow-2xl animate-slideUp">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-600" />
                        تغيير كلمة المرور
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        disabled={loading}
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            كلمة المرور الحالية
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                required
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                className="w-full pr-12 pl-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="أدخل كلمة المرور الحالية"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                            >
                                {showPasswords.current ? (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                required
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className={`w-full pr-12 pl-10 py-2 rounded-lg border ${
                                    errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                                placeholder="أدخل كلمة المرور الجديدة"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                            >
                                {showPasswords.new ? (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            تأكيد كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className={`w-full pr-12 pl-10 py-2 rounded-lg border ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
                                placeholder="أكد كلمة المرور الجديدة"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                            >
                                {showPasswords.confirm ? (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <Eye className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            تغيير كلمة المرور
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-semibold transition"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
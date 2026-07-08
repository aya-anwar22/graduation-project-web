// src/components/admin/SecurityActions.tsx
import React from 'react';
import { Lock, Key, Download, Upload, Trash2, Shield } from 'lucide-react';

interface Props {
    onOpenChangePassword: () => void;
    onToggleTwoFactor: () => void;
    onBackup: () => void;
    onExport: () => void;
    onDeleteAccount: () => void;
    twoFactorEnabled: boolean;
    loading: boolean;
}

export const SecurityActions: React.FC<Props> = ({
    onOpenChangePassword,
    onToggleTwoFactor,
    onBackup,
    onExport,
    onDeleteAccount,
    twoFactorEnabled,
    loading,
}) => {
    return (
        <div className="space-y-6">
            {/* Security Section */}
            <div className="animate-slide-in bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600" />
                    الأمان
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                                <Key className="w-4 h-4" />
                                كلمة المرور
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                آخر تحديث: 2024-01-01
                            </p>
                        </div>
                        <button
                            onClick={onOpenChangePassword}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
                        >
                            تغيير
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                المصادقة الثنائية
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                {twoFactorEnabled ? 'مفعلة' : 'غير مفعلة'}
                            </p>
                        </div>
                        <button
                            onClick={onToggleTwoFactor}
                            disabled={loading}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                                twoFactorEnabled
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            } disabled:opacity-50`}
                        >
                            {twoFactorEnabled ? 'إلغاء' : 'تفعيل'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="animate-slide-in bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Download className="w-5 h-5 text-red-600" />
                    الإجراءات السريعة
                </h3>
                <div className="space-y-3">
                    <button
                        onClick={onBackup}
                        disabled={loading}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white transition disabled:opacity-50"
                    >
                        <Upload className="w-5 h-5 text-red-600" />
                        نسخ احتياطي للبيانات
                    </button>
                    <button
                        onClick={onExport}
                        disabled={loading}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white transition disabled:opacity-50"
                    >
                        <Download className="w-5 h-5 text-red-600" />
                        تصدير البيانات
                    </button>
                    <button
                        onClick={onDeleteAccount}
                        disabled={loading}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition disabled:opacity-50"
                    >
                        <Trash2 className="w-5 h-5" />
                        حذف الحساب
                    </button>
                </div>
            </div>
        </div>
    );
};
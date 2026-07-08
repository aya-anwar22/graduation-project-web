// src/components/admin/UserFilters.tsx
import React from 'react';
import type { UserFilters as FiltersType } from '../AdminTypes/User.interface';

interface Props {
    filters: FiltersType;
    onFilterChange: (key: keyof FiltersType, value: string) => void;
    onReset: () => void;
    universities: any[];
    departments: any[];
    loading?: boolean;
}

export const UserFilters: React.FC<Props> = ({
    filters,
    onFilterChange,
    onReset,
    universities,
    departments,
    loading = false,
}) => {
    return (
        <div className="animate-slide-in bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="البحث عن مستخدم..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            disabled={loading}
                            className="w-full pr-12 pl-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        />
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <select
                        value={filters.role}
                        onChange={(e) => onFilterChange('role', e.target.value)}
                        disabled={loading}
                        className="cursor-pointer px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        <option value="all">كل الأدوار</option>
                        <option value="admin">مسؤول</option>
                        <option value="doctor">دكتور</option>
                        <option value="student">طالب</option>
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        disabled={loading}
                        className="cursor-pointer px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        <option value="all">كل الحالات</option>
                        <option value="verified">مفعل</option>
                        <option value="unverified">غير مفعل</option>
                        <option value="deleted">محذوف</option>
                    </select>

                    <button
                        onClick={onReset}
                        disabled={loading}
                        className="cursor-pointer px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 flex items-center gap-2"
                        title="إعادة تعيين"
                    >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        <span className="hidden md:inline">إعادة تعيين</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
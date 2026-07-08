// src/components/admin/ProjectFilters.tsx
import React from 'react';
import type { ProjectFilters as FiltersType } from '../AdminTypes/Project.interface';

interface Props {
    filters: FiltersType;
    onFilterChange: (key: keyof FiltersType, value: string) => void;
    onReset: () => void;
    doctors: any[];
    universities: any[];
    departments: any[];
    loading?: boolean;
}

export const ProjectFilters: React.FC<Props> = ({
    filters,
    onFilterChange,
    onReset,
    loading = false,
}) => {
    const years = ['2026', '2025', '2024', '2023', '2022'];
    const statusOptions = [
        { value: 'all', label: 'كل الحالات' },
        { value: 'start', label: 'بداية' },
        { value: 'in_progress', label: 'قيد التنفيذ' },
        { value: 'completed', label: 'مكتمل' },
        { value: 'paused', label: 'متوقف' },
    ];

    return (
        <div className="glass-effect rounded-2xl p-6 shadow-elevated animate-slide-up bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* البحث */}
                <div className="flex-1 w-full">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-red-500">search</span>
                        <input
                            type="text"
                            placeholder="ابحث باسم المشروع، الجامعة، الدكتور..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            disabled={loading}
                            className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    {/* فلتر الحالة */}
                    <div className="relative flex-1 lg:flex-none ">
                        <select
                            value={filters.status}
                            onChange={(e) => onFilterChange('status', e.target.value)}
                            disabled={loading}
                            className="cursor-pointer w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white appearance-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all disabled:opacity-50"
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 ">expand_more</span>
                    </div>

                    {/* فلتر السنة */}
                    <div className="relative flex-1 lg:flex-none">
                        <select
                            value={filters.year}
                            onChange={(e) => onFilterChange('year', e.target.value)}
                            disabled={loading}
                            className="cursor-pointer w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white appearance-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all disabled:opacity-50"
                        >
                            <option value="all">جميع السنوات</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 ">expand_more</span>
                    </div>

                    {/* زر إعادة تعيين */}
                    <button
                        onClick={onReset}
                        disabled={loading}
                        className="cursor-pointer px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 flex items-center gap-2"
                        title="إعادة تعيين الفلاتر"
                    >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        <span className="hidden md:inline">إعادة تعيين</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
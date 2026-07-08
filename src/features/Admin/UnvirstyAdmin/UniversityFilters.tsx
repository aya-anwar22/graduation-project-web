// src/features/Admin/UnvirstyAdmin/UniversityFilters.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface UniversityFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;           // غيرنا الاسم من currentStatus ل statusFilter
    onStatusFilterChange: (value: string) => void;
}

export const UniversityFilters: React.FC<UniversityFiltersProps> = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
}) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="البحث عن جامعة..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pr-12 pl-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 md:w-48"
                >
                    <option value="">كل الحالات</option>
                    <option value="active">نشط</option>
                    <option value="deleted">محذوف</option>
                </select>
            </div>
        </div>
    );
};
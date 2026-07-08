// src/features/Student/components/ProjectFilters.tsx
import React from 'react';
import type { ProjectFilters as FiltersType } from '../types/project.types';

interface ProjectFiltersProps {
    filters: FiltersType;
    onFilterChange: (key: keyof FiltersType, value: string) => void;
    onReset: () => void;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({ filters, onFilterChange, onReset }) => {
    const filterOptions = [
        { id: 'all', label: 'الكل', type: 'status' },
        { id: 'completed', label: 'مكتمل', type: 'status' },
        { id: 'in-progress', label: 'قيد التنفيذ', type: 'status' },
        { id: 'start', label: 'جاري العمل', type: 'status' },
    ];

    const typeOptions = [
        { id: 'all', label: 'الكل', type: 'projectType' },
        { id: 'web', label: 'ويب', type: 'projectType' },
        { id: 'mobile', label: 'جوال', type: 'projectType' },
        { id: 'desktop', label: 'سطح مكتب', type: 'projectType' },
    ];

    const yearOptions = [
        { id: 'all', label: 'الكل' },
        { id: '2026', label: '2026' },
        { id: '2025', label: '2025' },
        { id: '2024', label: '2024' },
        { id: '2023', label: '2023' },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {filterOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onFilterChange('status', option.id)}
                        className={ `cursor-pointer px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
                            filters.status === option.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {typeOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onFilterChange('type', option.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
                            filters.type === option.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div> */}

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {yearOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onFilterChange('year', option.id)}
                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all duration-200 ${
                            filters.year === option.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
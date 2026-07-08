// src/features/Admin/DoctorsAdmin/DoctorsFilters.tsx
import React, { useEffect, useState } from 'react';
import type { DoctorFilters } from '../AdminTypes/Doctor.interface';
import departmentService from '../AdminService/Department.service';

interface FiltersProps {
    filters: DoctorFilters;
    onFilterChange: (key: keyof DoctorFilters, value: string) => void;
    onReset: () => void;
}

export const DoctorsFilters: React.FC<FiltersProps> = ({
    filters,
    onFilterChange,
    onReset,
}) => {
    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await departmentService.getDepartments();
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    return (
        <div className="animate-slide-in bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* حقل البحث */}
                <div className="flex-1">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="البحث عن دكتور..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            className="w-full pr-12 pl-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>

                {/* الفلاتر */}
                <div className="flex gap-2 flex-wrap">
                    {/* فلتر الأقسام */}
                    <select
                        value={filters.departmentId}
                        onChange={(e) => onFilterChange('departmentId', e.target.value)}
                        className="px-4 py-3 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">كل الأقسام</option>
                        {departments.map((dept) => (
                            <option key={dept.id || dept._id} value={dept.id || dept._id}>
                                {dept.departmentName || dept.name}
                            </option>
                        ))}
                    </select>

                    {/* فلتر رؤساء الأقسام */}
                    <select
                        value={filters.headFilter}
                        onChange={(e) => onFilterChange('headFilter', e.target.value)}
                        className="px-4 py-3 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">كل الدكاترة</option>
                        <option value="yes">رؤساء الأقسام فقط</option>
                        <option value="no">غير رؤساء الأقسام</option>
                    </select>

                    {/* فلتر الحالة */}
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="px-4 py-3 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">كل الحالات</option>
                        <option value="active">نشط</option>
                        <option value="deleted">محذوف</option>
                    </select>

                    {/* زر إعادة تعيين */}
                    <button
                        onClick={onReset}
                        className="px-4 py-3 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        title="إعادة تعيين"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
// src/features/Admin/DepartmentsAdmin/DepartmentTable.tsx
import React from 'react';
import { Edit, Trash2, Undo, Building, Users, Crown } from 'lucide-react';
import type { Department } from '../AdminTypes/Department.interface';

interface DepartmentTableProps {
    departments: Department[];
    onEdit: (department: Department) => void;
    onStatusToggle: (department: Department) => void;
    loading: boolean;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({
    departments,
    onEdit,
    onStatusToggle,
    loading,
}) => {
    if (departments.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">لا توجد أقسام</h3>
                <p className="text-gray-500 dark:text-gray-400">قم بإضافة قسم جديد للبدء</p>
            </div>
        );
    }

    return (
        <div className="hidden md:block bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                        <tr>
                            <th className="text-right px-6 py-4 text-sm font-semibold">اسم القسم</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold">الجامعة</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold">رئيس القسم</th>
                            <th className="text-center px-6 py-4 text-sm font-semibold">الدكاترة</th>
                            <th className="text-center px-6 py-4 text-sm font-semibold">المشاريع</th>
                            <th className="text-center px-6 py-4 text-sm font-semibold">الحالة</th>
                            <th className="text-center px-6 py-4 text-sm font-semibold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {departments.map((dept) => {
                            const isDeleted = dept.status === 'deleted';
                            // الحصول على عدد الدكاترة من stats إذا كانت موجودة
                            const doctorsCount = dept.stats?.doctorsCount || dept.doctors || 0;
                            const projectsCount = dept.stats?.projectsCount || dept.projects || 0;
                            
                            return (
                                <tr key={dept.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition ${isDeleted ? 'opacity-60' : ''}`}>
                                    <td className="px-6 py-4 font-semibold">{dept.departmentName}</td>
                                    <td className="px-6 py-4 text-gray-500">{dept.universityName}</td>
                                    <td className="px-6 py-4 text-gray-500">{dept.headDoctorName}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                            <Users className="w-4 h-4" />
                                            {doctorsCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                                            <span className="material-symbols-outlined text-sm">folder</span>
                                            {projectsCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDeleted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {isDeleted ? 'محذوف' : 'نشط'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {!isDeleted && (
                                                <button onClick={() => onEdit(dept)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" disabled={loading} title="تعديل">
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button onClick={() => onStatusToggle(dept)} className={`p-2 rounded-lg ${isDeleted ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`} disabled={loading} title={isDeleted ? 'استعادة' : 'حذف'}>
                                                {isDeleted ? <Undo className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
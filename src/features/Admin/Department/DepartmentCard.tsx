// src/features/Admin/DepartmentsAdmin/DepartmentCard.tsx
import React from 'react';
import { Edit, Trash2, Undo, Building, Users } from 'lucide-react';
import type { Department } from '../AdminTypes/Department.interface';

interface DepartmentCardProps {
    department: Department;
    onEdit: (department: Department) => void;
    onStatusToggle: (department: Department) => void;
    loading: boolean;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onEdit, onStatusToggle, loading }) => {
    const isDeleted = department.status === 'deleted';
    // ✅ الحصول على عدد الدكاترة من مصادر متعددة
    const doctorsCount = department.stats?.doctorsCount || department.doctors || 0;
    const projectsCount = department.stats?.projectsCount || department.projects || 0;

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800 ${isDeleted ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{department.departmentName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{department.universityName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">رئيس القسم: {department.headDoctorName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDeleted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {isDeleted ? 'محذوف' : 'نشط'}
                </span>
            </div>
            <div className="mt-4 flex justify-between items-center border-t dark:border-gray-800 pt-4">
                <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{doctorsCount} دكاترة</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="material-symbols-outlined text-sm">folder</span>
                    <span className="text-sm">{projectsCount} مشاريع</span>
                </div>
                <div className="flex gap-2">
                    {!isDeleted && (
                        <button 
                            onClick={() => onEdit(department)} 
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" 
                            disabled={loading}
                            title="تعديل"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    )}
                    <button 
                        onClick={() => onStatusToggle(department)} 
                        className={`p-2 rounded-lg transition ${isDeleted ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`} 
                        disabled={loading}
                        title={isDeleted ? 'استعادة' : 'حذف'}
                    >
                        {isDeleted ? <Undo className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
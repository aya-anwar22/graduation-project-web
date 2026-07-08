// src/features/Admin/UnvirstyAdmin/UniversityTable.tsx
import React from 'react';
import { Edit, Trash2, Undo, Mail, Building } from 'lucide-react';
import type { University } from '../AdminTypes/Universty.interface';

interface UniversityTableProps {
    universities: University[];
    onEdit: (university: University) => void;
    onStatusToggle: (university: University) => void;
    loading: boolean;
}

export const UniversityTable: React.FC<UniversityTableProps> = ({
    universities,
    onEdit,
    onStatusToggle,
    loading,
}) => {
    const getGradientColor = (id: string) => {
        const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600'];
        return colors[parseInt(id) % colors.length];
    };

    if (universities.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">لا توجد جامعات</h3>
                <p className="text-gray-500 dark:text-gray-400">قم بإضافة جامعة جديدة للبدء</p>
            </div>
        );
    }

    return (
        <div className="hidden md:block bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="text-right px-6 py-4 text-sm font-semibold">اسم الجامعة</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold">الموقع</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold">البريد الإلكتروني</th>
                            <th className="text-center px-6 py-4 text-sm font-semibold">عدد الأقسام</th>
                            <th className="text-center px-6 py-4 text-sm font-semibold">الحالة</th>
                            <th className="text-center px-6 py-4 text-sm font-semibold">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {universities.map((uni) => {
                            const isDeleted = uni.status === 'deleted';
                            return (
                                <tr key={uni.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition ${isDeleted ? 'opacity-60' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${getGradientColor(uni.id)}`}>
                                                {uni.logo}
                                            </div>
                                            <span className="font-semibold">{uni.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{uni.location}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {uni.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 rounded-full text-sm">
                                            <Building className="w-4 h-4" />
                                            {uni.departments}
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
                                                <button onClick={() => onEdit(uni)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" disabled={loading}>
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button onClick={() => onStatusToggle(uni)} className={`p-2 rounded-lg ${isDeleted ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`} disabled={loading}>
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
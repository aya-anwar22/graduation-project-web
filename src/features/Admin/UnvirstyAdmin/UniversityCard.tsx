// src/features/Admin/UnvirstyAdmin/UniversityCard.tsx
import React from 'react';
import { Edit, Trash2, Undo, Mail, Building } from 'lucide-react';
import type { University } from '../AdminTypes/Universty.interface';

interface UniversityCardProps {
    university: University;
    onEdit: (university: University) => void;
    onStatusToggle: (university: University) => void;
    loading: boolean;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, onEdit, onStatusToggle, loading }) => {
    const isDeleted = university.status === 'deleted';
    const getGradientColor = (id: string) => {
        const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600'];
        return colors[parseInt(id) % colors.length];
    };

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800 ${isDeleted ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${getGradientColor(university.id)}`}>
                        {university.logo}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{university.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{university.location}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDeleted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {isDeleted ? 'محذوف' : 'نشط'}
                </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm truncate">{university.email}</span>
            </div>
            <div className="mt-4 flex justify-between items-center border-t dark:border-gray-800 pt-4">
                <div className="flex items-center gap-2 text-gray-500">
                    <Building className="w-4 h-4" />
                    <span className="text-sm">{university.departments} أقسام</span>
                </div>
                <div className="flex gap-2">
                    {!isDeleted && (
                        <button onClick={() => onEdit(university)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" disabled={loading}>
                            <Edit className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={() => onStatusToggle(university)} className={`p-2 rounded-lg ${isDeleted ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`} disabled={loading}>
                        {isDeleted ? <Undo className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
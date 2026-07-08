// src/components/admin/TeamCard.tsx
import React from 'react';
import type { Team } from '../AdminTypes/Team.interface';

interface Props {
    team: Team;
    onView: (team: Team) => void;
    onEdit: (team: Team) => void;
    onDelete: (id: string) => void;
}

export const TeamCard: React.FC<Props> = ({ team, onView, onEdit, onDelete }) => {
    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    const displayedMembers = team.membersNames?.slice(0, 3) || [];
    const remainingMembers = (team.membersNames?.length || 0) - 3;

    return (
        <div className="card-hover  bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    <span>{getInitials(team.teamName)}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                                {team.teamName}
                                <span className="text-sm font-mono px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                    {team.teamCode}
                                </span>
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                المشروع: {team.projectName}
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-100">الأعضاء</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{team.membersCount}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-100">المشرف</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {team.doctorName}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">القائد</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {team.leaderName}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">السنة</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {team.projectYear}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {displayedMembers.map((member, idx) => (
                            <span key={idx} className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">person</span>
                                {member}
                            </span>
                        ))}
                        {remainingMembers > 0 && (
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg text-sm">
                                +{remainingMembers}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">psychology</span>
                            {team.doctorName}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onView(team)}
                                className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                                title="عرض التفاصيل"
                            >
                                <span className="material-symbols-outlined">visibility</span>
                            </button>
                            <button
                                onClick={() => onEdit(team)}
                                className="p-2 cursor-pointer text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition"
                                title="تعديل"
                            >
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                                onClick={() => onDelete(team._id)}
                                className="p-2 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                title="حذف"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
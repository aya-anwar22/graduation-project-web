// TeamMemberCard.tsx
import React, { type ChangeEvent } from 'react';
import type { TeamMemberUI } from '../types/Supervisor.interface';

interface Props {
    member: TeamMemberUI;
    index: number;
    updateTeamMember: (id: number, field: keyof TeamMemberUI, value: string | boolean) => void;
    removeTeamMember: (id: number) => void;
}

const TeamMemberCard: React.FC<Props> = ({ member, index, updateTeamMember, removeTeamMember }) => {


    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-gray-800 dark:text-gray-200">عضو الفريق {index + 1}</h4>
                <button
                    type="button"
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 text-sm transition-colors"
                    onClick={() => removeTeamMember(member.id)}
                >
                    حذف
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الاسم *</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="اسم العضو"
                        value={member.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateTeamMember(member.id, 'name', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الرقم الجامعي *</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="الرقم الجامعي"
                        value={member.studentId}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateTeamMember(member.id, 'studentId', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الدور *</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="مثال: مطور واجهة أمامية"
                        value={member.role}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateTeamMember(member.id, 'role', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني *</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="email@university.edu"
                        value={member.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateTeamMember(member.id, 'email', e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        checked={member.isLeader}
                        onChange={(e) => updateTeamMember(member.id, 'isLeader', e.target.checked)}
                        id={`leader-${member.id}`}
                    />
                    <label htmlFor={`leader-${member.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                        قائد الفريق
                    </label>
                </div>

            </div>
        </div>

    );
};

export default TeamMemberCard;

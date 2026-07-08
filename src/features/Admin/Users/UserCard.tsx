// src/components/admin/UserCard.tsx
import React, { useState } from 'react';
import type { User } from '../AdminTypes/User.interface';

interface Props {
    user: User;
    onView: (user: User) => void;
    onEdit: (user: User) => void;
    onUpdateRole: (id: string, role: string) => void;
    onToggleStatus: (id: string) => void;
    onDelete: (id: string, name: string) => void;
    loading: boolean;
}

export const UserCard: React.FC<Props> = ({ user, onView, onEdit, onUpdateRole, onToggleStatus, onDelete, loading }) => {
    const [showRoleMenu, setShowRoleMenu] = useState(false);

    const getRoleGradient = (role: string) => {
        switch (role) {
            case 'admin': return 'gradient-admin';
            case 'doctor': return 'gradient-doctor';
            case 'student': return 'gradient-student';
            default: return 'gradient-default';
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300';
            case 'doctor': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300';
            case 'student': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
        }
    };

    const getRoleName = (role: string) => {
        switch (role) {
            case 'admin': return 'مسؤول';
            case 'doctor': return 'دكتور';
            case 'student': return 'طالب';
            default: return role;
        }
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    const isDeleted = user.isDeleted;
    const isVerified = user.isVerified;

    return (
        <div className={`card-hover bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${isDeleted ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    {user.profileImage ? (
                        <img 
                            src={user.profileImage} 
                            alt={user.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className={`avatar-initials w-12 h-12 rounded-full ${getRoleGradient(user.role)} text-white text-lg flex items-center justify-center font-bold`}>
                            {getInitials(user.fullName)}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user.fullName}</h3>
                            {isVerified && !isDeleted && (
                                <span className="material-symbols-outlined text-green-500 text-sm fill">verified</span>
                            )}
                            {isDeleted && (
                                <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full">محذوف</span>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {/* زر تغيير الدور */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                                    disabled={loading || isDeleted}
                                    className={`cursor-pointer px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleBadgeColor(user.role)} hover:opacity-80 transition`}
                                >
                                    {getRoleName(user.role)}
                                    <span className="material-symbols-outlined text-xs">expand_more</span>
                                </button>
                                {showRoleMenu && !isDeleted && (
                                    <div className=" absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[120px]">
                                        <button
                                            onClick={() => {
                                                onUpdateRole(user._id, 'student');
                                                setShowRoleMenu(false);
                                            }}
                                            className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                                        >
                                            طالب
                                        </button>
                                        <button
                                            onClick={() => {
                                                onUpdateRole(user._id, 'doctor');
                                                setShowRoleMenu(false);
                                            }}
                                            className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                                        >
                                            دكتور
                                        </button>
                                        <button
                                            onClick={() => {
                                                onUpdateRole(user._id, 'admin');
                                                setShowRoleMenu(false);
                                            }}
                                            className="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                                        >
                                            مسؤول
                                        </button>
                                    </div>
                                )}
                            </div>
                            {user.universityName && user.universityName !== 'N/A' && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">{user.universityName}</span>
                            )}
                            {user.departmentName && user.departmentName !== 'N/A' && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">{user.departmentName}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onView(user)}
                        className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
                        title="عرض التفاصيل"
                        disabled={loading}
                    >
                        <span className="material-symbols-outlined">visibility</span>
                    </button>
                    <button
                        onClick={() => onEdit(user)}
                        className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition"
                        title="تعديل"
                        disabled={loading}
                    >
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                        onClick={() => onToggleStatus(user._id)}
                        className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-orange-500 transition"
                        title={isDeleted ? 'استعادة' : 'حذف'}
                        disabled={loading}
                    >
                        <span className="material-symbols-outlined">
                            {isDeleted ? 'undo' : 'delete'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
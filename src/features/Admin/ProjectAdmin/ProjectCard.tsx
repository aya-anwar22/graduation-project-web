// src/components/admin/ProjectCard.tsx
import React, { useState } from 'react';
import type { Project } from '../AdminTypes/Project.interface';

interface Props {
    project: Project;
    onView: (project: Project) => void;
    onEdit?: (project: Project) => void;
    onDelete?: (id: string) => void;
}

export const ProjectCard: React.FC<Props> = ({ project, onView, onEdit, onDelete }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'start': return 'from-blue-500 to-blue-600';
            case 'in_progress': return 'from-yellow-500 to-yellow-600';
            case 'completed': return 'from-green-500 to-green-600';
            case 'paused': return 'from-red-500 to-red-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'start': return 'بداية';
            case 'in_progress': return 'قيد التنفيذ';
            case 'completed': return 'مكتمل';
            case 'paused': return 'متوقف';
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'start': return 'play_circle';
            case 'in_progress': return 'pending';
            case 'completed': return 'check_circle';
            case 'paused': return 'pause_circle';
            default: return 'info';
        }
    };

    const getGradientColor = (index: number) => {
        const gradients = [
            'from-purple-500 to-purple-600',
            'from-indigo-500 to-indigo-600',
            'from-cyan-500 to-cyan-600',
            'from-pink-500 to-pink-600',
            'from-teal-500 to-teal-600',
        ];
        return gradients[index % gradients.length];
    };

    // عرض أول 3 تقنيات فقط
    const displayedTechs = project.technologies?.slice(0, 3) || [];
    const remainingTechs = (project.technologies?.length || 0) - 3;

    return (
        <div className="project-card bg-white dark:bg-gray-900 rounded-2xl shadow-elevated border border-gray-100 dark:border-gray-800 overflow-hidden animate-slide-up hover:shadow-2xl transition-all duration-300">
            {/* Header with gradient */}
            <div className={`h-32 bg-gradient-to-r ${getGradientColor(project._id.length)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`status-badge px-3 py-1 bg-gradient-to-r ${getStatusColor(project.status)} text-white rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-sm">{getStatusIcon(project.status)}</span>
                        {getStatusText(project.status)}
                    </span>
                    <span className="px-3 py-1 bg-black/20 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                        {project.year}
                    </span>
                </div>
                <div className="absolute bottom-4 right-4">
                    <span className="material-symbols-outlined text-white/90 text-5xl">folder_managed</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                {/* Title and description */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{project.description || 'لا يوجد وصف'}</p>
                </div>

                {/* Info chips */}
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="material-symbols-outlined text-xs text-red-500">account_balance</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">{project.universityName}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="material-symbols-outlined text-xs text-red-500">psychology</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">{project.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="material-symbols-outlined text-xs text-red-500">corporate_fare</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">{project.departmentName}</span>
                    </div>
                   
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {displayedTechs.map((tech, idx) => (
                            <span key={idx} className="tech-tag px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium">
                                {tech}
                            </span>
                        ))}
                        {remainingTechs > 0 && (
                            <span className="tech-tag px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-xs">
                                +{remainingTechs}
                            </span>
                        )}
                    </div>
                )}

                {/* Created Date */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    <span>تاريخ الإنشاء: {new Date(project.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => onView(project)}
                        className="cursor-pointer flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        تفاصيل
                    </button>
                    {onEdit && (
                        <button
                            onClick={() => onEdit(project)}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(project._id)}
                            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
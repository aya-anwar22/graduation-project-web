// src/features/Student/components/ProjectCard.tsx
import React from 'react';
import type { Project } from '../types/project.types';

interface ProjectCardProps {
    project: Project;
    index: number;
    onViewDetails: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onViewDetails }) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'in-progress': return 'bg-yellow-500';
            case 'start': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'مكتمل';
            case 'in-progress': return 'قيد التنفيذ';
            case 'start': return 'جاري العمل';
            default: return status;
        }
    };

    const getProjectImage = (project: Project) => {
        if (project.projectImage) return project.projectImage;
        const images = {
            'web': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'mobile': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'desktop': 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        };
        return images[project.projectType as keyof typeof images] || images.web;
    };

    const displayedMembers = project.teamMembers?.slice(0, 3) || [];
    const remainingCount = (project.teamMembers?.length || 0) - 3;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative">
                <div 
                    className="bg-center bg-no-repeat aspect-video bg-cover"
                    style={{ backgroundImage: `url("${getProjectImage(project)}")` }}
                />
                <div className={`absolute top-3 left-3 ${getStatusBadge(project.projectStatus)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                    {getStatusText(project.projectStatus)}
                </div>
                {project.rating && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-yellow-400 text-xs">star</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{project.rating}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{project.projectTitle}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{project.projectDescription}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                    {project.category && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                            {project.category}
                        </span>
                    )}
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                        {project.projectType === 'web' ? 'ويب' : project.projectType === 'mobile' ? 'جوال' : 'سطح مكتب'}
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-2 py-1 rounded-full">
                        {project.projectYear}
                    </span>
                </div>
                
                {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">التقنيات المستخدمة</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 4).map((tech, idx) => (
                                <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                                    {tech}
                                </span>
                            ))}
                            {project.technologies.length > 4 && (
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                                    +{project.technologies.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-xs">event</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">يناير {project.projectYear}</span>
                    </div>
                    {project.duration && (
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-xs">schedule</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">{project.duration}</span>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {displayedMembers.map((member) => (
                            <div 
                                key={member.memberId}
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-cover bg-center"
                                style={{ 
                                    backgroundImage: member.memberProfileImage 
                                        ? `url("${member.memberProfileImage}")` 
                                        : `url("https://ui-avatars.com/api/?name=${member.memberFullName}&background=random&size=24")`
                                }}
                                title={member.memberFullName}
                            />
                        ))}
                        {remainingCount > 0 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => onViewDetails(project.projectId)}
                        className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors flex items-center gap-2 text-sm"
                    >
                        <span className="text-sm">تفاصيل</span>
                        <span className="material-symbols-outlined text-sm">arrow_left</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
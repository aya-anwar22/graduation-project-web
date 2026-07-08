// Components/ProjectCard.tsx
import React from 'react';
import { Icon } from '@iconify/react';
import type { Project } from '../TypesDoctor/homeDoctor.interfase';

interface ProjectCardProps {
    project: Project;
    onViewDetails: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
    // Get status based on project status from API
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'start':
                return {
                    text: 'قيد التنفيذ',
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    textColor: 'text-blue-700 dark:text-blue-400',
                    icon: 'mdi:play-circle'
                };
            case 'pending':
                return {
                    text: 'قيد المراجعة',
                    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
                    textColor: 'text-orange-700 dark:text-orange-400',
                    icon: 'mdi:clock'
                };
            case 'completed':
                return {
                    text: 'مكتمل',
                    bgColor: 'bg-green-100 dark:bg-green-900/30',
                    textColor: 'text-green-700 dark:text-green-400',
                    icon: 'mdi:check-circle'
                };
            default:
                return {
                    text: 'جديد',
                    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
                    textColor: 'text-gray-700 dark:text-gray-400',
                    icon: 'mdi:new-box'
                };
        }
    };

    const statusConfig = getStatusConfig(project.projectStatus || project.status || 'start');

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700">
            {/* Project Image */}
            <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <img
                    src={project.projectImage || project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop'}
                    alt={project.projectTitle || project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop';
                    }}
                />
                
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 ${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                    <Icon icon={statusConfig.icon} className="text-xs" />
                    {statusConfig.text}
                </div>
                
                {/* Year Badge */}
                {project.projectYear && (
                    <div className="absolute top-3 right-3 bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                        {project.projectYear}
                    </div>
                )}
                
                {/* Project Type Badge */}
                {project.projectType && (
                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white px-3 py-1 rounded-lg text-xs font-medium">
                        {project.projectType === 'web' ? 'ويب' : project.projectType}
                    </div>
                )}
            </div>
            
            {/* Project Content */}
            <div className="p-4 md:p-6 flex-grow flex flex-col">
                {/* Department Badge */}
                <div className="mb-3">
                    {project.departmentName && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-lg">
                            <Icon icon="mdi:school" className="text-xs" />
                            {project.departmentName}
                        </span>
                    )}
                </div>
                
                {/* Project Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
                    {project.projectTitle || project.title}
                </h3>
                
                {/* Project Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {project.projectDescription || project.description}
                </p>

                {/* Technologies Tags */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center gap-1 mb-2 text-xs text-gray-500 dark:text-gray-400">
                            <Icon icon="mdi:code-tags" className="text-sm" />
                            <span>التقنيات المستخدمة:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {project.technologies.slice(0, 4).map((tech, index) => (
                                <span 
                                    key={index} 
                                    className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 text-orange-700 dark:text-orange-300 text-xs px-2.5 py-1 rounded-lg"
                                >
                                    <Icon icon="mdi:check-circle" className="text-xs" />
                                    {tech}
                                </span>
                            ))}
                            {project.technologies.length > 4 && (
                                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-lg">
                                    +{project.technologies.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* University Info */}
                {project.universityName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="p-1.5 bg-white dark:bg-gray-600 rounded-lg">
                            <Icon icon="mdi:university" className="text-lg" />
                        </div>
                        <span className="font-medium">{project.universityName}</span>
                    </div>
                )}

                {/* View Details Button */}
                <button
                    onClick={() => onViewDetails(project.projectId || project.id || '')}
                    className="w-full bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-auto group"
                >
                    <span>عرض التفاصيل</span>
                    <Icon icon="mdi:arrow-left" className="text-sm group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
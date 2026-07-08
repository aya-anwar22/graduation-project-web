// src/features/Student/StudentProjects.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { Project, ProjectFilters as FiltersType, ProjectStats } from '../types/project.types';
import StudentProjectService from '../services/studentProjectService';
import { StatCard } from './StatCard';
import { ProjectFilters } from './ProjectFilters';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailsModal } from './ProjectDetailsModal';

export const StudentProjects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ProjectStats>({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        supervisionRequests: 0,
    });
    const [filters, setFilters] = useState<FiltersType>({
        search: '',
        status: 'all',
        type: 'all',
        year: 'all',
        category: 'all',
    });
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await StudentProjectService.getAllProjects(filters);
            setProjects(response.data);
            
            // حساب الإحصائيات من البيانات الفعلية
            const total = response.data.length;
            const active = response.data.filter(p => p.projectStatus === 'start' || p.projectStatus === 'in-progress').length;
            const completed = response.data.filter(p => p.projectStatus === 'completed').length;
            
            setStats({
                totalProjects: response.stats?.totalProjects || total,
                activeProjects: active,
                completedProjects: response.stats?.completedProjects || completed,
                supervisionRequests: 0,
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleFilterChange = (key: keyof FiltersType, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            type: 'all',
            year: 'all',
            category: 'all',
        });
    };

    const handleViewDetails = (projectId: string) => {
        setSelectedProjectId(projectId);
        setShowDetailsModal(true);
    };

    const statCards = [
        { title: 'إجمالي المشاريع', value: stats.totalProjects, icon: 'folder', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', delay: 0.1 },
        { title: 'المشاريع النشطة', value: stats.activeProjects, icon: 'rocket_launch', iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400', delay: 0.2 },
        { title: 'طلبات الإشراف', value: stats.supervisionRequests, icon: 'assignment', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', delay: 0.3 },
        { title: 'المشاريع المكتملة', value: stats.completedProjects, icon: 'check_circle', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400', delay: 0.4 },
    ];

    return (
            <div className="mx-auto max-w-4xl  lg:pt-32 pt-9">
                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((card, idx) => (
                        <StatCard key={idx} {...card} />
                    ))}
                </div>

                {/* Filters Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">المشاريع المميزة</h2>
                    <ProjectFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
                        <span className="material-symbols-outlined text-6xl text-gray-400">inbox</span>
                        <p className="text-gray-500 dark:text-gray-400 mt-4">لا توجد مشاريع مطابقة لمعايير البحث</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project.projectId}
                                project={project}
                                index={index}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                )}

                {/* Project Details Modal */}
                <ProjectDetailsModal
                    projectId={selectedProjectId}
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedProjectId(null);
                    }}
                />
            </div>
    );
};

export default StudentProjects;
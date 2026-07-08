// src/components/admin/ProjectsManagement.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { ProjectStats } from './ProjectStats';
import { ProjectFilters } from './ProjectFilters';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import { Alert } from '../../../components/common/Alert';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';
import { useProjects } from '../../../hooks/useProjects';
import type { ProjectFilters as FiltersType } from '../AdminTypes/Project.interface';

export const ProjectsManagement: React.FC = () => {
    const {
        projects,
        doctors,
        universities,
        departments,
        loading,
        statsLoading,
        stats,
        error,
        success,
        filterProjects,
        refresh,
    } = useProjects();

    const [filters, setFilters] = useState<FiltersType>({
        search: '',
        status: 'all',
        doctor: 'all',
        university: 'all',
        department: 'all',
        year: 'all',
    });

    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const filteredProjects = useMemo(() => filterProjects(filters), [filterProjects, filters]);

    const handleFilterChange = (key: keyof FiltersType, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleViewProject = (project: any) => {
        setSelectedProjectId(project._id);
        setShowDetailsModal(true);
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            doctor: 'all',
            university: 'all',
            department: 'all',
            year: 'all',
        });
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {success && <Alert type="success" message={success} onClose={() => {}} />}
                {error && <Alert type="error" message={error} onClose={() => {}} />}

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-xl shadow-lg">
                            <span className="material-symbols-outlined text-white text-3xl">folder_managed</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                إدارة المشاريع
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة وتنظيم مشاريع التخرج للطلاب</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <ProjectStats stats={stats} loading={statsLoading} />

                {/* Filters */}
                <ProjectFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={resetFilters}
                    doctors={doctors}
                    universities={universities}
                    departments={departments}
                    loading={loading}
                />

                {/* Loading */}
                {loading && <LoadingSpinner />}

                {/* Projects Grid */}
                {!loading && (
                    <>
                        {filteredProjects.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">inbox</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا توجد مشاريع</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">لا توجد مشاريع تطابق معايير البحث</p>
                                <button
                                    onClick={resetFilters}
                                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                                >
                                    إعادة تعيين الفلاتر
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                        onView={handleViewProject}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Project Details Modal */}
            <ProjectDetailsModal
                projectId={selectedProjectId}
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedProjectId(null);
                }}
            />
        </main>
    );
};
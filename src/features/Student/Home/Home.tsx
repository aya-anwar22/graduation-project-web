// components/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import type {
    ProjectStatsApiResponse,
    ActiveProjectApiResponse,
    ProjectsListApiResponse,
    ProjectData
} from '../types/home.interface'
import ProjectService, { getDefaultProjectImage, getProjectStatusColor, getProjectStatusText, getProjectTypeText, getStatsColor, getStatsIcon, getStatsTitle } from '../services/homeService';

interface StatsCard {
    title: string;
    value: number;
    icon: string;
    type: 'totalProjects' | 'completedProjects' | 'inProgressProjects' | 'currentYearProjects' | 'averageRating';
}

const DashboardPage: React.FC = () => {
    const [statsCards, setStatsCards] = useState<StatsCard[]>([
        {
            title: 'إجمالي المشاريع',
            value: 0,
            icon: 'folder',
            type: 'totalProjects'
        },
        {
            title: 'المشاريع المكتملة',
            value: 0,
            icon: 'check_circle',
            type: 'completedProjects'
        },
        {
            title: 'المشاريع قيد التنفيذ',
            value: 0,
            icon: 'pending',
            type: 'inProgressProjects'
        },
        {
            title: 'مشاريع السنة الحالية',
            value: 0,
            icon: 'calendar_month',
            type: 'currentYearProjects'
        }
    ]);

    const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
    const [featuredProjects, setFeaturedProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // دالة لتحميل جميع البيانات
    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // جلب الإحصائيات
            const statsResult = await ProjectService.getEnhancedProjectStats();
            if (!statsResult.success) {
                throw new Error(statsResult.message);
            }

            // تحديث بطاقات الإحصائيات
            if (statsResult.success && statsResult.data) {
                const stats = statsResult.data;
                setStatsCards(prev => prev.map(card => ({
                    ...card,
                    value: stats[card.type as keyof typeof stats] || 0
                })));
            }

            // جلب المشروع النشط
            const activeResult = await ProjectService.getMyActiveProject();
            if (activeResult.success && activeResult.data) {
                setActiveProject(activeResult.data);
            }

            // جلب المشاريع المميزة (المكتملة)
            const featuredResult = await ProjectService.getFeaturedProjects(3);
            if (featuredResult.success && featuredResult.data) {
                setFeaturedProjects(featuredResult.data);
            }

        } catch (err: any) {
            console.error('Error loading dashboard data:', err);
            setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // دالة للحصول على أيقونة حسب نوع الإحصائية
    const getStatsCardIcon = (type: string): string => {
        return getStatsIcon(type);
    };

    // دالة للحصول على لون حسب نوع الإحصائية
    const getStatsCardColor = (type: string) => {
        return getStatsColor(type);
    };

    // دالة للحصول على صورة المشروع
    const getProjectImage = (project: ProjectData): string => {
        if (project.projectImage) return project.projectImage;
        return getDefaultProjectImage(project.projectType, project.departmentName);
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl flex-1 p-5 justify-center items-center">
                <div className="flex flex-col items-center justify-center min-h-[80vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-7xl flex-1 p-5">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl mb-3">
                        error
                    </span>
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <button
                        onClick={loadDashboardData}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl flex-1 p-5">
            {/* Hero Section */}
            <div className="relative rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 lg:p-8 mb-6 lg:mb-8 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">لوحة التحكم</h1>
                        <p className="text-white/90 text-base lg:text-lg">
                            مرحباً بعودتك! {statsCards[0].value > 0 ? `لديك ${statsCards[0].value} مشروع` : 'ابدأ بمشروعك الأول الآن'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 lg:mb-8">
                {statsCards.map((stat, index) => {
                    const colors = getStatsCardColor(stat.type);
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                                        {getStatsTitle(stat.type)}
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${colors.bg}`}>
                                    <span className={`material-symbols-outlined ${colors.text}`}>
                                        {getStatsCardIcon(stat.type)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Active Project Section */}
            {activeProject && (
                <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-md mb-6 lg:mb-8 border border-gray-200 dark:border-gray-700 animate-slide-up">
                    <h2 className="text-lg text-white lg:text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">business_center</span>
                        مشروعي النشط
                    </h2>

                    <div className="flex flex-col gap-4 lg:gap-6">
                        <div
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-md"
                            style={{
                                backgroundImage: `url("${getProjectImage(activeProject)}")`,
                                backgroundColor: '#f3f4f6'
                            }}
                        ></div>

                        <div className="flex flex-col flex-grow gap-4">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                                <div>
                                    <span className={`${getProjectStatusColor(activeProject.projectStatus)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                                        {getProjectStatusText(activeProject.projectStatus)}
                                    </span>
                                    <h3 className="text-gray-900 dark:text-gray-100 text-lg lg:text-xl font-bold mt-2">
                                        {activeProject.projectTitle}
                                    </h3>
                                </div>
                                <Link
                                    to={`/project/${activeProject.projectId}`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                                >
                                    <span className="material-symbols-outlined text-lg">open_in_new</span>
                                    <p className="text-sm font-medium">فتح المشروع</p>
                                </Link>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-outlined text-xl text-blue-600 dark:text-blue-400">person</span>
                                <p className="text-sm">المشرف: {activeProject.doctorFullName}</p>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {activeProject.projectDescription}
                            </p>

                            {activeProject.technologies && activeProject.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {activeProject.technologies.slice(0, 3).map((tech, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mt-2">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">event</span>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                                        السنة: {activeProject.projectYear}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">category</span>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                                        النوع: {getProjectTypeText(activeProject.projectType)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">groups</span>
                                <div className="flex -space-x-2">
                                    {activeProject.teamMembers.slice(0, 4).map((member, index) => (
                                        <div
                                            key={index}
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-white dark:border-gray-800"
                                            style={{ backgroundImage: `url("${member.memberProfileImage}")` }}
                                            title={member.memberFullName}
                                            onError={(e) => {
                                                const target = e.target as HTMLDivElement;
                                                target.style.backgroundImage = 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.memberFullName + '&backgroundColor=6366f1")';
                                            }}
                                        ></div>
                                    ))}
                                    {activeProject.teamMembers.length > 4 && (
                                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full size-8 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                            <span className="text-xs text-gray-600 dark:text-gray-300">+{activeProject.teamMembers.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Projects Section */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h2 className="text-gray-900 text-xl lg:text-2xl font-bold">
                        المشاريع المميزة
                    </h2>
                    <Link
                        to="/projects"
                        className="text-blue-600 dark:text-blue-400 text-sm lg:text-base font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-200"
                    >
                        عرض الكل
                        <span className="material-symbols-outlined text-lg lg:text-xl">arrow_left</span>
                    </Link>
                </div>

                {featuredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {featuredProjects.map((project, index) => (
                            <div
                                key={project.projectId}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="relative">
                                    <div
                                        className="bg-center bg-no-repeat aspect-video bg-cover"
                                        style={{
                                            backgroundImage: `url("${getProjectImage(project)}")`,
                                            backgroundColor: '#f3f4f6'
                                        }}
                                    ></div>
                                    <div className={`absolute top-4 left-4 ${getProjectStatusColor(project.projectStatus)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                                        {getProjectStatusText(project.projectStatus)}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <div className="rating-stars flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">4.5</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 lg:p-6">
                                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                                        {project.projectTitle}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {project.projectDescription}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.slice(0, 3).map((tech, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs">
                                                +{project.technologies.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">event</span>
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">{project.projectYear}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">category</span>
                                            <span className="text-gray-600 dark:text-gray-400 text-sm">{project.departmentName}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {project.teamMembers.slice(0, 3).map((member, memberIndex) => (
                                                <div
                                                    key={memberIndex}
                                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-white dark:border-gray-800"
                                                    style={{ backgroundImage: `url("${member.memberProfileImage}")` }}
                                                    title={member.memberFullName}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLDivElement;
                                                        target.style.backgroundImage = 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.memberFullName + '&backgroundColor=6366f1")';
                                                    }}
                                                ></div>
                                            ))}
                                            {project.teamMembers.length > 3 && (
                                                <div className="bg-gray-200 dark:bg-gray-700 rounded-full size-8 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                    <span className="text-xs text-gray-600 dark:text-gray-300">+{project.teamMembers.length - 3}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Link
                                            to={`/project/${project.projectId}`}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
                                        >
                                            <span className="text-sm">تفاصيل المشروع</span>
                                            <span className="material-symbols-outlined text-lg">arrow_left</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
                        <span className="material-symbols-outlined text-gray-400 text-4xl mb-4">folder_off</span>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">لا توجد مشاريع مميزة لعرضها</p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm">ابدأ بمشروعك الأول الآن</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
// pages/HomeDoctor.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import type { DashboardStats, Project } from '../TypesDoctor/homeDoctor.interfase';
import { dashboardService } from '../DoctorServices/homeDoctorService';
import StatCard from '../Components/StatCard';
import ProjectCard from '../Components/ProjectCard';
import MobileNavigation from '../Components/MobileNavigation';

const HomeDoctor: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        totalProjects: 0,
        pendingActions: 0,
        completedProjects: 0,
        totalTeams: 0,
        featuredProjects: 0,
        currentYearProjects: 0,
        year: '2026'
    });
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch stats from API
                const statsResponse = await dashboardService.getDashboardStats();
                if (statsResponse.success && statsResponse.data.success) {
                    setStats(statsResponse.data.stats);
                }

                // Fetch featured projects
                const projects = await dashboardService.getFeaturedProjects();
                setFeaturedProjects(projects);

            } catch (err: any) {
                console.error('Error loading dashboard data:', err);

                if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
                    setError('انتهت الجلسة. جاري إعادة التوجيه لتسجيل الدخول...');
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setError(err.message || 'حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    // Effect للكشف عن حجم الشاشة
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handler functions
    const handleViewProjectDetails = (projectId: string) => {
        navigate(`projectDoctor/${projectId}`);
    };

    const handleViewAllProjects = () => {
        navigate('projectDoctor');
    };




    if (loading) {
        return (
            <main className=" p-4  pt-20 lg:pt-6 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
                </div>
            </main>
        );
    }

  

    return (
        <main className=" p-4  pt-20 lg:pt-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Welcome Header */}
            <div className="relative rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-r from-orange-600 to-blue-700 text-white p-4 lg:p-8 mb-6 lg:mb-8 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">لوحة التحكم</h1>
                        <p className="text-white/90 text-base lg:text-lg">
                            مرحباً بعودتك! لديك {stats.totalProjects} مشروع
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <StatCard
                    title="إجمالي المشاريع"
                    value={stats.totalProjects}
                    icon="mdi:folder"
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-100"
                    darkBgColor="dark:bg-blue-900/30"
                />

                <StatCard
                    title="قيد المراجعة"
                    value={stats.pendingActions}
                    icon="mdi:pending-actions"
                    color="text-orange-600 dark:text-orange-400"
                    bgColor="bg-orange-100"
                    darkBgColor="dark:bg-orange-900/30"
                />

                <StatCard
                    title="المشاريع المكتملة"
                    value={stats.completedProjects}
                    icon="mdi:check-circle"
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-100"
                    darkBgColor="dark:bg-green-900/30"
                />

                <StatCard
                    title="عدد الفرق"
                    value={stats.totalTeams}
                    icon="mdi:account-group"
                    color="text-purple-600 dark:text-purple-400"
                    bgColor="bg-purple-100"
                    darkBgColor="dark:bg-purple-900/30"
                />
            </div>

            {/* Featured Projects Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Icon icon="mdi:trophy" className="text-orange-500" />
                        المشاريع المميزة ({stats.featuredProjects})
                    </h2>
                    <button
                        onClick={handleViewAllProjects}
                        className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline flex items-center gap-1 transition-colors duration-200"
                    >
                        عرض الكل
                        <Icon icon="mdi:chevron-left" className="text-sm" />
                    </button>
                </div>

                {featuredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {featuredProjects.map((project) => (
                            <ProjectCard
                                key={project.projectId}
                                project={project}
                                onViewDetails={handleViewProjectDetails}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                        <Icon icon="mdi:folder-open" className="text-4xl text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">لا توجد مشاريع متميزة حالياً</p>
                    </div>
                )}
            </div>

            {/* باقي المكون كما هو... */}
        </main>
    );
};

export default HomeDoctor;
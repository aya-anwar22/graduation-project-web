// components/ProjectsDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    type Project,
    type FilterState,
    StatusLabels,
    StatusColors
} from '../TypesDoctor/projectDoctor.interface';
import {
    getProjectStats,
    getAllProjects,
    getAllTechnologies
} from '../DoctorServices/allprojectShowDoctor';
import { toastSuccess } from '../../../utlis/tost';

// واجهة للمشروع بعد التحويل للعرض
interface DisplayProject {
    id: string;
    title: string;
    description: string;
    status: string;
    type: string;
    image: string;
    teamName: string;
    school: string;
    year: string;
    technologies: string[];
    featured?: boolean;
    departmentName: string;
    universityName: string;
}

interface Filter {
    type: string;
    value: string;
    label: string;
}

const ProjectsDashboard: React.FC = () => {
    const navigate = useNavigate();

    // بيانات المشاريع
    const [projects, setProjects] = useState<DisplayProject[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<DisplayProject[]>([]);
    const [technologies, setTechnologies] = useState<string[]>([]);

    // إحصائيات
    const [stats, setStats] = useState({
        totalProjects: 0,
        pendingActions: 0,
        completedProjects: 0,
        totalTeams: 0,
        featuredProjects: 0,
        currentYearProjects: 0,
        year: '2026'
    });

    // حالة التحميل والفلترة
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
    const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // دالة تحويل بيانات المشروع
    const transformProjectData = (apiProject: Project): DisplayProject => ({
        id: apiProject.projectId,
        title: apiProject.projectTitle,
        description: apiProject.projectDescription,
        status: StatusLabels[apiProject.projectStatus] || apiProject.projectStatus,
        type: apiProject.projectType,
        image: apiProject.projectImage || getRandomImage(apiProject.projectType),
        teamName: apiProject.projectTitle,
        school: apiProject.universityName,
        year: apiProject.projectYear,
        technologies: apiProject.technologies,
        featured: Math.random() > 0.7, // مؤقت - يمكن تعديله حسب الـ API
        departmentName: apiProject.departmentName,
        universityName: apiProject.universityName
    });

    // دالة للحصول على صورة عشوائية
    const getRandomImage = (type: string): string => {
        const images = {
            web: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop',
            mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop',
            ai: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop',
            default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop'
        };

        if (type.includes('web')) return images.web;
        if (type.includes('mobile')) return images.mobile;
        if (type.includes('ai')) return images.ai;
        return images.default;
    };

    // جلب البيانات
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // جلب الإحصائيات
            console.log('Fetching project stats...');
            const statsResponse = await getProjectStats();
            console.log('Stats response:', statsResponse);

            if (statsResponse?.success && statsResponse.data?.stats) {
                setStats(statsResponse.data.stats);
            }

            // جلب المشاريع
            console.log('Fetching projects...');
            const projectsResponse = await getAllProjects(page);
            console.log('Projects response:', projectsResponse);

            if (projectsResponse?.success) {
                const transformedProjects = projectsResponse.data.map(transformProjectData);
                setProjects(transformedProjects);
                setFilteredProjects(transformedProjects);
                setTotalPages(projectsResponse.meta?.totalPages || 1);
            }

            // جلب التقنيات للفلاتر
            const techs = await getAllTechnologies();
            setTechnologies(techs);

        } catch (error) {
            console.error('Error fetching data:', error);

            if (error instanceof Error) {
                setError(error.message);

                if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } else {
                setError('حدث خطأ في تحميل البيانات');
            }
        } finally {
            setLoading(false);
        }
    }, [page, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // تصفية المشاريع عند تغيير الفلاتر
    useEffect(() => {
        if (activeFilters.length === 0) {
            setFilteredProjects(projects);
            return;
        }

        let filtered = [...projects];

        activeFilters.forEach(filter => {
            if (filter.type === 'status') {
                filtered = filtered.filter(p =>
                    StatusLabels[p.status as keyof typeof StatusLabels] === filter.value ||
                    p.status === filter.value
                );
            } else if (filter.type === 'year') {
                filtered = filtered.filter(p => p.year === filter.value);
            } else if (filter.type === 'technology') {
                filtered = filtered.filter(p => p.technologies.includes(filter.value));
            }
        });

        setFilteredProjects(filtered);
    }, [projects, activeFilters]);

    // الدوال
    const handleShowAdvancedFilter = () => {
        setShowAdvancedFilterModal(true);
    };

    const handleResetAllFilters = () => {
        setActiveFilters([]);
    };

    const handleClearActiveFilter = (type?: string) => {
        if (type === 'all') {
            setActiveFilters([]);
        } else if (type) {
            setActiveFilters(activeFilters.filter(filter => filter.type !== type));
        }
    };

    const handleAddFilter = (type: string, value: string, label: string) => {
        if (!activeFilters.some(filter => filter.type === type && filter.value === value)) {
            setActiveFilters([...activeFilters, { type, value, label }]);
        }
        setShowAdvancedFilterModal(false);
    };

    const handleDownloadProject = (projectId: string) => {
        toastSuccess(`جاري تحميل ملفات المشروع ${projectId}`);
    };

    // دالة عرض تفاصيل المشروع - معدلة للتنقل للصفحة الجديدة
    const handleViewProjectDetails = (projectId: string) => {
        navigate(`${projectId}`);
    };

    // الحصول على ألوان الحالة
    const getStatusColor = (status: string) => {
        const statusKey = Object.keys(StatusLabels).find(
            key => StatusLabels[key] === status
        ) as keyof typeof StatusColors | undefined;

        if (statusKey && StatusColors[statusKey]) {
            return StatusColors[statusKey];
        }

        return { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400' };
    };

    // مكونات واجهة الفلاتر المتقدمة
    const AdvancedFilterModal = () => {
        if (!showAdvancedFilterModal) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">فلاتر متقدمة</h3>
                        <button
                            onClick={() => setShowAdvancedFilterModal(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium  dark:text-gray-300 mb-2">الحالة</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(StatusLabels).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleAddFilter('status', key, label)}
                                        className="px-3 text-gray-300 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">السنة</label>
                            <div className="flex flex-wrap gap-2">
                                {['2026', '2025', '2024'].map(year => (
                                    <button
                                        key={year}
                                        onClick={() => handleAddFilter('year', year, `سنة ${year}`)}
                                        className="px-3 text-gray-300 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">التقنيات</label>
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                                {technologies.map(tech => (
                                    <button
                                        key={tech}
                                        onClick={() => handleAddFilter('technology', tech, tech)}
                                        className="px-3 text-gray-300 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {tech}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={() => setShowAdvancedFilterModal(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // مكون عرض الفلتر النشط
    const ActiveFilterBadge = ({ filter }: { filter: Filter }) => {
        return (
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm">
                <span>{filter.label}</span>
                <button
                    onClick={() => handleClearActiveFilter(filter.type)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        );
    };

    // عرض رسالة الخطأ
    if (error) {
        return (
            <main className="p-6">
                <div className="text-center py-12">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
                        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
                        <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">حدث خطأ</h3>
                        <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
                        <button
                            onClick={fetchData}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="p-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800  mb-2">المشاريع : -</h1>
                    <p className="text-gray-600 dark:text-gray-400">إدارة وعرض جميع المشاريع</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                        onClick={handleShowAdvancedFilter}
                        className="px-4 py-2 bg-orange-600 hover:cursor-pointer hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined align-middle text-sm">filter_alt</span>
                        فلاتر متقدمة
                    </button>
                    <button
                        onClick={handleResetAllFilters}
                        className="px-4 py-2 border hover:cursor-pointer border-gray-300 dark:border-gray-600 text-gray-700 hover:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined align-middle text-sm">refresh</span>
                        إعادة تعيين
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">folder</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">
                            {stats.totalProjects}
                        </span>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">إجمالي المشاريع</h3>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">
                            {stats.completedProjects}
                        </span>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">المشاريع المكتملة</h3>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-2xl">grade</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">
                            {stats.featuredProjects}
                        </span>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                        المشاريع المميزة
                    </h3>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">calendar_month</span>
                        </div>
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">
                            {stats.currentYearProjects}
                        </span>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">مشاريع {stats.year}</h3>
                </div>
            </div>

            {/* Active Filters Section */}
            {activeFilters.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-8 shadow-sm">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">الفلاتر النشطة:</span>
                        <div className="flex flex-wrap gap-2">
                            {activeFilters.map((filter, index) => (
                                <ActiveFilterBadge key={index} filter={filter} />
                            ))}
                        </div>
                        <button
                            onClick={() => handleClearActiveFilter('all')}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                            إزالة الكل
                        </button>
                    </div>
                </div>
            )}

            {/* Loading Spinner */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">جاري تحميل المشاريع...</p>
                </div>
            )}

            {/* No Projects Message */}
            {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-6xl mb-4">folder_off</span>
                    <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">لا توجد مشاريع</h3>
                    <p className="text-gray-400 dark:text-gray-500 mb-6">لا توجد مشاريع تطابق معايير البحث أو التصفية</p>
                    <button
                        onClick={handleResetAllFilters}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                    >
                        إعادة تعيين الفلاتر
                    </button>
                </div>
            )}

            {/* Projects Grid */}
            {!loading && filteredProjects.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => {
                            const statusColors = getStatusColor(project.status);

                            return (
                                <div
                                    key={project.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
                                >
                                    {/* Project Image */}
                                    <div className="relative">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className={`${statusColors.bg} ${statusColors.text} px-3 py-1 rounded-full text-xs font-medium`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-gray-800/70 text-white px-2 py-1 rounded text-xs">
                                                {project.type}
                                            </span>
                                        </div>
                                        {project.featured && (
                                            <div className="absolute bottom-4 right-4">
                                                <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">star</span>
                                                    مميز
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            {project.description}
                                        </p>

                                        {/* Project Info */}
                                        <div className="space-y-3 mb-5">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-sm">school</span>
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">{project.universityName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-sm">category</span>
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">{project.departmentName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-400 text-sm">calendar_month</span>
                                                <span className="text-gray-700 dark:text-gray-300 text-sm">سنة {project.year}</span>
                                            </div>
                                        </div>

                                        {/* Technologies */}
                                        <div className="mb-5">
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.slice(0, 4).map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 4 && (
                                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                                        +{project.technologies.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewProjectDetails(project.id)}
                                                className="flex-1 bg-gradient-to-r hover:cursor-pointer from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2.5 rounded-lg text-sm font-medium text-center transition-all shadow-md hover:shadow-lg"
                                            >
                                                عرض التفاصيل
                                            </button>
                                            <button
                                                onClick={() => handleDownloadProject(project.id)}
                                                className="p-2.5 border hover:cursor-pointer border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                title="تحميل الملفات"
                                            >
                                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-sm">download</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                            >
                                السابق
                            </button>
                            <span className="px-4 py-2">
                                صفحة {page} من {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                            >
                                التالي
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Advanced Filter Modal */}
            <AdvancedFilterModal />
        </main>
    );
};

export default ProjectsDashboard;
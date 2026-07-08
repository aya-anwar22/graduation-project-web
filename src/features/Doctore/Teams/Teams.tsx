// components/TeamsDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    StatusLabels,
    type Team as ITeam,
    type FilterState,
    StatusColors,
    type ProjectStatus
} from '../TypesDoctor/teams.interface';
import { getTeams, getTeamStats, getTeamDetails } from '../DoctorServices/teamsService';
import TeamDetailsModal from '../Teams/TeamDetailsModel';

interface TransformedTeam {
    id: string;
    name: string;
    code: string;
    status: ProjectStatus;
    university: string;
    year: string;
    projectTitle: string;
    universityId: string;
    departmentId: string;
    departmentName: string;
    totalMembers: number;
    completedProjects: number;
}

const TeamsDashboard: React.FC = () => {
    const navigate = useNavigate();
    
    // بيانات الفرق
    const [teams, setTeams] = useState<TransformedTeam[]>([]);
    const [filteredTeams, setFilteredTeams] = useState<TransformedTeam[]>([]);
    const [stats, setStats] = useState({
        totalTeams: 0,
        totalMembers: 0,
        activeTeams: 0,
        completedProjects: 0
    });

    // حالة التحميل والفلترة
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        university: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // حالة Modal التفاصيل
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // دالة لحساب الأعضاء الفريدين
    const calculateUniqueMembers = (members: any[]): number => {
        const uniqueUserIds = new Set(members.map(m => m.userId));
        return uniqueUserIds.size;
    };

    // دالة تحويل بيانات الفريق مع جلب التفاصيل
    const transformTeamData = async (apiTeam: any): Promise<TransformedTeam> => {
        let totalMembers = 0;
        
        try {
            // محاولة جلب تفاصيل الفريق للحصول على عدد الأعضاء الحقيقي
            const detailsResponse = await getTeamDetails(apiTeam._id);
            if (detailsResponse?.success && detailsResponse.data?.members) {
                totalMembers = calculateUniqueMembers(detailsResponse.data.members);
            }
        } catch (error) {
            console.error(`Error fetching details for team ${apiTeam._id}:`, error);
        }

        return {
            id: apiTeam._id,
            name: apiTeam.teamName,
            code: apiTeam.teamCode,
            status: apiTeam.projectStatus,
            university: apiTeam.universityName,
            year: apiTeam.projectYear,
            projectTitle: apiTeam.teamName,
            universityId: apiTeam.universityId,
            departmentId: apiTeam.departmentId,
            departmentName: apiTeam.departmentName,
            totalMembers: totalMembers,
            completedProjects: apiTeam.projectStatus === 'completed' ? 1 : 0
        };
    };

    // جلب البيانات
    const fetchData = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) {
            setIsRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);
        
        try {
            // جلب الإحصائيات
            console.log('Fetching stats...');
            const statsResponse = await getTeamStats();
            console.log('Stats response:', statsResponse);
            
            if (statsResponse?.success) {
                setStats(statsResponse.data);
            }

            // جلب الفرق
            console.log('Fetching teams...');
            const teamsResponse = await getTeams(page);
            console.log('Teams response:', teamsResponse);
            
            if (teamsResponse?.success) {
                // تحويل البيانات مع جلب التفاصيل لكل فريق
                const transformedTeamsPromises = teamsResponse.data.map(transformTeamData);
                const transformedTeams = await Promise.all(transformedTeamsPromises);
                
                console.log('Transformed teams with members:', transformedTeams);
                setTeams(transformedTeams);
                setTotalPages(teamsResponse.meta?.totalPages || 1);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            
            // عرض رسالة خطأ مناسبة
            if (error instanceof Error) {
                setError(error.message);
                
                // إذا كان الخطأ بسبب انتهاء الجلسة، التوجيه لتسجيل الدخول
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
            setIsRefreshing(false);
        }
    }, [page, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // الحصول على الجامعات الفريدة للفلتر
    const universities = Array.from(new Set(teams.map(team => team.university).filter(Boolean)));

    // تطبيق الفلاتر والبحث
    useEffect(() => {
        let filtered = teams.filter(team => {
            // تطبيق فلتر الحالة
            if (filters.status !== 'all' && team.status !== filters.status) return false;

            // تطبيق فلتر الجامعة
            if (filters.university !== 'all' && team.university !== filters.university) return false;

            // تطبيق البحث
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    team.name?.toLowerCase().includes(query) ||
                    team.code?.toLowerCase().includes(query) ||
                    team.projectTitle?.toLowerCase().includes(query) ||
                    team.university?.toLowerCase().includes(query) ||
                    team.departmentName?.toLowerCase().includes(query)
                );
            }

            return true;
        });

        setFilteredTeams(filtered);
    }, [teams, filters, searchQuery]);

    // الدوال
    const handleViewRequests = () => {
        navigate('/doctor/requests');
    };

    const handleViewTeamDetails = (teamId: string) => {
        setSelectedTeamId(teamId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTeamId(null);
    };

    const handleResetFilters = () => {
        setFilters({
            status: 'all',
            university: 'all'
        });
        setSearchQuery('');
    };

    const handleRetry = () => {
        fetchData(true);
    };

    const handleRefresh = () => {
        fetchData(true);
    };

    // الحصول على ألوان الحالة
    const getStatusColor = (status: string) => {
        return StatusColors[status as ProjectStatus] ||
            { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400' };
    };

    const getStatusLabel = (status: string) => {
        return StatusLabels[status as ProjectStatus] || status;
    };

    // توليد لون فريد لكل فريق
    const getGradientClass = (teamId: string) => {
        const gradients = [
            'from-green-500 to-blue-600',
            'from-purple-500 to-pink-600',
            'from-orange-500 to-red-600',
            'from-blue-500 to-cyan-600',
            'from-indigo-500 to-purple-600',
            'from-teal-500 to-green-600'
        ];
        const index = (teamId?.charCodeAt(teamId.length - 1) || 0) % gradients.length;
        return gradients[index];
    };

    // مكون كرت الفريق
    const TeamCard = ({ team }: { team: TransformedTeam }) => {
        const statusColors = getStatusColor(team.status);

        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                <div className={`relative h-32 bg-gradient-to-r ${getGradientClass(team.id)}`}>
                    <div className="absolute bottom-0 right-0 left-0 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">{team.name || 'بدون اسم'}</h3>
                                <p className="text-white/90 text-sm">{team.code || 'بدون كود'}</p>
                            </div>
                            <span className={`${statusColors.bg} ${statusColors.text} px-3 py-1 rounded-full text-xs font-medium`}>
                                {getStatusLabel(team.status)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <h4 className="text-gray-800 dark:text-white font-medium mb-1">{team.projectTitle || 'بدون عنوان'}</h4>
                        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">school</span>
                                <span>{team.university || 'غير محدد'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                <span>{team.year || 'غير محدد'}</span>
                            </div>
                        </div>
                        {team.departmentName && (
                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                                القسم: {team.departmentName}
                            </div>
                        )}
                    </div>

                    {/* معلومات الفريق */}
                    <div className="mb-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">إجمالي الأعضاء</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">
                                    {team.totalMembers || '0'}
                                </p>
                            </div>
                            <div className="bg-gray-50 bg-gray-700/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">المشاريع المنتهية</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">
                                    {team.completedProjects || '0'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* الإجراءات */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleViewTeamDetails(team.id)}
                            className="flex-1 hover:cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            عرض التفاصيل
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // عرض رسالة الخطأ
    if (error) {
        return (
            <main className="p-4 md:p-6">
                <div className="text-center py-12">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
                        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
                        <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">حدث خطأ</h3>
                        <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
                        <button
                            onClick={handleRetry}
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
        <main className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800  mb-2">الفرق</h1>
                        <p className="text-gray-600 dark:text-gray-400">إدارة وعرض جميع فرق الطلاب</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="inline-flex hover:cursor-pointer items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`}>
                                refresh
                            </span>
                            تحديث
                        </button>
                        <button
                            onClick={handleViewRequests}
                            className="inline-flex hover:cursor-pointer items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            <span className="material-symbols-outlined">assignment</span>
                            طلبات الإشراف
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border border-blue-200 ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">إجمالي الفرق</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalTeams || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">groups</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br  bg-gray-800    rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">إجمالي الأعضاء</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalMembers || 0}</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">person</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border border-purple-200 ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">فرق نشطة</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.activeTeams || 0}</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">check_circle</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">مشاريع منجزة</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.completedProjects || 0}</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl">task_alt</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <span className="material-symbols-outlined">search</span>
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ابحث عن فريق، مشروع..."
                                    className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="px-4 hover:cursor-pointer py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">جميع الحالات</option>
                                <option value="start">بداية</option>
                                <option value="in_progress">قيد التنفيذ</option>
                                <option value="completed">مكتملة</option>
                            </select>

                            <select
                            
                                value={filters.university}
                                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                                className="px-4 hover:cursor-pointer py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">جميع الجامعات</option>
                                {universities.map((university, index) => (
                                    <option key={index} value={university}>{university}</option>
                                ))}
                            </select>

                            <button
                                onClick={handleResetFilters}
                                className="px-4 hover:cursor-pointer py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined">restart_alt</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">جاري تحميل الفرق...</p>
                </div>
            )}

            {/* No Results Message */}
            {!loading && filteredTeams.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">group_off</span>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">لا توجد فرق</h3>
                    <p className="text-gray-600 dark:text-gray-400">لم يتم العثور على فرق تطابق معايير البحث</p>
                </div>
            )}

            {/* Teams Grid */}
            {!loading && filteredTeams.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeams.map(team => (
                            <TeamCard key={team.id} team={team} />
                        ))}
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

            {/* Modal تفاصيل الفريق */}
            <TeamDetailsModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                teamId={selectedTeamId}
            />
        </main>
    );
};

export default TeamsDashboard;
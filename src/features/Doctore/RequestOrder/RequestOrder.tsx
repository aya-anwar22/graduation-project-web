// features/Doctore/RequestOrder/RequestOrder.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getPendingRequests,
    getRejectedRequests,
    getRequestsByStatus,
    getRequestStats,
    updateRequestStatus
} from '../DoctorServices/supervisionService';
import RequestDetailsModal from '../RequestOrder/RequestDetailsModal';
import type { Request, FilterState, TabType, RequestStats } from '../TypesDoctor/supervision.interface';
import LoadingSpinner from '../Components/LoadingSpinner';

// واجهة للطلب بعد التحويل للعرض
interface DisplayRequest extends Request {
    date: string;
}

const SupervisionRequests: React.FC = () => {
    const navigate = useNavigate();

    // بيانات الطلبات
    const [requests, setRequests] = useState<DisplayRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<DisplayRequest[]>([]);

    // الحالة
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [filters, setFilters] = useState<FilterState>({
        university: 'all',
        department: 'all',
        year: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rejectedCount, setRejectedCount] = useState(0);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    // الإحصائيات
    const [stats, setStats] = useState<RequestStats>({
        totalRequests: 0,
        approvedRequests: 0,
        pendingRequests: 0,
        currentYearRequests: 0,
        year: '2026'
    });

    // دالة تحويل التاريخ
    const formatDate = (dateString?: string): string => {
        try {
            if (!dateString) {
                return new Date().toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'تاريخ غير معروف';
        }
    };

    // جلب الإحصائيات
    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getRequestStats();
            /////////////////////////////
            if (response?.success) {
                setStats(response.data);
            }
            console.log("response", response);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    // جلب البيانات حسب التبويب النشط
    // جلب البيانات حسب التبويب النشط
    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        setNotFound(false);

        try {
            // ✅ استخدم getRequestsByStatus بدلاً من if/else
            const response = await getRequestsByStatus(activeTab);

            console.log('Requests response 🚀:', response);

            if (response?.success) {
                const transformedRequests = response.data.map((req: Request) => ({
                    ...req,
                    date: formatDate(req.createdAt)
                }));
                const reqLength = transformedRequests.length;
                console.log("reqLength : ", reqLength);
                setRequests(transformedRequests);
                setFilteredRequests(transformedRequests);
                setTotalPages(response.meta?.totalPages || 1);

                // إذا كانت القائمة فارغة، نظهر notFound
                if (transformedRequests.length === 0) {
                    setNotFound(true);
                }
            }
        } catch (error: any) {
            console.error('Error fetching requests:', error);

            // التحقق من حالة 404 (لا توجد طلبات)
            if (error.message?.includes('404') || error.message?.includes('البيانات المطلوبة غير موجودة')) {
                console.log(error);

                setNotFound(true);
                setRequests([]);
                setFilteredRequests([]);
                setError(null); // إزالة رسالة الخطأ
            } else if (error instanceof Error) {
                setError(error.message);
                if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    setTimeout(() => navigate('/login'), 2000);
                }
            } else {
                setError('حدث خطأ في تحميل البيانات');
            }
        } finally {
            setLoading(false);
        }
    }, [activeTab, page, navigate]);
    useEffect(() => {
        const loadRejectedCount = async () => {
            try {
                const response = await getRequestsByStatus("rejected");
                if (response?.success) {
                    setRejectedCount(response.data.length);
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadRejectedCount();
    }, []);

    // جلب كل البيانات عند التحميل أو تغيير التبويب
    useEffect(() => {
        fetchStats();
        fetchRequests();
    }, [fetchStats, fetchRequests, getRejectedRequests]);

    // تطبيق الفلاتر والبحث
    useEffect(() => {
        if (notFound || requests.length === 0) {
            setFilteredRequests([]);
            return;
        }



        let filtered = requests.filter(request => {
            // تطبيق الفلاتر
            if (filters.university !== 'all' && request.universityName !== filters.university) return false;
            if (filters.department !== 'all' && request.departmentName !== filters.department) return false;
            if (filters.year !== 'all' && request.year !== filters.year) return false;

            // تطبيق البحث
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    request.projectName.toLowerCase().includes(query) ||
                    request.projectDescription.toLowerCase().includes(query) ||
                    request.technologies.some(tech => tech.toLowerCase().includes(query)) ||
                    (request.studentName && request.studentName.toLowerCase().includes(query)) ||
                    request.universityName.toLowerCase().includes(query)
                );
            }

            return true;
        });

        setFilteredRequests(filtered);
    }, [requests, filters, searchQuery, notFound]);

    // الدوال
    const handleExportData = () => {
        if (filteredRequests.length === 0) return;

        const csvContent = [
            ['اسم المشروع', 'الجامعة', 'القسم', 'السنة', 'الحالة', 'اسم الطالب'],
            ...filteredRequests.map(req => [
                req.projectName,
                req.universityName,
                req.departmentName,
                req.year,
                req.status,
                req.studentName || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `supervision_requests_${activeTab}_page_${page}.csv`;
        link.click();
    };

    const handleRefreshRequests = () => {
        fetchStats();
        fetchRequests();
    };

    const handleSwitchTab = (tab: TabType) => {
        setActiveTab(tab);
        setPage(1);
        setSearchQuery('');
        setFilters({
            university: 'all',
            department: 'all',
            year: 'all'
        });
        setNotFound(false);
        setError(null);
    };

    const handleResetFilters = () => {
        setFilters({
            university: 'all',
            department: 'all',
            year: 'all'
        });
        setSearchQuery('');
    };

    const handleViewRequestDetails = (requestId: string) => {
        setSelectedRequestId(requestId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequestId(null);
    };

    const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
        try {
            await updateRequestStatus(requestId, newStatus);

            // تحديث القائمة بعد قبول/رفض الطلب
            setRequests(prev => prev.filter(req => req.requestId !== requestId));
            setFilteredRequests(prev => prev.filter(req => req.requestId !== requestId));

            // تحديث الإحصائيات
            fetchStats();

            // إذا أصبحت القائمة فارغة، نظهر notFound
            if (requests.length - 1 === 0) {
                setNotFound(true);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('حدث خطأ في تحديث حالة الطلب');
        }
    };

    const handleAcceptAllRejected = async () => {
        if (!window.confirm('هل أنت متأكد من قبول جميع الطلبات المرفوضة؟')) return;

        const rejectedRequests = requests.filter(r => r.status === 'rejected');
        for (const req of rejectedRequests) {
            try {
                await updateRequestStatus(req.requestId, 'approved');
            } catch (error) {
                console.error('Error accepting request:', error);
            }
        }

        // تحديث القائمة والإحصائيات
        fetchRequests();
        fetchStats();
        alert('تم قبول جميع الطلبات المرفوضة');
    };

    const handleDeleteAllRejected = async () => {
        if (!window.confirm('هل أنت متأكد من حذف جميع الطلبات المرفوضة؟')) return;

        // هنا يمكن إضافة منطق حذف جميع الطلبات إذا كان متاحاً في الـ API
        setRequests(prev => prev.filter(r => r.status !== 'rejected'));
        setFilteredRequests(prev => prev.filter(r => r.status !== 'rejected'));

        // تحديث الإحصائيات
        fetchStats();

        // إذا أصبحت القائمة فارغة، نظهر notFound
        if (requests.filter(r => r.status === 'rejected').length === 0) {
            setNotFound(true);
        }

        alert('تم حذف جميع الطلبات المرفوضة');
    };

    // الحصول على الجامعات والأقسام الفريدة للفلاتر
    const universities = Array.from(new Set(requests.map(r => r.universityName).filter(Boolean)));
    const departments = Array.from(new Set(requests.map(r => r.departmentName).filter(Boolean)));
    const years = Array.from(new Set(requests.map(r => r.year).filter(Boolean)));

    // مكون كرت الطلب
    const RequestCard = ({ request }: { request: DisplayRequest }) => {
        const statusText = request.status === 'pending' ? 'معلق' :
            request.status === 'approved' ? 'مقبول' : 'مرفوض';

        const statusClass = request.status === 'pending' ?
            'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
            request.status === 'approved' ?
                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';

        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={request.projectImage || ""}
                        alt={request.projectName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`${statusClass} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                            <span className="material-symbols-outlined text-sm">
                                {request.status === 'pending' ? 'pending_actions' :
                                    request.status === 'approved' ? 'check_circle' : 'block'}
                            </span>
                            {statusText}
                        </span>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4">
                        <span className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white px-3 py-1 rounded-full text-xs font-medium">
                            سنة {request.year}
                        </span>
                    </div>

                    {/* Overlay Content */}
                    <div className="absolute bottom-4 right-0 left-0 px-6">
                        <h3 className="text-xl font-bold text-white mb-1">{request.projectName}</h3>
                        <div className="flex items-center gap-3 text-white/90 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">school</span>
                                {request.universityName}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">apartment</span>
                                {request.departmentName}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Request Content */}
                <div className="p-6">
                    {/* Project Description */}
                    <div className="mb-4">
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {request.projectDescription}
                        </p>
                    </div>

                    {/* Student Info */}
                    {request.studentName && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                مقدم الطلب: <span className="font-medium text-gray-800 dark:text-white">{request.studentName}</span>
                            </p>
                        </div>
                    )}

                    {/* Technologies */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {request.technologies.slice(0, 3).map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                            {request.technologies.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                    +{request.technologies.length - 3}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleViewRequestDetails(request.requestId)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            عرض التفاصيل
                        </button>

                        {/* أزرار إضافية للطلبات المرفوضة */}
                        {request.status === 'rejected' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStatusUpdate(request.requestId, 'approved')}
                                    className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    title="قبول الطلب المرفوض"
                                >
                                    <span className="material-symbols-outlined text-sm">check</span>
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(request.requestId, 'rejected')}
                                    className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    title="حذف الطلب المرفوض"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // عرض رسالة الخطأ الحقيقية (لأخطاء حقيقية وليس 404)
    if (error && !notFound) {
        return (
            <main className="p-4 md:p-6">
                <div className="text-center py-12">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md mx-auto">
                        <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
                        <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">حدث خطأ</h3>
                        <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                fetchStats();
                                fetchRequests();
                            }}
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
        <main className=" md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800  mb-2">طلبات الإشراف</h1>
                        <p className="text-gray-600 dark:text-gray-400">مراجعة وإدارة طلبات المشاريع المقدمة من الطلاب</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 hover:cursor-pointer hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">download</span>
                            تصدير البيانات
                        </button>

                        <button
                            onClick={handleRefreshRequests}
                            className="inline-flex items-center hover:cursor-pointer gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                            تحديث الطلبات
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <LoadingSpinner />
                            ) : (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">إجمالي الطلبات</p>
                                    <p className="text-3xl font-bold text-white ">{stats.totalRequests}</p>
                                </div>
                            )
                            }
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">assignment</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            {loading ? (<LoadingSpinner />) :
                                (<div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">مقبولة</p>
                                    <p className="text-3xl font-bold text-white ">{stats.approvedRequests}</p>
                                </div>
                                )}

                            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            {loading ? (<LoadingSpinner />) : (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">معلقة</p>
                                    <p className="text-3xl font-bold text-white ">{stats.pendingRequests}</p>
                                </div>
                            )}
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl">pending_actions</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            {loading ? (<LoadingSpinner />) : (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">مرفوضة</p>
                                    <p className="text-3xl font-bold text-white ">{rejectedCount}</p>
                                </div>
                            )}
                            <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">block</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs and Filters Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm">
                    <div className="flex flex-col gap-4">
                        {/* Tabs Navigation */}
                        <div className="flex border-b dark:border-gray-700 mb-4">
                            <button
                                onClick={() => handleSwitchTab('pending')}
                                className={`px-6 py-3 font-medium border-b-2 hover:cursor-pointer transition-colors ${activeTab === 'pending'
                                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                                    }`}
                            >
                                الطلبات المعلقة ({stats.pendingRequests})
                            </button>
                            <button
                                onClick={() => handleSwitchTab('rejected')}
                                className={`px-6 py-3 font-medium border-b-2 hover:cursor-pointer transition-colors ${activeTab === 'rejected'
                                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                                    }`}
                            >
                                الطلبات المرفوضة ({rejectedCount})
                            </button>
                        </div>

                        {/* Search and Filter Row */}
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
                                        placeholder="ابحث عن مشروع، طالب، أو تقنية..."
                                        className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-white dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <select
                                    value={filters.university}
                                    onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                                    className="px-4 py-3 hover:cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">جميع الجامعات</option>
                                    {universities.map((uni, index) => (
                                        <option key={index} value={uni}>{uni}</option>
                                    ))}
                                </select>

                                <select
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                    className="px-4 py-3 hover:cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">جميع الأقسام</option>
                                    {departments.map((dept, index) => (
                                        <option key={index} value={dept}>{dept}</option>
                                    ))}
                                </select>

                                <select
                                    value={filters.year}
                                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                    className="px-4 py-3 hover:cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="all">جميع السنوات</option>
                                    {years.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleResetFilters}
                                    className="px-4 py-3 hover:cursor-pointer border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined">restart_alt</span>
                                </button>
                            </div>
                        </div>

                        {/* Rejected Actions - تظهر فقط في تبويب المرفوضة وإذا كان هناك طلبات */}
                        {activeTab === 'rejected' && !notFound && requests.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleAcceptAllRejected}
                                    className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
                                >
                                    <span className="material-symbols-outlined">check_circle</span>
                                    قبول جميع المرفوضة
                                </button>
                                <button
                                    onClick={handleDeleteAllRejected}
                                    className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                                >
                                    <span className="material-symbols-outlined">delete_forever</span>
                                    حذف جميع المرفوضة
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            {/* Loading Indicator */}
            {
                loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">جاري تحميل الطلبات...</p>
                    </div>
                )
            }

            {/* No Results Message - تظهر عندما لا توجد طلبات */}
            {
                !loading && notFound && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">assignment_late</span>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">لا توجد طلبات</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {activeTab === 'pending'
                                ? 'لا توجد طلبات معلقة حالياً'
                                : 'لا توجد طلبات مرفوضة حالياً'}
                        </p>
                    </div>
                )
            }

            {/* Requests Grid - تظهر فقط عندما يكون هناك طلبات */}
            {
                !loading && !notFound && filteredRequests.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRequests.map(request => (
                                <RequestCard key={request.requestId} request={request} />
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
                )
            }

            {/* Request Details Modal */}
            <RequestDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                requestId={selectedRequestId}
                onStatusUpdate={handleStatusUpdate}
            />
        </main >
    );
};

export default SupervisionRequests;
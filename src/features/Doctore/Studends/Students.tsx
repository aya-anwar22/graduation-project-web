// features/Doctore/Students/Students.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentSummary, getStudents } from '../DoctorServices/studentsService';
import type { Student, FilterState } from '../TypesDoctor/students.interface';
import StudentDetailsModal from './StudentDetailsModal';

interface DisplayStudent extends Student {
    avatarColor: string;
    status: 'active' | 'inactive';
}

const StudentsDashboard: React.FC = () => {
    const navigate = useNavigate();

    // بيانات الطلاب
    const [students, setStudents] = useState<DisplayStudent[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<DisplayStudent[]>([]);

    // إحصائيات
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        totalTeams: 0,
        activeProjects: 0
    });

    // حالة التحميل والفلترة
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        university: 'all',
        status: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // ألوان للصور الرمزية
    const avatarColors = [
        'from-red-500 to-orange-600',
        'from-purple-500 to-pink-600',
        'from-green-500 to-blue-600',
        'from-orange-500 to-red-600',
        'from-indigo-500 to-purple-600',
        'from-blue-500 to-cyan-600',
        'from-teal-500 to-green-600',
    ];
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudentId(null);
    };
    // دالة تحويل بيانات الطالب
    const transformStudentData = (apiStudent: any, index: number): DisplayStudent => ({
        ...apiStudent,
        avatarColor: avatarColors[index % avatarColors.length],
        status: 'active' // يمكن تعديلها حسب حالة الطالب من API
    });

    // جلب البيانات
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // جلب الملخص
            console.log('Fetching student summary...');
            const summaryResponse = await getStudentSummary();
            console.log('Summary response:', summaryResponse);

            if (summaryResponse?.success) {
                setStats(summaryResponse.data);
            }

            // جلب الطلاب
            console.log('Fetching students...');
            const studentsResponse = await getStudents(page);
            console.log('Students response:', studentsResponse);

            if (studentsResponse?.success) {
                const transformedStudents = studentsResponse.data.map((student, index) =>
                    transformStudentData(student, index)
                );

                setStudents(transformedStudents);
                setFilteredStudents(transformedStudents);
                setTotalPages(studentsResponse.meta?.totalPages || 1);
            }
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

    // الحصول على الجامعات الفريدة للفلتر
    const universities = Array.from(new Set(students.map(student => student.universityName).filter(Boolean)));

    // تطبيق الفلاتر والبحث
    useEffect(() => {
        let filtered = students.filter(student => {
            // تطبيق فلتر الجامعة
            if (filters.university !== 'all' && student.universityName !== filters.university) return false;

            // تطبيق فلتر الحالة
            if (filters.status !== 'all' && student.status !== filters.status) return false;

            // تطبيق البحث
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    student.fullName.toLowerCase().includes(query) ||
                    student.email.toLowerCase().includes(query) ||
                    student.departmentName?.toLowerCase().includes(query) ||
                    student.universityName?.toLowerCase().includes(query) ||
                    student.projectName?.toLowerCase().includes(query)
                );
            }

            return true;
        });

        setFilteredStudents(filtered);
    }, [students, filters, searchQuery]);

    // الدوال
    const handleExportStudentsData = () => {
        const csvContent = [
            ['الاسم', 'البريد الإلكتروني', 'الجامعة', 'القسم', 'المشروع', 'الحالة'],
            ...filteredStudents.map(student => [
                student.fullName,
                student.email,
                student.universityName,
                student.departmentName,
                student.projectName,
                student.status === 'active' ? 'نشط' : 'غير نشط'
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `students_export_page_${page}.csv`;
        link.click();
    };

    const handleSendBulkMessage = () => {
        if (selectedStudents.length === 0) {
            alert('الرجاء تحديد طلاب لإرسال الرسالة');
            return;
        }

        const message = prompt('أدخل نص الرسالة الجماعية:');
        if (message) {
            const selectedNames = students
                .filter(s => selectedStudents.includes(s._id))
                .map(s => s.fullName)
                .join(', ');

            alert(`سيتم إرسال الرسالة إلى: ${selectedNames}\n\nنص الرسالة: ${message}`);
        }
    };

    const handleViewStudentDetails = (studentId: string) => {
        setSelectedStudentId(studentId);
        setIsModalOpen(true);
    };
    const handleResetFilters = () => {
        setFilters({
            university: 'all',
            status: 'all'
        });
        setSearchQuery('');
        setSelectedStudents([]);
    };

    const handleSelectStudent = (studentId: string) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleSelectAllStudents = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s._id));
        }
    };

    // الحصول على الحروف الأولى من الاسم
    const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return words[0][0].toUpperCase();
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
        <main className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-800 mb-2">الطلاب</h1>
                        <p className="text-gray-600 dark:text-gray-400">إدارة وعرض جميع الطلاب الذين تشر عليهم</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportStudentsData}
                            className="flex cursor-pointer items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-800 hover:dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">download</span>
                            تصدير البيانات
                        </button>

                        {/* <button
                            onClick={handleSendBulkMessage}
                            className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            <span className="material-symbols-outlined">send</span>
                            إرسال رسالة جماعية
                        </button> */}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">إجمالي الطلاب</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalStudents}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">school</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">طلاب نشطين</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.activeStudents}</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">person_check</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">فرق مختلفة</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalTeams}</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">groups</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br bg-gray-800  rounded-2xl p-6 border ">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">مشاريع نشطة</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.activeProjects}</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl">
                                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-2xl">folder_managed</span>
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
                                    placeholder="ابحث عن طالب، جامعة، أو مشروع..."
                                    className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={filters.university}
                                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">جميع الجامعات</option>
                                {universities.map((university, index) => (
                                    <option key={index} value={university}>{university}</option>
                                ))}
                            </select>

                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="all">جميع الحالات</option>
                                <option value="active">نشط</option>
                                <option value="inactive">غير نشط</option>
                            </select>

                            <button
                                onClick={handleResetFilters}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined">restart_alt</span>
                            </button>
                        </div>
                    </div>

                    {/* Selected Students Info */}
                    {selectedStudents.length > 0 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedStudents.length} طالب محدد
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSendBulkMessage}
                                    className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    إرسال رسالة للمحددين
                                </button>
                                <button
                                    onClick={() => setSelectedStudents([])}
                                    className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    إلغاء التحديد
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">جاري تحميل الطلاب...</p>
                </div>
            )}

            {/* No Results Message */}
            {!loading && filteredStudents.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">person_off</span>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">لا توجد طلاب</h3>
                    <p className="text-gray-600 dark:text-gray-400">لم يتم العثور على طلاب تطابق معايير البحث</p>
                </div>
            )}

            {/* Students Table */}
            {!loading && filteredStudents.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="py-4 px-6 text-right">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.length === filteredStudents.length}
                                            onChange={handleSelectAllStudents}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">الطالب</th>
                                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">المعلومات الأكاديمية</th>
                                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">المشروع</th>
                                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">الحالة</th>
                                    <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="py-4 px-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student._id)}
                                                onChange={() => handleSelectStudent(student._id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {student.profileImage ? (
                                                    <img
                                                        src={student.profileImage}
                                                        alt={student.fullName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${student.avatarColor} flex items-center justify-center text-white font-bold`}>
                                                        {getInitials(student.fullName)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-gray-800 dark:text-white font-medium">{student.fullName}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-gray-800 dark:text-white">{student.universityName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{student.departmentName}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-sm text-gray-800 dark:text-white">{student.projectName || 'لا يوجد'}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === 'active'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                                                }`}>
                                                {student.status === 'active' ? 'نشط' : 'غير نشط'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewStudentDetails(student._id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="عرض التفاصيل"
                                                >
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                </button>
                                                <a
                                                    href={`mailto:${student.email}`}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="إرسال بريد إلكتروني"
                                                >
                                                    <span className="material-symbols-outlined text-sm">mail</span>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                عرض {filteredStudents.length} من أصل {stats.totalStudents} طالب
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
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
                        </div>
                    </div>
                </div>
            )}
            <StudentDetailsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                studentId={selectedStudentId}
            />
        </main>
    );
};

export default StudentsDashboard;
// src/components/admin/dashboard/UniversityProjectsChart.tsx
import React from 'react';

// تعريف النوع كما هو قادم من API
interface UniversityProjectFromAPI {
    universityName: string;
    projectCount: number;
}

interface Props {
    universities: UniversityProjectFromAPI[];
    loading?: boolean;
}

export const UniversityProjectsChart: React.FC<Props> = ({ universities, loading = false }) => {
    const totalProjects = universities.reduce((sum, uni) => sum + uni.projectCount, 0);
    
    // ألوان متدرجة للجامعات
    const colors = [
        'from-blue-500 to-blue-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-orange-500 to-orange-600',
        'from-pink-500 to-pink-600',
        'from-indigo-500 to-indigo-600',
        'from-teal-500 to-teal-600',
        'from-cyan-500 to-cyan-600',
    ];

    // حساب النسبة المئوية لكل جامعة
    const universitiesWithPercentage = universities.map((uni, index) => ({
        ...uni,
        percentage: totalProjects > 0 ? (uni.projectCount / totalProjects) * 100 : 0,
        color: colors[index % colors.length],
    }));

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 animate-slide-in">
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="p-4 lg:p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-24 lg:w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (universities.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 animate-slide-in">
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-600">bar_chart</span>
                        توزيع المشاريع حسب الجامعات
                    </h2>
                </div>
                <div className="p-4 lg:p-6 text-center text-gray-500">
                    لا توجد بيانات لعرضها
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-subtle border border-gray-200 dark:border-gray-800 animate-slide-in">
            <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600">bar_chart</span>
                    توزيع المشاريع حسب الجامعات
                </h2>
                {totalProjects > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        إجمالي المشاريع: {totalProjects}
                    </p>
                )}
            </div>
            <div className="p-4 lg:p-6">
                {totalProjects === 0 ? (
                    <div className="text-center py-8">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">bar_chart</span>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">لا توجد مشاريع لعرضها</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {universitiesWithPercentage.map((uni, index) => (
                            <div key={index} className="flex items-center gap-4 group">
                                <div className="w-24 lg:w-32 text-sm font-medium text-gray-900 dark:text-white truncate" title={uni.universityName}>
                                    {uni.universityName}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className={`bg-gradient-to-r ${uni.color} h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`}
                                            style={{ width: `${uni.percentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="w-12 lg:w-16 text-sm font-semibold text-gray-900 dark:text-white text-left">
                                    {uni.projectCount}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
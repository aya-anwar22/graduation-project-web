// src/features/Admin/DashboardAdmin/DashboardManagement.tsx
import React from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/common/Alert';
import { MainStatCard } from './MainStatCard';
import { SecondaryStatCard } from './SecondaryStatCard';
import { UniversityProjectsChart } from './UniversityProjectsChart';

export const DashboardManagement: React.FC = () => {
    const { stats, universityProjects, loading, error, refresh } = useDashboard();

    if (loading && !stats) {
        return <LoadingSpinner text="جاري تحميل لوحة التحكم..." />;
    }

    if (error && !stats) {
        return <Alert type="error" message={error} onClose={() => {}} />;
    }

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
                {/* بطاقات الإحصائيات الرئيسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <MainStatCard
                        title="الجامعات"
                        value={stats?.universities || 0}
                        icon="account_balance"
                        color="from-blue-500 to-blue-600"
                    />
                    <MainStatCard
                        title="الأقسام"
                        value={stats?.departments || 0}
                        icon="corporate_fare"
                        color="from-purple-500 to-purple-600"
                    />
                    <MainStatCard
                        title="الدكاترة"
                        value={stats?.doctors || 0}
                        icon="psychology"
                        color="from-green-500 to-green-600"
                    />
                    <MainStatCard
                        title="الطلاب"
                        value={stats?.students || 0}
                        icon="school"
                        color="from-orange-500 to-orange-600"
                    />
                </div>

                {/* إحصائيات المشاريع والطلبات */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <SecondaryStatCard
                        title="إجمالي المشاريع"
                        value={stats?.totalProjects || 0}
                        icon="folder_managed"
                        iconColor="text-blue-600"
                        bgColor="bg-blue-50 dark:bg-blue-900/20"
                    />
                    <SecondaryStatCard
                        title="مشاريع نشطة"
                        value={stats?.activeProjects || 0}
                        icon="trending_up"
                        iconColor="text-green-600"
                        bgColor="bg-green-50 dark:bg-green-900/20"
                    />
                    <SecondaryStatCard
                        title="طلبات معلقة"
                        value={stats?.pendingRequests || 0}
                        icon="schedule"
                        iconColor="text-orange-600"
                        bgColor="bg-orange-50 dark:bg-orange-900/20"
                        animate={true}
                    />
                    <SecondaryStatCard
                        title="مشاريع مكتملة"
                        value={stats?.completedProjects || 0}
                        icon="check_circle"
                        iconColor="text-purple-600"
                        bgColor="bg-purple-50 dark:bg-purple-900/20"
                    />
                </div>

                {/* توزيع المشاريع حسب الجامعات */}
                <UniversityProjectsChart 
                    universities={universityProjects} 
                    loading={loading}
                />
            </div>
        </main>
    );
};
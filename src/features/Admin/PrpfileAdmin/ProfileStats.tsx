// src/components/admin/ProfileStats.tsx
import React from 'react';
import { Building, Briefcase, Users, GraduationCap } from 'lucide-react';
// import { DashboardManagement } from '../AdminHome/DashboardManagement';
import { MainStatCard } from '../AdminHome/MainStatCard';
import { useDashboard } from '../../../hooks/useDashboard';
import LoadingSpinner from '../../Doctore/Components/LoadingSpinner';
import { Alert } from '../../../components/common/Alert';
// import { AdminProfile } from '../../AdminTypes/Profile.interface';

interface Props {
    profile: any | null;
}

export const ProfileStats: React.FC<Props> = ({ profile }) => {
    const statsCards = [
        { icon: Building, label: 'الجامعات', value: profile?.stats?.universities || 0, color: 'from-blue-500 to-blue-600' },
        { icon: Briefcase, label: 'الأقسام', value: profile?.stats?.departments || 0, color: 'from-purple-500 to-purple-600' },
        { icon: Users, label: 'الدكاترة', value: profile?.stats?.doctors || 0, color: 'from-green-500 to-green-600' },
        { icon: GraduationCap, label: 'الطلاب', value: profile?.stats?.students || 0, color: 'from-orange-500 to-orange-600' },
    ];
    const { stats, universityProjects, loading, error, refresh } = useDashboard();

    if (loading && !stats) {
        return <LoadingSpinner />;
    }

    if (error && !stats) {
        return <Alert type="error" message={error} onClose={() => { }} />;
    }

    return (
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
    );
};
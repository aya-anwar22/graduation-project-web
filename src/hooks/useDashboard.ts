// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../features/Admin/AdminService/Home.service';
import type { DashboardStats, UniversityProjectStats } from '../features/Admin/AdminTypes/Home.interface';

// تعريف النوع الموسع للجامعات مع النسبة واللون
interface UniversityProjectWithDetails extends UniversityProjectStats {
    percentage: number;
    color: string;
}

export const useDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [universityProjects, setUniversityProjects] = useState<UniversityProjectWithDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // جلب إحصائيات لوحة التحكم
    const fetchStats = useCallback(async () => {
        try {
            const data = await dashboardService.getDashboardStats();
            setStats(data);
        } catch (err: any) {
            console.error('Error fetching stats:', err);
            throw err;
        }
    }, []);

    // جلب توزيع المشاريع حسب الجامعات مع حساب النسب
    const fetchProjectsByUniversity = useCallback(async () => {
        try {
            const data = await dashboardService.getProjectsByUniversity();
            const total = data.reduce((sum, uni) => sum + uni.projectCount, 0);
            
            // إضافة النسبة المئوية واللون لكل جامعة
            const projectsWithDetails = data.map((uni, index) => ({
                universityName: uni.universityName,
                projectCount: uni.projectCount,
                percentage: total > 0 ? (uni.projectCount / total) * 100 : 0,
                color: colors[index % colors.length],
            }));
            
            setUniversityProjects(projectsWithDetails);
        } catch (err: any) {
            console.error('Error fetching projects by university:', err);
        }
    }, []);

    // تحميل جميع البيانات
    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([
                fetchStats(),
                fetchProjectsByUniversity(),
            ]);
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تحميل بيانات لوحة التحكم');
        } finally {
            setLoading(false);
        }
    }, [fetchStats, fetchProjectsByUniversity]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    return {
        stats,
        universityProjects,
        loading,
        error,
        refresh: loadDashboardData,
    };
};
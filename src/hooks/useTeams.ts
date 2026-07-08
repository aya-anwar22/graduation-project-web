// src/hooks/useTeams.ts
import { useState, useEffect, useCallback } from 'react';
import TeamService from '../features/Admin/AdminService/Team.service';
import type { Team, TeamStatistics } from '../features/Admin/AdminTypes/Team.interface';

// تعريف نوع الفلاتر هنا
export interface TeamFiltersType {
    search: string;
    supervisor: string;
    year: string;
}

export const useTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [supervisors, setSupervisors] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [universities, setUniversities] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [stats, setStats] = useState<TeamStatistics>({
        totalTeams: 0,
        activeTeams: 0,
        totalMembers: 0,
        thisYearTeams: 0,
    });

    // جلب إحصائيات الفرق
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const data = await TeamService.getTeamsStatistics();
            setStats({
                totalTeams: data.totalTeams,
                activeTeams: data.activeTeams,
                totalMembers: data.totalMembers,
                thisYearTeams: data.thisYearTeams,
            });
        } catch (err: any) {
            console.error('Error fetching stats:', err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // جلب الفرق
    const fetchTeams = useCallback(async (filters?: TeamFiltersType) => {
        setLoading(true);
        setError(null);
        try {
            const data = await TeamService.getAllTeams(filters);
            setTeams(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تحميل الفرق');
        } finally {
            setLoading(false);
        }
    }, []);

    // جلب خيارات الفلترة
    const fetchFilterOptions = useCallback(async () => {
        try {
            const [supervisorsData, studentsData, universitiesData, departmentsData] = await Promise.all([
                TeamService.getSupervisors(),
                TeamService.getStudents(),
                TeamService.getUniversities(),
                TeamService.getDepartments(),
            ]);
            setSupervisors(supervisorsData);
            setStudents(studentsData);
            setUniversities(universitiesData);
            setDepartments(departmentsData);
        } catch (err: any) {
            console.error('Error fetching filter options:', err);
        }
    }, []);

    // إضافة فريق
    const addTeam = useCallback(async (formData: any) => {
        setLoading(true);
        try {
            await TeamService.createTeam(formData);
            setSuccess('تم إضافة الفريق بنجاح');
            await fetchTeams();
            await fetchStats();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في إضافة الفريق');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchTeams, fetchStats]);

    // تحديث فريق
    const updateTeam = useCallback(async (id: string, formData: Partial<any>) => {
        setLoading(true);
        try {
            await TeamService.updateTeam(id, formData);
            setSuccess('تم تحديث الفريق بنجاح');
            await fetchTeams();
            await fetchStats();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تحديث الفريق');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchTeams, fetchStats]);

    // حذف فريق
    const deleteTeam = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await TeamService.deleteTeam(id);
            setSuccess('تم حذف الفريق بنجاح');
            await fetchTeams();
            await fetchStats();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في حذف الفريق');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchTeams, fetchStats]);

    // فلترة الفرق
    const filterTeams = useCallback((filters: TeamFiltersType) => {
        return teams.filter(team => {
            const matchesSearch = !filters.search ||
                team.teamName.toLowerCase().includes(filters.search.toLowerCase()) ||
                team.teamCode.toLowerCase().includes(filters.search.toLowerCase()) ||
                team.projectName.toLowerCase().includes(filters.search.toLowerCase());

            const matchesSupervisor = !filters.supervisor || filters.supervisor === 'all' ||
                team.doctorId === filters.supervisor || team.doctorName === filters.supervisor;

            const matchesYear = !filters.year || filters.year === 'all' || team.projectYear === filters.year;

            return matchesSearch && matchesSupervisor && matchesYear;
        });
    }, [teams]);

    // تحميل البيانات عند بدء التشغيل
    useEffect(() => {
        fetchStats();
        fetchTeams();
        fetchFilterOptions();
    }, [fetchStats, fetchTeams, fetchFilterOptions]);

    return {
        teams,
        supervisors,
        students,
        universities,
        departments,
        loading,
        statsLoading,
        stats,
        error,
        success,
        addTeam,
        updateTeam,
        deleteTeam,
        filterTeams,
        refresh: () => {
            fetchStats();
            fetchTeams();
        },
    };
};
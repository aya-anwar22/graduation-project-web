// src/hooks/useProjects.ts
import { useState, useEffect, useCallback } from 'react';
import type { Project, ProjectFilters, ProjectStats } from '../features/Admin/AdminTypes/Project.interface';
import ProjectService from '../features/Admin/AdminService/Project.service';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [universities, setUniversities] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [stats, setStats] = useState<ProjectStats>({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        thisYearProjects: 0,
    });

    // جلب إحصائيات المشاريع
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const summary = await ProjectService.getProjectsSummary();
            setStats({
                totalProjects: summary.projectTotal,
                activeProjects: summary.projectActive,
                completedProjects: summary.projectCompleted,
                thisYearProjects: summary.projectThisYear,
            });
        } catch (err: any) {
            console.error('Error fetching stats:', err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // جلب قائمة المشاريع
    const fetchProjects = useCallback(async (filters?: ProjectFilters) => {
        setLoading(true);
        setError(null);
        try {
            const data = await ProjectService.getAllProjects(filters);
            setProjects(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تحميل المشاريع');
        } finally {
            setLoading(false);
        }
    }, []);

    // جلب خيارات الفلترة
    const fetchFilterOptions = useCallback(async () => {
        try {
            const [doctorsData, universitiesData, departmentsData] = await Promise.all([
                ProjectService.getDoctors(),
                ProjectService.getUniversities(),
                ProjectService.getDepartments(),
            ]);
            setDoctors(doctorsData);
            setUniversities(universitiesData);
            setDepartments(departmentsData);
        } catch (err: any) {
            console.error('Error fetching filter options:', err);
        }
    }, []);

    // فلترة المشاريع حسب المعايير
    const filterProjects = useCallback((filters: ProjectFilters) => {
        return projects.filter(project => {
            const matchesSearch = !filters.search ||
                project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                project.universityName.toLowerCase().includes(filters.search.toLowerCase()) ||
                project.doctorName.toLowerCase().includes(filters.search.toLowerCase());

            const matchesStatus = !filters.status || filters.status === 'all' || project.status === filters.status;
            const matchesDoctor = !filters.doctor || filters.doctor === 'all' || project.doctorId === filters.doctor;
            const matchesUniversity = !filters.university || filters.university === 'all' || project.universityId === filters.university;
            const matchesDepartment = !filters.department || filters.department === 'all' || project.departmentId === filters.department;
            const matchesYear = !filters.year || filters.year === 'all' || project.year === filters.year;

            return matchesSearch && matchesStatus && matchesDoctor && matchesUniversity && matchesDepartment && matchesYear;
        });
    }, [projects]);

    // تحميل البيانات عند بدء التشغيل
    useEffect(() => {
        fetchStats();
        fetchProjects();
        fetchFilterOptions();
    }, [fetchStats, fetchProjects, fetchFilterOptions]);

    return {
        projects,
        doctors,
        universities,
        departments,
        loading,
        statsLoading,
        stats,
        error,
        success,
        fetchProjects,
        filterProjects,
        refresh: () => {
            fetchStats();
            fetchProjects();
        },
    };
};
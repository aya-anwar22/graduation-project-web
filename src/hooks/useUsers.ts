// src/hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import userService from '../features/Admin/AdminService/User.service';
import type { User, UserStats, UserFilters } from '../features/Admin/AdminTypes/User.interface';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [universities, setUniversities] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [fetchingDepartments, setFetchingDepartments] = useState(false);
    const [stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        totalDoctors: 0,
        totalStudents: 0,
        verifiedUsers: 0,
    });

    // جلب إحصائيات المستخدمين
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const data = await userService.getUsersStats();
            setStats({
                totalUsers: data.totalUsers,
                totalDoctors: data.totalDoctors,
                totalStudents: data.totalStudents,
                verifiedUsers: data.verifiedUsers,
            });
        } catch (err: any) {
            console.error('Error fetching stats:', err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // جلب المستخدمين
    const fetchUsers = useCallback(async (filters?: UserFilters) => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getAllUsers(filters);
            setUsers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    }, []);

    // جلب خيارات الفلترة (الجامعات)
    const fetchUniversities = useCallback(async () => {
        try {
            const data = await userService.getUniversities();
            setUniversities(data);
        } catch (err: any) {
            console.error('Error fetching universities:', err);
        }
    }, []);

    // ✅ جلب الأقسام حسب الجامعة
    const fetchDepartmentsByUniversity = useCallback(async (universityId: string) => {
        if (!universityId) {
            setFilteredDepartments([]);
            return;
        }
        
        setFetchingDepartments(true);
        try {
            const data = await userService.getDepartmentsByUniversity(universityId);
            console.log('📚 Departments fetched for university:', universityId, data);
            setFilteredDepartments(data);
        } catch (err: any) {
            console.error('Error fetching departments:', err);
            setFilteredDepartments([]);
        } finally {
            setFetchingDepartments(false);
        }
    }, []);

    // تحديث دور المستخدم
    const updateUserRole = useCallback(async (id: string, role: string) => {
        setLoading(true);
        try {
            await userService.updateUserRole(id, role);
            setSuccess('تم تحديث دور المستخدم بنجاح');
            await fetchUsers();
            await fetchStats();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تحديث دور المستخدم');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchUsers, fetchStats]);

    // تغيير حالة المستخدم (حذف/استعادة)
    const toggleUserStatus = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await userService.toggleUserStatus(id);
            setSuccess('تم تغيير حالة المستخدم بنجاح');
            await fetchUsers();
            await fetchStats();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تغيير حالة المستخدم');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchUsers, fetchStats]);

    // إضافة مستخدم
    const addUser = useCallback(async (formData: any) => {
        setLoading(true);
        try {
            await userService.createUser(formData);
            setSuccess('تم إضافة المستخدم بنجاح');
            await fetchUsers();
            await fetchStats();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في إضافة المستخدم');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchUsers, fetchStats]);

    // تحديث مستخدم
    const updateUser = useCallback(async (id: string, formData: Partial<any>) => {
        setLoading(true);
        try {
            await userService.updateUser(id, formData);
            setSuccess('تم تحديث المستخدم بنجاح');
            await fetchUsers();
            await fetchStats();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في تحديث المستخدم');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchUsers, fetchStats]);

    // حذف مستخدم نهائياً
    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await userService.deleteUser(id);
            setSuccess('تم حذف المستخدم بنجاح');
            await fetchUsers();
            await fetchStats();
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'فشل في حذف المستخدم');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    }, [fetchUsers, fetchStats]);

    // فلترة المستخدمين محلياً
    const filterUsers = useCallback((filters: UserFilters) => {
        return users.filter(user => {
            const matchesSearch = !filters.search ||
                user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(filters.search.toLowerCase());

            const matchesRole = !filters.role || filters.role === 'all' || user.role === filters.role;
            const matchesStatus = !filters.status || filters.status === 'all' ||
                (filters.status === 'verified' && user.isVerified) ||
                (filters.status === 'unverified' && !user.isVerified) ||
                (filters.status === 'deleted' && user.isDeleted);

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users]);

    // تحميل البيانات عند بدء التشغيل
    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchUniversities();
    }, [fetchStats, fetchUsers, fetchUniversities]);

    return {
        users,
        universities,
        departments: filteredDepartments,  // ← الأقسام المفلترة حسب الجامعة
        loading,
        statsLoading,
        stats,
        error,
        success,
        fetchingDepartments,
        addUser,
        updateUser,
        deleteUser,
        updateUserRole,
        toggleUserStatus,
        filterUsers,
        fetchDepartmentsByUniversity,  // ← دالة جلب الأقسام حسب الجامعة
        refresh: () => {
            fetchStats();
            fetchUsers();
        },
    };
};
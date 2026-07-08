// src/hooks/useDepartments.ts
import { useState, useEffect, useCallback } from 'react';
import type { Department, DepartmentFormData, DepartmentApiData, DepartmentStatsType } from '../features/Admin/AdminTypes/Department.interface';
import DepartmentService from '../features/Admin/AdminService/Department.service';

export const useDepartments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
    const [universities, setUniversities] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedUniversityId, setSelectedUniversityId] = useState<string>('');
    const [fetchingDoctors, setFetchingDoctors] = useState(false);
    const [fetchingDepartments, setFetchingDepartments] = useState(false);
    const [stats, setStats] = useState<DepartmentStatsType>({
        totalDepartments: 0,
        activeDepartments: 0,
        totalDoctors: 0,
        headDepartments: 0,
    });

    // تحويل البيانات من API
    // في useDepartments.ts، تحديث transformApiDataToDepartment
    const transformApiDataToDepartment = (apiData: any): Department => {
        let status: 'active' | 'deleted' = 'active';

        // تحديد الحالة
        if (apiData.is_deleted === true || apiData.isDeleted === true || apiData.status === 'محذوف') {
            status = 'deleted';
        }

        return {
            id: apiData._id || apiData.id,
            departmentName: apiData.departmentName,
            universityId: apiData.universityId,
            universityName: apiData.universityName || 'غير محدد',
            headDoctorId: apiData.headDoctorId || apiData.headId,
            headDoctorName: apiData.headDoctorName || apiData.headName || 'غير معين',
            status: status,
            doctors: apiData.doctorsCount || apiData.stats?.doctorsCount || 0,
            students: apiData.studentsCount || 0,
            projects: apiData.projectsCount || apiData.stats?.projectsCount || 0,
            requests: apiData.requestsCount || apiData.stats?.requestsCount || 0,
            stats: apiData.stats || {
                doctorsCount: apiData.doctorsCount || 0,
                requestsCount: apiData.requestsCount || 0,
                projectsCount: apiData.projectsCount || 0,
            },
        };
    };

    // حساب الإحصائيات
    const calculateStats = useCallback((depts: Department[]) => {
        return {
            totalDepartments: depts.length,
            activeDepartments: depts.filter(d => d.status === 'active').length,
            totalDoctors: depts.reduce((sum, d) => sum + (d.doctors || 0), 0),
            headDepartments: depts.filter(d => d.headDoctorId && d.headDoctorId !== '').length,
        };
    }, []);

    // جلب جميع الأقسام
    const fetchDepartments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await DepartmentService.getDepartments();
            const transformed = data.map(transformApiDataToDepartment);
            setDepartments(transformed);
            setFilteredDepartments(transformed);
            setStats(calculateStats(transformed));
        } catch (err: any) {
            setError(err.message || 'فشل في تحميل الأقسام');
        } finally {
            setLoading(false);
        }
    }, [calculateStats]);

    // ✅ جلب الأقسام حسب الجامعة المختارة
    const fetchDepartmentsByUniversity = useCallback(async (universityId: string) => {
        if (!universityId) {
            setFilteredDepartments(departments);
            return;
        }

        setFetchingDepartments(true);
        try {
            console.log('🔍 Fetching departments for university:', universityId);
            const data = await DepartmentService.getDepartmentsByUniversity(universityId);
            console.log('📚 Departments received:', data);
            const transformed = data.map(transformApiDataToDepartment);
            setFilteredDepartments(transformed);
        } catch (err: any) {
            console.error('Error fetching departments by university:', err);
            setFilteredDepartments([]);
        } finally {
            setFetchingDepartments(false);
        }
    }, [departments]);

    // جلب الجامعات
    const fetchUniversities = useCallback(async () => {
        try {
            const data = await DepartmentService.getUniversities();
            setUniversities(data);
        } catch (err: any) {
            console.error('Error fetching universities:', err);
        }
    }, []);

    // جلب الدكاترة حسب الجامعة
    const fetchDoctorsByUniversity = useCallback(async (universityId: string) => {
        if (!universityId) {
            setDoctors([]);
            return;
        }
        setFetchingDoctors(true);
        try {
            const data = await DepartmentService.getDoctorsByUniversity(universityId);
            setDoctors(data);
        } catch (err: any) {
            console.error('Error fetching doctors:', err);
            setDoctors([]);
        } finally {
            setFetchingDoctors(false);
        }
    }, []);

    // إضافة قسم
    const addDepartment = useCallback(async (formData: DepartmentFormData) => {
        setLoading(true);
        try {
            await DepartmentService.createDepartment(formData);
            setSuccess('تم إضافة القسم بنجاح');
            await fetchDepartments();
            if (selectedUniversityId) {
                await fetchDepartmentsByUniversity(selectedUniversityId);
            }
            return true;
        } catch (err: any) {
            setError(err.message || 'فشل في إضافة القسم');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 5000);
        }
    }, [fetchDepartments, fetchDepartmentsByUniversity, selectedUniversityId]);

    // تحديث قسم
    const updateDepartment = useCallback(async (id: string, formData: Partial<DepartmentFormData>) => {
        setLoading(true);
        try {
            await DepartmentService.updateDepartment(id, formData);
            setSuccess('تم تحديث القسم بنجاح');
            await fetchDepartments();
            if (selectedUniversityId) {
                await fetchDepartmentsByUniversity(selectedUniversityId);
            }
            return true;
        } catch (err: any) {
            setError(err.message || 'فشل في تحديث القسم');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 5000);
        }
    }, [fetchDepartments, fetchDepartmentsByUniversity, selectedUniversityId]);

    // تبديل حالة القسم
    const toggleDepartmentStatus = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const result = await DepartmentService.toggleDepartmentStatus(id);
            setSuccess(result.message);
            await fetchDepartments();
            if (selectedUniversityId) {
                await fetchDepartmentsByUniversity(selectedUniversityId);
            }
            return true;
        } catch (err: any) {
            setError(err.message || 'فشل في تغيير حالة القسم');
            return false;
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 5000);
        }
    }, [fetchDepartments, fetchDepartmentsByUniversity, selectedUniversityId]);

    // فلترة الأقسام (للبحث والحالة)
    const filterDepartmentsLocally = useCallback((searchTerm: string, statusFilter: string, universityId: string) => {
        let dataToFilter = departments;

        // إذا كان هناك جامعة محددة، استخدم الأقسام المفلترة
        if (universityId && filteredDepartments.length > 0) {
            dataToFilter = filteredDepartments;
        }

        return dataToFilter.filter(dept => {
            const matchesSearch = !searchTerm ||
                dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dept.headDoctorName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !statusFilter || dept.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [departments, filteredDepartments]);

    // تحديث الفلتر حسب الجامعة
    const handleUniversityFilterChange = useCallback(async (universityId: string) => {
        setSelectedUniversityId(universityId);
        if (universityId) {
            await fetchDepartmentsByUniversity(universityId);
        } else {
            setFilteredDepartments(departments);
        }
    }, [fetchDepartmentsByUniversity, departments]);

    useEffect(() => {
        fetchDepartments();
        fetchUniversities();
    }, [fetchDepartments, fetchUniversities]);

    useEffect(() => {
        if (selectedUniversityId) {
            fetchDoctorsByUniversity(selectedUniversityId);
        }
    }, [selectedUniversityId, fetchDoctorsByUniversity]);

    return {
        departments: filteredDepartments, // ← الأقسام المفلترة حسب الجامعة
        allDepartments: departments,
        universities,
        doctors,
        stats,
        loading,
        fetchingDoctors,
        fetchingDepartments,
        error,
        success,
        selectedUniversityId,
        setSelectedUniversityId: handleUniversityFilterChange, // ← استخدم الدالة الجديدة
        addDepartment,
        updateDepartment,
        toggleDepartmentStatus,
        filterDepartments: filterDepartmentsLocally,
        refetch: () => {
            fetchDepartments();
            if (selectedUniversityId) {
                fetchDepartmentsByUniversity(selectedUniversityId);
            }
        },
    };
};